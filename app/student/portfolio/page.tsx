'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  FileCheck2,
  CheckCircle2,
  Share2,
  Download,
  Building,
  Award,
  ShieldCheck,
  QrCode,
  CreditCard,
  Sparkles,
  TrendingUp,
  Copy,
  Layers,
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  category: string;
  icon: string;
  earnedDate: string;
  issuer: string;
  credentialUrl: string;
  isVerified: boolean;
}

interface GeneratedProfile {
  studentId: string;
  studentName: string;
  college: string;
  degree: string;
  competencyScore: number;
  verificationLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nsqfLevel: number;
  hsscAlignment: string[];
  badges: Badge[];
  strengths: string[];
  improvementAreas: string[];
  portfolioSummary: string;
  digitalSignature: string;
  qrCodeUrl: string;
  abcCredits: number;
  totalVerifiedSkills: number;
  lastUpdated: string;
}

const TIER_STYLES = {
  Bronze: {
    badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    ring: 'border-amber-500',
    label: 'Bronze Scholar',
  },
  Silver: {
    badge: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600',
    ring: 'border-slate-400',
    label: 'Silver Scholar',
  },
  Gold: {
    badge: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
    ring: 'border-yellow-500',
    label: 'Gold Scholar',
  },
  Platinum: {
    badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    ring: 'border-purple-500',
    label: 'Platinum Sovereign Scholar',
  },
};

export default function PortfolioPage() {
  const { student } = useApp();
  const [profile, setProfile] = useState<GeneratedProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/ai/profile-generate');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
          }
        }
      } catch (err) {
        console.error('Failed to load AI generated profile', err);
      }
    }
    fetchProfile();
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopySignature = () => {
    if (profile?.digitalSignature && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profile.digitalSignature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
    const shareUrl = profile?.qrCodeUrl || 'https://karyasetu.gov.in/verify';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setShareMessage(`Copied public verifiable link: ${shareUrl}`);
    setTimeout(() => setShareMessage(null), 4000);
  };

  const tier = profile?.verificationLevel || 'Gold';
  const tierConfig = TIER_STYLES[tier];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4 sm:px-6">
      {shareMessage && (
        <div
          role="status"
          aria-live="polite"
          className="px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{shareMessage}</span>
        </div>
      )}
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-1.5 border border-emerald-200 dark:border-emerald-800">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>AI-Generated Digital Skill Passport • Sovereign Verifiable Credential</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            AYUSH Verified Digital Portfolio
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Automated competency profile mapped against HSSC Qualification Packs, AIIA curricula &amp; APAAR/ABC credits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareLink}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-saffron/20 cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Main Verifiable Portfolio Document Card */}
      <div className="bg-white dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-6 sm:p-10 relative border-b border-navy-700/60">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-saffron/50 shadow-xl shrink-0"
                />
                <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-md ${tierConfig.badge}`}>
                  {tier}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black">{student.name}</h2>
                  <span className="bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Scholar
                  </span>
                  {student.isInstitutionVerified && (
                    <span className="bg-saffron/25 border border-saffron/40 text-saffron-light text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-saffron-light" />
                      Dean Endorsed
                    </span>
                  )}
                </div>
                <p className="text-slate-200 text-sm font-medium">{student.degree}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-saffron" />
                  {student.college}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-slate-300 font-mono flex-wrap">
                  <span>CGPA: {student.cgpa}</span>
                  <span>•</span>
                  <span>Prakriti: {student.prakriti}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-bold">ABC ID: {student.abcId || '8472-1920-3841'}</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">{student.abcCredits || 148} Credits</span>
                </div>
              </div>
            </div>

            {/* Verification Gauge & NSQF Block */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 self-stretch lg:self-auto justify-around sm:justify-start">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-saffron flex items-center justify-center bg-navy-950/60 font-black text-xl text-white shadow-inner">
                  {profile ? `${profile.competencyScore}%` : `${student.readinessScore}%`}
                </div>
                <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider block mt-1">
                  AI Competency
                </span>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex flex-col items-center justify-center text-white">
                  <span className="text-[10px] uppercase font-bold text-saffron-light">Level</span>
                  <span className="text-2xl font-black">{profile?.nsqfLevel || 6}</span>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider block mt-1">
                  NSQF Aligned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Body */}
        <div className="p-6 sm:p-10 space-y-8 text-xs">
          {/* AI Executive Summary */}
          <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Competency Synthesis &amp; Career Readiness Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {profile?.portfolioSummary || student.bio}
            </p>
          </div>

          {/* HSSC Qualification Packs Alignment */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-navy-700 dark:text-blue-300" />
              <span>Healthcare Sector Skill Council (HSSC) Mapped Qualifications</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(profile?.hsscAlignment || [
                'HSS/Q3601 - Panchakarma Technician (NSQF Level 4)',
                'HSS/Q3801 - Ayurveda Ahara Sahayak (NSQF Level 5)',
                'HSS/Q4001 - Yoga Wellness Trainer (NSQF Level 5)',
                'HSS/Q3901 - Ayurveda Pharmacy Assistant (NSQF Level 4)',
              ]).map((pack, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{pack}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Verifiable Digital Badges Grid (Feature 5 Core) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-saffron" />
                <span>Automated Verified Digital Badges (6 Cryptographic Micro-Credentials)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AIIA &amp; DigiLocker Authenticated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(profile?.badges || []).map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    badge.isVerified
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs hover:border-saffron/40'
                      : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl p-1.5 bg-slate-100 dark:bg-slate-700 rounded-xl">{badge.icon}</span>
                    {badge.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-navy-900 dark:text-white text-xs mt-2.5 line-clamp-1">{badge.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{badge.category}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[140px]">{badge.issuer}</span>
                    <span>{badge.earnedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Priority Improvement Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Validated Clinical Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                {(profile?.strengths || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20 space-y-2">
              <h4 className="font-bold text-saffron-dark dark:text-saffron text-xs flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-saffron" />
                <span>Recommended Skill Bridge Focus</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                {(profile?.improvementAreas || []).map((area, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-saffron font-bold mt-0.5">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Endorsed Tested Skill Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Institutional Competency Ledger
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {student.skills.length} Evaluated Clinical Domains
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.skills.map((s) => (
                <div
                  key={s.skillId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                      <span>{s.skillName}</span>
                      {s.isVerified && (
                        <span title="Faculty Endorsed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        </span>
                      )}
                    </div>
                    {s.endorsedBy ? (
                      <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">
                        Endorsed by: {s.endorsedBy}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Self-Assessed Competency
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-black text-navy-900 dark:text-white text-sm">{s.level} / 5</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">Proficiency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Bank of Credits (ABC ID / APAAR) Attestation */}
          <div className="p-4 rounded-2xl border border-emerald-300/80 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-navy-900 dark:text-white text-xs sm:text-sm">
                    Academic Bank of Credits (APAAR ID: {student.abcId || '8472-1920-3841'})
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
                    {student.abcCredits || 148} Academic Credits
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  National Academic Depository (NAD) • NEP 2020 Aligned • Transcripts verified via DigiLocker
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shrink-0 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> DigiLocker Synced
            </span>
          </div>

          {/* Sovereign Cryptographic Proof & QR Attestation */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 text-saffron text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Cryptographic Proof of Authenticity</span>
              </div>
              <p className="font-mono text-[10px] text-slate-300 break-all">
                SHA-256 Hash: {profile?.digitalSignature || '0x4a9b2c8e1f07d3b58264e9a17056c2d84713a0e69b52c814df307185e492ca81'}
              </p>
              <p className="text-[10px] text-slate-400">
                Timestamp: {profile?.lastUpdated ? new Date(profile.lastUpdated).toUTCString() : 'Mon, 15 Sep 2026 01:25:00 GMT'} • Issuer: AIIA Institutional Node #044
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySignature}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
              </button>

              <div className="p-2 bg-white rounded-xl text-navy-950 shrink-0">
                <QrCode className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Stamp Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
          <p>Verified through KaryaSetu Portal • National AYUSH Skilling &amp; Digital Credentials Registry</p>
          <p className="font-mono text-[11px] text-navy-900 dark:text-blue-200 font-bold">
            All India Institute of Ayurveda, New Delhi
          </p>
        </div>
      </div>
    </div>
  );
}
