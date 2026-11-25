import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import {
  School,
  Building2,
  Award,
  GraduationCap,
  Microscope,
  FlaskConical,
  Sprout,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

const ECOSYSTEM_PARTNERS = [
  { name: 'Ministry of Ayush', Icon: School },
  { name: 'AIIA New Delhi', Icon: Building2 },
  { name: 'HSSC & NSDC', Icon: Award },
  { name: 'AICTE & SIH', Icon: GraduationCap },
  { name: 'CSIR-CDRI', Icon: Microscope },
  { name: 'Dabur Research Foundation', Icon: FlaskConical },
  { name: 'ITC Agri-Business', Icon: Sprout },
  { name: 'Tata HealthTech', Icon: HeartPulse },
  { name: 'Himalaya Wellness', Icon: Sparkles },
] as const;

export default function PartnerMarquee() {
  return (
    <ScrollReveal variant="fade-up">
      <section
        aria-label="Trusted National Ecosystem Partners"
        className="w-full py-6 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs"
      >
        <div className="max-w-[1600px] mx-auto px-4 mb-3 text-center">
          <span className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300 font-bold tracking-wider">
            Trusted National Ecosystem Partners &amp; Autonomous Bodies
          </span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-navy-900 dark:text-slate-200 font-bold text-sm">
            {[0, 1].map((pass) =>
              ECOSYSTEM_PARTNERS.map(({ name, Icon }) => (
                <div
                  key={`${pass}-${name}`}
                  aria-hidden={pass === 1 ? true : undefined}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-navy-900 dark:text-blue-400" aria-hidden="true" />
                  <span>{name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
