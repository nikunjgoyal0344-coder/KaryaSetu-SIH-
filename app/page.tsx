'use client';

import React, { useState } from 'react';
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
  BarChart3,
  TrendingUp,
  FileCheck,
  Briefcase,
  Layers,
  Lock,
  Search,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const [activeCohort, setActiveCohort] = useState<'all' | 'top10' | 'moa'>('all');

  return (
    <div className="w-full space-y-12 pb-12 transition-colors">
      {/* 3. Hero Showcase Section */}
      <section className="w-full pt-4 pb-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: National Directive & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-900/80 text-navy-800 dark:text-blue-200 text-xs font-mono font-semibold border border-slate-200 dark:border-navy-700 shadow-2xs">
              <span className="text-base leading-none">🇮🇳</span>
              <span>HSSC, NSDC &amp; NSQF Level 6-8 Sovereign Alignment</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-navy-900 dark:text-white leading-[1.18]">
              Bridging Academic Excellence with <span className="text-navy-700 dark:text-blue-400">Healthcare</span> &amp; Cross-Sector Demands
            </h1>

            <p className="text-base text-slate-800 dark:text-slate-300 max-w-2xl leading-relaxed">
              Connecting verified AYUSH scholars with Pharma R&amp;D, Agri-Tech, HealthTech Informatics, FMCG Nutraceuticals, and Clinical Hospital Networks through sovereign cryptographically-signed verifiable credentials.
            </p>

            {/* 4 Live Telemetry Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full my-2 bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="border-r border-slate-100 dark:border-slate-800 pr-2">
                <div className="text-xl font-extrabold text-navy-900 dark:text-blue-300 font-mono">12,480+</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold font-mono">Verified Scholars</div>
              </div>
              <div className="border-r border-slate-100 dark:border-slate-800 pr-2">
                <div className="text-xl font-extrabold text-navy-900 dark:text-blue-300 font-mono">380+</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold font-mono">Colleges</div>
              </div>
              <div className="border-r border-slate-100 dark:border-slate-800 pr-2">
                <div className="text-xl font-extrabold text-navy-900 dark:text-blue-300 font-mono">210+</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold font-mono">Multi-Sector</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">89.4%</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold font-mono">Placement Rate</div>
              </div>
            </div>

            {/* Primary Actions with Saffron Hero CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-1 w-full sm:w-auto">
              <Link
                href="/login?role=student"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group min-h-[44px]"
              >
                <span>Enter Students Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/workflow"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-800 text-navy-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition-all border border-navy-800/30 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Network className="w-4 h-4 text-navy-700 dark:text-blue-400" />
                <span>Explore Architecture Map</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Digital Skill Passport Preview Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative flex flex-col p-6 bg-white dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl ring-1 ring-slate-900/5 dark:ring-white/5">
              {/* Card Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full border-2 border-amber-400/50 p-0.5 bg-navy-900 shrink-0 overflow-hidden shadow-xs">
                    <img
                      alt="KaryaSetu Seal"
                      className="w-full h-full object-cover rounded-full"
                      src="/logo.png"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-navy-900 dark:text-white">Digital Skill Passport</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 font-semibold border border-navy-200 dark:border-navy-800">
                        L7 NSQF
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono">ID: KS-2025-IND-88419</span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>94% Match</span>
                </div>
              </div>

              {/* 5-Axis Clinical Competency Radar Visualization */}
              <div className="relative bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1 px-1">
                  <span className="font-bold text-navy-900 dark:text-slate-200">Clinical Competency Radar</span>
                  <span className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-navy-700 dark:bg-blue-500"></span> Scholar
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Nat. Avg
                    </span>
                  </span>
                </div>

                {/* Radar SVG */}
                <div className="w-full flex items-center justify-center py-1">
                  <svg className="w-full max-w-[270px] h-auto overflow-visible" viewBox="0 0 280 220">
                    {/* Spider web grid polygons */}
                    <polygon fill="none" points="140,25 226,87 193,189 87,189 54,87" stroke="#CBD5E1" strokeDasharray="2,2" strokeWidth="0.8" />
                    <polygon fill="none" points="140,47 204,94 180,171 100,171 76,94" stroke="#CBD5E1" strokeDasharray="2,2" strokeWidth="0.8" />
                    <polygon fill="none" points="140,70 183,101 166,152 114,152 97,101" stroke="#CBD5E1" strokeWidth="0.8" />
                    <polygon fill="none" points="140,92 161,108 153,133 127,133 119,108" stroke="#CBD5E1" strokeWidth="0.8" />

                    {/* Radial Axis Lines */}
                    <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="140" y1="115" y2="25" />
                    <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="226" y1="115" y2="87" />
                    <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="193" y1="115" y2="189" />
                    <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="87" y1="115" y2="189" />
                    <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="54" y1="115" y2="87" />

                    {/* National Benchmark Polygon (Amber) */}
                    <polygon fill="rgba(245, 158, 11, 0.18)" points="140,55 198,96 172,165 106,168 83,98" stroke="#D97706" strokeWidth="1.6" />

                    {/* Scholar Candidate Polygon (Royal Navy #1E3A8A / #1B365D) */}
                    <polygon fill="rgba(30, 58, 138, 0.3)" points="140,32 220,89 188,183 91,176 62,90" stroke="#1E3A8A" strokeWidth="2.2" />

                    {/* Data Points Scholar */}
                    <circle cx="140" cy="32" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="220" cy="89" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="188" cy="183" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="91" cy="176" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                    <circle cx="62" cy="90" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* Axis Labels in crisp charcoal / dark text */}
                    <text fill="currentColor" className="text-slate-900 dark:text-slate-100" fontFamily="Public Sans" fontSize="9.5" fontWeight="700" textAnchor="middle" x="140" y="15">
                      Phytochemistry (94%)
                    </text>
                    <text fill="currentColor" className="text-slate-800 dark:text-slate-300" fontFamily="Public Sans" fontSize="9" fontWeight="600" textAnchor="start" x="234" y="88">
                      Formulation Sci
                    </text>
                    <text fill="currentColor" className="text-slate-800 dark:text-slate-300" fontFamily="Public Sans" fontSize="9" fontWeight="600" textAnchor="start" x="204" y="202">
                      Bioinformatics
                    </text>
                    <text fill="currentColor" className="text-slate-800 dark:text-slate-300" fontFamily="Public Sans" fontSize="9" fontWeight="600" textAnchor="end" x="76" y="202">
                      GMP Compliance
                    </text>
                    <text fill="currentColor" className="text-slate-800 dark:text-slate-300" fontFamily="Public Sans" fontSize="9" fontWeight="600" textAnchor="end" x="46" y="88">
                      Clinical Protocols
                    </text>
                  </svg>
                </div>

                {/* Radar Summary Info */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  <span>Benchmark: Pharma R&amp;D Tier-1</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    +18.4% above median
                  </span>
                </div>
              </div>

              {/* 3 Sovereign Trust Badges */}
              <div className="grid grid-cols-3 gap-2.5 w-full mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex flex-col items-center gap-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-navy-900 dark:text-slate-200">DigiLocker</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">Ready</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex flex-col items-center gap-0.5">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-navy-900 dark:text-slate-200">NSQF L6-8</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">Aligned</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex flex-col items-center gap-0.5">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-navy-900 dark:text-slate-200">AyushGrid</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. National Partner Logo Marquee */}
      <section className="w-full py-6 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 mb-3 text-center">
          <span className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300 font-bold tracking-wider">
            Trusted National Ecosystem Partners &amp; Autonomous Bodies
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-navy-900 dark:text-slate-200 font-bold text-sm">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Ministry of Ayush
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-navy-900 dark:text-blue-400" /> AIIA New Delhi
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-navy-900 dark:text-blue-400" /> HSSC &amp; NSDC
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-navy-900 dark:text-blue-400" /> AICTE &amp; SIH
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-navy-900 dark:text-blue-400" /> CSIR-CDRI
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Dabur Research Foundation
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-navy-900 dark:text-blue-400" /> ITC Agri-Business
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Tata HealthTech
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Himalaya Wellness
            </div>

            {/* Infinite Scroll Loop Duplicate */}
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Ministry of Ayush
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-navy-900 dark:text-blue-400" /> AIIA New Delhi
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-navy-900 dark:text-blue-400" /> HSSC &amp; NSDC
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-navy-900 dark:text-blue-400" /> AICTE &amp; SIH
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-navy-900 dark:text-blue-400" /> CSIR-CDRI
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Dabur Research Foundation
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-navy-900 dark:text-blue-400" /> ITC Agri-Business
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Tata HealthTech
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-navy-900 dark:text-blue-400" /> Himalaya Wellness
            </div>
          </div>
        </div>
      </section>

      {/* 5. Four Stakeholder Gateways (Positioned above Telemetry Dashboard) */}
      <section className="w-full px-4 py-8 max-w-[1600px] mx-auto border-b border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase text-navy-800 dark:text-blue-300 font-bold tracking-wider bg-navy-100 dark:bg-navy-950 px-3 py-1 rounded-full border border-navy-200 dark:border-navy-800">
            Secure Role Portals
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mt-2.5">
            Multi-Role Sovereignty Gateways
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            Select your designated stakeholder profile for Aadhaar &amp; DigiLocker sovereign authenticated sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Role Card 1: Students Portal */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 flex items-center justify-center mb-4 group-hover:bg-navy-800 group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 dark:text-white mb-2">Students Portal</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Diagnostics, gap analysis, digital skill passports, and 1-click internship applications across verified hospital and lab networks.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=student"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-navy-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-center block min-h-[38px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=student"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-saffron hover:bg-saffron-hover shadow-2xs transition-all flex items-center justify-center gap-1 min-h-[38px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Role Card 2: Industry & Corporate Partners */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-saffron-accent dark:text-amber-400 flex items-center justify-center mb-4 group-hover:bg-saffron group-hover:text-white transition-colors">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 dark:text-white mb-2">Industry &amp; Corporate Partners</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Post weighted skill internships, review pre-screened talent, shortlist candidates, and manage automated MoAs.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=industry"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-navy-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-center block min-h-[38px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=industry"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-saffron hover:bg-saffron-hover shadow-2xs transition-all flex items-center justify-center gap-1 min-h-[38px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Role Card 3: Academicians & Faculty */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 flex items-center justify-center mb-4 group-hover:bg-navy-800 group-hover:text-white transition-colors">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 dark:text-white mb-2">Academicians &amp; Faculty</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Industry sabbatical marketplace, UGC/AICTE accredited FDPs, and official student skill endorsements.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=faculty"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-navy-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-center block min-h-[38px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=faculty"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-saffron hover:bg-saffron-hover shadow-2xs transition-all flex items-center justify-center gap-1 min-h-[38px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Role Card 4: Institutions & Registrars */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 flex items-center justify-center mb-4 group-hover:bg-navy-800 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 dark:text-white mb-2">Institutions &amp; Registrars</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Student enrollment validation queue, DigiLocker verification, and NAAC/NIRF placement analytics tracking.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login?role=institution"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-navy-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-center block min-h-[38px] flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?role=institution"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-saffron hover:bg-saffron-hover shadow-2xs transition-all flex items-center justify-center gap-1 min-h-[38px]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Telemetry & Analytics Dashboard (Kept Below Gateways) */}
      <section className="w-full px-4 py-8 max-w-[1600px] mx-auto border-b border-slate-200 dark:border-slate-800">
        {/* Section Header with Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 text-xs font-mono font-semibold mb-2 border border-slate-200 dark:border-navy-800">
              <BarChart3 className="w-3.5 h-3.5 text-navy-700 dark:text-blue-400" />
              <span>National Skill Intelligence Grid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Live Telemetry &amp; Competency Benchmarks
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl">
              Real-time aggregate data visualization of authenticated scholar cohorts, enterprise MoAs, and Ayush bio-pharma skill demands.
            </p>
          </div>

          {/* Cohort Filter Toggles with Active Saffron State */}
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold shrink-0 shadow-2xs">
            <button
              onClick={() => setActiveCohort('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeCohort === 'all'
                  ? 'bg-saffron text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              All India Grid
            </button>
            <button
              onClick={() => setActiveCohort('top10')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeCohort === 'top10'
                  ? 'bg-saffron text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              Top 10% Cohort
            </button>
            <button
              onClick={() => setActiveCohort('moa')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeCohort === 'moa'
                  ? 'bg-saffron text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              Verified MoAs
            </button>
          </div>
        </div>

        {/* Top Progress Rollout Card */}
        <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <CheckCircle2 className="w-5 h-5 text-navy-900 dark:text-blue-400" />
                <h3 className="font-bold text-base md:text-lg text-navy-900 dark:text-white tracking-tight">
                  Overall National Portal &amp; Mission Rollout Progress
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold border border-emerald-600/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                  Phase-II On Schedule • 84.2% Complete
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                Live national milestone telemetry across academic nodes, industry MoAs, and sovereign attestation networks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">National Standard:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 border border-slate-200 dark:border-navy-800">
                NSQF L6-8 Certified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
            {/* Circular Progress Ring */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" fill="transparent" r="56" stroke="#E2E8F0" strokeWidth="11" />
                  <circle
                    cx="70"
                    cy="70"
                    fill="transparent"
                    r="56"
                    stroke="#1B365D"
                    strokeDasharray="351.8"
                    strokeDashoffset="55.6"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                  <circle cx="70" cy="70" fill="transparent" r="42" stroke="#E2E8F0" strokeWidth="7" />
                  <circle
                    cx="70"
                    cy="70"
                    fill="transparent"
                    r="42"
                    stroke="#EA580C"
                    strokeDasharray="263.9"
                    strokeDashoffset="52.7"
                    strokeLinecap="round"
                    strokeWidth="7"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-navy-900 dark:text-white font-mono leading-none">
                    84.2%
                  </span>
                  <span className="text-[10px] text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider mt-1 font-semibold">
                    National Index
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-3 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-navy-700 dark:bg-blue-400"></span> Portal Core
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-saffron"></span> Enterprise Hub
                </span>
              </div>
            </div>

            {/* Horizontal Milestone Progress Bars */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-navy-900 dark:text-slate-200 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-navy-700 dark:text-blue-400" />
                    Scholar Attestation &amp; Verification
                  </span>
                  <span className="font-bold text-navy-800 dark:text-blue-300">
                    92% <span className="text-slate-500 dark:text-slate-400 font-normal">(12,480 / 13,500 target)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-navy-800 dark:bg-blue-600 rounded-full transition-all duration-300" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-navy-900 dark:text-slate-200 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-saffron" />
                    Enterprise &amp; MoA Onboarding
                  </span>
                  <span className="font-bold text-saffron">
                    86% <span className="text-slate-500 dark:text-slate-400 font-normal">(210+ / 250 targets)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-saffron rounded-full transition-all duration-300" style={{ width: '86%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-navy-900 dark:text-slate-200 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-navy-700 dark:text-blue-400" />
                    College &amp; Institutional Integration
                  </span>
                  <span className="font-bold text-navy-800 dark:text-blue-300">
                    79% <span className="text-slate-500 dark:text-slate-400 font-normal">(380 / 480 colleges)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-navy-600 dark:bg-blue-500 rounded-full transition-all duration-300" style={{ width: '79%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-navy-900 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    DigiLocker &amp; Sovereign Gateway Sync
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    98% <span className="text-slate-500 dark:text-slate-400 font-normal">(Operational)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700">
              <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Overall Ecosystem Index</div>
              <div className="text-base font-extrabold text-navy-900 dark:text-white mt-0.5">88.4%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700">
              <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Active Milestones</div>
              <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">18 / 22 Achieved</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700">
              <div className="text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">Next Sovereign Audit</div>
              <div className="text-base font-extrabold text-navy-900 dark:text-white mt-0.5">12 Days</div>
            </div>
          </div>
        </div>

        {/* Dual Visualizations: Area Chart & Sector Demand Bar Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Chart 1: Placement & MoA Trajectory Area/Line Graph (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <span className="font-bold text-base text-navy-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-navy-700 dark:text-blue-400" />
                    Monthly Verified Placement &amp; MoA Growth Trajectory
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                    Telemetry trend over recent 6 Quarters across 210+ Bio-Pharma Partners
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-xs bg-navy-800 dark:bg-blue-400"></span> Placements
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-xs bg-saffron"></span> MoA Accords
                  </span>
                </div>
              </div>

              {/* SVG Area Chart with Navy & Saffron Gradients */}
              <div className="w-full h-56 relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 540 180">
                  <defs>
                    <linearGradient id="placementNavyGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#102A45" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#102A45" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="moaSaffronGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#EA580C" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  <line stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="0.8" x1="30" x2="520" y1="20" y2="20" />
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="24" y="23">14k</text>

                  <line stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="0.8" x1="30" x2="520" y1="60" y2="60" />
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="24" y="63">10k</text>

                  <line stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="0.8" x1="30" x2="520" y1="100" y2="100" />
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="24" y="103">6k</text>

                  <line stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="0.8" x1="30" x2="520" y1="140" y2="140" />
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" x="24" y="143">2k</text>

                  {/* MoA Area & Line (Saffron Theme) */}
                  <polygon fill="url(#moaSaffronGradient)" points="45,155 45,135 140,120 235,105 330,90 425,75 520,55 520,155" />
                  <path d="M 45 135 L 140 120 L 235 105 L 330 90 L 425 75 L 520 55" fill="none" stroke="#EA580C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

                  {/* Placements Area & Line (Deep Navy Theme) */}
                  <polygon fill="url(#placementNavyGradient)" points="45,155 45,125 140,105 235,80 330,62 425,42 520,26 520,155" />
                  <path d="M 45 125 L 140 105 L 235 80 L 330 62 L 425 42 L 520 26" fill="none" stroke="#102A45" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />

                  {/* Data Points */}
                  <circle cx="45" cy="125" fill="#102A45" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="140" cy="105" fill="#102A45" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="235" cy="80" fill="#102A45" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="330" cy="62" fill="#102A45" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="425" cy="42" fill="#102A45" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="520" cy="26" fill="#EA580C" r="4.5" stroke="#ffffff" strokeWidth="2" />

                  {/* Quarter Labels on X-axis */}
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9.5" textAnchor="middle" x="45" y="168">Q3 '23</text>
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9.5" textAnchor="middle" x="140" y="168">Q4 '23</text>
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9.5" textAnchor="middle" x="235" y="168">Q1 '24</text>
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9.5" textAnchor="middle" x="330" y="168">Q2 '24</text>
                  <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="9.5" textAnchor="middle" x="425" y="168">Q3 '24</text>
                  <text fill="currentColor" className="text-slate-900 dark:text-slate-100" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="700" textAnchor="middle" x="520" y="168">
                    Q4 '24 (Live)
                  </text>
                </svg>
              </div>
            </div>

            {/* Summary Footer Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">MoU Pipeline</div>
                <div className="text-base font-bold text-navy-900 dark:text-white font-mono">488 Active</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">Quarterly Surge</div>
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">+32.6% YoY</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">Avg Turnaround</div>
                <div className="text-base font-bold text-navy-900 dark:text-white font-mono">14.2 Days</div>
              </div>
            </div>
          </div>

          {/* Chart 2: Bio-Pharma & Ayush Talent Demand Bar Indicators (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <span className="font-bold text-base text-navy-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-saffron-accent" />
                    Sector Skill Demand Index
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                    Verified enterprise requisition intensity
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-saffron text-[11px] font-mono font-bold border border-orange-200 dark:border-orange-900">
                  High Surge
                </span>
              </div>

              {/* Skill Progress Bars */}
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-navy-900 dark:text-white">Phytomedicine &amp; Drug Discovery R&amp;D</span>
                    <span className="text-navy-800 dark:text-blue-300 font-bold">92% Index</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-navy-800 dark:bg-blue-600 rounded-full transition-all duration-300" style={{ width: '92%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    <span>3,420 Vacancies</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">+24% vs Q3</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-navy-900 dark:text-white">Clinical GCP Auditing &amp; Trials</span>
                    <span className="text-navy-800 dark:text-blue-300 font-bold">86% Index</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-navy-600 dark:bg-blue-500 rounded-full transition-all duration-300" style={{ width: '86%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    <span>2,180 Vacancies</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">+18% vs Q3</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-navy-900 dark:text-white">HPLC &amp; Analytical Phytochemistry</span>
                    <span className="text-saffron font-bold">78% Index</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-saffron rounded-full transition-all duration-300" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    <span>1,840 Vacancies</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">+15% vs Q3</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-navy-900 dark:text-white">Botanical Cosmeceuticals &amp; Nutraceuticals</span>
                    <span className="text-navy-800 dark:text-blue-300 font-bold">74% Index</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-navy-700/80 dark:bg-blue-700 rounded-full transition-all duration-300" style={{ width: '74%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    <span>1,510 Vacancies</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">+11% vs Q3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Direct NSDC/HSSC Live Feed
              </span>
              <Link href="/workflow" className="text-saffron hover:text-saffron-hover font-bold flex items-center gap-0.5">
                View Full Matrix →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive System Architecture Workflow Banner */}
      <section className="w-full px-4 py-6 max-w-[1600px] mx-auto">
        <div className="bg-navy-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-navy-700">
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-navy-800 text-amber-400 text-[11px] font-mono font-semibold uppercase tracking-wider border border-navy-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              System Architecture State
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Workflow &amp; Accreditation Pipeline
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trace candidate telemetry from national diagnostic intake to final DigiLocker credential minting and verified enterprise placement.
            </p>
          </div>

          {/* Saffron Action Button */}
          <Link
            href="/workflow"
            className="relative z-10 px-6 py-3.5 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 group"
          >
            <Network className="w-5 h-5" />
            <span>View Live Architecture Map</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
