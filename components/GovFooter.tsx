'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { t } from '@/lib/translations';

export default function GovFooter() {
  const { language } = useApp();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs pt-12 pb-8 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Strip Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-center">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <span className="text-base">🛡️</span>
            <span>{t('digilocker', language)}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-navy-800 dark:text-blue-300 font-bold">
            <span className="text-base">📜</span>
            <span>{t('nsqf', language)}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-saffron-accent dark:text-amber-400 font-bold">
            <span className="text-base">🏥</span>
            <span>{t('ayushGrid', language)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-amber-400/50 overflow-hidden shadow-xs shrink-0 bg-navy-900 flex items-center justify-center">
                <img alt="KaryaSetu Logo" className="w-full h-full object-cover scale-110" src="/logo.png" />
              </div>
              <span className="font-extrabold text-base text-navy-900 dark:text-blue-200">
                {t('brandName', language)}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
              {language === 'hi'
                ? 'आयुष एवं जीवन विज्ञान कौशल सत्यापन, क्रॉस-सेक्टर प्लेसमेंट और करियर प्रमाणीकरण हेतु राष्ट्रीय डिजिटल अवसंरचना।'
                : 'National Digital Infrastructure for Ayush & Life Sciences Skill Verification, Cross-Sector Placements, and Career Attestation.'}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-navy-900 dark:text-white uppercase tracking-wider text-[11px]">
              {t('campusHq', language)}
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              {t('campusAddress', language)}
            </p>
            <p className="text-navy-900 dark:text-blue-300 font-mono text-[11px] font-bold">
              {t('helpline', language)}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-navy-900 dark:text-white uppercase tracking-wider text-[11px]">
              {t('complianceTitle', language)}
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              {t('complianceDesc', language)}
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-600 dark:text-slate-400">
          <p>{t('rightsReserved', language)}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a className="hover:text-saffron transition-colors" href="#">
              {t('privacy', language)}
            </a>
            <a className="hover:text-saffron transition-colors" href="#">
              {t('terms', language)}
            </a>
            <a className="hover:text-saffron transition-colors" href="#">
              {t('sitemap', language)}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
