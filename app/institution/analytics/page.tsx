'use client';

import React from 'react';
import Link from 'next/link';
import { INSTITUTION_ANALYTICS } from '@/lib/seedData';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Download, 
  ArrowLeft,
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function InstitutionAnalyticsPage() {
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/institution/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Institutional Overview</span>
        </Link>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
          Workflow Block: Institution Actions &rarr; Analytics & Placement Tracking
        </span>
      </div>

      {/* Header & Export */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Institutional Analytics & Placement Tracking</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time telemetry gathered from the student application pipeline, recruiter shortlists, and industry hiring conversions across all AYUSH faculties.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintReport}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Official Placement Report</span>
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Placement Ratio</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {INSTITUTION_ANALYTICS.placementRate}%
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +6.6% vs previous cohort
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Active Residencies & Internships</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {INSTITUTION_ANALYTICS.activeInternships}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Across 14 Accredited Centers
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Average Monthly Stipend</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {INSTITUTION_ANALYTICS.averageStipend}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Highest: ₹55,000 / mo (R&D Fellow)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Active Industry MoUs</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {INSTITUTION_ANALYTICS.partnerMoUs}
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 block">
            100% Recruiter Compliance
          </span>
        </div>
      </div>

      {/* Main Analytics Grid: Demand Skills & Cohort Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recruited Skills */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Top Skills Recruited by Industry</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">HSSC QP Benchmarked</span>
          </div>

          <div className="space-y-3 pt-2">
            {INSTITUTION_ANALYTICS.topSkillsDemand.map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{item.skill}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{item.count} offers ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${item.percentage * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Year Placement Cohort Trajectory */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>3-Year Placement Trajectory</span>
            </h2>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+11.6% Net Growth</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {INSTITUTION_ANALYTICS.cohortTrends.map((cohort) => (
              <div
                key={cohort.year}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-1"
              >
                <span className="text-xs text-slate-500 font-medium">{cohort.year} Cohort</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {cohort.rate}%
                </div>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                  {cohort.placed} Placed
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>KaryaSetu AI matching algorithm increased average placement time-to-hire by 42%.</span>
          </div>
        </div>
      </div>

      {/* Primary Recruiter Distribution */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-500" />
          <span>Major Recruiting Partners</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {INSTITUTION_ANALYTICS.hiringPartners.map((partner) => (
            <div
              key={partner.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-2 hover:border-emerald-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                {partner.logo}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {partner.name}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {partner.hires} candidates hired
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
