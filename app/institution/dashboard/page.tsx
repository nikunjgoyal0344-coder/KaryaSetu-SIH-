'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { INSTITUTION_ANALYTICS } from '@/lib/seedData';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Award, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function InstitutionDashboard() {
  const { unverifiedStudents } = useApp();
  const pendingCount = unverifiedStudents.filter((s) => s.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-xl relative overflow-hidden border border-navy-700/60">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron-light text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-saffron" />
              Institution Administration Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              All India Institute of Ayurveda
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Academic oversight, learner credential verification, and career placement analytics synchronized with the National Ayush Skilling Framework.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/institution/verify"
              className="px-4 py-2.5 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-semibold text-xs transition-all shadow-md shadow-saffron/25 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Students</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-navy-950 text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </Link>

            <Link
              href="/institution/analytics"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Placement Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Scholars</span>
            <Users className="w-4 h-4 text-navy-800 dark:text-saffron" />
          </div>
          <div className="text-2xl font-bold text-navy-900 dark:text-white">
            {INSTITUTION_ANALYTICS.totalEnrolled}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
            BAMS & MD AYUSH Cohorts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Verification Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-navy-900 dark:text-white">
            {INSTITUTION_ANALYTICS.verificationRate}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            {INSTITUTION_ANALYTICS.verifiedLearners} DigiLocker verified
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {INSTITUTION_ANALYTICS.placementRate}%
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            {INSTITUTION_ANALYTICS.activeInternships} active internships
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Partner MoUs</span>
            <Building2 className="w-4 h-4 text-saffron" />
          </div>
          <div className="text-2xl font-bold text-navy-900 dark:text-white">
            {INSTITUTION_ANALYTICS.partnerMoUs}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Pharma R&D & Hospital Networks
          </div>
        </div>
      </div>

      {/* Two Core Workflow Actions: Verify Students & Placement Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Verify Students Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-slate-800 text-saffron flex items-center justify-center font-bold border border-orange-200 dark:border-slate-700">
                <ShieldCheck className="w-6 h-6 text-saffron" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                Workflow Action 1
              </span>
            </div>

            <h2 className="text-xl font-bold text-navy-900 dark:text-white">
              Verify Students
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Validate student enrollment credentials, synchronize DigiLocker records, and push verified learner data into the KaryaSetu Core Processing Engine to activate trusted AI matching.
            </p>

            <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Pending Registrars Queue:</span>
                <span className="font-bold text-navy-900 dark:text-white">
                  {pendingCount} Candidates Pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Institutional Seal:</span>
                <span className="font-medium text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DigiLocker Synced
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/institution/verify"
            className="w-full py-3 px-4 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs shadow-md shadow-saffron/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Student Verification Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2. Analytics & Placement Tracking Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 dark:bg-slate-800 text-navy-900 dark:text-teal-400 flex items-center justify-center font-bold border border-navy-200 dark:border-slate-700">
                <BarChart3 className="w-6 h-6 text-navy-900 dark:text-teal-400" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                Workflow Action 2
              </span>
            </div>

            <h2 className="text-xl font-bold text-navy-900 dark:text-white">
              Analytics & Placement Tracking
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Inspect comprehensive placement analytics derived from student application tracking, monitor cohort hiring trends, and evaluate top industry demand skills.
            </p>

            <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Average Placement Rate:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">88.6% (2025-26)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Average Stipend / Salary:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{INSTITUTION_ANALYTICS.averageStipend}</span>
              </div>
            </div>
          </div>

          <Link
            href="/institution/analytics"
            className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 dark:bg-saffron dark:hover:bg-saffron-hover text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>View Placement Analytics & Reports</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Workflow Reference Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <FileCheck2 className="w-4 h-4 text-saffron" />
          <span>
            Connected to <strong>KaryaSetu Core Processing</strong> & <strong>Opportunity Flow</strong> as specified in the System Workflow.
          </span>
        </div>
        <Link
          href="/workflow"
          className="text-saffron-dark dark:text-saffron font-semibold hover:underline flex items-center gap-1"
        >
          <span>View Architecture Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
