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
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-white text-2xl font-black shrink-0">
            DRF
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dabur Research Foundation</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Verified Industry Partner
              </span>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm">
              Logged in as Dr. Vikram Malhotra • Lead Pharmacognosy & Clinical Research
            </p>
            <p className="text-slate-400 text-xs">
              Directly connected with All India Institute of Ayurveda & 300+ accredited AYUSH Colleges
            </p>
          </div>
        </div>

        <Link
          href="/industry/post-internship"
          className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all shrink-0 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Postings</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{opportunities.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+1 posted this week</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Candidates</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalApplicants}</p>
          <span className="text-[11px] text-slate-500">Pre-ranked by AI match score</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700">{shortlistedCount}</p>
          <span className="text-[11px] text-slate-500">Ready for interview</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Skill Match</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">86%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Pre-filtered talent pool</span>
        </div>
      </div>

      {/* Active Listings Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Active Job & Internship Postings</h2>
            <p className="text-xs text-slate-500">Live roles visible to BAMS and AYUSH postgraduates</p>
          </div>
          <Link
            href="/industry/post-internship"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Create Posting <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{opp.title}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {opp.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>📍 {opp.location} ({opp.mode})</span>
                  <span>•</span>
                  <span>💰 {opp.stipend}</span>
                  <span>•</span>
                  <span>⏳ {opp.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm block">
                    {opp.applicantsCount} Applicants
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Top score: 92%
                  </span>
                </div>

                <Link
                  href="/industry/applicants"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs"
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
