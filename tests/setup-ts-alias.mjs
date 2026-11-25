import fs from 'node:fs';
import path from 'node:path';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

    if (specifier === 'next/server') {
      const cjsPath = path.join(ROOT_DIR, 'node_modules', 'next', 'server.js');
      if (fs.existsSync(cjsPath)) {
        return { url: pathToFileURL(cjsPath).href, shortCircuit: true };
      }
    }

    return nextResolve(specifier, context);
  },
});
