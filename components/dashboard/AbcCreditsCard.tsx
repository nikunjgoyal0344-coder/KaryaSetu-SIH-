'use client';

import React from 'react';
import { ShieldCheck, Copy, Layers, X } from 'lucide-react';
import type { StudentProfile } from '@/lib/seedData';

interface AbcCreditsCardProps {
  student: StudentProfile;
  isCreditsDrawerOpen: boolean;
  setIsCreditsDrawerOpen: (open: boolean) => void;
  onOpenSyncModal: () => void;
  onCopyAbcId: () => void;
}

export default function AbcCreditsCard({
  student,
  isCreditsDrawerOpen,
  setIsCreditsDrawerOpen,
  onOpenSyncModal,
  onCopyAbcId,
}: AbcCreditsCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Left Info Block */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            DigiLocker &amp; NEP 2020 Synced
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">ABC / APAAR ID:</span>
            <span className="font-mono text-xs font-bold text-navy-900 dark:text-white tracking-wider">
              {student.abcId || '8472-1920-3841'}
            </span>
            <button
              onClick={onCopyAbcId}
              className="hover:text-saffron p-0.5 text-slate-400 dark:text-slate-300 flex items-center transition-colors"
              title="Copy ABC ID"
              aria-label="Copy ABC ID"
              type="button"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Accumulated Credits:</span>
            <span className="text-sm text-navy-900 dark:text-white font-black">
              {student.abcCredits || 148}
            </span>
            <span className="text-slate-400 text-[11px]">/ 160 Minimum</span>
          </div>
        </div>

        {/* Middle Credits Breakdown Tags */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
            Clinical Practicum: <strong className="text-navy-900 dark:text-white">72 Cr</strong>
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
            Phytochemistry: <strong className="text-navy-900 dark:text-white">44 Cr</strong>
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
            Hospital Residency: <strong className="text-navy-900 dark:text-white">32 Cr</strong>
          </span>
        </div>

        {/* Right Trigger Buttons */}
        <div className="flex items-center gap-2 self-end xl:self-auto">
          <button
            onClick={() => setIsCreditsDrawerOpen(!isCreditsDrawerOpen)}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-navy-900 dark:text-white px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            type="button"
          >
            <Layers className="w-3.5 h-3.5 text-saffron" />
            <span>{isCreditsDrawerOpen ? 'Hide Distribution' : 'Manage ABC Credits'}</span>
          </button>
          <button
            onClick={onOpenSyncModal}
            className="bg-saffron hover:bg-saffron-hover text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            type="button"
          >
            <span>Sync DigiLocker</span>
          </button>
        </div>
      </div>

      {/* Expandable NSQF Alignment & ABC Credit Distribution Drawer */}
      {isCreditsDrawerOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-navy-900 dark:text-white">
                NSQF Alignment &amp; ABC Credit Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Validated through Ministry of Ayush Academic Equivalence Council &amp; AIIA Academic Senate
              </p>
            </div>
            <button
              onClick={() => setIsCreditsDrawerOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              aria-label="Close credit distribution drawer"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-navy-900 dark:text-white">
                  NSQF Level 6 (Undergraduate Clinical)
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  96 / 100 Credits
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-navy-900 dark:bg-teal-500 h-2.5 rounded-full" style={{ width: '96%' }}></div>
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block">
                Charak Samhita Clinical Rotation, Shalakya Tantra Procedures, Basic Agada Tantra.
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-navy-900 dark:text-white">
                  NSQF Level 7 (Advanced Diagnostic &amp; Res.)
                </span>
                <span className="font-mono font-bold text-saffron-dark dark:text-orange-300">
                  52 / 60 Credits
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-saffron h-2.5 rounded-full" style={{ width: '86%' }}></div>
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block">
                HPTLC Herb Extraction, Panchakarma Complex Case Studies, ICD-11 NAMASTE coding.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
