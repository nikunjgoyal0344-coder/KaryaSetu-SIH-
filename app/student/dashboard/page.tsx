'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import WhyMatchModal from '@/components/WhyMatchModal';
import AbcIdModal from '@/components/AbcIdModal';
import { computeOpportunityMatch } from '@/lib/matchingEngine';
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  FileQuestion,
  Leaf,
  Stethoscope,
  Copy,
  Layers,
  Check,
} from 'lucide-react';

export default function StudentDashboard() {
  const { student, opportunities, applications, applyToOpportunity, updateSkillLevel } = useApp();
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [isAbcModalOpen, setIsAbcModalOpen] = useState(false);
  const [isCreditsDrawerOpen, setIsCreditsDrawerOpen] = useState(false);

  // Local state tracking for bridge module enhancements
  const [enrolledBridges, setEnrolledBridges] = useState<string[]>([]);
  const [bonusScore, setBonusScore] = useState(0);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const copyAbcId = () => {
    const id = student.abcId || '8472-1920-3841';
    navigator.clipboard.writeText(id);
    showToast('ABC ID Copied', `${id} copied to clipboard for official portal sync.`);
  };

  // Calculate dynamic skill levels from store
  const getSkillLevel = (skillId: string, defaultLevel = 2) => {
    const s = student.skills.find((item) => item.skillId === skillId);
    return s ? s.level : defaultLevel;
  };

  const panchakarmaLvl = getSkillLevel('panchakarma-therapy', 4);
  const counselingLvl = getSkillLevel('patient-counseling', 4);
  const nadiLvl = getSkillLevel('nadi-pariksha', 3);
  const prakritiLvl = getSkillLevel('prakriti-evaluation', 4);
  const dieteticsLvl = getSkillLevel('ahara-poshan', 3);
  const herbLvl = getSkillLevel('dravyaguna-identification', 2);
  const ehrLvl = getSkillLevel('clinical-documentation', 2);
  const rasashastraLvl = getSkillLevel('rasashastra-qa', 1);

  // Compute 8 points of the Octagon Radar
  // Center: (200, 200). Scale unit: 35px per level (level 1 = 35px, level 5 = 175px).
  // Axis 1: Top (0° from vertical, y=200 - R)
  const p1 = { x: 200, y: Math.round(200 - panchakarmaLvl * 35) };
  // Axis 2: NE (45°, cos=0.7071, sin=0.7071)
  const p2 = {
    x: Math.round(200 + counselingLvl * 35 * 0.7071),
    y: Math.round(200 - counselingLvl * 35 * 0.7071),
  };
  // Axis 3: E (90°, x=200 + R)
  const p3 = { x: Math.round(200 + nadiLvl * 35), y: 200 };
  // Axis 4: SE (135°)
  const p4 = {
    x: Math.round(200 + prakritiLvl * 35 * 0.7071),
    y: Math.round(200 + prakritiLvl * 35 * 0.7071),
  };
  // Axis 5: S (180°, y=200 + R)
  const p5 = { x: 200, y: Math.round(200 + dieteticsLvl * 35) };
  // Axis 6: SW (225°)
  const p6 = {
    x: Math.round(200 - herbLvl * 35 * 0.7071),
    y: Math.round(200 + herbLvl * 35 * 0.7071),
  };
  // Axis 7: W (270°, x=200 - R)
  const p7 = { x: Math.round(200 - ehrLvl * 35), y: 200 };
  // Axis 8: NW (315°)
  const p8 = {
    x: Math.round(200 - rasashastraLvl * 35 * 0.7071),
    y: Math.round(200 - rasashastraLvl * 35 * 0.7071),
  };

  const radarPolygonPoints = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y} ${p6.x},${p6.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`;

  // Current calculated readiness score
  const readinessScore = Math.min(100, student.readinessScore + bonusScore);
  // Circle circumference is 2 * PI * 50 = 314.159
  const circleOffset = Math.max(0, 314.159 * (1 - readinessScore / 100));

  // Top Opportunities computation
  const matchedOpportunities = opportunities.slice(0, 3).map((opp) => ({
    opportunity: opp,
    match: computeOpportunityMatch(student, opp),
    isApplied: applications.some((a) => a.opportunityId === opp.id),
  }));

  // Handle Bridge Enrollment Action
  const handleEnrollBridge = (skillId: string, newLevel: number, courseName: string, gainText: string) => {
    if (enrolledBridges.includes(skillId)) return;
    setEnrolledBridges((prev) => [...prev, skillId]);
    updateSkillLevel(skillId, newLevel);
    setBonusScore((prev) => Math.min(16, prev + 3));
    showToast('Bridge Module Enrolled', `${courseName} upgraded: Level -> ${newLevel}/5 (${gainText})`);
  };

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-100 antialiased pb-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 flex items-center gap-3 bg-navy-950 dark:bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/30 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-white">{toast.title}</span>
            <span className="text-[11px] text-slate-300 font-mono">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Internal Student Navigation Sub-Tab Bar */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-1 overflow-x-auto">
        <Link
          href="/student/dashboard"
          className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-navy-900 dark:bg-slate-800 text-white shadow-xs transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span>Student Dashboard</span>
        </Link>
        <Link
          href="/student/internships"
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>Opportunity Marketplace</span>
        </Link>
        <Link
          href="/student/assessment"
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
          <span>Diagnostic Assessment</span>
        </Link>
        <Link
          href="/student/portfolio"
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-slate-400" />
          <span>Verifiable Skill Passport</span>
        </Link>
      </div>

      {/* SECTION 1: TOP IDENTITY & READINESS BLOCK (12 COLS: 7 + 5) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile & Institutional Card (7 cols) */}
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

        {/* Industry Readiness Score & Radial Gauge (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-navy-700/80 flex flex-col justify-between relative overflow-hidden space-y-4">
          {/* Background Ambient Aura */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-saffron/15 blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider block font-semibold">
                Assessment Matrix
              </span>
              <h2 className="text-lg font-bold text-white">Industry Readiness Score</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Top 10%
            </span>
          </div>

          {/* Center Gauge with SVG Circular Track */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1 relative z-10">
            <div className="sm:col-span-6 flex items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="#1b365d"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="#fd651e"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="314.159"
                    strokeDashoffset={circleOffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-white leading-none">
                    {readinessScore}%
                  </span>
                  <span className="font-mono text-[10px] text-amber-300 font-bold tracking-wider mt-1">
                    COMPLIANT
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6 space-y-2 text-left">
              <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-700/60 space-y-0.5">
                <span className="font-mono text-[10px] text-slate-400 block uppercase">
                  COHORT POSITION
                </span>
                <div className="font-bold text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% above median
                </div>
              </div>
              <div className="bg-navy-950/70 p-2.5 rounded-xl border border-navy-700/60 space-y-0.5">
                <span className="font-mono text-[10px] text-slate-400 block uppercase">
                  NCISM BENCHMARK
                </span>
                <div className="font-semibold text-xs text-white">
                  Level 4: Autonomous Care
                </div>
              </div>
            </div>
          </div>

          {/* Metric Sub-strip */}
          <div className="pt-2 border-t border-navy-700/60 flex items-center justify-between font-mono text-[11px] text-slate-300 relative z-10">
            <span>Verified by 3 HOD Reviewers</span>
            <span className="text-amber-300 font-semibold">Next Audit: Nov 15</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: ACADEMIC BANK OF CREDITS (ABC / APAAR) BANNER */}
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
                onClick={copyAbcId}
                className="hover:text-saffron p-0.5 text-slate-400 dark:text-slate-300 flex items-center transition-colors"
                title="Copy ABC ID"
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
              onClick={() => setIsAbcModalOpen(true)}
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

      {/* SECTION 3: MAIN ANALYTICAL GRID (12 COLS: 7 + 5) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 8-AXIS COMPETENCY RADAR & METRICS (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
                HSSC Standards • Version 3.4
              </span>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                8-Axis Clinical Competency Radar
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-xs bg-saffron inline-block"></span> Student ({student.name.split(' ')[0]})
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-xs bg-navy-900/30 dark:bg-teal-400/40 inline-block border border-dashed border-navy-900 dark:border-teal-400"></span> Standard (Lvl 4)
              </span>
            </div>
          </div>

          {/* Octagon SVG Radar Chart Visualization */}
          <div className="relative w-full flex justify-center py-2">
            <div className="w-full max-w-[440px] aspect-square relative">
              <svg className="w-full h-full drop-shadow-xs overflow-visible" viewBox="0 0 400 400">
                {/* Concentric Grid Octagons */}
                {/* Level 1 (r=35) */}
                <polygon
                  fill="transparent"
                  points="200,165 225,175 235,200 225,225 200,235 175,225 165,200 175,175"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                {/* Level 2 (r=70) */}
                <polygon
                  fill="transparent"
                  points="200,130 249,150 270,200 249,249 200,270 150,249 130,200 150,150"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                {/* Level 3 (r=105) */}
                <polygon
                  fill="transparent"
                  points="200,95 274,126 305,200 274,274 200,305 126,274 95,200 126,126"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                {/* Level 4: Benchmark Target (r=140) */}
                <polygon
                  fill="currentColor"
                  className="text-navy-900/5 dark:text-teal-400/5 stroke-navy-900/60 dark:stroke-teal-400/60"
                  points="200,60 299,101 340,200 299,299 200,340 101,299 60,200 101,101"
                  strokeDasharray="4,4"
                  strokeWidth="1.5"
                />
                {/* Level 5 (r=175) */}
                <polygon
                  fill="transparent"
                  points="200,25 324,76 375,200 324,324 200,375 76,324 25,200 76,76"
                  className="stroke-slate-300 dark:stroke-slate-700"
                  strokeWidth="1"
                />

                {/* Axis Spokes */}
                <line x1="200" y1="200" x2="200" y2="25" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="324" y2="76" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="375" y2="200" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="324" y2="324" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="200" y2="375" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="76" y2="324" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="25" y2="200" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />
                <line x1="200" y1="200" x2="76" y2="76" className="stroke-slate-200 dark:stroke-slate-750" strokeWidth="1" />

                {/* Dynamic Active User Polygon */}
                <polygon
                  points={radarPolygonPoints}
                  fill="#fd651e"
                  fillOpacity="0.32"
                  stroke="#fd651e"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-in-out"
                />

                {/* Data Point Circles */}
                <circle cx={p1.x} cy={p1.y} r="4" fill="#fd651e" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p2.x} cy={p2.y} r="4" fill="#fd651e" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p3.x} cy={p3.y} r="4" fill="#fd651e" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p4.x} cy={p4.y} r="4" fill="#fd651e" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p5.x} cy={p5.y} r="4" fill="#fd651e" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p6.x} cy={p6.y} r="4" fill={herbLvl < 4 ? '#e11d48' : '#fd651e'} stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p7.x} cy={p7.y} r="4" fill={ehrLvl < 3 ? '#e11d48' : '#fd651e'} stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-700" />
                <circle cx={p8.x} cy={p8.y} r={rasashastraLvl < 3 ? 5 : 4} fill={rasashastraLvl < 3 ? '#e11d48' : '#fd651e'} stroke="#ffffff" strokeWidth="1.5" className={`transition-all duration-700 ${rasashastraLvl < 3 ? 'animate-pulse' : ''}`} />

                {/* Labels around the Radar */}
                <text x="200" y="15" textAnchor="middle" className="font-mono text-[10px] font-bold fill-navy-900 dark:fill-white">
                  1. Panchakarma ({panchakarmaLvl}/5)
                </text>
                <text x="330" y="70" textAnchor="start" className="font-mono text-[10px] font-medium fill-slate-700 dark:fill-slate-300">
                  2. Counseling ({counselingLvl}/5)
                </text>
                <text x="382" y="204" textAnchor="start" className="font-mono text-[10px] font-medium fill-slate-700 dark:fill-slate-300">
                  3. Nadi Pariksha ({nadiLvl}/5)
                </text>
                <text x="330" y="335" textAnchor="start" className="font-mono text-[10px] font-medium fill-slate-700 dark:fill-slate-300">
                  4. Prakriti/Agni ({prakritiLvl}/5)
                </text>
                <text x="200" y="392" textAnchor="middle" className="font-mono text-[10px] font-medium fill-slate-700 dark:fill-slate-300">
                  5. Dietetics/Ahara ({dieteticsLvl}/5)
                </text>
                <text x="65" y="335" textAnchor="end" className="font-mono text-[10px] font-semibold fill-saffron-dark dark:fill-orange-400">
                  6. Herb ID ({herbLvl}/5) {herbLvl < 4 ? '⚠️' : '✓'}
                </text>
                <text x="18" y="204" textAnchor="end" className="font-mono text-[10px] font-semibold fill-saffron-dark dark:fill-orange-400">
                  7. Ayush EHR ({ehrLvl}/5) {ehrLvl < 3 ? '⚠️' : '✓'}
                </text>
                <text x="65" y="70" textAnchor="end" className="font-mono text-[10px] font-bold fill-rose-600 dark:fill-rose-400">
                  8. Rasashastra ({rasashastraLvl}/5) {rasashastraLvl < 3 ? '🚨' : '✓'}
                </text>
              </svg>
            </div>
          </div>

          {/* Summary Metrics Row beneath radar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                  Verified Skills
                </span>
                <span className="font-bold text-xs text-navy-900 dark:text-white">
                  {student.skills.filter((s) => s.isVerified).length} / {student.skills.length} Domains
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                  Faculty Endorsements
                </span>
                <span className="font-bold text-xs text-navy-900 dark:text-white">
                  3 Senior Profs (AIIA)
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                  Actionable Gaps
                </span>
                <span className="font-bold text-xs text-rose-600 dark:text-rose-400">
                  {3 - enrolledBridges.length} Critical Blocks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TARGETED SKILL GAPS PANEL (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Gap Diagnostics
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Formula: W<sub>imp</sub> × (Req - Cur)
              </span>
            </div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white mt-1">
              Priority Clinical Remediation
            </h2>
          </div>

          {/* Gap Item 1: Rasashastra (Critical) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
              enrolledBridges.includes('rasashastra-qa')
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                  <span>Rasashastra &amp; Formulation QA</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Deficit in Bhasma particle sizing and heavy metal testing standards (AFI Guidelines).
                </p>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold shrink-0">
                Gap: 12.0 • Critical
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Current: <strong className="text-rose-600 dark:text-rose-400">{rasashastraLvl} / 5</strong>
              </span>
              <span>
                Required Target: <strong className="text-navy-900 dark:text-white">4 / 5</strong>
              </span>
              <span>
                Importance: <strong>High (4×)</strong>
              </span>
            </div>

            <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
                  Recommended Bridge (AIIA-MSDE)
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
                  HPLC &amp; Heavy Metal Standardisation
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleEnrollBridge(
                    'rasashastra-qa',
                    2,
                    'Rasashastra Heavy Metal Standardisation',
                    '+3% Readiness Gain'
                  )
                }
                disabled={enrolledBridges.includes('rasashastra-qa')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
                  enrolledBridges.includes('rasashastra-qa')
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-saffron hover:bg-saffron-hover text-white'
                }`}
              >
                {enrolledBridges.includes('rasashastra-qa') ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Enrolled (Lvl 2)</span>
                  </>
                ) : (
                  <>
                    <span>Bridge +1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Gap Item 2: Herb Identification (High) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
              enrolledBridges.includes('dravyaguna-identification')
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-saffron inline-block"></span>
                  <span>Dravyaguna Herb Identification</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Authentication of raw dry crude herbs and adulterant detection techniques.
                </p>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-saffron-dark dark:text-orange-300 font-bold shrink-0">
                Gap: 8.0 • High
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Current: <strong className="text-saffron-dark dark:text-orange-400">{herbLvl} / 5</strong>
              </span>
              <span>
                Required Target: <strong className="text-navy-900 dark:text-white">4 / 5</strong>
              </span>
              <span>
                Importance: <strong>Med (4×)</strong>
              </span>
            </div>

            <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
                  Recommended Bridge
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
                  TLC &amp; HPTLC Botanical Fingerprinting
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleEnrollBridge(
                    'dravyaguna-identification',
                    3,
                    'TLC & HPTLC Botanical Fingerprinting',
                    '+3% Readiness Gain'
                  )
                }
                disabled={enrolledBridges.includes('dravyaguna-identification')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
                  enrolledBridges.includes('dravyaguna-identification')
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-600 text-white'
                }`}
              >
                {enrolledBridges.includes('dravyaguna-identification') ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Enrolled (Lvl 3)</span>
                  </>
                ) : (
                  <>
                    <span>Bridge +1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Gap Item 3: Ayush EHR (Medium) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 space-y-2 text-xs ${
              enrolledBridges.includes('clinical-documentation')
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                  <span>Ayurveda EHR &amp; Digital Records</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Implementation of NAMASTE portal terminology &amp; ABDM compliance protocols.
                </p>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shrink-0">
                Gap: 4.0 • Med
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Current: <strong className="text-navy-900 dark:text-white">{ehrLvl} / 5</strong>
              </span>
              <span>
                Required Target: <strong className="text-navy-900 dark:text-white">3 / 5</strong>
              </span>
              <span>
                Importance: <strong>Regular (4×)</strong>
              </span>
            </div>

            <div className="pt-2 mt-1 bg-white dark:bg-slate-900/90 p-3 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-saffron-dark dark:text-amber-400 font-bold uppercase block">
                  Recommended Bridge
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-xs block leading-snug">
                  AyushGrid EHR &amp; ICD-11 Integration
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleEnrollBridge(
                    'clinical-documentation',
                    3,
                    'AyushGrid EHR & ICD-11 Integration',
                    '+2% Readiness Gain'
                  )
                }
                disabled={enrolledBridges.includes('clinical-documentation')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1 transition-all shadow-xs ${
                  enrolledBridges.includes('clinical-documentation')
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-navy-900 hover:bg-navy-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-600 text-white'
                }`}
              >
                {enrolledBridges.includes('clinical-documentation') ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Enrolled (Lvl 3)</span>
                  </>
                ) : (
                  <>
                    <span>Bridge +1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: AI-RANKED OPPORTUNITY RECOMMENDATIONS & TRACKING PIPELINE */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
              Intelligent Matching Engine
            </span>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">
              Top Verified Internship Recommendations
            </h2>
          </div>
          <Link
            href="/student/internships"
            className="text-xs font-bold text-saffron-dark dark:text-saffron hover:underline flex items-center gap-1"
          >
            <span>Explore All ({opportunities.length}) Matched Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mosaic Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {matchedOpportunities.map(({ opportunity, match, isApplied }) => (
            <div
              key={opportunity.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-saffron" /> {match.overallScore}% Match
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Stipend: {opportunity.stipend}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-navy-100 dark:bg-slate-800 text-navy-900 dark:text-teal-400 font-bold flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-base">
                    {opportunity.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900 dark:text-white leading-snug">
                      {opportunity.company}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {opportunity.title}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 line-clamp-2">
                  {opportunity.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    📍 {opportunity.location}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                    ⏱️ {opportunity.duration}
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                    MoA Stipend Subsidized
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOpp({ opportunity, match, isApplied })}
                  className="text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white font-mono text-xs underline underline-offset-4 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-saffron" />
                  Why this matches?
                </button>

                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => {
                    applyToOpportunity(opportunity);
                    showToast('Application Submitted', `Application sent to ${opportunity.company}. Added to tracking pipeline.`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                    isApplied
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      : 'bg-navy-900 hover:bg-navy-800 dark:bg-saffron dark:hover:bg-saffron-hover text-white'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : 'Quick Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Active Application Tracking Pipeline Table Card */}
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
                          onClick={() => showToast('Round Scheduled', 'Interview scheduled with Dabur Clinical Panel on 28 Oct.')}
                          className="text-saffron-dark dark:text-saffron hover:underline font-semibold"
                        >
                          Schedule Round
                        </button>
                      ) : app.status === 'Selected' ? (
                        <button
                          type="button"
                          onClick={() => showToast('Offer Accepted', 'Congratulations! Official AIIA placement appointment dossier confirmed.')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-lg font-semibold shadow-2xs"
                        >
                          Accept Offer
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => showToast('Dossier Opened', `Viewing verified application dossier for ${app.opportunityTitle}.`)}
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
      </section>

      {/* Explainability Modal */}
      {selectedOpp && (
        <WhyMatchModal
          isOpen={!!selectedOpp}
          onClose={() => setSelectedOpp(null)}
          opportunityTitle={selectedOpp.opportunity.title}
          companyName={selectedOpp.opportunity.company}
          match={selectedOpp.match}
          onApply={() => {
            applyToOpportunity(selectedOpp.opportunity);
            showToast('Application Submitted', `Application sent to ${selectedOpp.opportunity.company}.`);
          }}
          isApplied={selectedOpp.isApplied}
        />
      )}

      {/* Academic Bank of Credits Modal */}
      <AbcIdModal
        isOpen={isAbcModalOpen}
        onClose={() => setIsAbcModalOpen(false)}
      />
    </div>
  );
}
