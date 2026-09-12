'use client';

import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-emerald-200 hover:text-white bg-emerald-900/60 p-2 rounded-full transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Explainable AI Matching Engine
          </div>
          <h3 className="text-lg sm:text-xl font-bold pr-8">{opportunityTitle}</h3>
          <p className="text-emerald-100 text-xs sm:text-sm">{companyName}</p>

          <div className="mt-3 sm:mt-4 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15">
            <div>
              <p className="text-[11px] sm:text-xs text-emerald-100">Overall Calculated Match</p>
              <p className="text-xl sm:text-2xl font-black text-white">{match.overallScore}%</p>
            </div>
            <span className="text-[11px] sm:text-xs font-medium px-2.5 py-1 bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 rounded-full">
              Transparent Scoring
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Executive Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              Algorithmic Rationale
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">{match.reasoning}</p>
          </div>

          {/* Factor Breakdown (The 5 Weights) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Weighted Factor Breakdown
            </h4>
            <div className="space-y-3">
              {/* Factor 1 */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Skill Overlap & Coverage (Weight: 45%)</span>
                  <span className="font-bold text-slate-900">{match.factors.skillMatchPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${match.factors.skillMatchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Factor 2 */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Proficiency Level Alignment (Weight: 20%)</span>
                  <span className="font-bold text-slate-900">{match.factors.proficiencyScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${match.factors.proficiencyScore}%` }}
                  />
                </div>
              </div>

              {/* Factor 3 */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Career Domain Interest (Weight: 15%)</span>
                  <span className="font-bold text-slate-900">{match.factors.interestMatchScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${match.factors.interestMatchScore}%` }}
                  />
                </div>
              </div>

              {/* Factor 4 & 5 */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Work Mode (10%)</span>
                  <span className="text-xs font-bold text-slate-800">{match.factors.modeMatchScore}% Alignment</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Academic Eligibility (10%)</span>
                  <span className="text-xs font-bold text-slate-800">{match.factors.eligibilityScore}% Eligible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Comparison Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Skill Mapping Details ({match.matchedSkillsCount}/{match.totalRequiredSkills} Matched)
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
              {match.matchedSkillsList.map((skill, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {skill.met ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-slate-800">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      Yours: <strong className="text-slate-900">{skill.studentLevel}/5</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">
                      Req: <strong className="text-blue-700">{skill.requiredLevel}/5</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Missing Skills if any */}
          {match.missingCriticalSkills.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">Recommended Gap Closure:</span>
              <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                {match.missingCriticalSkills.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
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
              className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                isApplied
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
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
