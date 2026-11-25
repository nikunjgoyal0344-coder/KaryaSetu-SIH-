'use client';

import React from 'react';
import { useInView } from '@/lib/hooks/useInView';
import { getRevealClassName, type ScrollRevealVariant } from '@/lib/scrollUtils';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delayMs?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * Accessible GPU-accelerated wrapper that reveals children smoothly on viewport entry.
 */
export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delayMs = 0,
  className = '',
  threshold = 0.08,
  once = true,
}: ScrollRevealProps) {
  const { ref, isVisible, prefersReducedMotion } = useInView<HTMLDivElement>({
    threshold,
    once,
  });

  const revealClasses = getRevealClassName(variant, isVisible, prefersReducedMotion);
  const effectiveDelay = !prefersReducedMotion && delayMs > 0 ? `${delayMs}ms` : undefined;

  return (
    <div
      ref={ref}
      style={effectiveDelay ? { transitionDelay: effectiveDelay } : undefined}
      className={`transform-gpu transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 ${revealClasses} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
