'use client';

import React from 'react';
import { CheckCircle2, Award, AlertTriangle } from 'lucide-react';
import type { StudentProfile } from '@/lib/seedData';

interface CompetencyRadarCardProps {
  student: StudentProfile;
  enrolledBridges: string[];
}

export default function CompetencyRadarCard({ student, enrolledBridges }: CompetencyRadarCardProps) {
  // Helper to extract skill level
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

  // Center (200, 200), radius = level * 35px
  const p1 = { x: 200, y: Math.round(200 - panchakarmaLvl * 35) };
  const p2 = {
    x: Math.round(200 + counselingLvl * 35 * 0.7071),
    y: Math.round(200 - counselingLvl * 35 * 0.7071),
  };
  const p3 = { x: Math.round(200 + nadiLvl * 35), y: 200 };
  const p4 = {
    x: Math.round(200 + prakritiLvl * 35 * 0.7071),
    y: Math.round(200 + prakritiLvl * 35 * 0.7071),
  };
  const p5 = { x: 200, y: Math.round(200 + dieteticsLvl * 35) };
  const p6 = {
    x: Math.round(200 - herbLvl * 35 * 0.7071),
    y: Math.round(200 + herbLvl * 35 * 0.7071),
  };
  const p7 = { x: Math.round(200 - ehrLvl * 35), y: 200 };
  const p8 = {
    x: Math.round(200 - rasashastraLvl * 35 * 0.7071),
    y: Math.round(200 - rasashastraLvl * 35 * 0.7071),
  };

  const radarPolygonPoints = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y} ${p6.x},${p6.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`;

  return (
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
          <svg className="w-full h-full drop-shadow-xs overflow-visible" viewBox="0 0 400 400" role="img" aria-label="8-Axis Clinical Competency Radar">
            {/* Concentric Grid Octagons */}
            <polygon
              fill="transparent"
              points="200,165 225,175 235,200 225,225 200,235 175,225 165,200 175,175"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
            <polygon
              fill="transparent"
              points="200,130 249,150 270,200 249,249 200,270 150,249 130,200 150,150"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
            <polygon
              fill="transparent"
              points="200,95 274,126 305,200 274,274 200,305 126,274 95,200 126,126"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
            {/* Level 4 Benchmark Target */}
            <polygon
              fill="currentColor"
              className="text-navy-900/5 dark:text-teal-400/5 stroke-navy-900/60 dark:stroke-teal-400/60"
              points="200,60 299,101 340,200 299,299 200,340 101,299 60,200 101,101"
              strokeDasharray="4,4"
              strokeWidth="1.5"
            />
            {/* Level 5 Target */}
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
  );
}
