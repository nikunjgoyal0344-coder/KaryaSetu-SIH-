'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { calculateScrollProgress } from '@/lib/scrollUtils';

/**
 * Top hairline reading/scroll indicator synced cleanly via requestAnimationFrame.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mediaQuery?.matches) {
      return;
    }

    let frameId: number | null = null;

    const updateProgress = () => {
      frameId = null;
      const bar = barRef.current;
      if (!bar) return;

      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const progress = calculateScrollProgress(scrollTop, doc.scrollHeight, doc.clientHeight);
      bar.style.transform = `scaleX(${progress})`;
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none motion-reduce:hidden"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-navy-800 via-saffron to-emerald-600 transition-transform duration-100 ease-out"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
