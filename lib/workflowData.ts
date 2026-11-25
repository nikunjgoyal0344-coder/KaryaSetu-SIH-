export interface WorkflowStep {
  name: string;
  link: string;
  desc: string;
}

export interface WorkflowNode {
  id: string;
  title: string;
  badge: string;
  color: string;
  description: string;
  steps: WorkflowStep[];
}

export interface DataConnection {
  from: string;
  to: string;
  signal: string;
  type: 'purple' | 'amber' | 'emerald' | 'teal' | 'rose' | 'blue';
}

export const WORKFLOW_NODES: readonly WorkflowNode[] = [
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
      { name: 'Gap Analysis', link: '/student/dashboard', desc: 'Computes Missing Skills: Gap = Importance × (Required - Current)' },
    ],
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
      { name: 'Notification System', link: '#', desc: 'Real-time cross-stakeholder event dispatch for status updates' },
    ],
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
      { name: 'Digital Portfolio Update', link: '/student/portfolio', desc: 'Dynamic Skill Passport with DigiLocker verification & QR stamp' },
    ],
  },
  {
    id: 'industry-actions',
    title: 'Industry Actions',
    badge: 'Recruiter Operations',
    color: 'border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300',
    description: 'Pharma R&D, clinical centers, and health tech enterprises hiring AYUSH scholars and evaluating candidate pools.',
    steps: [
      { name: 'Post Opportunities', link: '/industry/post-internship', desc: 'Publish roles with custom AYUSH skill weights and required proficiencies' },
      { name: 'View Candidates & Shortlist', link: '/industry/applicants', desc: 'Filter pre-ranked applicants and trigger selection updates' },
    ],
  },
  {
    id: 'faculty-actions',
    title: 'Faculty Actions',
    badge: 'Academic Mentorship',
    color: 'border-teal-300 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-300',
    description: 'Professors and clinical instructors verifying student practical skills and supervising academic development.',
    steps: [
      { name: 'Mentorship & Skill Endorsement', link: '/faculty/dashboard', desc: 'Directly endorse student clinical and formulation proficiencies' },
      { name: 'Review Student Progress', link: '/student/dashboard', desc: 'Inspect mentee radar charts, readiness scores, and case logs' },
    ],
  },
  {
    id: 'institution-actions',
    title: 'Institution Actions',
    badge: 'College Administration',
    color: 'border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300',
    description: 'Registrars, Deans, and Placement Cells verifying student enrollment and monitoring institutional placement KPIs.',
    steps: [
      { name: 'Verify Students', link: '/institution/verify', desc: 'Validate roll numbers, DigiLocker credentials, and push verified learner data' },
      { name: 'Analytics & Placement Tracking', link: '/institution/analytics', desc: 'Track cohort hiring rates, top demand skills, and export placement reports' },
    ],
  },
];

export const DATA_CONNECTIONS: readonly DataConnection[] = [
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
