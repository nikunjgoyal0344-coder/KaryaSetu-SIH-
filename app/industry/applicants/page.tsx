'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Search,
  XCircle,
  Sparkles,
  ExternalLink,
  Building,
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicantsPage() {
  const { applications, updateApplicationStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentCollege.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 py-4 text-xs">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-saffron-dark dark:text-orange-300 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            Candidate Pipeline & Screening
          </div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            Pre-Screened Applicant Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Candidates automatically scored and ranked by skill compatibility against your requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
            Total Candidates: {applications.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Shortlisted: {applications.filter((a) => a.status === 'Shortlisted').length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search candidates by name, college, or role"
            placeholder="Search candidates by name, college, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="applicant-status-filter" className="text-slate-600 dark:text-slate-300 font-semibold shrink-0">Status:</label>
          <select
            id="applicant-status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants List */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-5">Candidate Name</th>
                <th className="py-3.5 px-5">Applied Role</th>
                <th className="py-3.5 px-5">Match Score</th>
                <th className="py-3.5 px-5">Applied Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Recruiter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-teal-400 font-bold flex items-center justify-center shrink-0">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-navy-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>{app.studentName}</span>
                          <Link
                            href="/student/portfolio"
                            className="text-slate-400 hover:text-saffron-dark dark:hover:text-saffron"
                            title="View Verified Portfolio"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {app.studentCollege}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {app.opportunityTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{app.company}</span>
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-black text-xs inline-flex items-center gap-1 ${
                        app.matchScore >= 85
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-orange-100 dark:bg-orange-950/50 text-saffron-dark dark:text-orange-300 border border-orange-300 dark:border-orange-800'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-saffron" />
                      {app.matchScore}%
                    </span>
                  </td>

                  <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{app.appliedDate}</td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        app.status === 'Shortlisted'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-850'
                          : app.status === 'Under Review'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-850'
                          : app.status === 'Selected'
                          ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-850'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-850'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                        disabled={app.status === 'Shortlisted'}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          app.status === 'Shortlisted'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                        }`}
                      >
                        {app.status === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        Review
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Reject Candidate"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="sm:hidden p-4 divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-teal-400 font-bold flex items-center justify-center shrink-0">
                    {app.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-navy-900 dark:text-white text-sm flex items-center gap-1.5">
                      <span>{app.studentName}</span>
                      <Link href="/student/portfolio" className="text-slate-400 hover:text-saffron-dark dark:hover:text-saffron">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{app.studentCollege}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full font-black text-[11px] shrink-0 flex items-center gap-1 ${
                    app.matchScore >= 85
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-orange-100 dark:bg-orange-950/50 text-saffron-dark dark:text-orange-300 border border-orange-300 dark:border-orange-800'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-saffron" />
                  {app.matchScore}%
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{app.opportunityTitle}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{app.appliedDate}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">{app.company}</span>
                  <span
                    className={`px-2 py-0.2 rounded-full font-bold text-[10px] ${
                      app.status === 'Shortlisted'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : app.status === 'Under Review'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                        : app.status === 'Selected'
                        ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                  disabled={app.status === 'Shortlisted'}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                    app.status === 'Shortlisted'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-700 text-white shadow-2xs'
                  }`}
                >
                  {app.status === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                </button>
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Review
                </button>
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700"
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
