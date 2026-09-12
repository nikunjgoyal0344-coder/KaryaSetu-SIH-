'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { StudentSkill } from '@/lib/matchingEngine';

interface SkillRadarChartProps {
  skills: StudentSkill[];
}

export default function SkillRadarChart({ skills }: SkillRadarChartProps) {
  // Take top 6 skills for optimal radar geometry
  const displaySkills = skills.slice(0, 6).map((s) => ({
    subject: s.skillName.length > 20 ? s.skillName.substring(0, 18) + '...' : s.skillName,
    fullName: s.skillName,
    studentLevel: s.level * 20, // convert 1-5 scale to percentage (0 - 100)
    industryTarget: 80,         // standard industry target 4/5 (80%)
    rawStudentLevel: s.level,
  }));

  return (
    <div className="w-full h-[260px] sm:h-[320px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="66%" data={displaySkills}>
          <PolarGrid stroke="#cbd5e1" strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#475569', fontSize: 9.5, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
          <Radar
            name="Current Student Level"
            dataKey="studentLevel"
            stroke="#059669"
            fill="#10b981"
            fillOpacity={0.45}
          />
          <Radar
            name="Industry Benchmark Target"
            dataKey="industryTarget"
            stroke="#3b82f6"
            fill="#60a5fa"
            fillOpacity={0.15}
            strokeDasharray="4 4"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs border border-slate-700">
                    <p className="font-semibold text-emerald-400 mb-1">{item.fullName}</p>
                    <p className="text-slate-300">
                      Student Level: <span className="font-bold text-white">{item.rawStudentLevel}/5</span> ({item.studentLevel}%)
                    </p>
                    <p className="text-slate-400">
                      Industry Target: <span className="font-bold text-blue-300">4/5</span> (80%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
