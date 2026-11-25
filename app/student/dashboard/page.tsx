'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import WhyMatchModal from '@/components/WhyMatchModal';
import AbcIdModal from '@/components/AbcIdModal';
import { computeOpportunityMatch } from '@/lib/matchingEngine';
import type { Opportunity } from '@/lib/matchingEngine';
import StudentProfileCard from '@/components/dashboard/StudentProfileCard';
import ReadinessScoreCard from '@/components/dashboard/ReadinessScoreCard';
import AbcCreditsCard from '@/components/dashboard/AbcCreditsCard';
import CompetencyRadarCard from '@/components/dashboard/CompetencyRadarCard';
import SkillGapsCard from '@/components/dashboard/SkillGapsCard';
import TopOpportunitiesList, { MatchedOpportunityItem } from '@/components/dashboard/TopOpportunitiesList';
import ApplicationPipelineTable from '@/components/dashboard/ApplicationPipelineTable';
import {
  Sparkles,
  CheckCircle2,
  Briefcase,
  FileQuestion,
  Award,
  X,
} from 'lucide-react';

export default function StudentDashboard() {
  const { student, opportunities, applications, applyToOpportunity, updateSkillLevel } = useApp();
  const [selectedOpp, setSelectedOpp] = useState<MatchedOpportunityItem | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [isAbcModalOpen, setIsAbcModalOpen] = useState(false);
  const [isCreditsDrawerOpen, setIsCreditsDrawerOpen] = useState(false);
  const [enrolledBridges, setEnrolledBridges] = useState<string[]>([]);
  const [bonusScore, setBonusScore] = useState(0);

  const showToast = useCallback((title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3800);
  }, []);

  const copyAbcId = useCallback(() => {
    const id = student.abcId || '8472-1920-3841';
    navigator.clipboard.writeText(id);
    showToast('ABC ID Copied', `${id} copied to clipboard for official portal sync.`);
  }, [student.abcId, showToast]);

  const skillLevelsMap = useMemo(
    () => new Map(student.skills.map((item) => [item.skillId, item.level])),
    [student.skills]
  );

  const herbLvl = skillLevelsMap.get('dravyaguna-identification') ?? 2;
  const ehrLvl = skillLevelsMap.get('clinical-documentation') ?? 2;
  const rasashastraLvl = skillLevelsMap.get('rasashastra-qa') ?? 1;

  const readinessScore = Math.min(100, student.readinessScore + bonusScore);

  const matchedOpportunities: MatchedOpportunityItem[] = useMemo(() => {
    const appliedSet = new Set(applications.map((a) => a.opportunityId));
    return opportunities.slice(0, 3).map((opp) => ({
      opportunity: opp,
      match: computeOpportunityMatch(student, opp),
      isApplied: appliedSet.has(opp.id),
    }));
  }, [opportunities, applications, student]);

  const handleEnrollBridge = useCallback(
    (skillId: string, newLevel: number, courseName: string, gainText: string) => {
      if (enrolledBridges.includes(skillId)) return;
      setEnrolledBridges((prev) => [...prev, skillId]);
      updateSkillLevel(skillId, newLevel);
      setBonusScore((prev) => Math.min(16, prev + 3));
      showToast('Bridge Module Enrolled', `${courseName} upgraded: Level -> ${newLevel}/5 (${gainText})`);
    },
    [enrolledBridges, updateSkillLevel, showToast]
  );

  const handleApply = useCallback(
    (opp: Opportunity) => {
      applyToOpportunity(opp);
      showToast('Application Submitted', `Application sent to ${opp.company}. Added to tracking pipeline.`);
    },
    [applyToOpportunity, showToast]
  );

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-100 antialiased pb-8">
      {/* Live Region Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 flex items-center gap-3 bg-navy-950 dark:bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/30 animate-in slide-in-from-bottom-5"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-white">{toast.title}</span>
            <span className="text-[11px] text-slate-300 font-mono">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Internal Student Navigation Sub-Tab Bar */}
      <nav
        aria-label="Student workspace sections"
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-1 overflow-x-auto"
      >
        <Link
          href="/student/dashboard"
          aria-current="page"
          className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-navy-900 dark:bg-slate-800 text-white shadow-xs transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron" aria-hidden="true" />
          <span>Student Dashboard</span>
        </Link>
        <Link
          href="/student/internships"
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Opportunity Marketplace</span>
        </Link>
        <Link
          href="/student/assessment"
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <FileQuestion className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Diagnostic Assessment</span>
        </Link>
        <Link
          href="/student/portfolio"
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>Verifiable Skill Passport</span>
        </Link>
      </nav>

      {/* SECTION 1: TOP IDENTITY & READINESS BLOCK */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <StudentProfileCard student={student} />
        <ReadinessScoreCard readinessScore={readinessScore} />
      </section>

      {/* SECTION 2: ACADEMIC BANK OF CREDITS (ABC / APAAR) BANNER */}
      <AbcCreditsCard
        student={student}
        isCreditsDrawerOpen={isCreditsDrawerOpen}
        setIsCreditsDrawerOpen={setIsCreditsDrawerOpen}
        onOpenSyncModal={() => setIsAbcModalOpen(true)}
        onCopyAbcId={copyAbcId}
      />

      {/* SECTION 3: MAIN ANALYTICAL GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <CompetencyRadarCard student={student} enrolledBridges={enrolledBridges} />
        <SkillGapsCard
          rasashastraLvl={rasashastraLvl}
          herbLvl={herbLvl}
          ehrLvl={ehrLvl}
          enrolledBridges={enrolledBridges}
          onEnrollBridge={handleEnrollBridge}
        />
      </section>

      {/* SECTION 4: AI-RANKED OPPORTUNITY RECOMMENDATIONS & TRACKING PIPELINE */}
      <section className="space-y-4">
        <TopOpportunitiesList
          totalOpportunitiesCount={opportunities.length}
          matchedOpportunities={matchedOpportunities}
          onSelectWhyMatch={(item) => setSelectedOpp(item)}
          onApplyOpportunity={handleApply}
        />

        <ApplicationPipelineTable
          applications={applications}
          onShowToast={showToast}
        />
      </section>

      {/* Explainability Modal */}
      {selectedOpp && (
        <WhyMatchModal
          isOpen={Boolean(selectedOpp)}
          onClose={() => setSelectedOpp(null)}
          opportunityTitle={selectedOpp.opportunity.title}
          companyName={selectedOpp.opportunity.company}
          match={selectedOpp.match}
          onApply={() => handleApply(selectedOpp.opportunity)}
          isApplied={selectedOpp.isApplied}
        />
      )}

      {/* Academic Bank of Credits Modal */}
      <AbcIdModal
        isOpen={isAbcModalOpen}
        onClose={() => setIsAbcModalOpen(false)}
      />
    </div>
  );
}
