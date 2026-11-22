'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Opportunity, MatchBreakdown } from '@/lib/matchingEngine';

export interface MatchedOpportunityItem {
  opportunity: Opportunity;
  match: MatchBreakdown;
  isApplied: boolean;
}

interface TopOpportunitiesListProps {
  totalOpportunitiesCount: number;
  matchedOpportunities: MatchedOpportunityItem[];
  onSelectWhyMatch: (item: MatchedOpportunityItem) => void;
  onApplyOpportunity: (opportunity: Opportunity) => void;
}

export default function TopOpportunitiesList({
  totalOpportunitiesCount,
  matchedOpportunities,
  onSelectWhyMatch,
  onApplyOpportunity,
}: TopOpportunitiesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
            Intelligent Matching Engine
          </span>
          <h2 className="text-lg font-bold text-navy-900 dark:text-white">
            Top Verified Internship Recommendations
          </h2>
        </div>
        <Link
          href="/student/internships"
          className="text-xs font-bold text-saffron-dark dark:text-saffron hover:underline flex items-center gap-1"
        >
          <span>Explore All ({totalOpportunitiesCount}) Matched Listings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mosaic Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {matchedOpportunities.map((item) => {
          const { opportunity, match, isApplied } = item;
          return (
            <div
              key={opportunity.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-saffron" /> {match.overallScore}% Match
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Stipend: {opportunity.stipend}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-teal-400 font-bold flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-base">
                    {opportunity.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900 dark:text-white leading-snug">
                      {opportunity.company}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {opportunity.title}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 line-clamp-2">
                  {opportunity.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    📍 {opportunity.location}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    ⏱️ {opportunity.duration}
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                    MoA Stipend Subsidized
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectWhyMatch(item)}
                  className="text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white font-mono text-xs underline underline-offset-4 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-saffron" />
                  Why this matches?
                </button>

                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => onApplyOpportunity(opportunity)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                    isApplied
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      : 'bg-navy-900 hover:bg-navy-800 dark:bg-saffron dark:hover:bg-saffron-hover text-white'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : 'Quick Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
