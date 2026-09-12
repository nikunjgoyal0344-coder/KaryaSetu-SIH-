'use client';

import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  BookOpenCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Network,
  CheckCircle2,
  School,
  Microscope,
  FlaskConical,
  Sprout,
  HeartPulse,
  Award,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full space-y-10 pb-8 transition-colors">
      {/* 1. Hero Showcase */}
      <section className="w-full pt-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800 text-xs font-mono font-semibold">
              <span>🇮🇳</span> HSSC, NSDC &amp; NSQF Level 6-8 Aligned
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Bridging Academic Excellence with Healthcare &amp; Cross-Sector Demands
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Connecting scholars with Pharma R&amp;D, Agri-Tech, HealthTech Informatics, FMCG Nutraceuticals, and Clinical Hospital Networks through sovereign verifiable credentials.
            </p>

            {/* 4 Live Telemetry Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full my-2 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="space-y-0.5">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-blue-300 font-mono">12,480+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Verified Scholars</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-blue-300 font-mono">380+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Colleges</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-blue-300 font-mono">210+</div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Multi-Sector</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-400 font-mono">89.4%</div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Placement Rate</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 w-full sm:w-auto">
              <Link
                href="/login?role=student"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Enter Students Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/workflow"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-all border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Network className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Explore Architecture Map</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Digital Skill Passport Preview Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative flex flex-col items-center justify-center p-5 sm:p-8 bg-white dark:bg-slate-900/95 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="absolute -top-3 px-3 py-1 rounded-full bg-emerald-800 text-white text-[11px] font-mono font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sovereign Attestation Grid</span>
              </div>

              {/* Mandala Emblem Seal */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 my-4 rounded-full border-4 border-amber-400/50 p-2 bg-gradient-to-r from-[#FF9933]/15 via-white dark:via-slate-800 to-[#138808]/15 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/logo.png"
                  alt="KaryaSetu Official Mandala Emblem"
                  className="w-full h-full object-cover rounded-full scale-105"
                />
              </div>

              <div className="text-center space-y-1 mt-1">
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  KaryaSetu National Platform
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  National Digital Infrastructure • Ayush &amp; Life Sciences Grid
                </p>
              </div>

              {/* Grid Badges */}
              <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800 text-center font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-1 border border-slate-100 dark:border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">DigiLocker</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Ready</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-1 border border-slate-100 dark:border-slate-800">
                  <Award className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">NSQF L6-8</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Aligned</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center gap-1 border border-slate-100 dark:border-slate-800">
                  <HeartPulse className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AyushGrid</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. National Partner Logo Marquee */}
      <section className="w-full py-5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
          <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider font-semibold">
            Trusted National Ecosystem Partners &amp; Autonomous Bodies
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-10 sm:gap-14 whitespace-nowrap text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
            <div className="flex items-center gap-2"><School className="w-4 h-4 text-emerald-800 dark:text-emerald-400" /> Ministry of Ayush</div>
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-800 dark:text-blue-400" /> AIIA New Delhi</div>
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-700 dark:text-amber-400" /> HSSC &amp; NSDC</div>
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-800 dark:text-indigo-400" /> AICTE &amp; SIH</div>
            <div className="flex items-center gap-2"><Microscope className="w-4 h-4 text-rose-800 dark:text-rose-400" /> CSIR-CDRI</div>
            <div className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-teal-800 dark:text-teal-400" /> Dabur Research Foundation</div>
            <div className="flex items-center gap-2"><Sprout className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> ITC Agri-Business</div>
            <div className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-sky-800 dark:text-sky-400" /> Tata HealthTech</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Himalaya Wellness</div>

            {/* Duplicate for infinite marquee loop */}
            <div className="flex items-center gap-2"><School className="w-4 h-4 text-emerald-800 dark:text-emerald-400" /> Ministry of Ayush</div>
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-800 dark:text-blue-400" /> AIIA New Delhi</div>
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-700 dark:text-amber-400" /> HSSC &amp; NSDC</div>
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-800 dark:text-indigo-400" /> AICTE &amp; SIH</div>
            <div className="flex items-center gap-2"><Microscope className="w-4 h-4 text-rose-800 dark:text-rose-400" /> CSIR-CDRI</div>
            <div className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-teal-800 dark:text-teal-400" /> Dabur Research Foundation</div>
            <div className="flex items-center gap-2"><Sprout className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> ITC Agri-Business</div>
            <div className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-sky-800 dark:text-sky-400" /> Tata HealthTech</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Himalaya Wellness</div>
          </div>
        </div>
      </section>

      {/* 4. Four Stakeholder Gateways */}
      <section className="w-full py-4">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-semibold tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800">
            Secure Role Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Multi-Role Sovereignty Gateways
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Select your designated stakeholder profile for DigiLocker authenticated sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Students Portal */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-300/80 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-900/50">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Students Portal</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Diagnostics, gap analysis, digital skill passports, and 1-click internship applications across verified hospital and lab networks.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=student"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center border border-slate-200 dark:border-slate-700 min-h-[40px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=student"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Industry & Corporate Partners */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-4 border border-slate-200/80 dark:border-slate-700">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Industry &amp; Corporate Partners</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Post weighted skill internships, review pre-screened talent, shortlist candidates, and manage automated MoAs.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=industry"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center border border-slate-200 dark:border-slate-700 min-h-[40px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=industry"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Academicians & Faculty */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-amber-300/80 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4 border border-amber-100 dark:border-amber-900/50">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Academicians &amp; Faculty</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Industry sabbatical marketplace, UGC/AICTE accredited FDPs, and official student skill endorsements.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=faculty"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center border border-slate-200 dark:border-slate-700 min-h-[40px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=faculty"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Institutions & Registrars */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Institutions &amp; Registrars</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Student enrollment validation queue, DigiLocker verification, and NAAC/NIRF placement analytics tracking.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=institution"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center border border-slate-200 dark:border-slate-700 min-h-[40px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=institution"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive System Workflow Banner */}
      <section className="w-full py-4">
        <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono uppercase tracking-wider">
              System Architecture State
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Interactive Workflow &amp; Accreditation Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trace candidate telemetry from national diagnostic intake to final DigiLocker credential minting and verified enterprise placement.
            </p>
          </div>
          <Link
            href="/workflow"
            className="relative z-10 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <Network className="w-4 h-4" />
            <span>View Live Architecture Map</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
