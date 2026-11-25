'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { t } from '@/lib/translations';

export default function GovTopBanner() {
  const { language, setLanguage } = useApp();
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');

  const adjustFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontScale(size);
    const root = document.documentElement;
    if (size === 'sm') root.style.fontSize = '14px';
    if (size === 'md') root.style.fontSize = '16px';
    if (size === 'lg') root.style.fontSize = '18px';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
      {/* Indian National Tricolor Hairline Stripe */}
      <div className="h-[3.5px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" aria-hidden="true" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 overflow-hidden">
        {/* Left: Ministry Identifier */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="font-bold text-navy-900 dark:text-blue-300 flex items-center gap-1.5 shrink-0 text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-saffron shrink-0" aria-hidden="true" />
            {t('govOfIndia', language)}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
          <span className="truncate text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">
            {t('ministryHeader', language)}
          </span>
        </div>

        {/* Right: Font Sizing & Language Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1" role="group" aria-label="Text size controls">
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden md:inline text-[11px]">
              {t('fontSize', language)}
            </span>
            {(
              [
                { key: 'sm', label: 'A-', title: 'Decrease Font Size' },
                { key: 'md', label: 'A', title: 'Reset Font Size' },
                { key: 'lg', label: 'A+', title: 'Increase Font Size' },
              ] as const
            ).map(({ key, label, title }) => (
              <button
                key={key}
                type="button"
                onClick={() => adjustFontSize(key)}
                aria-pressed={fontScale === key}
                className={`h-6 px-1.5 rounded-md text-[11px] transition-colors flex items-center justify-center min-w-[22px] ${
                  fontScale === key
                    ? 'bg-navy-900 dark:bg-saffron text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300'
                }`}
                title={title}
                aria-label={title}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700" aria-hidden="true" />

          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true">🌐</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
              className="bg-transparent border-none text-[11px] sm:text-xs py-0 pl-0.5 pr-3 focus:ring-0 cursor-pointer text-slate-800 dark:text-slate-200 font-bold focus:outline-hidden"
              aria-label="Select Language"
            >
              <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English</option>
              <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिन्दी</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
