'use client';

import React, { useEffect } from 'react';
import { MatchBreakdown } from '@/lib/matchingEngine';
import { X, CheckCircle2, AlertCircle, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface WhyMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityTitle: string;
  companyName: string;
  match: MatchBreakdown;
  onApply?: () => void;
  isApplied?: boolean;
}

export default function WhyMatchModal({
  isOpen,
  onClose,
  opportunityTitle,
  companyName,
  match,
  onApply,
  isApplied,
}: WhyMatchModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-match-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-4 sm:p-6 relative shrink-0 border-b border-navy-700/60">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-navy-800 p-2 rounded-full transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center border border-navy-700"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-saffron-light text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-saffron" aria-hidden="true" />
            Explainable AI Matching Engine
          </div>
          <h3 id="why-match-modal-title" className="text-lg sm:text-xl font-bold pr-8 text-white">{opportunityTitle}</h3>
          <p className="text-slate-300 text-xs sm:text-sm">{companyName}</p>

          <div className="mt-3 sm:mt-4 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-300">Overall Calculated Match</p>
              <p className="text-xl sm:text-2xl font-black text-white">{match.overallScore}%</p>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 bg-saffron/25 text-saffron-light border border-saffron/40 rounded-full">
              Transparent Scoring
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Executive Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-saffron" />
              Algorithmic Rationale
            </h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{match.reasoning}</p>
          </div>

          {/* Factor Breakdown (The 5 Weights) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              Weighted Factor Breakdown
            </h4>
            <div className="space-y-3">
              {/* Factor 1 */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Skill Overlap & Coverage (Weight: 45%)</span>
                  <span className="font-bold text-navy-900 dark:text-white">{match.factors.skillMatchPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-saffron rounded-full"
                    style={{ width: `${match.factors.skillMatchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Factor 2 */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Proficiency Level Alignment (Weight: 20%)</span>
                  <span className="font-bold text-navy-900 dark:text-white">{match.factors.proficiencyScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy-900 dark:bg-saffron-dark rounded-full"
                    style={{ width: `${match.factors.proficiencyScore}%` }}
                  />
                </div>
              </div>

              {/* Factor 3 */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Career Domain Interest (Weight: 15%)</span>
                  <span className="font-bold text-navy-900 dark:text-white">{match.factors.interestMatchScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${match.factors.interestMatchScore}%` }}
                  />
                </div>
              </div>

              {/* Factor 4 & 5 */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block">Work Mode (10%)</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{match.factors.modeMatchScore}% Alignment</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block">Academic Eligibility (10%)</span>
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{match.factors.eligibilityScore}% Eligible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Comparison Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Skill Mapping Details ({match.matchedSkillsCount}/{match.totalRequiredSkills} Matched)
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
              {match.matchedSkillsList.map((skill, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {skill.met ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-saffron shrink-0" />
                    )}
                    <span className="font-medium text-slate-800 dark:text-slate-200">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      Yours: <strong className="text-navy-900 dark:text-white">{skill.studentLevel}/5</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">
                      Req: <strong className="text-saffron-dark dark:text-saffron">{skill.requiredLevel}/5</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Missing Skills if any */}
          {match.missingCriticalSkills.length > 0 && (
            <div className="p-3 bg-orange-50 dark:bg-slate-800/80 rounded-xl border border-orange-200 dark:border-slate-700 text-xs">
              <span className="font-bold text-saffron-dark dark:text-saffron block mb-1">Recommended Gap Closure:</span>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                {match.missingCriticalSkills.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Close
          </button>
          {onApply && (
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              disabled={isApplied}
              className={`px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                isApplied
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-saffron hover:bg-saffron-hover text-white shadow-md shadow-saffron/25'
              }`}
            >
              {isApplied ? 'Application Submitted' : '1-Click Apply Now'}
              {!isApplied && <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
