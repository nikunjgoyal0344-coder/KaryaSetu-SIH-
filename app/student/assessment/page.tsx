'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { AYUSH_SKILLS_TAXONOMY } from '@/lib/taxonomy';
import SkillRadarChart from '@/components/SkillRadarChart';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Layers,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface GapItem {
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  bridgeCourse: {
    title: string;
    provider: string;
    durationWeeks: number;
    difficulty: string;
  };
}

interface AssessmentResult {
  newLevel: number;
  oldLevel: number;
  levelGain: number;
  gapAnalysis: GapItem[];
  updatedReadinessScore: number;
  notification: any;
}

export default function AssessmentPage() {
  const { student, updateSkillLevel } = useApp();

  // Active quiz state
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Selected skill details
  const activeSkill = AYUSH_SKILLS_TAXONOMY.find((s) => s.id === activeSkillId);

  // Start assessment for a specific skill
  const handleStartAssessment = async (skillId: string) => {
    setActiveSkillId(skillId);
    setLoadingQuestions(true);
    setCurrentIdx(0);
    setSelectedAnswers([]);
    setResult(null);

    try {
      const res = await fetch(`/api/ai/quiz?skillId=${skillId}&difficulty=intermediate`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setSelectedAnswers(new Array(data.questions.length).fill(-1));
        }
      }
    } catch (err) {
      console.error('Failed to load quiz questions', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentIdx] = optionIdx;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeSkillId) return;
    setSubmitting(true);

    try {
      // Calculate scores (0 to 4) per question based on correct answer
      const answerScores = questions.map((q, idx) => {
        const selected = selectedAnswers[idx];
        return selected === q.correctIndex ? 4 : 0;
      });

      const res = await fetch('/api/ai/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          skillId: activeSkillId,
          answers: answerScores,
          quizType: 'theory',
        }),
      });

      if (res.ok) {
        const data: AssessmentResult = await res.json();
        setResult(data);
        if (data.levelGain > 0) {
          updateSkillLevel(activeSkillId, data.levelGain);
        }
      }
    } catch (err) {
      console.error('Failed to submit assessment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setActiveSkillId(null);
    setQuestions([]);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-slate-800 text-saffron-dark dark:text-saffron text-xs font-semibold mb-2 border border-orange-200 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            Healthcare Sector Skill Council (HSSC) &amp; AIIA Aligned
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Automated AI Skill Assessment &amp; Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Closed-loop competency validation: select an AYUSH skill, complete an adaptive diagnostic assessment, receive instant level upgrades, and identify tailored bridge pathways.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Current Readiness</span>
            <span className="text-2xl font-black text-saffron">{student.readinessScore}%</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Evaluated Skills</span>
            <span className="text-2xl font-black text-navy-900 dark:text-white">{student.skills.length}</span>
          </div>
        </div>
      </div>

      {/* Skills Matrix Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-saffron" />
            <span>Select AYUSH Clinical Domain for Diagnostic Assessment</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            8 Core Standardized Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AYUSH_SKILLS_TAXONOMY.slice(0, 8).map((skill) => {
            const studentSkill = student.skills.find((s) => s.skillId === skill.id);
            const level = studentSkill ? studentSkill.level : 1;
            const isVerified = Boolean(studentSkill?.isVerified);

            return (
              <div
                key={skill.id}
                className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-saffron/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-50 dark:bg-navy-950/80 text-navy-800 dark:text-blue-300 border border-navy-200 dark:border-navy-800">
                      {skill.category}
                    </span>
                    <span className="text-[11px] font-bold text-saffron-dark dark:text-saffron">
                      Level {level}/5
                    </span>
                  </div>

                  <h3 className="font-bold text-navy-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1.5">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">NSQF Level:</span>
                    <span className="font-bold text-navy-900 dark:text-white">Level {skill.nsqfLevel || 6}</span>
                  </div>

                  {isVerified && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Faculty Endorsed</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartAssessment(skill.id)}
                    className="w-full py-2 px-3 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview Competency Radar Card */}
      <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2 max-w-md">
          <SkillRadarChart skills={student.skills} />
        </div>

        <div className="w-full md:w-1/2 space-y-4 text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Closed-Loop AI Learning Model</span>
          </div>

          <h3 className="text-xl font-bold text-navy-900 dark:text-white">
            How KaryaSetu Skill Diagnostic Works
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
            Each diagnostic evaluation tests your understanding of clinical protocols, standard operative procedures (SOPs), classical formulations, and patient counseling. Earning higher scores directly increases your competency level, recalibrates your opportunity match scores, and recommends targeted bridge courses.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-navy-900 dark:text-white block text-sm">Step 1</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">5-Question Clinical Scenario Evaluation</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-navy-900 dark:text-white block text-sm">Step 2</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Instant Level Boost &amp; Gap Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Assessment Modal */}
      {activeSkillId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-5 sm:p-6 relative shrink-0 border-b border-navy-700/60">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-navy-800 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-saffron-light text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-saffron" />
                <span>AYUSH Adaptive Assessment</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white pr-8">
                {activeSkill?.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {activeSkill?.hsscQpCode || 'HSSC Aligned Diagnostic Module'}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingQuestions ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-saffron border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generating diagnostic questions mapped to HSSC criteria...
                  </p>
                </div>
              ) : result ? (
                /* Assessment Results View */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto border-2 border-emerald-300 dark:border-emerald-700 shadow-inner">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-navy-900 dark:text-white">
                      {result.levelGain > 0 ? 'Competency Level Upgraded!' : 'Assessment Completed'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      {result.levelGain > 0
                        ? `Congratulations! Your competency has been updated from Level ${result.oldLevel}/5 to Level ${result.newLevel}/5.`
                        : `You have confirmed your current proficiency at Level ${result.newLevel}/5.`}
                    </p>
                  </div>

                  {/* Level Gain Stat */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                        New Skill Level
                      </span>
                      <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
                        {result.newLevel} / 5
                      </span>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-saffron-dark dark:text-saffron block">
                        Readiness Index
                      </span>
                      <span className="text-3xl font-black text-saffron">
                        {result.updatedReadinessScore}%
                      </span>
                    </div>
                  </div>

                  {/* Gap Analysis & Bridge Recommendations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-saffron" />
                      <span>Closed-Loop Gap Analysis &amp; Recommended Bridge Courses</span>
                    </h4>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {result.gapAnalysis.slice(0, 3).map((item) => (
                        <div
                          key={item.skillId}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-navy-900 dark:text-white">
                                {item.skillName}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                Gap: -{item.gap} Level
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {item.bridgeCourse?.title || 'Targeted NSQF Bridge Practicum'}
                            </p>
                          </div>

                          <span className="text-[10px] px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                            {item.bridgeCourse?.durationWeeks || 3} Weeks
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/student/learning-path"
                      className="flex-1 py-3 px-4 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-center text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>View Personalized Learning Path</span>
                    </Link>

                    <button
                      onClick={handleCloseModal}
                      className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      Close &amp; Return
                    </button>
                  </div>
                </div>
              ) : questions.length > 0 ? (
                /* Question View */
                <div className="space-y-6">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-saffron h-full transition-all duration-300"
                        style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <h4 className="text-base font-bold text-navy-900 dark:text-white leading-relaxed">
                    {questions[currentIdx].questionText}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {questions[currentIdx].options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 text-xs sm:text-sm cursor-pointer ${
                            isSelected
                              ? 'border-saffron bg-orange-50/60 dark:bg-slate-800 font-semibold text-navy-900 dark:text-white shadow-2xs'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-saffron text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                        currentIdx === 0
                          ? 'opacity-40 cursor-not-allowed text-slate-400'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentIdx < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentIdx] === -1}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                          selectedAnswers[currentIdx] === -1
                            ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                            : 'bg-saffron hover:bg-saffron-hover text-white shadow-xs cursor-pointer'
                        }`}
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submitting || selectedAnswers.includes(-1)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md ${
                          submitting || selectedAnswers.includes(-1)
                            ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 cursor-pointer'
                        }`}
                      >
                        {submitting ? (
                          <span>Grading...</span>
                        ) : (
                          <>
                            <span>Submit &amp; Evaluate</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500">
                  No questions available for this module.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
