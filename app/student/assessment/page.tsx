'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { INITIAL_ASSESSMENT_QUESTIONS } from '@/lib/seedData';
import SkillRadarChart from '@/components/SkillRadarChart';
import {
  Award,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

export default function AssessmentPage() {
  const { student, updateSkillLevel } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);

  const question = INITIAL_ASSESSMENT_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const opt = question.options[selectedOption];

    if (!showExplanation) {
      if (opt.correct) {
        setScoreCount((prev) => prev + 1);
        updateSkillLevel(opt.skillId, opt.levelGain);
      }
      setShowExplanation(true);
      return;
    }

    // Move to next question or complete
    setShowExplanation(false);
    setSelectedOption(null);
    if (currentIdx + 1 < INITIAL_ASSESSMENT_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCompleted(false);
    setScoreCount(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-slate-800 text-saffron-dark dark:text-saffron text-xs font-semibold mb-2 border border-orange-200 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            Healthcare Sector Skill Council (HSSC) Aligned
          </div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
            AYUSH Competency Diagnostic Assessment
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Dynamic adaptive evaluation mapped against National Skill Qualification Framework (NSQF Level 6-7)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm text-navy-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {completed ? INITIAL_ASSESSMENT_QUESTIONS.length : currentIdx + 1} / {INITIAL_ASSESSMENT_QUESTIONS.length}
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2">
            <div
              className="bg-saffron h-full transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / INITIAL_ASSESSMENT_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 bg-navy-100 dark:bg-navy-950 rounded-full font-bold text-navy-900 dark:text-blue-200 border border-navy-200 dark:border-navy-800 uppercase tracking-wider">
                Category: {question.category}
              </span>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Single choice
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white leading-snug">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {question.options.map((opt, idx) => {
                let borderClass = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100';
                if (selectedOption === idx) {
                  borderClass = 'border-navy-900 dark:border-amber-400 bg-slate-50/80 dark:bg-slate-700/80 shadow-2xs text-navy-900 dark:text-white font-semibold';
                }
                if (showExplanation) {
                  if (opt.correct) {
                    borderClass = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-semibold';
                  } else if (selectedOption === idx && !opt.correct) {
                    borderClass = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 text-xs sm:text-sm ${borderClass}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        selectedOption === idx
                          ? 'bg-navy-900 dark:bg-amber-400 text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation card */}
            {showExplanation && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  Clinical / Domain Rationalization:
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{question.explanation}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  selectedOption === null
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-saffron hover:bg-saffron-hover text-white shadow-md shadow-saffron/25'
                }`}
              >
                <span>{showExplanation ? 'Proceed to Next' : 'Submit Answer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner border border-emerald-200 dark:border-emerald-800">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-navy-900 dark:text-white">
              Assessment Completed!
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              You scored <strong className="text-emerald-800 dark:text-emerald-400">{scoreCount} out of {INITIAL_ASSESSMENT_QUESTIONS.length}</strong>. Your competency profile has been updated and mapped to the National Skill Matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Updated Radar */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-saffron" />
                Updated Competency Radar
              </h3>
              <SkillRadarChart skills={student.skills} />
            </div>

            {/* Key Outcomes */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                  Overall Readiness Score Gain
                </span>
                <p className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
                  {student.readinessScore}% (+4% Boost)
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-1">
                  Strong performance in Panchakarma procedures &amp; Ayurvedic dietetics.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Identified Priority Gap
                </span>
                <p className="text-navy-900 dark:text-white font-semibold">
                  Rasashastra QA &amp; LC-MS Phytochemical Fingerprinting
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">
                  Recommended: Enroll in 2-week Dabur standardization module to raise match score by 14%.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/student/internships"
                  className="flex-1 py-3 px-4 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-center transition-all shadow-md shadow-saffron/25 flex items-center justify-center gap-1.5"
                >
                  <span>Explore Matched Roles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-all flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
