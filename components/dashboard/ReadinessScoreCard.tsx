'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ReadinessScoreCardProps {
  readinessScore: number;
}

export default function ReadinessScoreCard({ readinessScore }: ReadinessScoreCardProps) {
  // Circle circumference is 2 * PI * 50 = 314.159
  const circleOffset = Math.max(0, 314.159 * (1 - readinessScore / 100));

  return (
    <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-navy-700/80 flex flex-col justify-between relative overflow-hidden space-y-4">
      {/* Background Ambient Aura */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-saffron/15 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider block font-semibold">
            Assessment Matrix
          </span>
          <h2 className="text-lg font-bold text-white">Industry Readiness Score</h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" /> Top 10%
        </span>
      </div>

      {/* Center Gauge with SVG Circular Track */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1 relative z-10">
        <div className="sm:col-span-6 flex items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120" role="img" aria-label={`Readiness gauge showing ${readinessScore}%`}>
              <circle
                cx="60"
                cy="60"
                fill="transparent"
                r="50"
                stroke="#1b365d"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                fill="transparent"
                r="50"
                stroke="#fd651e"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="314.159"
                strokeDashoffset={circleOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white leading-none">
                {readinessScore}%
              </span>
              <span className="font-mono text-[10px] text-amber-300 font-bold tracking-wider mt-1">
                COMPLIANT
              </span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-6 space-y-2 text-left">
          <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-700/60 space-y-0.5">
            <span className="font-mono text-[10px] text-slate-400 block uppercase">
              COHORT POSITION
            </span>
            <div className="font-bold text-xs text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% above median
            </div>
          </div>
          <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-700/60 space-y-0.5">
            <span className="font-mono text-[10px] text-slate-400 block uppercase">
              NCISM BENCHMARK
            </span>
            <div className="font-semibold text-xs text-white">
              Level 4: Autonomous Care
            </div>
          </div>
        </div>
      </div>

      {/* Metric Sub-strip */}
      <div className="pt-2 border-t border-navy-700/60 flex items-center justify-between font-mono text-[11px] text-slate-300 relative z-10">
        <span>Verified by 3 HOD Reviewers</span>
        <span className="text-amber-300 font-semibold">Next Audit: Nov 15</span>
      </div>
    </div>
  );
}
