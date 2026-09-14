'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowLeft,
  GraduationCap,
  ExternalLink,
  Info,
  BadgeAlert,
  Sparkles
} from 'lucide-react';

export default function VerifyStudentsPage() {
  const { unverifiedStudents, verifyStudent, flagStudent } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Verified' | 'Flagged'>('All');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredStudents = unverifiedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      student.degree.toLowerCase().includes(search.toLowerCase());

    if (filter === 'All') return matchesSearch;
    return matchesSearch && student.status === filter;
  });

  const handleVerify = (id: string, name: string) => {
    verifyStudent(id);
    setSuccessToast(`Verified learner credentials for ${name}. Data pushed to Core Processing!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleFlag = (id: string, name: string) => {
    flagStudent(id);
    setSuccessToast(`Flagged ${name} for administrative document re-submission.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back to Dashboard Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/institution/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-saffron-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Institutional Overview</span>
        </Link>

        {/* Workflow breadcrumb */}
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-50 dark:bg-slate-800 text-saffron-dark dark:text-saffron border border-orange-200 dark:border-slate-700 font-semibold">
          Workflow Block: Institution Actions &rarr; Verify Students
        </span>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-700 text-white font-medium text-xs shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-saffron" />
            <span>Student Credential & Enrollment Verification</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Authorize learner academic authenticity via institutional roll records and DigiLocker ID synchronization. Approving pushes verified learner data directly into the Skill Matching engine.
          </p>
        </div>

        {/* Workflow Info Badge */}
        <div className="p-3 rounded-2xl bg-orange-50/80 dark:bg-slate-800/80 border border-orange-200/80 dark:border-slate-700 text-xs text-saffron-dark dark:text-saffron flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4 text-saffron shrink-0" />
          <div className="text-[11px] leading-tight">
            <strong>Sends:</strong> Verified Learner Data<br />
            <strong>To:</strong> Core Data Processing
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or degree..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-saffron focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          {(['All', 'Pending', 'Verified', 'Flagged'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-saffron text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Student Verification Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Candidate & Roll No.</th>
                <th className="py-3.5 px-4">Program & Year</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">DigiLocker &amp; ABC ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-white flex items-center justify-center font-bold text-xs">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-navy-900 dark:text-white block">
                            {s.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {s.rollNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block">
                        {s.degree}
                      </span>
                      <span className="text-[11px] text-slate-500">{s.year}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-navy-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {s.cgpa}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[11px] text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 block w-fit">
                          {s.digiLockerId}
                        </span>
                        {s.abcId && (
                          <span className="font-mono text-[10px] text-navy-800 dark:text-blue-300 bg-navy-50 dark:bg-navy-950/60 px-2 py-0.5 rounded-md border border-navy-200 dark:border-navy-800 block w-fit">
                            ABC: {s.abcId} ({s.abcCredits || 148} Cr)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {s.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : s.status === 'Pending' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      {s.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerify(s.id, s.name)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFlag(s.id, s.name)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all"
                          >
                            Flag
                          </button>
                        </div>
                      ) : s.status === 'Verified' ? (
                        <span className="text-[11px] text-slate-500 font-medium">
                          Data pushed to Core Engine
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerify(s.id, s.name)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-saffron-dark dark:text-saffron hover:underline"
                        >
                          Re-Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="sm:hidden p-4 divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          {filteredStudents.length === 0 ? (
            <p className="text-center py-6 text-slate-500">No students found matching current filters.</p>
          ) : (
            filteredStudents.map((s) => (
              <div key={s.id} className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-white font-bold flex items-center justify-center shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 dark:text-white text-sm">
                        {s.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500">{s.rollNumber}</p>
                    </div>
                  </div>

                  <span className="font-bold text-xs bg-slate-100 dark:bg-slate-800 text-navy-900 dark:text-white px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    CGPA {s.cgpa}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{s.degree}</span>
                    <span className="text-[11px] text-slate-500">{s.year}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="font-mono text-[10px] text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      DigiLocker: {s.digiLockerId}
                    </span>
                    {s.abcId && (
                      <span className="font-mono text-[10px] text-navy-800 dark:text-blue-300 bg-navy-50 dark:bg-navy-950/60 px-2 py-0.5 rounded-md border border-navy-200 dark:border-navy-800">
                        ABC: {s.abcId} ({s.abcCredits || 148} Cr)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {s.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : s.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                      Pending Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                    </span>
                  )}

                  {s.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleVerify(s.id, s.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFlag(s.id, s.name)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                      >
                        Flag
                      </button>
                    </div>
                  ) : s.status === 'Flagged' ? (
                    <button
                      type="button"
                      onClick={() => handleVerify(s.id, s.name)}
                      className="px-3 py-1.5 rounded-xl bg-saffron text-white font-semibold text-xs shadow-2xs"
                    >
                      Re-Verify
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Pushed to Core Engine ✓</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
