'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { computeOpportunityMatch, Opportunity } from '@/lib/matchingEngine';
import WhyMatchModal from '@/components/WhyMatchModal';
import {
  Briefcase,
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Building,
  Check,
} from 'lucide-react';

export default function InternshipsPage() {
  const { student, opportunities, applications, applyToOpportunity } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [activeModalOpp, setActiveModalOpp] = useState<any>(null);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.skillName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesMode = selectedMode === 'All' || opp.mode === selectedMode;
    return matchesSearch && matchesCategory && matchesMode;
  });

  // Calculate matches and sort by match score
  const rankedOpportunities = filteredOpportunities
    .map((opp) => {
      const match = computeOpportunityMatch(student, opp);
      const isApplied = applications.some((a) => a.opportunityId === opp.id && a.studentName === student.name);
      return { opp, match, isApplied };
    })
    .sort((a, b) => b.match.overallScore - a.match.overallScore);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Rule-Based & Weighted AI Recommendation Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Intelligent Opportunity Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time matching calibrated against student proficiency, Prakriti traits, and AYUSH Qualification Packs
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs flex items-center gap-2 text-emerald-900 font-semibold">
          <span>Active Postings: {opportunities.length}</span>
          <span>•</span>
          <span>Applications Submitted: {applications.filter((a) => a.studentName === student.name).length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by role title, company, or required skill (e.g. Panchakarma, Herbology)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Internship">Internships</option>
            <option value="Entry-Level Job">Entry-Level Jobs</option>
            <option value="Faculty FDP">Faculty FDPs</option>
          </select>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
          >
            <option value="All">All Modes</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {rankedOpportunities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            No matching opportunities found. Try adjusting your search query or filters.
          </div>
        ) : (
          rankedOpportunities.map(({ opp, match, isApplied }) => (
            <div
              key={opp.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {opp.category}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500">{opp.postedAt}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-emerald-700 font-medium">
                      {opp.applicantsCount} Applicants
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                  <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    {opp.company}
                  </p>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div
                    className={`px-4 py-2 rounded-2xl text-center border ${
                      match.overallScore >= 85
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : match.overallScore >= 70
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold block uppercase tracking-wider">
                      AI Compatibility
                    </span>
                    <span className="text-xl font-black">{match.overallScore}%</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>

              {/* Skills and Details Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Required Skills:</span>
                  {opp.requiredSkills.map((s) => (
                    <span
                      key={s.skillId}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
                    >
                      {s.skillName} (Lvl {s.requiredLevel})
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {opp.location} ({opp.mode})
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    {opp.stipend}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalOpp({ opp, match, isApplied })}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Explain Scoring Rationale (Why this matches?)</span>
                </button>

                <button
                  onClick={() => applyToOpportunity(opp)}
                  disabled={isApplied}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isApplied
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Application Submitted</span>
                    </>
                  ) : (
                    <span>1-Click Apply</span>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transparency Modal */}
      {activeModalOpp && (
        <WhyMatchModal
          isOpen={!!activeModalOpp}
          onClose={() => setActiveModalOpp(null)}
          opportunityTitle={activeModalOpp.opp.title}
          companyName={activeModalOpp.opp.company}
          match={activeModalOpp.match}
          onApply={() => applyToOpportunity(activeModalOpp.opp)}
          isApplied={activeModalOpp.isApplied}
        />
      )}
    </div>
  );
}
