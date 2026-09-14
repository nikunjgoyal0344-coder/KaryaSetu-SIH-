'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  Building2,
  Users,
  Briefcase,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function IndustryDashboard() {
  const { opportunities, applications } = useApp();

  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="space-y-8 py-4">
      {/* Recruiter Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron-light text-2xl font-black shrink-0">
            DRF
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dabur Research Foundation</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Industry Partner
              </span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm">
              Logged in as Dr. Vikram Malhotra • Lead Pharmacognosy & Clinical Research
            </p>
            <p className="text-slate-400 text-xs">
              Directly connected with All India Institute of Ayurveda & 300+ accredited AYUSH Colleges
            </p>
          </div>
        </div>

        <Link
          href="/industry/post-internship"
          className="px-5 py-3 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs sm:text-sm shadow-md shadow-saffron/25 flex items-center gap-2 transition-all shrink-0 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Link>
      </div>      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Postings</span>
            <Briefcase className="w-4 h-4 text-navy-800 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-black text-navy-900 dark:text-white">{opportunities.length}</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">+1 posted this week</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-saffron" />
          </div>
          <p className="text-3xl font-black text-navy-900 dark:text-white">{totalApplicants}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">Pre-ranked by AI match score</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{shortlistedCount}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">Ready for interview</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Skill Match</span>
            <TrendingUp className="w-4 h-4 text-saffron" />
          </div>
          <p className="text-3xl font-black text-navy-900 dark:text-white">86%</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Pre-filtered talent pool</span>
        </div>
      </div>

      {/* Active Listings Table */}
      <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Your Active Job &amp; Internship Postings</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Live roles visible to BAMS and AYUSH postgraduates</p>
          </div>
          <Link
            href="/industry/post-internship"
            className="text-xs font-bold text-saffron hover:text-saffron-dark flex items-center gap-1"
          >
            Create Posting <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy-900 dark:text-white text-sm">{opp.title}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-semibold">
                    {opp.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>📍 {opp.location} ({opp.mode})</span>
                  <span>•</span>
                  <span>💰 {opp.stipend}</span>
                  <span>•</span>
                  <span>⏳ {opp.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="font-bold text-navy-900 dark:text-white text-sm block">
                    {opp.applicantsCount} Applicants
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Top score: 92%
                  </span>
                </div>

                <Link
                  href="/industry/applicants"
                  className="px-4 py-2 rounded-xl bg-navy-900 dark:bg-navy-800 hover:bg-navy-800 dark:hover:bg-navy-700 text-white font-semibold transition-all shadow-xs"
                >
                  Manage Pipeline
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
