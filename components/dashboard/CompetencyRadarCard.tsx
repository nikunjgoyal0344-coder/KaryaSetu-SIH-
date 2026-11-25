'use client';

import React, { useMemo } from 'react';
import { CheckCircle2, Award, AlertTriangle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { StudentProfile } from '@/lib/seedData';

interface CompetencyRadarCardProps {
  student: StudentProfile;
  enrolledBridges: string[];
}

interface RadarAxisConfig {
  skillId: string;
  defaultLevel: number;
  label: string;
  angleDeg: number;
  labelX: number;
  labelY: number;
  textAnchor: 'start' | 'middle' | 'end';
  alertThreshold?: number;
  alertIcon?: string;
}

const CENTER = 200;
const SCALE_PER_LEVEL = 35;

const RADAR_AXES: readonly RadarAxisConfig[] = [
  { skillId: 'panchakarma-therapy', defaultLevel: 4, label: '1. Panchakarma', angleDeg: 0, labelX: 200, labelY: 15, textAnchor: 'middle' },
  { skillId: 'patient-counseling', defaultLevel: 4, label: '2. Counseling', angleDeg: 45, labelX: 330, labelY: 70, textAnchor: 'start' },
  { skillId: 'nadi-pariksha', defaultLevel: 3, label: '3. Nadi Pariksha', angleDeg: 90, labelX: 382, labelY: 204, textAnchor: 'start' },
  { skillId: 'prakriti-evaluation', defaultLevel: 4, label: '4. Prakriti/Agni', angleDeg: 135, labelX: 330, labelY: 335, textAnchor: 'start' },
  { skillId: 'ahara-poshan', defaultLevel: 3, label: '5. Dietetics/Ahara', angleDeg: 180, labelX: 200, labelY: 392, textAnchor: 'middle' },
  { skillId: 'dravyaguna-identification', defaultLevel: 2, label: '6. Herb ID', angleDeg: 225, labelX: 65, labelY: 335, textAnchor: 'end', alertThreshold: 4, alertIcon: '⚠️' },
  { skillId: 'clinical-documentation', defaultLevel: 2, label: '7. Ayush EHR', angleDeg: 270, labelX: 18, labelY: 204, textAnchor: 'end', alertThreshold: 3, alertIcon: '⚠️' },
  { skillId: 'rasashastra-qa', defaultLevel: 1, label: '8. Rasashastra', angleDeg: 315, labelX: 65, labelY: 70, textAnchor: 'end', alertThreshold: 3, alertIcon: '🚨' },
];

function computeOctagonPoint(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(CENTER + radius * Math.sin(rad)),
    y: Math.round(CENTER - radius * Math.cos(rad)),
  };
}

function buildOctagonPoints(level: number): string {
  const radius = level * SCALE_PER_LEVEL;
  return RADAR_AXES.map((axis) => {
    const pt = computeOctagonPoint(axis.angleDeg, radius);
    return `${pt.x},${pt.y}`;
  }).join(' ');
}

const GRID_LEVELS = [1, 2, 3, 4, 5] as const;

export default function CompetencyRadarCard({ student, enrolledBridges }: CompetencyRadarCardProps) {
  const { points, polygonPoints, verifiedCount } = useMemo(() => {
    const skillMap = new Map(student.skills.map((s) => [s.skillId, s.level]));
    const computedPoints = RADAR_AXES.map((axis) => {
      const level = skillMap.get(axis.skillId) ?? axis.defaultLevel;
      const coords = computeOctagonPoint(axis.angleDeg, level * SCALE_PER_LEVEL);
      const hasDeficit = axis.alertThreshold !== undefined && level < axis.alertThreshold;
      return { axis, level, coords, hasDeficit };
    });

    return {
      points: computedPoints,
      polygonPoints: computedPoints.map((p) => `${p.coords.x},${p.coords.y}`).join(' '),
      verifiedCount: student.skills.filter((s) => s.isVerified).length,
    };
  }, [student.skills]);

  return (
    <ScrollReveal variant="fade-up" className="lg:col-span-7">
      <div className="h-full bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
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
            <span className="w-3 h-3 rounded-xs bg-saffron inline-block" /> Student ({student.name.split(' ')[0]})
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded-xs bg-navy-900/30 dark:bg-teal-400/40 inline-block border border-dashed border-navy-900 dark:border-teal-400" /> Standard (Lvl 4)
          </span>
        </div>
      </div>

      {/* Octagon SVG Radar Chart Visualization */}
      <div className="relative w-full flex justify-center py-2">
        <div className="w-full max-w-[440px] aspect-square relative">
          <svg
            className="w-full h-full drop-shadow-xs overflow-visible"
            viewBox="0 0 400 400"
            role="img"
            aria-label="8-Axis Clinical Competency Radar"
          >
            {GRID_LEVELS.map((lvl) => (
              <polygon
                key={lvl}
                fill={lvl === 4 ? 'currentColor' : 'transparent'}
                className={
                  lvl === 4
                    ? 'text-navy-900/5 dark:text-teal-400/5 stroke-navy-900/60 dark:stroke-teal-400/60'
                    : lvl === 5
                    ? 'stroke-slate-300 dark:stroke-slate-700'
                    : 'stroke-slate-200 dark:stroke-slate-800'
                }
                points={buildOctagonPoints(lvl)}
                strokeDasharray={lvl === 4 ? '4,4' : undefined}
                strokeWidth={lvl === 4 ? '1.5' : '1'}
              />
            ))}

            {/* Radial Axis Spokes */}
            {RADAR_AXES.map((axis) => {
              const outer = computeOctagonPoint(axis.angleDeg, 5 * SCALE_PER_LEVEL);
              return (
                <line
                  key={axis.skillId}
                  x1={CENTER}
                  y1={CENTER}
                  x2={outer.x}
                  y2={outer.y}
                  className="stroke-slate-200 dark:stroke-slate-750"
                  strokeWidth="1"
                />
              );
            })}

            {/* Dynamic Active User Polygon */}
            <polygon
              points={polygonPoints}
              fill="#fd651e"
              fillOpacity="0.32"
              stroke="#fd651e"
              strokeWidth="2.5"
              className="transition-all duration-700 ease-in-out"
            />

            {/* Data Points & Axis Labels */}
            {points.map(({ axis, level, coords, hasDeficit }) => {
              const isCritical = axis.skillId === 'rasashastra-qa' && hasDeficit;
              return (
                <g key={axis.skillId}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isCritical ? 5 : 4}
                    fill={hasDeficit ? '#e11d48' : '#fd651e'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className={`transition-all duration-700 ${isCritical ? 'animate-pulse' : ''}`}
                  />
                  <text
                    x={axis.labelX}
                    y={axis.labelY}
                    textAnchor={axis.textAnchor}
                    className={`font-mono text-[10px] ${
                      isCritical
                        ? 'font-bold fill-rose-600 dark:fill-rose-400'
                        : axis.alertThreshold !== undefined
                        ? 'font-semibold fill-saffron-dark dark:fill-orange-400'
                        : axis.skillId === 'panchakarma-therapy'
                        ? 'font-bold fill-navy-900 dark:fill-white'
                        : 'font-medium fill-slate-700 dark:fill-slate-300'
                    }`}
                  >
                    {axis.label} ({level}/5)
                    {axis.alertThreshold !== undefined ? (hasDeficit ? ` ${axis.alertIcon}` : ' ✓') : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Summary Metrics Row beneath radar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
              Verified Skills
            </span>
            <span className="font-bold text-xs text-navy-900 dark:text-white">
              {verifiedCount} / {student.skills.length} Domains
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" aria-hidden="true" />
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
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
              Actionable Gaps
            </span>
            <span className="font-bold text-xs text-rose-600 dark:text-rose-400">
              {Math.max(0, 3 - enrolledBridges.length)} Critical Blocks
            </span>
          </div>
        </div>
      </div>
    </div>
    </ScrollReveal>
  );
}
