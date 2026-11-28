import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { Network } from 'lucide-react';

export default function WorkflowBanner() {
  return (
    <section id="workflow-section" className="scroll-mt-20 w-full px-4 py-6 max-w-[1600px] mx-auto" aria-labelledby="workflow-banner-heading">
      <ScrollReveal variant="zoom-in">
        <div className="bg-navy-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-navy-700">
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-navy-800 text-amber-400 text-[11px] font-mono font-semibold uppercase tracking-wider border border-navy-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              System Architecture State
            </div>
            <h3 id="workflow-banner-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Workflow &amp; Accreditation Pipeline
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trace candidate telemetry from national diagnostic intake to final DigiLocker credential minting and verified enterprise placement.
            </p>
          </div>

          <Link
            href="/workflow"
            className="relative z-10 px-6 py-3.5 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2 group"
          >
            <Network className="w-5 h-5" aria-hidden="true" />
            <span>View Live Architecture Map</span>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
