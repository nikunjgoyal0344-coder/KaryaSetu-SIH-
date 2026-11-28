'use client';

import { useEffect, useRef, useState } from 'react';
import { calculateScrollProgress, getTaskbarDensity, type TaskbarDensity } from '@/lib/scrollUtils';

export interface ScrollStateSnapshot {
  scrollY: number;
  progress: number;
  direction: 'down' | 'up';
  density: TaskbarDensity;
  prefersReducedMotion: boolean;
}

/**
 * Tracks viewport scroll position, direction, progress ratio, and screen density cleanly via rAF.
 */
export function useScrollPosition(): ScrollStateSnapshot {
  const [snapshot, setSnapshot] = useState<ScrollStateSnapshot>({
    scrollY: 0,
    progress: 0,
    direction: 'down',
    density: 'expanded',
    prefersReducedMotion: false,
  });
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let reducedMotion = Boolean(mediaQuery?.matches);
    let frameId: number | null = null;

    const readSnapshot = () => {
      frameId = null;
      const doc = document.documentElement;
      const currentY = Math.max(0, window.scrollY || doc.scrollTop || 0);
      const progress = calculateScrollProgress(currentY, doc.scrollHeight, doc.clientHeight);
      const direction: 'down' | 'up' =
        currentY < lastScrollYRef.current - 4 ? 'up' : 'down';
      lastScrollYRef.current = currentY;

      const density = getTaskbarDensity(window.innerWidth);
      setSnapshot((prev) => {
        if (
          Math.abs(prev.scrollY - currentY) < 4 &&
          Math.abs(prev.progress - progress) < 0.01 &&
          prev.direction === direction &&
          prev.density === density &&
          prev.prefersReducedMotion === reducedMotion
        ) {
          return prev;
        }
        return {
          scrollY: currentY,
          progress,
          direction,
          density,
          prefersReducedMotion: reducedMotion,
        };
      });
    };

    const scheduleRead = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(readSnapshot);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      readSnapshot();
    };

    readSnapshot();
    window.addEventListener('scroll', scheduleRead, { passive: true });
    window.addEventListener('resize', scheduleRead, { passive: true });
    mediaQuery?.addEventListener?.('change', handleMotionChange);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleRead);
      window.removeEventListener('resize', scheduleRead);
      mediaQuery?.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  return snapshot;
}
