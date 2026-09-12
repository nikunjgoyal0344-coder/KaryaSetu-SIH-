'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Sparkles, 
  BrainCircuit, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  Bell, 
  Award, 
  FileCheck2, 
  Send, 
  Activity, 
  FileText,
  HelpCircle
} from 'lucide-react';

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'specification'>('visual');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const workflowNodes = [
    {
      id: 'user-journey',
      title: 'User Journey',
      badge: 'Student Onboarding',
      color: 'border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300',
      description: 'Progressive student journey from intake registration to diagnostic assessment and dynamic skill gap quantification.',
      steps: [
        { name: 'Registration & Role Selection', link: '/register', desc: 'Stakeholder identity selection (Student, Industry, Faculty, Institution)' },
        { name: 'Skill Assessment', link: '/student/assessment', desc: 'Clinical & pharmacological diagnostic evaluating competencies' },
        { name: 'Skill Profile Generation', link: '/student/dashboard', desc: 'Radar chart and readiness index generation' },
        { name: 'Gap Analysis', link: '/student/dashboard', desc: 'Computes Missing Skills: Gap = Importance × (Required - Current)' }
      ]
    },
    {
      id: 'core-processing',
      title: 'Core Processing',
      badge: 'System Heart & AI',
      color: 'border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300',
      description: 'Central intelligence hub handling automated matching, gap-to-course recommendations, telemetry normalization, and event dispatch.',
      steps: [
        { name: 'Personalized Recommendations', link: '/student/dashboard', desc: 'Bridge courses and micro-credentials based on missing skills' },
        { name: 'Skill & Opportunity Matching', link: '/student/internships', desc: '5-factor explainable algorithm matching students with live postings' },
        { name: 'Data Processing Engine', link: '/student/portfolio', desc: 'Normalizes verified learner data and institutional feedback' },
        { name: 'Notification System', link: '#', desc: 'Real-time cross-stakeholder event dispatch for status updates' }
      ]
    },
    {
      id: 'opportunity-flow',
      title: 'Opportunity Flow',
      badge: 'Internships & Careers',
      color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300',
      description: 'End-to-end recruitment cycle from browsing AI-ranked opportunities to tracking submission states and digital portfolio issuance.',
      steps: [
        { name: 'Browse Opportunities', link: '/student/internships', desc: 'AI-matched internships, hospital residencies, and faculty FDPs' },
        { name: 'Apply for Opportunities', link: '/student/internships', desc: '1-click direct credential submission with match verification' },
        { name: 'Application Tracking', link: '/student/internships', desc: 'Pipeline status: Applied → Under Review → Shortlisted → Selected' },
        { name: 'Digital Portfolio Update', link: '/student/portfolio', desc: 'Dynamic Skill Passport with DigiLocker verification & QR stamp' }
      ]
    },
    {
      id: 'industry-actions',
      title: 'Industry Actions',
      badge: 'Recruiter Operations',
      color: 'border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300',
      description: 'Pharma R&D, clinical centers, and health tech enterprises hiring AYUSH scholars and evaluating candidate pools.',
      steps: [
        { name: 'Post Opportunities', link: '/industry/post-internship', desc: 'Publish roles with custom AYUSH skill weights and required proficiencies' },
        { name: 'View Candidates & Shortlist', link: '/industry/applicants', desc: 'Filter pre-ranked applicants and trigger selection updates' }
      ]
    },
    {
      id: 'faculty-actions',
      title: 'Faculty Actions',
      badge: 'Academic Mentorship',
      color: 'border-teal-300 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-300',
      description: 'Professors and clinical instructors verifying student practical skills and supervising academic development.',
      steps: [
        { name: 'Mentorship & Skill Endorsement', link: '/faculty/dashboard', desc: 'Directly endorse student clinical and formulation proficiencies' },
        { name: 'Review Student Progress', link: '/student/dashboard', desc: 'Inspect mentee radar charts, readiness scores, and case logs' }
      ]
    },
    {
      id: 'institution-actions',
      title: 'Institution Actions',
      badge: 'College Administration',
      color: 'border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300',
      description: 'Registrars, Deans, and Placement Cells verifying student enrollment and monitoring institutional placement KPIs.',
      steps: [
        { name: 'Verify Students', link: '/institution/verify', desc: 'Validate roll numbers, DigiLocker credentials, and push verified learner data' },
        { name: 'Analytics & Placement Tracking', link: '/institution/analytics', desc: 'Track cohort hiring rates, top demand skills, and export placement reports' }
      ]
    }
  ];

  const dataConnections = [
    { from: 'Gap Analysis', to: 'Personalized Recommendations', signal: 'Missing Skills', type: 'purple' },
    { from: 'Personalized Recommendations', to: 'Skill & Opportunity Matching', signal: 'Learning & Career Paths', type: 'purple' },
    { from: 'Industry: Post Opportunities', to: 'Skill & Opportunity Matching', signal: 'Live Opportunities', type: 'amber' },
    { from: 'Skill & Opportunity Matching', to: 'Browse Opportunities', signal: 'Matched Opportunities', type: 'emerald' },
    { from: 'Industry: Shortlist', to: 'Application Tracking', signal: 'Selection Updates', type: 'amber' },
    { from: 'Faculty: Skill Endorsement', to: 'Skill Profile Generation', signal: 'Endorsements', type: 'teal' },
    { from: 'Faculty: Review Progress', to: 'Data Processing Engine', signal: 'Feedback', type: 'teal' },
    { from: 'Institution: Verify Students', to: 'Data Processing / Profile', signal: 'Verified Learner Data', type: 'rose' },
    { from: 'Application Tracking', to: 'Institution: Placement Tracking', signal: 'Placement Analytics', type: 'emerald' },
    { from: 'Digital Portfolio Update', to: 'Data Processing', signal: 'Feedback Loop', type: 'purple' },
    { from: 'Data Processing', to: 'Notification System', signal: 'Events & Status Changes', type: 'blue' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              Architecture & Data Flow Map
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              KaryaSetu - System WorkFlow
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Interactive structural map illustrating the multi-stakeholder feedback loops between Student Journeys, Core Processing, Opportunity Flows, Industry Actions, Faculty Actions, and Institution Actions.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'visual'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Interactive Architecture Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specification')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'specification'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Data Connections Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Visual Workflow Architecture Cards */}
      {activeTab === 'visual' ? (
        <div className="space-y-8">
          {/* 3 Top Primary Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. User Journey */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    User Journey
                  </span>
                  <UserCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Student Assessment & Gap Analysis
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Diagnostics translate clinical answers into quantitative radar proficiencies.
                </p>
              </div>

              <div className="space-y-2.5">
                {workflowNodes[0].steps.map((step, idx) => (
                  <Link
                    key={step.name}
                    href={step.link}
                    className="block p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
                        {idx + 1}. {step.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                <span>&rarr; Sends missing skills:</span>
                <span className="text-emerald-800 dark:text-emerald-400 font-bold">To Recommendations</span>
              </div>
            </div>

            {/* 2. Core Processing */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Core Processing
                  </span>
                  <BrainCircuit className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recommendations & Match Engine
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  5-factor explainable matching algorithm, telemetry normalization & notifications.
                </p>
              </div>

              <div className="space-y-2.5">
                {workflowNodes[1].steps.map((step, idx) => (
                  <Link
                    key={step.name}
                    href={step.link}
                    className="block p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
                        {idx + 1}. {step.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                <span>&rarr; Dispatches matched roles:</span>
                <span className="text-emerald-800 dark:text-emerald-400 font-bold">To Opportunity Flow</span>
              </div>
            </div>

            {/* 3. Opportunity Flow */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Opportunity Flow
                  </span>
                  <Briefcase className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Applications & Digital Portfolio
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  1-click applications, candidate tracking stages, and verified skill passports.
                </p>
              </div>

              <div className="space-y-2.5">
                {workflowNodes[2].steps.map((step, idx) => (
                  <Link
                    key={step.name}
                    href={step.link}
                    className="block p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
                        {idx + 1}. {step.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                <span>&rarr; Telemetry & Outcomes:</span>
                <span className="text-emerald-800 dark:text-emerald-400 font-bold">To Placement Analytics</span>
              </div>
            </div>
          </div>

          {/* 3 Bottom Stakeholder Action Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 4. Industry Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Industry Actions
                  </span>
                  <Building2 className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Opportunities & Shortlists
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Publish internships with skill weights and send selection updates.
                </p>
              </div>

              <div className="space-y-2.5">
                {workflowNodes[3].steps.map((step, idx) => (
                  <Link
                    key={step.name}
                    href={step.link}
                    className="block p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400">
                        {idx + 1}. {step.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Syncs with: Core Match Engine &amp; Application Tracking
              </div>
            </div>

            {/* 5. Faculty Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Faculty Actions
                  </span>
                  <GraduationCap className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Mentorship & Endorsement
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Authenticate student competencies to build institutional trust.
                </p>
              </div>

              <div className="space-y-2.5">
                {workflowNodes[4].steps.map((step, idx) => (
                  <Link
                    key={step.name}
                    href={step.link}
                    className="block p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                        {idx + 1}. {step.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Syncs with: Skill Profile Generation &amp; Data Processing
              </div>
            </div>

            {/* 6. Institution Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Institution Actions
                  </span>
                  <ShieldCheck className="w-5 h-5 text-rose-700 dark:text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Verification & Placement Tracking
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Validate enrollment records and analyze aggregate institutional KPIs.
                </p>
              </div>

              <div className="space-y-2.5">
                {workflowNodes[5].steps.map((step, idx) => (
                  <Link
                    key={step.name}
                    href={step.link}
                    className="block p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-400">
                        {idx + 1}. {step.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Syncs with: Data Processing &amp; Placement Analytics
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Data Connections Matrix */
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            System Workflow Interconnecting Data Signals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mapping of the active event channels and real-time data pipelines shown in the architecture schematic:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {dataConnections.map((conn, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs gap-3"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    {conn.from} &rarr; {conn.to}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Signal: <strong className="text-slate-800 dark:text-slate-200">{conn.signal}</strong>
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                  conn.type === 'purple'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    : conn.type === 'amber'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : conn.type === 'emerald'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : conn.type === 'rose'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : conn.type === 'teal'
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
