import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { clampStaggerDelay } from '@/lib/scrollUtils';
import {
  GraduationCap,
  Microscope,
  BookOpenCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const STAKEHOLDER_PORTALS = [
  {
    role: 'student',
    title: 'Students Portal',
    description:
      'Diagnostics, gap analysis, digital skill passports, and 1-click internship applications across verified hospital and lab networks.',
    Icon: GraduationCap,
    iconBoxClass:
      'bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 group-hover:bg-navy-800 group-hover:text-white',
  },
  {
    role: 'industry',
    title: 'Industry & Corporate Partners',
    description:
      'Post weighted skill internships, review pre-screened talent, shortlist candidates, and manage automated MoAs.',
    Icon: Microscope,
    iconBoxClass:
      'bg-amber-50 dark:bg-amber-950/60 text-saffron-accent dark:text-amber-400 group-hover:bg-saffron group-hover:text-white',
  },
  {
    role: 'faculty',
    title: 'Academicians & Faculty',
    description:
      'Industry sabbatical marketplace, UGC/AICTE accredited FDPs, and official student skill endorsements.',
    Icon: BookOpenCheck,
    iconBoxClass:
      'bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 group-hover:bg-navy-800 group-hover:text-white',
  },
  {
    role: 'institution',
    title: 'Institutions & Registrars',
    description:
      'Student enrollment validation queue, DigiLocker verification, and NAAC/NIRF placement analytics tracking.',
    Icon: ShieldCheck,
    iconBoxClass:
      'bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-300 group-hover:bg-navy-800 group-hover:text-white',
  },
] as const;

export default function StakeholderGateways() {
  return (
    <section
      id="gateways-section"
      aria-labelledby="gateways-heading"
      className="scroll-mt-20 w-full px-4 py-8 max-w-[1600px] mx-auto border-b border-slate-200 dark:border-slate-800"
    >
      <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase text-navy-800 dark:text-blue-300 font-bold tracking-wider bg-navy-100 dark:bg-navy-950 px-3 py-1 rounded-full border border-navy-200 dark:border-navy-800">
          Secure Role Portals
        </span>
        <h2 id="gateways-heading" className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mt-2.5">
          Multi-Role Sovereignty Gateways
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
          Select your designated stakeholder profile for Aadhaar &amp; DigiLocker sovereign authenticated sessions.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAKEHOLDER_PORTALS.map(({ role, title, description, Icon, iconBoxClass }, idx) => (
          <ScrollReveal
            key={role}
            variant="fade-up"
            delayMs={clampStaggerDelay(idx, 85, 340)}
            className="h-full"
          >
            <div className="h-full bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group">
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${iconBoxClass}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg text-navy-900 dark:text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {description}
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/login?role=${role}`}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold text-navy-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-center min-h-[38px] flex items-center justify-center"
                >
                  Log In ({title.split(' ')[0]})
                </Link>
                <Link
                  href={`/register?role=${role}`}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-saffron hover:bg-saffron-hover shadow-2xs transition-all flex items-center justify-center gap-1 min-h-[38px]"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
