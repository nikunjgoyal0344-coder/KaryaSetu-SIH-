'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AYUSH_SKILLS_TAXONOMY } from '@/lib/taxonomy';
import {
  Briefcase,
  PlusCircle,
  Sliders,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function PostInternshipPage() {
  const router = useRouter();
  const { postNewOpportunity } = useApp();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Dabur Research Foundation (DRF)');
  const [category, setCategory] = useState<'Internship' | 'Entry-Level Job' | 'Live Project' | 'Faculty FDP'>('Internship');
  const [location, setLocation] = useState('Ghaziabad / Delhi NCR');
  const [mode, setMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [duration, setDuration] = useState('3 Months');
  const [stipend, setStipend] = useState('₹20,000 / month');
  const [minEligibility, setMinEligibility] = useState('Final Year BAMS or Internee');
  const [description, setDescription] = useState('');

  // Selected skills with requirement levels and weights
  const [selectedSkills, setSelectedSkills] = useState<
    { skillId: string; skillName: string; requiredLevel: number; importanceWeight: number }[]
  >([
    {
      skillId: 'dravyaguna-identification',
      skillName: 'Dravyaguna Herb Identification & Standardization',
      requiredLevel: 4,
      importanceWeight: 5,
    },
    {
      skillId: 'rasashastra-qa',
      skillName: 'Rasashastra & Formulation QA',
      requiredLevel: 3,
      importanceWeight: 4,
    },
  ]);

  const [newSkillId, setNewSkillId] = useState(AYUSH_SKILLS_TAXONOMY[0].id);

  const handleAddSkill = () => {
    const tax = AYUSH_SKILLS_TAXONOMY.find((t) => t.id === newSkillId);
    if (!tax) return;
    if (selectedSkills.some((s) => s.skillId === newSkillId)) return;

    setSelectedSkills((prev) => [
      ...prev,
      { skillId: tax.id, skillName: tax.name, requiredLevel: 3, importanceWeight: 4 },
    ]);
  };

  const handleRemoveSkill = (id: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.skillId !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    postNewOpportunity({
      title,
      company,
      category,
      location,
      mode,
      duration,
      stipend,
      minEligibility,
      targetDomain: ['AYUSH', 'Pharma', 'Clinical'],
      description: description || 'Exciting hands-on opportunity with industry mentors.',
      requiredSkills: selectedSkills,
    });

    router.push('/industry/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-xs">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-saffron-dark dark:text-orange-300 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          Industry Talent Acquisition Gateway
        </div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Post Opportunity with Required Skills</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Our algorithm will immediately match your weighted requirements against pre-assessed AYUSH graduates
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Role Overview
          </h2>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Opportunity Title</label>
            <input
              type="text"
              placeholder="e.g. Clinical Panchakarma Resident Intern / Quality Analyst"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Opportunity Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Internship">Internship</option>
                <option value="Entry-Level Job">Entry-Level Job</option>
                <option value="Live Project">Live Project</option>
                <option value="Faculty FDP">Faculty Development Program (FDP)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Work Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Stipend / CTC</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Job Description & Responsibilities</label>
            <textarea
              rows={3}
              placeholder="Describe the clinical or industrial tasks, learning outcomes, and mentorship..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-saffron text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Required Skills Configuration */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900 dark:text-white">
                2. Required Skills & Importance Weighting
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Importance weight (1 to 5) directly drives the gap score formula: Gap = Imp × (Req - Curr)
              </p>
            </div>
          </div>

          {/* Add skill row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <select
              value={newSkillId}
              onChange={(e) => setNewSkillId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-saffron focus:outline-none"
            >
              {AYUSH_SKILLS_TAXONOMY.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.name} ({tax.category})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 bg-navy-900 hover:bg-navy-800 dark:bg-saffron dark:hover:bg-saffron-hover text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Configured skills list */}
          <div className="space-y-3">
            {selectedSkills.map((s, idx) => (
              <div
                key={s.skillId}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-navy-900 dark:text-white block">{s.skillName}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">ID: {s.skillId}</span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Target Lvl:</span>
                    <select
                      value={s.requiredLevel}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSelectedSkills((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, requiredLevel: val } : item))
                        );
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-navy-900 dark:text-white focus:ring-2 focus:ring-saffron"
                    >
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}/5
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">Weight:</span>
                    <select
                      value={s.importanceWeight}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSelectedSkills((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, importanceWeight: val } : item))
                        );
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-saffron-dark dark:text-saffron focus:ring-2 focus:ring-saffron"
                    >
                      {[1, 2, 3, 4, 5].map((w) => (
                        <option key={w} value={w}>
                          {w}/5 ({w === 5 ? 'Critical' : w >= 3 ? 'High' : 'Normal'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.skillId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-saffron hover:bg-saffron-hover text-white font-bold text-sm shadow-md shadow-saffron/25 flex items-center gap-2 transition-all"
          >
            <span>Publish Opportunity to Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
