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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Healthcare Sector Skill Council (HSSC) Aligned
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            AYUSH Competency Diagnostic Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic adaptive evaluation mapped against National Skill Qualification Framework (NSQF Level 6-7)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Progress:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            {completed ? INITIAL_ASSESSMENT_QUESTIONS.length : currentIdx + 1} / {INITIAL_ASSESSMENT_QUESTIONS.length}
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2">
            <div
              className="bg-emerald-800 h-full transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / INITIAL_ASSESSMENT_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs">
              <span className="px-3 py-1 bg-slate-100 rounded-full font-bold text-slate-700 uppercase tracking-wider">
                Category: {question.category}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Single choice
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {question.options.map((opt, idx) => {
                let borderClass = 'border-slate-200 hover:border-slate-300 bg-white';
                if (selectedOption === idx) {
                  borderClass = 'border-emerald-800 bg-emerald-50/40 shadow-2xs';
                }
                if (showExplanation) {
                  if (opt.correct) {
                    borderClass = 'border-emerald-800 bg-emerald-50/60 text-emerald-950 font-semibold';
                  } else if (selectedOption === idx && !opt.correct) {
                    borderClass = 'border-rose-400 bg-rose-50 text-rose-950';
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
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-600'
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
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                  Clinical / Domain Rationalization:
                </div>
                <p className="text-slate-700 leading-relaxed">{question.explanation}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  selectedOption === null
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Assessment Completed!
            </h2>
            <p className="text-xs text-slate-600">
              You scored <strong className="text-emerald-700">{scoreCount} out of {INITIAL_ASSESSMENT_QUESTIONS.length}</strong>. Your competency profile has been updated and mapped to the National Skill Matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Updated Radar */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Updated Competency Radar
              </h3>
              <SkillRadarChart skills={student.skills} />
            </div>

            {/* Key Outcomes */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                  Overall Readiness Score Gain
                </span>
                <p className="text-2xl font-black text-emerald-700">
                  {student.readinessScore}% (+4% Boost)
                </p>
                <p className="text-slate-600 text-[11px] mt-1">
                  Strong performance in Panchakarma procedures & Ayurvedic dietetics.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Identified Priority Gap
                </span>
                <p className="text-slate-800 font-semibold">
                  Rasashastra QA & LC-MS Phytochemical Fingerprinting
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Recommended: Enroll in 2-week Dabur standardization module to raise match score by 14%.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/student/internships"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Explore Matched Roles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center justify-center gap-1"
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
