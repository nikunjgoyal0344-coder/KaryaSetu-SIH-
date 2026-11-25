'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Tracks when a DOM element intersects the viewport while respecting prefers-reduced-motion.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.08,
  rootMargin = '0px 0px -32px 0px',
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mediaQuery?.matches) {
      setPrefersReducedMotion(true);
      setIsVisible(true);
      return;
    }

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) {
        setIsVisible(true);
      }
    };
    mediaQuery?.addEventListener?.('change', handleMotionPreference);

    const node = ref.current;
    if (!node) {
      return () => {
        mediaQuery?.removeEventListener?.('change', handleMotionPreference);
      };
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return () => {
        mediaQuery?.removeEventListener?.('change', handleMotionPreference);
      };
    }

    // Ensure content already inside the initial viewport never stays hidden
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
      setIsVisible(true);
      if (once) {
        return () => {
          mediaQuery?.removeEventListener?.('change', handleMotionPreference);
        };
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      mediaQuery?.removeEventListener?.('change', handleMotionPreference);
    };
  }, [threshold, rootMargin, once]);

  return {
    ref,
    isVisible: isVisible || prefersReducedMotion,
    prefersReducedMotion,
  };
}
