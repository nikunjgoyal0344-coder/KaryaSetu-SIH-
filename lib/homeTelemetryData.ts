import { GraduationCap, Building2, School, ShieldCheck } from 'lucide-react';

export type CohortType = 'all' | 'top10' | 'moa';

export interface MilestoneMetric {
  label: string;
  pct: number;
  detail: string;
  barClass: string;
  textClass: string;
  Icon: typeof GraduationCap;
}

export interface CohortSnapshot {
  indexPct: string;
  ecosystemIndex: string;
  milestonesAchieved: string;
  milestones: MilestoneMetric[];
}

export const COHORT_SNAPSHOTS: Record<CohortType, CohortSnapshot> = {
  all: {
    indexPct: '84.2%',
    ecosystemIndex: '88.4%',
    milestonesAchieved: '18 / 22 Achieved',
    milestones: [
      {
        label: 'Scholar Attestation & Verification',
        pct: 92,
        detail: '(12,480 / 13,500 target)',
        barClass: 'bg-navy-800 dark:bg-blue-600',
        textClass: 'text-navy-800 dark:text-blue-300',
        Icon: GraduationCap,
      },
      {
        label: 'Enterprise & MoA Onboarding',
        pct: 86,
        detail: '(210+ / 250 targets)',
        barClass: 'bg-saffron',
        textClass: 'text-saffron',
        Icon: Building2,
      },
      {
        label: 'College & Institutional Integration',
        pct: 79,
        detail: '(380 / 480 colleges)',
        barClass: 'bg-navy-600 dark:bg-blue-500',
        textClass: 'text-navy-800 dark:text-blue-300',
        Icon: School,
      },
      {
        label: 'DigiLocker & Sovereign Gateway Sync',
        pct: 98,
        detail: '(Operational)',
        barClass: 'bg-emerald-600 dark:bg-emerald-500',
        textClass: 'text-emerald-600 dark:text-emerald-400',
        Icon: ShieldCheck,
      },
    ],
  },
  top10: {
    indexPct: '94.6%',
    ecosystemIndex: '95.8%',
    milestonesAchieved: '21 / 22 Achieved',
    milestones: [
      {
        label: 'Scholar Attestation & Verification',
        pct: 99,
        detail: '(1,248 / 1,250 honors cohort)',
        barClass: 'bg-navy-800 dark:bg-blue-600',
        textClass: 'text-navy-800 dark:text-blue-300',
        Icon: GraduationCap,
      },
      {
        label: 'Enterprise & MoA Onboarding',
        pct: 94,
        detail: '(Tier-1 R&D Placements)',
        barClass: 'bg-saffron',
        textClass: 'text-saffron',
        Icon: Building2,
      },
      {
        label: 'College & Institutional Integration',
        pct: 91,
        detail: '(38 / 42 AIIA & Central Nodes)',
        barClass: 'bg-navy-600 dark:bg-blue-500',
        textClass: 'text-navy-800 dark:text-blue-300',
        Icon: School,
      },
      {
        label: 'DigiLocker & Sovereign Gateway Sync',
        pct: 100,
        detail: '(Zero Latency Sync)',
        barClass: 'bg-emerald-600 dark:bg-emerald-500',
        textClass: 'text-emerald-600 dark:text-emerald-400',
        Icon: ShieldCheck,
      },
    ],
  },
  moa: {
    indexPct: '89.0%',
    ecosystemIndex: '91.2%',
    milestonesAchieved: '19 / 22 Achieved',
    milestones: [
      {
        label: 'Scholar Attestation & Verification',
        pct: 95,
        detail: '(MoA-Backed Cohorts)',
        barClass: 'bg-navy-800 dark:bg-blue-600',
        textClass: 'text-navy-800 dark:text-blue-300',
        Icon: GraduationCap,
      },
      {
        label: 'Enterprise & MoA Onboarding',
        pct: 96,
        detail: '(488 Signed Active MoUs)',
        barClass: 'bg-saffron',
        textClass: 'text-saffron',
        Icon: Building2,
      },
      {
        label: 'College & Institutional Integration',
        pct: 84,
        detail: '(318 / 380 MoA Campuses)',
        barClass: 'bg-navy-600 dark:bg-blue-500',
        textClass: 'text-navy-800 dark:text-blue-300',
        Icon: School,
      },
      {
        label: 'DigiLocker & Sovereign Gateway Sync',
        pct: 98,
        detail: '(Operational)',
        barClass: 'bg-emerald-600 dark:bg-emerald-500',
        textClass: 'text-emerald-600 dark:text-emerald-400',
        Icon: ShieldCheck,
      },
    ],
  },
};

export const DEMAND_SKILLS = [
  {
    name: 'Phytomedicine & Drug Discovery R&D',
    pct: 92,
    vacancies: '3,420 Vacancies',
    growth: '+24% vs Q3',
    barClass: 'bg-navy-800 dark:bg-blue-600',
    textClass: 'text-navy-800 dark:text-blue-300',
  },
  {
    name: 'Clinical GCP Auditing & Trials',
    pct: 86,
    vacancies: '2,180 Vacancies',
    growth: '+18% vs Q3',
    barClass: 'bg-navy-600 dark:bg-blue-500',
    textClass: 'text-navy-800 dark:text-blue-300',
  },
  {
    name: 'HPLC & Analytical Phytochemistry',
    pct: 78,
    vacancies: '1,840 Vacancies',
    growth: '+15% vs Q3',
    barClass: 'bg-saffron',
    textClass: 'text-saffron',
  },
  {
    name: 'Botanical Cosmeceuticals & Nutraceuticals',
    pct: 74,
    vacancies: '1,510 Vacancies',
    growth: '+11% vs Q3',
    barClass: 'bg-navy-700/80 dark:bg-blue-700',
    textClass: 'text-navy-800 dark:text-blue-300',
  },
] as const;

export const COHORT_TABS: { key: CohortType; label: string }[] = [
  { key: 'all', label: 'All India Grid' },
  { key: 'top10', label: 'Top 10% Cohort' },
  { key: 'moa', label: 'Verified MoAs' },
];
