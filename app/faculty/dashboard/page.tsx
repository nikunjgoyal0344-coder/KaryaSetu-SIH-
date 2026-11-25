'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  BookOpen,
  Award,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function FacultyDashboard() {
  const { student, endorseStudentSkill, addNotification } = useApp();
  const [fdpApplied, setFdpApplied] = React.useState(false);
  const [collabSent, setCollabSent] = React.useState(false);

  const pendingStudentSkills = student.skills.filter((s) => !s.isVerified);

  return (
    <div className="space-y-8 py-4 text-xs">
      {/* Faculty Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Dr. Rajesh Mishra"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-saffron/50 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dr. Rajesh Mishra</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron-light text-xs font-semibold">
                Associate Professor • Dravyaguna
              </span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm">
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
            <div className="flex items-center gap-1.5 text-saffron-light text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-saffron" />
              Faculty Development Score
            </div>
            <p className="text-3xl font-black text-white">92 / 100</p>
            <span className="text-[11px] text-emerald-300 font-medium">NAAC / NBA Criterion 2.4 Aligned</span>
          </div>
        </div>
      </div>

      {/* Grid: Skill Endorsement Queue + Industry FDPs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Student Skill Endorsements */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                Student Practical Skill Endorsement Queue
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Teachers validate hands-on clinical competencies to eliminate fake portfolio claims
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              {pendingStudentSkills.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingStudentSkills.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400 mx-auto mb-2" />
                <p className="font-bold text-sm">All student skills verified!</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Ananya Sharma&apos;s portfolio has full institutional faculty backing.
                </p>
              </div>
            ) : (
              pendingStudentSkills.map((s) => (
                <div
                  key={s.skillId}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 dark:text-white">{s.skillName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                        Claimed: {s.level}/5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Scholar: <strong className="text-slate-800 dark:text-slate-200">{student.name}</strong> • {student.year}
                    </p>
                  </div>

                  <button
                    onClick={() => endorseStudentSkill(s.skillId, 'Dr. Rajesh Mishra')}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 text-xs"
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
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-saffron" />
                Industry Training &amp; FDP Marketplace
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                UGC &amp; AICTE recognized faculty upskilling programs directly with pharma R&amp;D
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-saffron-dark dark:text-saffron font-bold text-xs border border-orange-200 dark:border-orange-900/60">
              Govt Funded
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-navy-100 dark:bg-navy-950 text-navy-900 dark:text-blue-200 border border-navy-200 dark:border-navy-800">
                  CSIR-CDRI &amp; AIIA
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  Fully Funded + ₹10,000
                </span>
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white text-sm">
                National Faculty Development Program: High-Throughput LC-MS &amp; Phytomedicine Standardization
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                2-Week hybrid training for Ayurvedic professors in modern chromatographic profiling, quality control, and clinical trial clearances.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">⏳ Starts 1st Nov 2026</span>
                <button
                  type="button"
                  disabled={fdpApplied}
                  onClick={() => {
                    setFdpApplied(true);
                    addNotification({
                      title: 'Faculty FDP Application Submitted',
                      message: 'Application submitted for CSIR-CDRI & AIIA National FDP. Reference: FDP-2026-9081',
                      type: 'opportunity',
                    });
                  }}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold transition-all shadow-sm text-xs flex items-center justify-center gap-1.5 ${
                    fdpApplied
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-saffron hover:bg-saffron-hover text-white'
                  }`}
                >
                  {fdpApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>FDP Fellow Nominated</span>
                    </>
                  ) : (
                    <span>Apply as Faculty Fellow</span>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  Dabur R&amp;D Labs
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Industry Sabbatical</span>
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white text-sm">
                Corporate Consultancy &amp; Collaborative Research Sabbatical
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                1-Month collaborative placement with formulation scientists on bioavailability enhancement of Rasashastra minerals.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">📍 Ghaziabad R&amp;D Center</span>
                <button
                  type="button"
                  disabled={collabSent}
                  onClick={() => {
                    setCollabSent(true);
                    addNotification({
                      title: 'Collaboration Inquiry Submitted',
                      message: 'Consultancy placement inquiry registered with Dabur R&D Labs, Ghaziabad Center.',
                      type: 'opportunity',
                    });
                  }}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl font-semibold transition-all text-xs flex items-center justify-center gap-1.5 ${
                    collabSent
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      : 'border border-navy-900/20 dark:border-slate-700 text-navy-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {collabSent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                      <span>Inquiry Registered</span>
                    </>
                  ) : (
                    <span>Express Collaboration Interest</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
