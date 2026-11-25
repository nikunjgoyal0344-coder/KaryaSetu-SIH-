import fs from 'node:fs';
import path from 'node:path';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const NEXT_VIRTUAL_SHIMS = new Map([
  [
    'next/link',
    {
      url: pathToFileURL(path.join(ROOT_DIR, 'tests', '__next_link_shim__.mjs')).href,
      source: `import React from 'react';
export default function Link({ href, children, prefetch, replace, scroll, shallow, passHref, legacyBehavior, ...rest }) {
  const resolvedHref = typeof href === 'string' ? href : (href?.pathname || '#');
  return React.createElement('a', { href: resolvedHref, ...rest }, children);
}
`,
    },
  ],
  [
    'next/image',
    {
      url: pathToFileURL(path.join(ROOT_DIR, 'tests', '__next_image_shim__.mjs')).href,
      source: `import React from 'react';
export default function Image({ src, alt, width, height, className, priority, fill, unoptimized, sizes, quality, placeholder, blurDataURL, ...rest }) {
  const resolvedSrc = typeof src === 'string' ? src : '';
  return React.createElement('img', { src: resolvedSrc, alt, width, height, className, ...rest });
}
`,
    },
  ],
  [
    'next/navigation',
    {
      url: pathToFileURL(path.join(ROOT_DIR, 'tests', '__next_navigation_shim__.mjs')).href,
      source: `export function usePathname() { return '/'; }
export function useRouter() { return { push() {}, replace() {}, back() {}, refresh() {}, prefetch() {} }; }
export function useSearchParams() { return new URLSearchParams(); }
`,
    },
  ],
]);

const VIRTUAL_SOURCES = new Map(
  Array.from(NEXT_VIRTUAL_SHIMS.values()).map((entry) => [entry.url, entry.source])
);

function resolveTsFile(candidatePath) {
  const extensions = ['', '.ts', '.tsx', '.js', '.mjs'];
  for (const ext of extensions) {
    const full = `${candidatePath}${ext}`;
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return pathToFileURL(full).href;
    }
  }
  const indexFile = path.join(candidatePath, 'index.ts');
  if (fs.existsSync(indexFile)) {
    return pathToFileURL(indexFile).href;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      const target = path.join(ROOT_DIR, specifier.slice(2));
      const resolvedUrl = resolveTsFile(target);
      if (resolvedUrl) {
        return { url: resolvedUrl, shortCircuit: true };
      }
    }

    if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const target = path.resolve(parentDir, specifier);
      const resolvedUrl = resolveTsFile(target);
      if (resolvedUrl) {
        return { url: resolvedUrl, shortCircuit: true };
      }
    }

    const virtualShim = NEXT_VIRTUAL_SHIMS.get(specifier);
    if (virtualShim) {
      return { url: virtualShim.url, shortCircuit: true };
    }

    if (specifier === 'next/server') {
      const cjsPath = path.join(ROOT_DIR, 'node_modules', 'next', 'server.js');
      if (fs.existsSync(cjsPath)) {
        return { url: pathToFileURL(cjsPath).href, shortCircuit: true };
      }
    }

    return nextResolve(specifier, context);
  },

  load(url, context, nextLoad) {
    const virtualSource = VIRTUAL_SOURCES.get(url);
    if (virtualSource !== undefined) {
      return {
        format: 'module',
        source: virtualSource,
        shortCircuit: true,
      };
    }

    if (url.endsWith('.tsx')) {
      const filePath = fileURLToPath(url);
      const source = fs.readFileSync(filePath, 'utf8');
      const { outputText } = ts.transpileModule(source, {
        fileName: filePath,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      });
      return {
        format: 'module',
        source: outputText,
        shortCircuit: true,
      };
    }

    return nextLoad(url, context);
  },
});
