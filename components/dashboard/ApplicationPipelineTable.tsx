'use client';

import React from 'react';
import type { ApplicationItem } from '@/lib/seedData';

interface ApplicationPipelineTableProps {
  applications: ApplicationItem[];
  onShowToast: (title: string, message: string) => void;
}

export default function ApplicationPipelineTable({
  applications,
  onShowToast,
}: ApplicationPipelineTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
            Registry Feed
          </span>
          <h3 className="text-lg font-bold text-navy-900 dark:text-white">
            Active Application Tracking Pipeline
          </h3>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          Total Tracked: <strong className="text-navy-900 dark:text-white">{applications.length} Submissions</strong>
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-y border-slate-200 dark:border-slate-700">
              <th className="py-3 px-4 rounded-l-xl">Host Organization &amp; Role</th>
              <th className="py-3 px-4">Applied Date</th>
              <th className="py-3 px-4">Match Affinity</th>
              <th className="py-3 px-4">Pipeline Status</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        app.status === 'Shortlisted'
                          ? 'bg-saffron'
                          : app.status === 'Selected'
                          ? 'bg-emerald-500'
                          : app.status === 'Under Review'
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-navy-900 dark:text-white block">
                        {app.company}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {app.opportunityTitle}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {app.appliedDate}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    {app.matchScore}% Match
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                      app.status === 'Shortlisted'
                        ? 'bg-orange-50 dark:bg-orange-950/60 text-saffron-dark dark:text-orange-300 border-orange-200 dark:border-orange-900/60'
                        : app.status === 'Selected'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : app.status === 'Under Review'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        app.status === 'Selected'
                          ? 'bg-emerald-500'
                          : app.status === 'Shortlisted'
                          ? 'bg-saffron'
                          : 'bg-blue-500'
                      }`}
                    />
                    {app.status === 'Shortlisted'
                      ? 'Shortlisted for Clinical Interview'
                      : app.status === 'Selected'
                      ? 'Selected & Offer Ready ✓'
                      : app.status === 'Under Review'
                      ? 'Under Institutional Review'
                      : 'Application Submitted'}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  {app.status === 'Shortlisted' ? (
                    <button
                      type="button"
                      onClick={() => onShowToast('Round Scheduled', 'Interview scheduled with Dabur Clinical Panel on 28 Oct.')}
                      className="text-saffron-dark dark:text-saffron hover:underline font-semibold"
                    >
                      Schedule Round
                    </button>
                  ) : app.status === 'Selected' ? (
                    <button
                      type="button"
                      onClick={() => onShowToast('Offer Accepted', 'Congratulations! Official AIIA placement appointment dossier confirmed.')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-lg font-semibold shadow-2xs"
                    >
                      Accept Offer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onShowToast('Dossier Opened', `Viewing verified application dossier for ${app.opportunityTitle}.`)}
                      className="text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white"
                    >
                      View Dossier
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="sm:hidden space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-navy-900 dark:text-white">{app.company}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{app.opportunityTitle}</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {app.matchScore}% Match
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700">
              <span>Applied: {app.appliedDate}</span>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                  app.status === 'Shortlisted'
                    ? 'bg-orange-100 text-saffron-dark'
                    : app.status === 'Selected'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
