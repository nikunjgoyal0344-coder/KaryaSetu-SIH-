'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import SkillRadarChart from '@/components/SkillRadarChart';
import WhyMatchModal from '@/components/WhyMatchModal';
import { computeOpportunityMatch, calculateSkillGaps } from '@/lib/matchingEngine';
import { LEARNING_RECOMMENDATIONS } from '@/lib/seedData';
import {
  GraduationCap,
  Award,
  TrendingUp,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  Clock,
  Building,
  Check,
} from 'lucide-react';

export default function StudentDashboard() {
  const { student, opportunities, applications, applyToOpportunity, updateSkillLevel } = useApp();
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [enrolledModules, setEnrolledModules] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate gaps against top opportunity
  const primaryOpp = opportunities[0];
  const skillGaps = calculateSkillGaps(student.skills, primaryOpp.requiredSkills);
  const topGaps = skillGaps.filter((g) => g.gapScore > 0).slice(0, 3);

  // Compute matches for internships
  const matchedOpportunities = opportunities.slice(0, 3).map((opp) => ({
    opportunity: opp,
    match: computeOpportunityMatch(student, opp),
    isApplied: applications.some((a) => a.opportunityId === opp.id),
  }));

  return (
    <div className="space-y-8">
      {/* Student Welcome & Readiness Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
                Prakriti: {student.prakriti}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-semibold">
                CGPA: {student.cgpa}
              </span>
            </div>
            <p className="text-emerald-100/90 text-xs sm:text-sm">
              {student.degree} • {student.year}
            </p>
            <p className="text-slate-300 text-xs flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              {student.college}
            </p>
          </div>
        </div>

        {/* Readiness Score Pill */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Industry Readiness Score
            </div>
            <p className="text-3xl font-black text-white">{student.readinessScore}%</p>
            <span className="text-[11px] text-emerald-200">Top 10% in AIIA Cohort</span>
          </div>

          <Link
            href="/student/assessment"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Retake Quiz</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Radar Analysis + Top Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Skill Radar Visualization */}
        <div className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Competency Mapping Radar
              </h2>
              <p className="text-xs text-slate-500">
                Visualizing your skills against HSSC Qualification Benchmark (AYUSH QPs)
              </p>
            </div>
            <Link
              href="/student/assessment"
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Detailed View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <SkillRadarChart skills={student.skills} />

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <span className="text-[10px] text-emerald-800 uppercase block font-semibold">Verified Skills</span>
              <strong className="text-emerald-900 text-sm">
                {student.skills.filter((s) => s.isVerified).length} / {student.skills.length}
              </strong>
            </div>
            <div className="p-2 bg-blue-50 rounded-xl">
              <span className="text-[10px] text-blue-800 uppercase block font-semibold">Faculty Endorsements</span>
              <strong className="text-blue-900 text-sm">
                {student.skills.filter((s) => s.endorsedBy).length}
              </strong>
            </div>
            <div className="p-2 bg-amber-50 rounded-xl">
              <span className="text-[10px] text-amber-800 uppercase block font-semibold">Critical Gaps</span>
              <strong className="text-amber-900 text-sm">{topGaps.length} Actionable</strong>
            </div>
          </div>
        </div>

        {/* Right Col: Top 3 Skill Gaps */}
        <div className="lg:col-span-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Targeted Skill Gaps
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Gap = Imp × (Req - Curr)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Prioritized by industry demand weights to boost your match scores:
            </p>

            <div className="space-y-3">
              {topGaps.map((gap, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{gap.skillName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                      Gap Score: {gap.gapScore}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>
                      Current: <strong>{gap.studentLevel}/5</strong>
                    </span>
                    <span>
                      Target: <strong className="text-blue-700">{gap.requiredLevel}/5</strong>
                    </span>
                    <span>
                      Weight: <strong>{gap.importance}/5</strong>
                    </span>
                  </div>

                  <p className="text-emerald-800 text-[11px] bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>{gap.recommendationAction}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/student/assessment"
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center block transition-colors"
          >
            Retake Clinical Diagnostic Assessment
          </Link>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Core Processing: Personalized Recommendations (Bridge Missing Skills -> Learning & Career Paths) */}
      <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/70 dark:border-emerald-800 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              Core Processing • Personalized Recommendations
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Bridge Modules for Your Missing Skills</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targeted clinical and regulatory learning paths synthesized by the recommendation engine from your Gap Analysis.
            </p>
          </div>

          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            {topGaps.length} Actionable Interventions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {topGaps.map((gap) => {
            const rec = LEARNING_RECOMMENDATIONS[gap.skillId] || {
              skillId: gap.skillId,
              skillName: gap.skillName,
              courseTitle: `${gap.skillName} Clinical Acceleration Program`,
              provider: 'All India Institute of Ayurveda & HSSC',
              duration: '3 Weeks • Self-Paced',
              difficulty: 'Intermediate',
              linkText: 'Enroll in Bridge Module',
              reason: 'Closes gap to elevate matching readiness index.',
            };

            const isEnrolled = enrolledModules.includes(gap.skillId);

            return (
              <div
                key={gap.skillId}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {rec.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {rec.duration}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {rec.courseTitle}
                  </h3>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Provider: <strong className="text-slate-800 dark:text-slate-200">{rec.provider}</strong>
                  </p>

                  <div className="p-2 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rec.reason}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isEnrolled}
                  onClick={() => {
                    setEnrolledModules((prev) => [...prev, gap.skillId]);
                    updateSkillLevel(gap.skillId, 4);
                    setToastMessage(`Enrolled in "${rec.courseTitle}"! Skill raised to level 4/5. Radar updated.`);
                    setTimeout(() => setToastMessage(null), 5000);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isEnrolled
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-2xs'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Enrolled • Competency Level +1</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{rec.linkText}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Opportunities Section */}
      <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              AI-Matched Opportunities (Ranked for You)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matched using 5-factor weighted algorithm tailored to your BAMS skills and preferences
            </p>
          </div>
          <Link
            href="/student/internships"
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All ({opportunities.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {matchedOpportunities.map(({ opportunity, match, isApplied }) => (
            <div
              key={opportunity.id}
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 bg-white dark:bg-slate-800/40 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {opportunity.category}
                  </span>
                  {/* Match percentage badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      match.overallScore >= 85
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    {match.overallScore}% Match
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {opportunity.title}
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold line-clamp-1">
                  {opportunity.company}
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                  <p>📍 {opportunity.location} ({opportunity.mode})</p>
                  <p>💰 {opportunity.stipend}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSelectedOpp({ opportunity, match, isApplied })}
                  className="w-full text-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1.5 flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  Why this matches? (Explainable AI)
                </button>

                <button
                  onClick={() => applyToOpportunity(opportunity)}
                  disabled={isApplied}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    isApplied
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-2xs'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : '1-Click Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Pipeline Status */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-900/10 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          My Application Tracking Pipeline
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Match Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{app.opportunityTitle}</td>
                  <td className="py-3 px-4 text-slate-600">{app.company}</td>
                  <td className="py-3 px-4 text-slate-500">{app.appliedDate}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-700">{app.matchScore}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        app.status === 'Shortlisted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainability Modal */}
      {selectedOpp && (
        <WhyMatchModal
          isOpen={!!selectedOpp}
          onClose={() => setSelectedOpp(null)}
          opportunityTitle={selectedOpp.opportunity.title}
          companyName={selectedOpp.opportunity.company}
          match={selectedOpp.match}
          onApply={() => applyToOpportunity(selectedOpp.opportunity)}
          isApplied={selectedOpp.isApplied}
        />
      )}
    </div>
  );
}
