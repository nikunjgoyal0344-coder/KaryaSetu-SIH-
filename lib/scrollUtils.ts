export type ScrollRevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'fade';

const HIDDEN_VARIANT_CLASSES: Record<ScrollRevealVariant, string> = {
  'fade-up': 'opacity-0 translate-y-6',
  'fade-down': 'opacity-0 -translate-y-6',
  'fade-left': 'opacity-0 translate-x-6',
  'fade-right': 'opacity-0 -translate-x-6',
  'zoom-in': 'opacity-0 scale-95',
  fade: 'opacity-0',
};

const VISIBLE_CLASSES = 'opacity-100 translate-x-0 translate-y-0 scale-100';

/**
 * Computes normalized vertical scroll progress in [0, 1].
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  if (
    !Number.isFinite(scrollTop) ||
    !Number.isFinite(scrollHeight) ||
    !Number.isFinite(clientHeight)
  ) {
    return 0;
  }

  const scrollableDistance = scrollHeight - clientHeight;
  if (scrollableDistance <= 0) {
    return 0;
  }

  const raw = scrollTop / scrollableDistance;
  return Math.min(1, Math.max(0, raw));
}

/**
 * Computes a bounded stagger transition delay (ms) for scrolled lists and card grids.
 */
export function clampStaggerDelay(
  index: number,
  stepMs: number = 75,
  maxMs: number = 360
): number {
  if (!Number.isFinite(index) || index <= 0 || !Number.isFinite(stepMs) || stepMs <= 0) {
    return 0;
  }

  const cap = Number.isFinite(maxMs) && maxMs >= 0 ? maxMs : 360;
  return Math.min(Math.round(index * stepMs), cap);
}

/**
 * Returns GPU-composited utility classes for scroll-reveal entrance transitions.
 */
export function getRevealClassName(
  variant: ScrollRevealVariant,
  isVisible: boolean,
  prefersReducedMotion: boolean
): string {
  if (prefersReducedMotion || isVisible) {
    return VISIBLE_CLASSES;
  }
  return HIDDEN_VARIANT_CLASSES[variant] ?? HIDDEN_VARIANT_CLASSES['fade-up'];
}

export type TaskbarDensity = 'compact' | 'standard' | 'expanded';

export interface SectionOffsetEntry {
  id: string;
  top: number;
}

/**
 * Resolves adaptive floating taskbar density based on current viewport width.
 */
export function getTaskbarDensity(viewportWidth: number): TaskbarDensity {
  if (!Number.isFinite(viewportWidth) || viewportWidth < 640) {
    return 'compact';
  }
  if (viewportWidth < 1024) {
    return 'standard';
  }
  return 'expanded';
}

/**
 * Determines the active landing section ID based on scroll offset positions.
 */
export function resolveActiveSectionId(
  sections: readonly SectionOffsetEntry[],
  scrollMarkerY: number,
  fallbackId: string
): string {
  if (!Array.isArray(sections) || sections.length === 0 || !Number.isFinite(scrollMarkerY)) {
    return fallbackId;
  }

  let active = sections[0].id;
  for (const section of sections) {
    if (section.top <= scrollMarkerY) {
      active = section.id;
    } else {
      break;
    }
  }
  return active;
}

