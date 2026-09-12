'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  GraduationCap,
  Sparkles,
  Building,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

export default function FacultyDashboard() {
  const { student, endorseStudentSkill } = useApp();

  const pendingStudentSkills = student.skills.filter((s) => !s.isVerified);

  return (
    <div className="space-y-8 py-4 text-xs">
      {/* Faculty Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Dr. Rajesh Mishra"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dr. Rajesh Mishra</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold">
                Associate Professor • Dravyaguna
              </span>
            </div>
            <p className="text-amber-100/90 text-xs sm:text-sm">
              All India Institute of Ayurveda (AIIA), New Delhi
            </p>
            <p className="text-slate-400 text-xs">
              Institutional Coordinator for Ayush Skill Development & Faculty Immersion Programs
            </p>
          </div>
        </div>

        {/* Faculty Impact Metrics */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              Faculty Development Score
            </div>
            <p className="text-3xl font-black text-white">92 / 100</p>
            <span className="text-[11px] text-amber-200">NAAC / NBA Criterion 2.4 Aligned</span>
          </div>
        </div>
      </div>

      {/* Grid: Skill Endorsement Queue + Industry FDPs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Student Skill Endorsements */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Student Practical Skill Endorsement Queue
              </h2>
              <p className="text-slate-500 text-xs">
                Teachers validate hands-on clinical competencies to eliminate fake portfolio claims
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              {pendingStudentSkills.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingStudentSkills.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-sm">All student skills verified!</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  Ananya Sharma's portfolio has full institutional faculty backing.
                </p>
              </div>
            ) : (
              pendingStudentSkills.map((s) => (
                <div
                  key={s.skillId}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.skillName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        Claimed: {s.level}/5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Scholar: <strong className="text-slate-700">{student.name}</strong> • {student.year}
                    </p>
                  </div>

                  <button
                    onClick={() => endorseStudentSkill(s.skillId, 'Dr. Rajesh Mishra')}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Endorse Skill</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Faculty FDPs & Industry Immersion */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                Industry Training & FDP Marketplace
              </h2>
              <p className="text-slate-500 text-xs">
                UGC & AICTE recognized faculty upskilling programs directly with pharma R&D
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
              Funded
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  CSIR-CDRI & AIIA
                </span>
                <span className="font-bold text-emerald-800 text-xs">Fully Funded + ₹10,000</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                National Faculty Development Program: High-Throughput LC-MS & Phytomedicine Standardization
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                2-Week hybrid training for Ayurvedic professors in modern chromatographic profiling, quality control, and clinical trial clearances.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">⏳ Starts 1st Nov 2026</span>
                <button
                  onClick={() => alert('Faculty FDP Application submitted for Dr. Rajesh Mishra!')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs text-xs"
                >
                  Apply as Faculty Fellow
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  Dabur R&D Labs
                </span>
                <span className="font-bold text-slate-700">Industry Sabbatical</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Corporate Consultancy & Collaborative Research Sabbatical
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                1-Month collaborative placement with formulation scientists on bioavailability enhancement of Rasashastra minerals.
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">📍 Ghaziabad R&D Center</span>
                <button
                  onClick={() => alert('Research Collaboration inquiry submitted to Dabur!')}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-800 font-semibold transition-all"
                >
                  Express Collaboration Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
