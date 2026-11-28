import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScrollProgress,
  clampStaggerDelay,
  getRevealClassName,
  getTaskbarDensity,
  resolveActiveSectionId,
  type ScrollRevealVariant,
} from '../lib/scrollUtils.ts';

test('calculateScrollProgress clamps scroll ratios safely across edge cases', () => {
  assert.strictEqual(calculateScrollProgress(0, 2000, 1000), 0);
  assert.strictEqual(calculateScrollProgress(500, 2000, 1000), 0.5);
  assert.strictEqual(calculateScrollProgress(1000, 2000, 1000), 1);

  // Over-scroll and under-scroll clamping
  assert.strictEqual(calculateScrollProgress(-50, 2000, 1000), 0);
  assert.strictEqual(calculateScrollProgress(1500, 2000, 1000), 1);

  // Non-scrollable or malformed dimensions
  assert.strictEqual(calculateScrollProgress(100, 800, 800), 0);
  assert.strictEqual(calculateScrollProgress(100, 600, 900), 0);
  assert.strictEqual(calculateScrollProgress(Number.NaN, 2000, 1000), 0);
});

test('clampStaggerDelay enforces lower and upper stagger bounds', () => {
  assert.strictEqual(clampStaggerDelay(0, 80, 360), 0);
  assert.strictEqual(clampStaggerDelay(2, 80, 360), 160);
  assert.strictEqual(clampStaggerDelay(10, 80, 360), 360);
  assert.strictEqual(clampStaggerDelay(-3, 80, 360), 0);
  assert.strictEqual(clampStaggerDelay(Number.POSITIVE_INFINITY, 80, 360), 0);
});

test('getRevealClassName returns immediate visible classes under reduced motion or intersection', () => {
  const variants: ScrollRevealVariant[] = [
    'fade-up',
    'fade-down',
    'fade-left',
    'fade-right',
    'zoom-in',
    'fade',
  ];

  for (const variant of variants) {
    const hidden = getRevealClassName(variant, false, false);
    assert.ok(hidden.includes('opacity-0'), `Expected hidden opacity for ${variant}`);

    const revealed = getRevealClassName(variant, true, false);
    assert.ok(revealed.includes('opacity-100'), `Expected visible opacity for ${variant}`);

    const reducedMotion = getRevealClassName(variant, false, true);
    assert.ok(
      reducedMotion.includes('opacity-100'),
      `Expected reduced-motion immediate visibility for ${variant}`
    );
  }
});

test('getTaskbarDensity adapts cleanly across mobile, tablet, and desktop breakpoints', () => {
  assert.strictEqual(getTaskbarDensity(375), 'compact');
  assert.strictEqual(getTaskbarDensity(639), 'compact');
  assert.strictEqual(getTaskbarDensity(640), 'standard');
  assert.strictEqual(getTaskbarDensity(1023), 'standard');
  assert.strictEqual(getTaskbarDensity(1024), 'expanded');
  assert.strictEqual(getTaskbarDensity(Number.NaN), 'compact');
});

test('resolveActiveSectionId resolves current scroll-spy section accurately', () => {
  const sections = [
    { id: 'hero-section', top: 0 },
    { id: 'partners-section', top: 650 },
    { id: 'gateways-section', top: 1100 },
    { id: 'telemetry-section', top: 1850 },
    { id: 'workflow-section', top: 2600 },
  ];

  assert.strictEqual(resolveActiveSectionId(sections, 0, 'hero-section'), 'hero-section');
  assert.strictEqual(resolveActiveSectionId(sections, 800, 'hero-section'), 'partners-section');
  assert.strictEqual(resolveActiveSectionId(sections, 2100, 'hero-section'), 'telemetry-section');
  assert.strictEqual(resolveActiveSectionId(sections, 3200, 'hero-section'), 'workflow-section');
  assert.strictEqual(resolveActiveSectionId([], 500, 'hero-section'), 'hero-section');
  assert.strictEqual(resolveActiveSectionId(sections, Number.NaN, 'hero-section'), 'hero-section');
});
