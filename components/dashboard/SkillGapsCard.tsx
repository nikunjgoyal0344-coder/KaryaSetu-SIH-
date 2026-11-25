'use client';

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface SkillGapsCardProps {
  rasashastraLvl: number;
  herbLvl: number;
  ehrLvl: number;
  enrolledBridges: string[];
  onEnrollBridge: (skillId: string, newLevel: number, courseName: string, gainText: string) => void;
}

interface GapDefinition {
  skillId: string;
  title: string;
  description: string;
  dotColor: string;
  badgeText: string;
  badgeClass: string;
  currentTextClass: string;
  targetLevel: number;
  importanceLabel: string;
  bridgeLabel: string;
  courseName: string;
  enrollTargetLevel: number;
  gainText: string;
  buttonActiveClass: string;
}

const GAP_DEFINITIONS: readonly GapDefinition[] = [
  {
    skillId: 'rasashastra-qa',
    title: 'Rasashastra & Formulation QA',
    description: 'Deficit in Bhasma particle sizing and heavy metal testing standards (AFI Guidelines).',
    dotColor: 'bg-rose-600',
    badgeText: 'Gap: 12.0 • Critical',
    badgeClass: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
    currentTextClass: 'text-rose-600 dark:text-rose-400',
    targetLevel: 4,
    importanceLabel: 'High (4×)',
    bridgeLabel: 'Recommended Bridge (AIIA-MSDE)',
    courseName: 'HPLC & Heavy Metal Standardisation',
    enrollTargetLevel: 2,
    gainText: '+3% Readiness Gain',
    buttonActiveClass: 'bg-saffron hover:bg-saffron-hover text-white',
  },
  {
    skillId: 'dravyaguna-identification',
    title: 'Dravyaguna Herb Identification',
    description: 'Authentication of raw dry crude herbs and adulterant detection techniques.',
    dotColor: 'bg-saffron',
    badgeText: 'Gap: 8.0 • High',
    badgeClass: 'bg-orange-100 dark:bg-orange-950/60 text-saffron-dark dark:text-orange-300',
    currentTextClass: 'text-saffron-dark dark:text-orange-400',
    targetLevel: 4,
    importanceLabel: 'Med (4×)',
    bridgeLabel: 'Recommended Bridge',
    courseName: 'TLC & HPTLC Botanical Fingerprinting',
    enrollTargetLevel: 3,
    gainText: '+3% Readiness Gain',
    buttonActiveClass:
      'bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-600 text-white',
  },
  {
    skillId: 'clinical-documentation',
    title: 'Ayurveda EHR & Digital Records',
    description: 'Implementation of NAMASTE portal terminology & ABDM compliance protocols.',
    dotColor: 'bg-blue-600',
    badgeText: 'Gap: 4.0 • Med',
    badgeClass: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
    currentTextClass: 'text-navy-900 dark:text-white',
    targetLevel: 3,
    importanceLabel: 'Regular (4×)',
    bridgeLabel: 'Recommended Bridge',
    courseName: 'ABDM Healthcare Professionals Registry (HPR)',
    enrollTargetLevel: 3,
    gainText: '+3% Readiness Gain',
    buttonActiveClass:
      'bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-600 text-white',
  },
];

export default function SkillGapsCard({
  rasashastraLvl,
  herbLvl,
  ehrLvl,
  enrolledBridges,
  onEnrollBridge,
}: SkillGapsCardProps) {
  const enrolledSet = new Set(enrolledBridges);
  const currentLevels: Record<string, number> = {
    'rasashastra-qa': rasashastraLvl,
    'dravyaguna-identification': herbLvl,
    'clinical-documentation': ehrLvl,
  };

  return (
    <ScrollReveal variant="fade-up" delayMs={90} className="lg:col-span-5">
      <div className="h-full bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
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

      {GAP_DEFINITIONS.map((gap) => {
        const isEnrolled = enrolledSet.has(gap.skillId);
        const currentLvl = currentLevels[gap.skillId] ?? 1;

        return (
          <div
            key={gap.skillId}
            className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
              isEnrolled
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                  <span className={`w-2 h-2 rounded-full ${gap.dotColor} inline-block`} aria-hidden="true" />
                  <span>{gap.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {gap.description}
                </p>
              </div>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${gap.badgeClass}`}>
                {gap.badgeText}
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Current: <strong className={gap.currentTextClass}>{currentLvl} / 5</strong>
              </span>
              <span>
                Required Target: <strong className="text-navy-900 dark:text-white">{gap.targetLevel} / 5</strong>
              </span>
              <span>
                Importance: <strong>{gap.importanceLabel}</strong>
              </span>
            </div>

            <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
                  {gap.bridgeLabel}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
                  {gap.courseName}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onEnrollBridge(gap.skillId, gap.enrollTargetLevel, gap.courseName, gap.gainText)
                }
                disabled={isEnrolled}
                aria-label={`${isEnrolled ? 'Enrolled in' : 'Enroll in'} ${gap.courseName}`}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
                  isEnrolled ? 'bg-emerald-600 text-white cursor-default' : gap.buttonActiveClass
                }`}
              >
                {isEnrolled ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Enrolled (Lvl {gap.enrollTargetLevel})</span>
                  </>
                ) : (
                  <>
                    <span>Bridge +1</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
    </ScrollReveal>
  );
}
