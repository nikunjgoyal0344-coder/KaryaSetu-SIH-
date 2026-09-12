'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  GraduationCap,
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Candidate Pipeline & Screening
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Pre-Screened Applicant Management
          </h1>
          <p className="text-slate-500 mt-1">
            Candidates automatically scored and ranked by skill compatibility against your requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-700">
            Total Candidates: {applications.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 font-bold text-emerald-800">
            Shortlisted: {applications.filter((a) => a.status === 'Shortlisted').length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidates by name, college, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-semibold shrink-0">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Candidate Name</th>
                <th className="py-3.5 px-5">Applied Role</th>
                <th className="py-3.5 px-5">Match Score</th>
                <th className="py-3.5 px-5">Applied Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Recruiter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{app.studentName}</span>
                          <Link
                            href="/student/portfolio"
                            className="text-slate-400 hover:text-blue-600"
                            title="View Verified Portfolio"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {app.studentCollege}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="font-semibold text-slate-800 block">
                      {app.opportunityTitle}
                    </span>
                    <span className="text-[11px] text-slate-400">{app.company}</span>
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-black text-xs inline-flex items-center gap-1 ${
                        app.matchScore >= 85
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {app.matchScore}%
                    </span>
                  </td>

                  <td className="py-4 px-5 text-slate-500">{app.appliedDate}</td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        app.status === 'Shortlisted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Selected'
                          ? 'bg-teal-100 text-teal-800'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
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
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        }`}
                      >
                        {app.status === 'Shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold"
                      >
                        Review
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
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
      </div>
    </div>
  );
}
