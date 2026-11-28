import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollDownCue from '@/components/home/ScrollDownCue';
import { ArrowRight, Network, CheckCircle2, ShieldCheck, Award, Lock } from 'lucide-react';

const HERO_COUNTERS = [
  { value: '12,480+', label: 'Verified Scholars', accentClass: 'text-navy-900 dark:text-blue-300' },
  { value: '380+', label: 'Colleges', accentClass: 'text-navy-900 dark:text-blue-300' },
  { value: '210+', label: 'Multi-Sector', accentClass: 'text-navy-900 dark:text-blue-300' },
  { value: '89.4%', label: 'Placement Rate', accentClass: 'text-emerald-700 dark:text-emerald-400' },
] as const;

const PASSPORT_BADGES = [
  { title: 'DigiLocker', subtitle: 'Ready', Icon: ShieldCheck },
  { title: 'NSQF L6-8', subtitle: 'Aligned', Icon: Award },
  { title: 'AyushGrid', subtitle: 'Secure', Icon: Lock },
] as const;

export default function HeroSection() {
  return (
    <section id="hero-section" className="scroll-mt-20 w-full pt-4 pb-6 max-w-[1600px] mx-auto" aria-labelledby="hero-heading">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: National Directive & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-900/80 text-navy-800 dark:text-blue-200 text-xs font-mono font-semibold border border-slate-200 dark:border-navy-700 shadow-2xs">
            <span className="text-base leading-none" aria-hidden="true">🇮🇳</span>
            <span>HSSC, NSDC &amp; NSQF Level 6-8 Sovereign Alignment</span>
          </div>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-navy-900 dark:text-white leading-[1.18]"
          >
            Bridging Academic Excellence with <span className="text-navy-700 dark:text-blue-400">Healthcare</span> &amp; Cross-Sector Demands
          </h1>

          <p className="text-base text-slate-800 dark:text-slate-300 max-w-2xl leading-relaxed">
            Connecting verified AYUSH scholars with Pharma R&amp;D, Agri-Tech, HealthTech Informatics, FMCG Nutraceuticals, and Clinical Hospital Networks through sovereign cryptographically-signed verifiable credentials.
          </p>

          {/* 4 Live Telemetry Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full my-2 bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {HERO_COUNTERS.map((counter, idx) => (
              <div
                key={counter.label}
                className={idx < HERO_COUNTERS.length - 1 ? 'border-r border-slate-100 dark:border-slate-800 pr-2' : ''}
              >
                <div className={`text-xl font-extrabold font-mono ${counter.accentClass}`}>{counter.value}</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold font-mono">
                  {counter.label}
                </div>
              </div>
            ))}
          </div>

          {/* Primary Actions with Saffron Hero CTA */}
          <div className="flex flex-wrap items-center gap-3 mt-1 w-full sm:w-auto">
            <Link
              href="/login?role=student"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group min-h-[44px]"
            >
              <span>Enter Students Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/workflow"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-800 text-navy-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition-all border border-navy-800/30 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Network className="w-4 h-4 text-navy-700 dark:text-blue-400" aria-hidden="true" />
              <span>Explore Architecture Map</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Digital Skill Passport Preview Card */}
        <div className="lg:col-span-5 w-full">
          <div className="relative flex flex-col p-6 bg-white dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl ring-1 ring-slate-900/5 dark:ring-white/5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-amber-400/50 p-0.5 bg-navy-900 shrink-0 overflow-hidden shadow-xs">
                  <Image
                    alt="KaryaSetu Seal"
                    width={44}
                    height={42}
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

              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>94% Match</span>
              </div>
            </div>

            <div className="relative bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 mb-1 px-1">
                <span className="font-bold text-navy-900 dark:text-slate-200">Clinical Competency Radar</span>
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-navy-700 dark:bg-blue-500" /> Scholar
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Nat. Avg
                  </span>
                </span>
              </div>

              <div className="w-full flex items-center justify-center py-1">
                <svg
                  className="w-full max-w-[270px] h-auto overflow-visible"
                  viewBox="0 0 280 220"
                  role="img"
                  aria-label="5-Axis Clinical Competency Radar showing 94% match against national average"
                >
                  <polygon fill="none" points="140,25 226,87 193,189 87,189 54,87" stroke="#CBD5E1" strokeDasharray="2,2" strokeWidth="0.8" />
                  <polygon fill="none" points="140,47 204,94 180,171 100,171 76,94" stroke="#CBD5E1" strokeDasharray="2,2" strokeWidth="0.8" />
                  <polygon fill="none" points="140,70 183,101 166,152 114,152 97,101" stroke="#CBD5E1" strokeWidth="0.8" />
                  <polygon fill="none" points="140,92 161,108 153,133 127,133 119,108" stroke="#CBD5E1" strokeWidth="0.8" />

                  <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="140" y1="115" y2="25" />
                  <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="226" y1="115" y2="87" />
                  <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="193" y1="115" y2="189" />
                  <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="87" y1="115" y2="189" />
                  <line stroke="#CBD5E1" strokeWidth="0.8" x1="140" x2="54" y1="115" y2="87" />

                  <polygon fill="rgba(245, 158, 11, 0.18)" points="140,55 198,96 172,165 106,168 83,98" stroke="#D97706" strokeWidth="1.6" />
                  <polygon fill="rgba(30, 58, 138, 0.3)" points="140,32 220,89 188,183 91,176 62,90" stroke="#1E3A8A" strokeWidth="2.2" />

                  <circle cx="140" cy="32" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="220" cy="89" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="188" cy="183" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="91" cy="176" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="62" cy="90" fill="#1E3A8A" r="3.5" stroke="#FFFFFF" strokeWidth="1.5" />

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

              <div className="w-full flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <span>Benchmark: Pharma R&amp;D Tier-1</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  +18.4% above median
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 w-full mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center font-mono text-[11px]">
              {PASSPORT_BADGES.map(({ title, subtitle, Icon }) => (
                <div
                  key={title}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 flex flex-col items-center gap-0.5 hover:border-saffron/50 hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="font-bold text-navy-900 dark:text-slate-200">{title}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-sans">{subtitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-Down Micro Indicator */}
      <ScrollDownCue targetId="partners-section" />
    </section>
  );
}
