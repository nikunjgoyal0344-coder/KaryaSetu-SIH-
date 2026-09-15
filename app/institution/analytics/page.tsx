'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INSTITUTION_ANALYTICS } from '@/lib/seedData';
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Download,
  ArrowLeft,
  Sparkles,
  Award,
  CheckCircle2,
  Briefcase,
  Layers,
  Zap,
  Activity,
} from 'lucide-react';

interface SkillDemandItem {
  skillId: string;
  skillName: string;
  demandCount: number;
  avgRequiredLevel: number;
  demandLevel: 'Critical' | 'High' | 'Medium' | 'Emerging';
}

interface TopRole {
  title: string;
  count: number;
  avgStipend: string;
}

interface PlacementStats {
  totalApplications: number;
  shortlisted: number;
  selected: number;
  avgMatchScore: number;
}

interface IndustryTrend {
  sector: string;
  openings: number;
  growth: string;
}

interface EmergingSkill {
  skillId: string;
  skillName: string;
  monthlyGrowth: number;
}

interface DemandData {
  skillDemand: SkillDemandItem[];
  topRoles: TopRole[];
  placementStats: PlacementStats;
  industryTrends: IndustryTrend[];
  emergingSkills: EmergingSkill[];
}

export default function InstitutionAnalyticsPage() {
  const [demandData, setDemandData] = useState<DemandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDemand() {
      try {
        const res = await fetch('/api/analytics/demand');
        if (res.ok) {
          const data = await res.json();
          setDemandData(data);
        }
      } catch (err) {
        console.error('Failed to fetch demand analytics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDemand();
  }, []);

  const handlePrintReport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const placementStats = demandData?.placementStats || {
    totalApplications: 24,
    shortlisted: 9,
    selected: 4,
    avgMatchScore: 84,
  };

  const skillDemand = demandData?.skillDemand || [];
  const industryTrends = demandData?.industryTrends || [
    { sector: 'Ayurvedic Pharma & Formulation', openings: 1840, growth: '+28%' },
    { sector: 'Panchakarma & Clinical Centers', openings: 1250, growth: '+41%' },
    { sector: 'Wellness & Integrative Tourism', openings: 980, growth: '+55%' },
    { sector: 'AYUSH Digital Health & EHR', openings: 720, growth: '+67%' },
    { sector: 'Medicinal Plant & Herb Trade', openings: 540, growth: '+19%' },
  ];
  const emergingSkills = demandData?.emergingSkills || [
    { skillId: 'clinical-documentation', skillName: 'AYUSH EHR & ABDM Grid Integration', monthlyGrowth: 67 },
    { skillId: 'rasashastra-qa', skillName: 'Bhasma ICP-MS Heavy Metal Standardization', monthlyGrowth: 48 },
    { skillId: 'nadi-pariksha', skillName: 'Digital Pulse Plethysmography Diagnostics', monthlyGrowth: 39 },
    { skillId: 'ahara-poshan', skillName: 'Clinical Prakriti-Based Nutraceuticals', monthlyGrowth: 34 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/institution/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-saffron-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Institutional Overview</span>
        </Link>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-50 dark:bg-slate-800 text-saffron-dark dark:text-saffron border border-orange-200 dark:border-slate-700 font-semibold">
          Feature 6: Real-Time Demand Insights &amp; Placement Telemetry
        </span>
      </div>

      {/* Header & Export */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 dark:bg-navy-950/80 text-navy-800 dark:text-blue-300 text-xs font-semibold mb-2 border border-navy-200 dark:border-navy-800">
            <Activity className="w-3.5 h-3.5 text-saffron" />
            <span>Healthcare Sector Skill Council (HSSC) Telemetry Feed</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-saffron" />
            <span>Institutional Placement Analytics &amp; Market Demand Intelligence</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Real-time telemetry gathered across recruiter postings, candidate application pipelines, and skill deficit analytics across all AYUSH colleges and affiliated hospitals.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintReport}
          className="px-4 py-2.5 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-semibold text-xs transition-all shadow-md shadow-saffron/25 flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Institutional Report</span>
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Placement Ratio</span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {INSTITUTION_ANALYTICS.placementRate}%
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1 mt-0.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +6.6% vs previous cohort
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Active Residencies &amp; Internships</span>
          <div className="text-2xl font-bold text-navy-900 dark:text-white mt-1">
            {INSTITUTION_ANALYTICS.activeInternships}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Across 14 Accredited Centers
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Average Monthly Stipend</span>
          <div className="text-2xl font-bold text-navy-900 dark:text-white mt-1">
            {INSTITUTION_ANALYTICS.averageStipend}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Highest: ₹55,000 / mo (R&amp;D Fellow)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Average AI Vector Match</span>
          <div className="text-2xl font-bold text-saffron mt-1">
            {placementStats.avgMatchScore}%
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block font-medium">
            Cosine Similarity Benchmark
          </span>
        </div>
      </div>

      {/* Placement Conversion Funnel */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-saffron" />
            <span>Institutional Placement Funnel &amp; Conversion Pipeline</span>
          </h2>
          <span className="text-xs text-slate-500">Live Application Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Stage 1: Applied</span>
            <p className="text-2xl font-black text-navy-900 dark:text-white mt-1">{placementStats.totalApplications}</p>
            <span className="text-[11px] text-slate-500">Total Candidacies</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 text-center">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Stage 2: Shortlisted</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-300 mt-1">{placementStats.shortlisted}</p>
            <span className="text-[11px] text-slate-500">
              {Math.round((placementStats.shortlisted / Math.max(1, placementStats.totalApplications)) * 100)}% Conversion
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Stage 3: Selected &amp; Hired</span>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{placementStats.selected}</p>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
              {Math.round((placementStats.selected / Math.max(1, placementStats.shortlisted)) * 100)}% Final Placement
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: Demand Skills & Industry Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruiter Skill Demand */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-saffron" />
              <span>Real-Time Recruiter Skill Demand (Aggregated from Live Postings)</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">HSSC QP Benchmarked</span>
          </div>

          <div className="space-y-3 pt-2">
            {(skillDemand.length > 0 ? skillDemand.slice(0, 6) : INSTITUTION_ANALYTICS.topSkillsDemand).map((item: any) => {
              const skillTitle = item.skillName || item.skill;
              const demandCount = item.demandCount || item.count || 24;
              const percentage = item.demandCount ? Math.min(95, item.demandCount * 22) : item.percentage || 70;

              return (
                <div key={skillTitle} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="truncate max-w-[280px]">{skillTitle}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                      {demandCount} Openings ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-saffron to-amber-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Industry Sector Hiring Trends */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-navy-900 dark:text-white" />
              <span>AYUSH Industry Sector Hiring Trends</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">National Job Portal Feed</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {industryTrends.map((trend, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-navy-900 dark:text-white text-xs">{trend.sector}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {trend.openings.toLocaleString('en-IN')} Active Openings Nationwide
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {trend.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emerging Skills Table */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Fastest-Growing Emerging AYUSH Skills (MoM Recruiter Demand Spike)</span>
          </h2>
          <span className="text-xs text-slate-500">Ministry of Ayush Grid Analytics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergingSkills.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Emerging #{idx + 1}</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +{s.monthlyGrowth}%
                </span>
              </div>
              <h3 className="font-bold text-navy-900 dark:text-white text-xs leading-snug">{s.skillName}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Recommended for curriculum inclusion in next professional term.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
