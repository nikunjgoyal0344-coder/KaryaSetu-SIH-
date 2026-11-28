'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';

interface ScrollDownCueProps {
  targetId?: string;
  label?: string;
}

/**
 * Interactive Hero scroll-down indicator that guides visitors downward and fades once scrolled.
 */
export default function ScrollDownCue({
  targetId = 'partners-section',
  label = 'Scroll down to explore portals & live telemetry',
}: ScrollDownCueProps) {
  const { scrollY, prefersReducedMotion } = useScrollPosition();
  const isDismissed = scrollY > 90;

  const handleScrollDown = () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div
      className={`mt-6 flex justify-center transition-all duration-500 motion-reduce:transition-none ${
        isDismissed ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <button
        type="button"
        onClick={handleScrollDown}
        aria-label={label}
        className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-saffron/60 transition-all text-xs font-semibold text-navy-900 dark:text-slate-200 cursor-pointer"
      >
        {/* Animated Scroll-Wheel Capsule */}
        <span
          aria-hidden="true"
          className="w-4 h-6 rounded-full border-2 border-navy-800/50 dark:border-blue-300/50 flex justify-center pt-1 shrink-0"
        >
          <span className="w-1 h-1.5 rounded-full bg-saffron motion-safe:animate-scroll-dot" />
        </span>

        <span>{label}</span>

        <ChevronDown
          aria-hidden="true"
          className="w-4 h-4 text-saffron motion-safe:animate-bounce group-hover:translate-y-0.5 transition-transform"
        />
      </button>
    </div>
  );
}
