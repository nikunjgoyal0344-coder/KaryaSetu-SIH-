'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import ThemeToggle from '@/components/ThemeToggle';
import WallpaperToggle from '@/components/WallpaperToggle';
import {
  GraduationCap,
  Building2,
  BookOpenCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { login } = useApp();

  const handleRoleLogin = (targetRole: 'student' | 'industry' | 'faculty' | 'institution') => {
    login(targetRole);
    if (targetRole === 'student') router.push('/student/dashboard');
    else if (targetRole === 'industry') router.push('/industry/dashboard');
    else if (targetRole === 'faculty') router.push('/faculty/dashboard');
    else if (targetRole === 'institution') router.push('/institution/dashboard');
  };

  return (
    <div className="space-y-12 py-4">
      {/* Top Banner with Wallpaper Switcher, Theme Switcher and Sign In / Log In Options on landing screen */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Centralized Academia–Industry Portal
          </span>
        </div>

        {/* Action Controls: Live Wallpaper / Plain Switcher + Sign In & Log In Options + Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Wallpaper Switcher (Live Wallpaper vs Plain) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden md:inline">
              Wallpaper:
            </span>
            <WallpaperToggle />
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
            <ThemeToggle showLabel />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white p-8 sm:p-12 shadow-2xl border border-emerald-900/40">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Centralized Academia–Industry Bridge
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Karya<span className="text-emerald-400">Setu</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A unified, intelligent ecosystem connecting <strong>Students</strong>,{' '}
              <strong>Academicians / Faculty</strong>, and <strong>Industries</strong> with transparent AI skill mapping,
              verifiable digital portfolios, and dedicated AYUSH specialization.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-3 border-amber-500/50 shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all duration-300 bg-slate-900/40">
              <img src="/logo.png" alt="KaryaSetu Emblem" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-300/90 font-bold uppercase tracking-widest mt-2 font-mono">
              Skills • Internships • Careers
            </span>
          </div>
        </div>

        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Direct Login Options Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Select Your Portal to Enter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your stakeholder role to access your dedicated dashboard
          </p>
        </div>

        {/* 4 Dedicated Stakeholder Login Cards with Eye-Friendly Non-Glare Surfaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Student Login Card */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-300/80 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center font-bold shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                  Student Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  AYUSH Scholars
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Assess clinical competencies, discover AI-matched internships, track applications, and generate a verified digital portfolio.
                </p>
              </div>

              {/* Portal Profile Preview */}
              <div className="p-2.5 bg-slate-50/90 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                  <span>Featured Scholar:</span>
                  <strong className="text-slate-900 dark:text-slate-100">Ananya Sharma</strong>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  AIIA New Delhi • BAMS Final Year
                </div>
              </div>
            </div>

            {/* Both Sign In and Log In Option Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRoleLogin('student')}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 transition-all text-center shadow-2xs"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleRoleLogin('student')}
                className="py-2 px-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1 transition-all text-center"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. Industry Login Card */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
                  Industry Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  Recruiters & Pharma
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Publish internships with skill weights, review pre-screened talent pre-ranked by compatibility scores, and shortlist.
                </p>
              </div>

              {/* Portal Profile Preview */}
              <div className="p-2.5 bg-slate-50/90 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                  <span>Partner Recruiter:</span>
                  <strong className="text-slate-900 dark:text-slate-100 truncate">Dr. V. Malhotra</strong>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Dabur Research Foundation
                </div>
              </div>
            </div>

            {/* Both Sign In and Log In Option Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRoleLogin('industry')}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 transition-all text-center shadow-2xs"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleRoleLogin('industry')}
                className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1 transition-all text-center"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3. Faculty Login Card */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-amber-300/80 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center font-bold shadow-2xs">
                <BookOpenCheck className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800">
                  Faculty Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  Academicians
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Discover AICTE/UGC recognized FDPs, consultancies, and endorse student practical skills to build trust.
                </p>
              </div>

              {/* Portal Profile Preview */}
              <div className="p-2.5 bg-slate-50/90 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                  <span>Faculty Lead:</span>
                  <strong className="text-slate-900 dark:text-slate-100 truncate">Dr. R. Mishra</strong>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Assoc. Professor, Dravyaguna (AIIA)
                </div>
              </div>
            </div>

            {/* Both Sign In and Log In Option Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRoleLogin('faculty')}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 transition-all text-center shadow-2xs"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleRoleLogin('faculty')}
                className="py-2 px-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1 transition-all text-center"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 4. Institution Login Card */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center font-bold shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800">
                  Institution Portal
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  Colleges & Admins
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Verify student academic enrollment, validate DigiLocker credentials, and track institutional placement telemetry.
                </p>
              </div>

              {/* Portal Profile Preview */}
              <div className="p-2.5 bg-slate-50/90 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                  <span>Dean / Admin:</span>
                  <strong className="text-slate-900 dark:text-slate-100 truncate">Dr. Sujata Kadam</strong>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Dean of Academics, AIIA New Delhi
                </div>
              </div>
            </div>

            {/* Both Sign In and Log In Option Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRoleLogin('institution')}
                className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 transition-all text-center shadow-2xs"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleRoleLogin('institution')}
                className="py-2 px-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1 transition-all text-center"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive System Workflow Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider border border-emerald-500/20">
            KaryaSetu - System WorkFlow
          </div>
          <h3 className="text-lg font-bold">
            Explore the Complete End-to-End System Architecture
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            Inspect all 6 workflow blocks: User Journey, Core Processing, Opportunity Flow, Industry Actions, Faculty Actions, and Institution Actions.
          </p>
        </div>
        <Link
          href="/workflow"
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <span>Open Interactive Workflow Map</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Registration Invitation */}
      <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Verified institutional gateway aligning academia with Healthcare Sector Skill Council benchmarks.
          </span>
        </div>
        <Link
          href="/register"
          className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline shrink-0"
        >
          Create New Institutional Account →
        </Link>
      </div>

      {/* Core Innovation Highlights with Eye-Friendly Nature Palettes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Explainable AI Matching</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Transparent scoring model: 45% Skill match + 20% Proficiency + 15% Interest + 10% Mode + 10% Eligibility.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
            <BookOpenCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty-Centric Module</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Solves faculty vacancies and outdated curriculums through accredited industry FDPs and skill endorsements.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">HSSC & AYUSH Taxonomy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Official Qualification Packs for Panchakarma, Dravyaguna herbology, Ahara dietetics, and AyushGrid EHR.
          </p>
        </div>
      </div>
    </div>
  );
}
