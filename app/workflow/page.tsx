'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { WORKFLOW_NODES, DATA_CONNECTIONS } from '@/lib/workflowData';
import { 
  UserCheck, 
  BrainCircuit, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
} from 'lucide-react';

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'specification'>('visual');
  const workflowNodes = WORKFLOW_NODES;
  const dataConnections = DATA_CONNECTIONS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white shadow-xl relative overflow-hidden border border-navy-700">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-navy-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              Architecture &amp; Data Flow Map
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              KaryaSetu - System WorkFlow
            </h1>
            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              Interactive structural map illustrating the multi-stakeholder feedback loops between Student Journeys, Core Processing, Opportunity Flows, Industry Actions, Faculty Actions, and Institution Actions.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-navy-950/60 backdrop-blur-md border border-navy-700/80 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'visual'
                  ? 'bg-saffron text-white shadow-md'
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
                  ? 'bg-saffron text-white shadow-md'
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
          <ScrollReveal variant="fade-up">
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
          </ScrollReveal>

          {/* 3 Bottom Stakeholder Action Blocks */}
          <ScrollReveal variant="fade-up" delayMs={100}>
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
          </ScrollReveal>
        </div>
      ) : (
        /* Data Connections Matrix */
        <ScrollReveal variant="fade-up">
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
        </ScrollReveal>
      )}
    </div>
  );
}
