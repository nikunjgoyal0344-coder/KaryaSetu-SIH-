'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Copy,
  RefreshCw,
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Check,
  Building,
  CreditCard,
} from 'lucide-react';

interface AbcIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AbcIdModal({ isOpen, onClose }: AbcIdModalProps) {
  const { student, linkAbcId, syncAbcCredits } = useApp();
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customAbcId, setCustomAbcId] = useState(student.abcId || '8472-1920-3841');

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(student.abcId || '8472-1920-3841');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncAbcCredits();
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 900);
  };

  const handleSaveCustomId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAbcId.trim()) return;
    linkAbcId(customAbcId);
    setIsEditing(false);
  };

  const creditBreakdown = student.abcCreditBreakdown || [
    { category: 'Core Ayush Clinical Practicum', credits: 84, level: 'NSQF Level 7', verifiedBy: 'AIIA Academic Council' },
    { category: 'Pharmacognosy & Phytochemistry Lab', credits: 32, level: 'NSQF Level 7', verifiedBy: 'PCIM&H / Ministry of Ayush' },
    { category: 'Hospital IPD/OPD Clinical Residency', credits: 20, level: 'NSQF Level 7', verifiedBy: 'AIIA Hospital Wing' },
    { category: 'Integrative Health & Digital Health Records', credits: 12, level: 'NSQF Level 6', verifiedBy: 'AyushGrid National Portal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-5 sm:p-6 relative shrink-0 border-b border-navy-700/60">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-navy-800 p-2 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center border border-navy-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Academic Bank of Credits • DigiLocker / APAAR</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            National ABC ID &amp; Credit Ledger
          </h3>
          <p className="text-slate-200 text-xs sm:text-sm mt-0.5 max-w-lg">
            National Education Policy (NEP 2020) sovereign credit accumulation repository for Ayush medical and clinical scholars.
          </p>

          {/* Quick Stats Pill */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300">Total Validated Credits</span>
              <p className="text-2xl font-black text-white font-mono">
                {student.abcCredits || 148} <span className="text-xs font-normal text-emerald-300 font-sans">Credits Deposited</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                DigiLocker Synced
              </span>
              <span className="px-2.5 py-1 rounded-full bg-saffron/25 border border-saffron/40 text-saffron-light text-[11px] font-semibold">
                NEP 2020 Aligned
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* ABC ID Display Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student ABC / APAAR Identifier
                </span>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <span className="text-lg sm:text-xl font-mono font-black text-navy-900 dark:text-white tracking-wider">
                    {student.abcId || '8472-1920-3841'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-400 text-slate-700 dark:text-slate-200 font-medium text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                    title="Copy ABC ID"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-3.5 py-2 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync with DigiLocker'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit ID'}
                </button>
              </div>
            </div>

            {syncSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Academic records successfully refreshed from DigiLocker APAAR Gateway!</span>
              </div>
            )}

            {/* Edit ABC ID Form */}
            {isEditing && (
              <form onSubmit={handleSaveCustomId} className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter 12-digit ABC ID (e.g. 8472-1920-3841)"
                  value={customAbcId}
                  onChange={(e) => setCustomAbcId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-saffron focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs"
                >
                  Save ID
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Linked Institution: <strong>{student.abcInstitution || student.college}</strong>
              </span>
              <span>
                Last Synced: <strong>{student.abcLastSynced || '12 Sep 2026, 11:20 IST'}</strong>
              </span>
            </div>
          </div>

          {/* Credit Ledger Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-saffron" />
                <span>Earned Credit Breakdown (NEP 2020 Curricular Framework)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Formula: 1 Credit = 30 Hours Practical
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 sm:px-4">Course / Competency Domain</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">NSQF Alignment</th>
                    <th className="py-2.5 px-3 sm:px-4 text-right">Attesting Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {creditBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-navy-800 dark:text-blue-300">
                        {item.credits} Cr
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.level}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                        ✓ {item.verifiedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Regulatory Badge */}
          <div className="p-3 rounded-2xl bg-orange-50/70 dark:bg-slate-800/50 border border-orange-200/80 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>National Education Policy 2020 Compliance:</strong> Under NCISM and Ministry of Ayush guidelines, all verified credits accumulated through KaryaSetu clinical internships and research fellowships are automatically credited to your official DigiLocker ABC account for university degree conferral and inter-institutional credit mobility.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <a
            href="https://www.abc.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-saffron hover:text-saffron-hover flex items-center gap-1"
          >
            <span>Visit Official ABC Portal (abc.gov.in)</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
