'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, Stethoscope, Download, FileQuestion } from 'lucide-react';
import type { StudentProfile } from '@/lib/seedData';

interface StudentProfileCardProps {
  student: StudentProfile;
}

export default function StudentProfileCard({ student }: StudentProfileCardProps) {
  return (
    <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Top Badges Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-navy-900 dark:bg-slate-800 text-white font-mono text-[10px] font-semibold tracking-wider">
              NCISM REG: 2021-DL-AIIA-0042
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-saffron-dark dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/40 font-mono text-[10px] font-semibold">
              <Leaf className="w-3 h-3 text-saffron" />
              Prakriti: {student.prakriti}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Ayush-Grid Connected
          </span>
        </div>

        {/* Profile Details Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
          <div className="relative shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-navy-900 border-2 border-amber-400/60"
            />
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900"
              title="Institution & NCISM Verified Scholar"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white tracking-tight">
                {student.name}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-navy-50 dark:bg-slate-800 text-navy-900 dark:text-teal-300 border border-navy-100 dark:border-slate-700">
                {student.degree} • {student.year}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {student.college}
            </p>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs pt-1 flex-wrap">
              <span>
                Roll: <strong className="text-navy-900 dark:text-slate-200">AIIA-2021-BAMS-042</strong>
              </span>
              <span className="opacity-40">|</span>
              <span>
                CGPA: <strong className="text-navy-900 dark:text-slate-200">{student.cgpa} / 10.0</strong>
              </span>
              <span className="opacity-40">|</span>
              <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-semibold border border-emerald-200/60 dark:border-emerald-900/40">
                Honors Track
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 bg-slate-50/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
          <Stethoscope className="w-4 h-4 text-saffron" />
          <span>Next Clinical Rounds: Shalya Tantra (Tomorrow 08:30 AM)</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/student/portfolio"
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-navy-900 dark:text-white px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-2xs border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Passport</span>
          </Link>
          <Link
            href="/student/assessment"
            className="bg-saffron hover:bg-saffron-hover text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Retake Clinical Quiz</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
