'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Building2,
  Users,
  BarChart3,
  Network,
  ShieldCheck,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { useScrollPosition } from '@/lib/hooks/useScrollPosition';
import { resolveActiveSectionId, type SectionOffsetEntry } from '@/lib/scrollUtils';

interface LandingNavSection {
  id: string;
  labelEn: string;
  labelHi: string;
  shortLabel: string;
  Icon: typeof Sparkles;
}

export const LANDING_SECTIONS: readonly LandingNavSection[] = [
  { id: 'hero-section', labelEn: 'Overview', labelHi: 'अवलोकन', shortLabel: 'Home', Icon: Sparkles },
  { id: 'partners-section', labelEn: 'Partners', labelHi: 'सहयोगी', shortLabel: 'Grid', Icon: Building2 },
  { id: 'gateways-section', labelEn: 'Portals', labelHi: 'पोर्टल', shortLabel: 'Portals', Icon: Users },
  { id: 'telemetry-section', labelEn: 'Telemetry', labelHi: 'टेलीमेट्री', shortLabel: 'Stats', Icon: BarChart3 },
  { id: 'workflow-section', labelEn: 'Architecture', labelHi: 'संरचना', shortLabel: 'Flow', Icon: Network },
];

/**
 * Floating screen-size-adaptive taskbar with scroll-spy section tracking, live % meter,
 * and direction-aware Next/Top scroll controls.
 */
export default function FloatingLandingTaskbar() {
  const { language } = useApp();
  const { scrollY, progress, direction, density, prefersReducedMotion } = useScrollPosition();
  const [activeId, setActiveId] = useState<string>('hero-section');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const entries: SectionOffsetEntry[] = [];
    for (const sec of LANDING_SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        entries.push({ id: sec.id, top: rect.top + window.scrollY });
      }
    }

    const markerY = scrollY + Math.round(window.innerHeight * 0.36);
    setActiveId(resolveActiveSectionId(entries, markerY, 'hero-section'));
  }, [scrollY]);

  const progressPct = Math.round(progress * 100);
  const nearBottom = progress >= 0.82;
  const ringCircumference = 50.27;
  const ringOffset = Math.round((ringCircumference * (1 - progress)) * 100) / 100;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleDirectionalAction = () => {
    if (nearBottom) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      return;
    }

    const currentIdx = LANDING_SECTIONS.findIndex((s) => s.id === activeId);
    const nextIdx = Math.min(LANDING_SECTIONS.length - 1, Math.max(0, currentIdx + 1));
    scrollToSection(LANDING_SECTIONS[nextIdx].id);
  };

  const isHi = language === 'hi';
  const showDirectionDown = !nearBottom && (direction === 'down' || progress < 0.15);

  return (
    <div className="sticky top-[66px] z-30 flex justify-center md:fixed md:top-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 px-2 pointer-events-none">
      <nav
        aria-label="Dynamic landing page taskbar"
        data-density={density}
        className={`pointer-events-auto flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-lg ring-1 ring-slate-900/5 dark:ring-white/10 max-w-[calc(100vw-1rem)] overflow-x-auto no-scrollbar transition-all duration-300 ${
          density === 'compact'
            ? 'px-2 py-1'
            : density === 'standard'
            ? 'px-2.5 py-1.5'
            : 'px-3 py-1.5'
        }`}
      >
        {/* Scroll Percentage Ring Pill */}
        <div
          aria-hidden="true"
          className="hidden sm:flex items-center gap-1.5 pl-1 pr-2 border-r border-slate-200 dark:border-slate-700/80 shrink-0"
        >
          <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-slate-200 dark:text-slate-700" />
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              className="text-saffron transition-[stroke-dashoffset] duration-150"
            />
          </svg>
          <span className="font-mono text-[10px] font-bold text-navy-900 dark:text-slate-200 w-7 text-right">
            {progressPct}%
          </span>
        </div>

        {/* Section Buttons — Labels adapt automatically by viewport width */}
        {LANDING_SECTIONS.map((section) => {
          const Icon = section.Icon;
          const isActive = activeId === section.id;
          const label =
            density === 'compact'
              ? section.shortLabel
              : density === 'standard'
              ? section.shortLabel
              : isHi
              ? section.labelHi
              : section.labelEn;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              aria-current={isActive ? 'location' : undefined}
              title={isHi ? section.labelHi : section.labelEn}
              className={`flex items-center gap-1.5 rounded-full font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                density === 'compact' ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-1.5 text-xs'
              } ${
                isActive
                  ? 'bg-saffron text-white shadow-xs scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className={density === 'compact' && !isActive ? 'hidden sm:inline' : ''}>
                {label}
              </span>
            </button>
          );
        })}

        {/* Quick Verify Portal Pill */}
        <Link
          href="/verify"
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>{isHi ? 'सत्यापन' : 'Verify'}</span>
        </Link>

        {/* Scroll Down / Back-to-Top Dynamic Action */}
        <button
          type="button"
          onClick={handleDirectionalAction}
          aria-label={nearBottom ? 'Scroll back to top' : 'Scroll down to next section'}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-[11px] font-bold shrink-0 transition-all cursor-pointer ml-0.5"
        >
          {nearBottom ? (
            <>
              <ArrowUp className="w-3.5 h-3.5 text-saffron" aria-hidden="true" />
              <span className="hidden lg:inline">{isHi ? 'शीर्ष' : 'Top'}</span>
            </>
          ) : (
            <>
              <ArrowDown
                className={`w-3.5 h-3.5 text-amber-300 ${showDirectionDown ? 'motion-safe:animate-bounce' : ''}`}
                aria-hidden="true"
              />
              <span className="hidden lg:inline">{isHi ? 'नीचे' : 'Next'}</span>
            </>
          )}
        </button>
      </nav>
    </div>
  );
}
