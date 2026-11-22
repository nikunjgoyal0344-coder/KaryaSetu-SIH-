'use client';

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface SkillGapsCardProps {
  rasashastraLvl: number;
  herbLvl: number;
  ehrLvl: number;
  enrolledBridges: string[];
  onEnrollBridge: (skillId: string, newLevel: number, courseName: string, gainText: string) => void;
}

export default function SkillGapsCard({
  rasashastraLvl,
  herbLvl,
  ehrLvl,
  enrolledBridges,
  onEnrollBridge,
}: SkillGapsCardProps) {
  return (
    <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Gap Diagnostics
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Formula: W<sub>imp</sub> × (Req - Cur)
          </span>
        </div>
        <h2 className="text-lg font-bold text-navy-900 dark:text-white mt-1">
          Priority Clinical Remediation
        </h2>
      </div>

      {/* Gap Item 1: Rasashastra (Critical) */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
          enrolledBridges.includes('rasashastra-qa')
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
              <span>Rasashastra &amp; Formulation QA</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Deficit in Bhasma particle sizing and heavy metal testing standards (AFI Guidelines).
            </p>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold shrink-0">
            Gap: 12.0 • Critical
          </span>
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Current: <strong className="text-rose-600 dark:text-rose-400">{rasashastraLvl} / 5</strong>
          </span>
          <span>
            Required Target: <strong className="text-navy-900 dark:text-white">4 / 5</strong>
          </span>
          <span>
            Importance: <strong>High (4×)</strong>
          </span>
        </div>

        <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
              Recommended Bridge (AIIA-MSDE)
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
              HPLC &amp; Heavy Metal Standardisation
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onEnrollBridge(
                'rasashastra-qa',
                2,
                'Rasashastra Heavy Metal Standardisation',
                '+3% Readiness Gain'
              )
            }
            disabled={enrolledBridges.includes('rasashastra-qa')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
              enrolledBridges.includes('rasashastra-qa')
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-saffron hover:bg-saffron-hover text-white'
            }`}
          >
            {enrolledBridges.includes('rasashastra-qa') ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled (Lvl 2)</span>
              </>
            ) : (
              <>
                <span>Bridge +1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gap Item 2: Herb Identification (High) */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
          enrolledBridges.includes('dravyaguna-identification')
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-saffron inline-block"></span>
              <span>Dravyaguna Herb Identification</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Authentication of raw dry crude herbs and adulterant detection techniques.
            </p>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-saffron-dark dark:text-orange-300 font-bold shrink-0">
            Gap: 8.0 • High
          </span>
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Current: <strong className="text-saffron-dark dark:text-orange-400">{herbLvl} / 5</strong>
          </span>
          <span>
            Required Target: <strong className="text-navy-900 dark:text-white">4 / 5</strong>
          </span>
          <span>
            Importance: <strong>Med (4×)</strong>
          </span>
        </div>

        <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
              Recommended Bridge
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
              TLC &amp; HPTLC Botanical Fingerprinting
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onEnrollBridge(
                'dravyaguna-identification',
                3,
                'TLC & HPTLC Botanical Fingerprinting',
                '+3% Readiness Gain'
              )
            }
            disabled={enrolledBridges.includes('dravyaguna-identification')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
              enrolledBridges.includes('dravyaguna-identification')
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-600 text-white'
            }`}
          >
            {enrolledBridges.includes('dravyaguna-identification') ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled (Lvl 3)</span>
              </>
            ) : (
              <>
                <span>Bridge +1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gap Item 3: Ayush EHR (Medium) */}
      <div
        className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
          enrolledBridges.includes('clinical-documentation')
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
              <span>Ayurveda EHR &amp; Digital Records</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Implementation of NAMASTE portal terminology &amp; ABDM compliance protocols.
            </p>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shrink-0">
            Gap: 4.0 • Med
          </span>
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Current: <strong className="text-navy-900 dark:text-white">{ehrLvl} / 5</strong>
          </span>
          <span>
            Required Target: <strong className="text-navy-900 dark:text-white">3 / 5</strong>
          </span>
          <span>
            Importance: <strong>Regular (4×)</strong>
          </span>
        </div>

        <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
              Recommended Bridge
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
              ABDM Healthcare Professionals Registry (HPR)
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onEnrollBridge(
                'clinical-documentation',
                3,
                'ABDM HPR & Digital Clinical Coding',
                '+3% Readiness Gain'
              )
            }
            disabled={enrolledBridges.includes('clinical-documentation')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
              enrolledBridges.includes('clinical-documentation')
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-600 text-white'
            }`}
          >
            {enrolledBridges.includes('clinical-documentation') ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Enrolled (Lvl 3)</span>
              </>
            ) : (
              <>
                <span>Bridge +1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
