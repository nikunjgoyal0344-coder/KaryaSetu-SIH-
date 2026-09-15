'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Clock,
  Award,
  Zap,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LearningRecommendation {
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'Critical' | 'High' | 'Medium';
  courseTitle: string;
  provider: string;
  duration: string;
  nsqfLevel: string;
  creditHours: number;
  mode: 'Online' | 'Hands-on' | 'Blended';
  url: string;
}

interface CareerPathway {
  title: string;
  description: string;
  requiredSkills: string[];
  estimatedSalary: string;
  demandLevel: 'Rising' | 'High' | 'Very High';
  openingsCount: number;
}

interface LearningPathData {
  studentName: string;
  recommendations: LearningRecommendation[];
  careerPathways: CareerPathway[];
  estimatedCompletionWeeks: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const PRIORITY_STYLES = {
  Critical: {
    badge: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    bar: 'bg-red-500',
    border: 'border-l-red-500',
    icon: AlertTriangle,
  },
  High: {
    badge: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
    bar: 'bg-orange-400',
    border: 'border-l-orange-500',
    icon: Zap,
  },
  Medium: {
    badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-400',
    bar: 'bg-amber-400',
    border: 'border-l-amber-400',
    icon: TrendingUp,
  },
};

const MODE_STYLES: Record<string, string> = {
  Online: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
  'Hands-on': 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
  Blended: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300',
};

const DEMAND_STYLES: Record<string, string> = {
  'Very High': 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  High: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Rising: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
};

function LevelDots({ current, target }: { current: number; target: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: target }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full border ${
            i < current
              ? 'bg-emerald-500 border-emerald-500'
              : i < target
              ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        />
      ))}
      <span className="ml-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        {current}/{target}
      </span>
    </div>
  );
}

function CourseCard({ rec, index }: { rec: LearningRecommendation; index: number }) {
  const styles = PRIORITY_STYLES[rec.priority];
  const PriorityIcon = styles.icon;

  return (
    <div className="flex gap-4 group">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${styles.dot} shadow-md`}
        >
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>
        <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-1 mb-1 min-h-4" />
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 ${styles.border} shadow-sm hover:shadow-md transition-shadow p-4 space-y-3`}
      >
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                <PriorityIcon className="w-3 h-3" />
                {rec.priority}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{rec.nsqfLevel}</span>
            </div>
            <h3 className="mt-1.5 text-sm font-bold text-navy-900 dark:text-white leading-snug">
              {rec.skillName}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Gap: {rec.gap} level{rec.gap > 1 ? 's' : ''}</span>
            <div className="mt-1">
              <LevelDots current={rec.currentLevel} target={rec.targetLevel} />
            </div>
          </div>
        </div>

        {/* Course info */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
          <p className="text-xs font-semibold text-navy-900 dark:text-white leading-snug">{rec.courseTitle}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{rec.provider}</p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            {rec.duration}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
            <Award className="w-3 h-3" />
            {rec.creditHours} Credit Hours
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${MODE_STYLES[rec.mode]}`}>
            {rec.mode}
          </span>
        </div>

        {/* Enroll button */}
        <a
          href={rec.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#F26E24] hover:bg-orange-600 transition-colors px-3 py-1.5 rounded-xl"
        >
          Enroll Now
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function PathwayCard({ pathway }: { pathway: CareerPathway }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#F26E24]/40 transition-all p-5 space-y-4 flex flex-col">
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-navy-900 dark:text-white">{pathway.title}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
            {pathway.description}
          </p>
        </div>
      </div>

      {/* Salary + demand */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{pathway.estimatedSalary}</span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${DEMAND_STYLES[pathway.demandLevel]}`}
        >
          {pathway.demandLevel} Demand
        </span>
      </div>

      {/* Openings */}
      <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
        <Briefcase className="w-3.5 h-3.5" />
        <span><strong className="text-navy-900 dark:text-white">{pathway.openingsCount}+</strong> live openings</span>
      </div>

      {/* Required skills */}
      <div className="flex flex-wrap gap-1.5">
        {pathway.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 rounded-full bg-navy-900/10 dark:bg-white/10 text-navy-900 dark:text-white font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 dark:text-white border border-navy-900/20 dark:border-white/20 hover:border-[#F26E24] hover:text-[#F26E24] transition-colors px-3 py-1.5 rounded-xl"
        >
          View Career Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LearningPathPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'pathways'>('courses');
  const [data, setData] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ai/recommend-learning', { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' } })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setData({
            studentName: json.studentName,
            recommendations: json.recommendations,
            careerPathways: json.careerPathways,
            estimatedCompletionWeeks: json.estimatedCompletionWeeks,
          });
        } else {
          setError(json.error ?? 'Unknown error');
        }
      })
      .catch(() => setError('Failed to fetch learning path'))
      .finally(() => setLoading(false));
  }, []);

  // Overall completion % — how many of the 8 core skills are already at level 4+
  // Derived: skills with gap === 0 divided by total core skills
  const totalCore = 8;
  const completedSkills = data ? totalCore - data.recommendations.length : 0;
  const completionPct = Math.round((completedSkills / totalCore) * 100);

  const criticalCount = data?.recommendations.filter((r) => r.priority === 'Critical').length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#F26E24] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-50 dark:bg-slate-800 text-[#F26E24] border border-orange-200 dark:border-slate-700 font-semibold">
          AI-Powered Learning Path Engine
        </span>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#183766] via-[#1E447B] to-[#0D1E36] p-6 md:p-8 text-white shadow-xl">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F26E24]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#F26E24]" />
            <span className="text-xs font-bold text-[#F26E24] uppercase tracking-widest">Personalized AI Path</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black leading-tight mb-3">
            Your AI-Personalized<br />
            <span className="text-[#F26E24]">AYUSH Learning Journey</span>
          </h1>
          <p className="text-sm text-blue-100/80 max-w-xl leading-relaxed">
            Skill gaps analyzed across 8 core AYUSH competencies. Bridge courses are ranked by industry-readiness priority and NSQF alignment.
          </p>

          {!loading && data && (
            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-2xl px-4 py-2.5">
                <Target className="w-4 h-4 text-[#F26E24]" />
                <div>
                  <p className="text-[10px] text-blue-200/70 font-medium">Courses to Complete</p>
                  <p className="text-lg font-black">{data.recommendations.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-2xl px-4 py-2.5">
                <Clock className="w-4 h-4 text-[#F26E24]" />
                <div>
                  <p className="text-[10px] text-blue-200/70 font-medium">Est. Completion</p>
                  <p className="text-lg font-black">{data.estimatedCompletionWeeks} Weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-2xl px-4 py-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-[10px] text-blue-200/70 font-medium">Critical Gaps</p>
                  <p className="text-lg font-black text-red-300">{criticalCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress Bar */}
      {!loading && data && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F26E24]" />
              <span className="text-sm font-bold text-navy-900 dark:text-white">
                Overall AYUSH Readiness: {completionPct}%
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {completedSkills} / {totalCore} skills at industry level
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F26E24] to-amber-400 transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            {(['Critical', 'High', 'Medium'] as const)
              .filter((p) => data.recommendations.some((r) => r.priority === p))
              .map((priority) => (
                <div key={priority} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[priority].dot}`} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{priority}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-white dark:bg-slate-900 text-navy-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Skill Bridge Courses
          {data && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#F26E24] text-white text-[10px]">
              {data.recommendations.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pathways')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pathways'
              ? 'bg-white dark:bg-slate-900 text-navy-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Career Pathways
          {data && (
            <span className="px-1.5 py-0.5 rounded-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 text-[10px]">
              {data.careerPathways.length}
            </span>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#F26E24] border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Analyzing skill gaps with AI...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Content */}
      {!loading && !error && data && (
        <>
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              {data.recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                    All AYUSH skills at industry-ready level!
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You have achieved NSQF Level 4 across all 8 core competencies.
                  </p>
                </div>
              ) : (
                <div className="pt-2">
                  {/* Priority legend */}
                  <div className="mb-4 flex flex-wrap gap-3">
                    {(['Critical', 'High', 'Medium'] as const).map((p) => {
                      const count = data.recommendations.filter((r) => r.priority === p).length;
                      if (count === 0) return null;
                      const styles = PRIORITY_STYLES[p];
                      return (
                        <span key={p} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${styles.badge}`}>
                          {count} {p} Priority
                        </span>
                      );
                    })}
                  </div>

                  {/* Timeline */}
                  {data.recommendations.map((rec, i) => (
                    <CourseCard key={rec.skillId} rec={rec} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pathways Tab */}
          {activeTab === 'pathways' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.careerPathways.map((pathway) => (
                <PathwayCard key={pathway.title} pathway={pathway} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
