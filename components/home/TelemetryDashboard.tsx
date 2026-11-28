'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { useInView } from '@/lib/hooks/useInView';
import { COHORT_SNAPSHOTS, COHORT_TABS, DEMAND_SKILLS, type CohortType } from '@/lib/homeTelemetryData';
import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function TelemetryDashboard() {
  const [activeCohort, setActiveCohort] = useState<CohortType>('all');
  const { ref: telemetryRef, isVisible: metricsInView } = useInView<HTMLElement>({ threshold: 0.1 });
  const snapshot = COHORT_SNAPSHOTS[activeCohort];
  const outerOffset = Math.round(351.8 * (1 - parseFloat(snapshot.indexPct) / 100));

  return (
    <section
      id="telemetry-section"
      ref={telemetryRef}
      aria-labelledby="telemetry-heading"
      className="scroll-mt-20 w-full px-4 py-8 max-w-[1600px] mx-auto border-b border-slate-200 dark:border-slate-800"
    >
      <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 text-xs font-mono font-semibold mb-2 border border-slate-200 dark:border-navy-800">
            <BarChart3 className="w-3.5 h-3.5 text-navy-700 dark:text-blue-400" aria-hidden="true" />
            <span>National Skill Intelligence Grid</span>
          </div>
          <h2 id="telemetry-heading" className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            Live Telemetry &amp; Competency Benchmarks
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl">
            Real-time aggregate data visualization of authenticated scholar cohorts, enterprise MoAs, and Ayush bio-pharma skill demands.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter telemetry cohort"
          className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold shrink-0 shadow-2xs"
        >
          {COHORT_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCohort(key)}
              aria-pressed={activeCohort === key}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeCohort === key
                  ? 'bg-saffron text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Top Progress Rollout Card */}
      <ScrollReveal variant="fade-up" delayMs={80}>
      <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <CheckCircle2 className="w-5 h-5 text-navy-900 dark:text-blue-400" aria-hidden="true" />
              <h3 className="font-bold text-base md:text-lg text-navy-900 dark:text-white tracking-tight">
                Overall National Portal &amp; Mission Rollout Progress
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold border border-emerald-600/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                Phase-II On Schedule • {snapshot.indexPct} Complete
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-mono mt-0.5">
              Live national milestone telemetry across academic nodes, industry MoAs, and sovereign attestation networks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">National Standard:</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 border border-slate-200 dark:border-navy-800">
              NSQF L6-8 Certified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140" role="img" aria-label={`National Index ${snapshot.indexPct}`}>
                <circle cx="70" cy="70" fill="transparent" r="56" stroke="#E2E8F0" strokeWidth="11" />
                <circle
                  cx="70"
                  cy="70"
                  fill="transparent"
                  r="56"
                  stroke="#1B365D"
                  strokeDasharray="351.8"
                  strokeDashoffset={metricsInView ? outerOffset : 351.8}
                  strokeLinecap="round"
                  strokeWidth="11"
                  className="transition-all duration-700 ease-out"
                />
                <circle cx="70" cy="70" fill="transparent" r="42" stroke="#E2E8F0" strokeWidth="7" />
                <circle
                  cx="70"
                  cy="70"
                  fill="transparent"
                  r="42"
                  stroke="#EA580C"
                  strokeDasharray="263.9"
                  strokeDashoffset={metricsInView ? 52.7 : 263.9}
                  strokeLinecap="round"
                  strokeWidth="7"
                  className="transition-all duration-700 ease-out delay-100"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-navy-900 dark:text-white font-mono leading-none">
                  {snapshot.indexPct}
                </span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mt-1 font-semibold">
                  National Index
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-navy-700 dark:bg-blue-400" /> Portal Core
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-saffron" /> Enterprise Hub
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-between space-y-3.5">
            {snapshot.milestones.map(({ label, pct, detail, barClass, textClass, Icon }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-navy-900 dark:text-slate-200 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-navy-700 dark:text-blue-400" aria-hidden="true" />
                    {label}
                  </span>
                  <span className={`font-bold ${textClass}`}>
                    {pct}% <span className="text-slate-500 dark:text-slate-400 font-normal">{detail}</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out motion-reduce:transition-none ${barClass}`}
                    style={{ width: metricsInView ? `${pct}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Overall Ecosystem Index</div>
            <div className="text-base font-extrabold text-navy-900 dark:text-white mt-0.5">{snapshot.ecosystemIndex}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Active Milestones</div>
            <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">{snapshot.milestonesAchieved}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Next Sovereign Audit</div>
            <div className="text-base font-extrabold text-navy-900 dark:text-white mt-0.5">12 Days</div>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* Dual Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <ScrollReveal variant="fade-up" delayMs={80} className="lg:col-span-7 flex">
        <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="font-bold text-base text-navy-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-navy-700 dark:text-blue-400" aria-hidden="true" />
                  Monthly Verified Placement &amp; MoA Growth Trajectory
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                  Telemetry trend over recent 6 Quarters across 210+ Bio-Pharma Partners
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-xs bg-navy-800 dark:bg-blue-400" /> Placements
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-xs bg-saffron" /> MoA Accords
                </span>
              </div>
            </div>

            <div className="w-full h-56 relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 540 180" role="img" aria-label="Quarterly Placement and MoA growth area chart">
                <defs>
                  <linearGradient id="placementNavyGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#102A45" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#102A45" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="moaSaffronGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[
                  { y: 20, label: '14k' },
                  { y: 60, label: '10k' },
                  { y: 100, label: '6k' },
                  { y: 140, label: '2k' },
                ].map(({ y, label }) => (
                  <g key={label}>
                    <line stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="0.8" x1="30" x2="520" y1={y} y2={y} />
                    <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="24" y={y + 3}>{label}</text>
                  </g>
                ))}

                <polygon
                  fill="url(#moaSaffronGradient)"
                  points="45,155 45,135 140,120 235,105 330,90 425,75 520,55 520,155"
                  className={`transition-opacity duration-700 ${metricsInView ? 'opacity-100' : 'opacity-0'}`}
                />
                <path
                  d="M 45 135 L 140 120 L 235 105 L 330 90 L 425 75 L 520 55"
                  fill="none"
                  stroke="#EA580C"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  strokeDasharray="600"
                  strokeDashoffset={metricsInView ? 0 : 600}
                  className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
                />

                <polygon
                  fill="url(#placementNavyGradient)"
                  points="45,155 45,125 140,105 235,80 330,62 425,42 520,26 520,155"
                  className={`transition-opacity duration-700 delay-150 ${metricsInView ? 'opacity-100' : 'opacity-0'}`}
                />
                <path
                  d="M 45 125 L 140 105 L 235 80 L 330 62 L 425 42 L 520 26"
                  fill="none"
                  stroke="#102A45"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  strokeDasharray="600"
                  strokeDashoffset={metricsInView ? 0 : 600}
                  className="transition-[stroke-dashoffset] duration-1000 ease-out delay-150 motion-reduce:transition-none"
                />

                {[
                  { cx: 45, cy: 125, q: "Q3 '23" },
                  { cx: 140, cy: 105, q: "Q4 '23" },
                  { cx: 235, cy: 80, q: "Q1 '24" },
                  { cx: 330, cy: 62, q: "Q2 '24" },
                  { cx: 425, cy: 42, q: "Q3 '24" },
                  { cx: 520, cy: 26, q: "Q4 '24 (Live)", live: true },
                ].map(({ cx, cy, q, live }, dotIdx) => (
                  <g
                    key={q}
                    style={{ transitionDelay: `${Math.min(500, dotIdx * 80)}ms` }}
                    className={`transition-opacity duration-500 ${metricsInView ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      fill={live ? '#EA580C' : '#102A45'}
                      r={live ? 4.5 : 3.5}
                      stroke="#ffffff"
                      strokeWidth={live ? 2 : 1.5}
                    />
                    <text
                      fill={live ? 'currentColor' : '#64748B'}
                      className={live ? 'text-slate-900 dark:text-slate-100' : undefined}
                      fontFamily="JetBrains Mono"
                      fontSize="9.5"
                      fontWeight={live ? '700' : undefined}
                      textAnchor="middle"
                      x={cx}
                      y="168"
                    >
                      {q}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">MoU Pipeline</div>
              <div className="text-base font-bold text-navy-900 dark:text-white font-mono">488 Active</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">Quarterly Surge</div>
              <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">+32.6% YoY</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">Avg Turnaround</div>
              <div className="text-base font-bold text-navy-900 dark:text-white font-mono">14.2 Days</div>
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Chart 2: Sector Skill Demand Index */}
        <ScrollReveal variant="fade-up" delayMs={180} className="lg:col-span-5 flex">
        <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="font-bold text-base text-navy-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-saffron-accent" aria-hidden="true" />
                  Sector Skill Demand Index
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                  Verified enterprise requisition intensity
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-saffron text-[11px] font-mono font-bold border border-orange-200 dark:border-orange-900">
                High Surge
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {DEMAND_SKILLS.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-navy-900 dark:text-white">{skill.name}</span>
                    <span className={`font-bold ${skill.textClass}`}>{skill.pct}% Index</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out motion-reduce:transition-none ${skill.barClass}`}
                      style={{ width: metricsInView ? `${skill.pct}%` : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    <span>{skill.vacancies}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{skill.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Direct NSDC/HSSC Live Feed
            </span>
            <Link href="/workflow" className="text-saffron hover:text-saffron-hover font-bold flex items-center gap-0.5">
              View Full Matrix →
            </Link>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
