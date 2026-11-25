import type { Opportunity, StudentSkill } from './matchingEngine';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  degree: string;
  year: string;
  cgpa: number;
  readinessScore: number; // 0 - 100
  prakriti: 'Vata-Pitta' | 'Pitta-Kapha' | 'Tridoshic' | 'Kapha-Vata';
  preferredMode: 'On-site' | 'Remote' | 'Hybrid';
  preferredLocation: string;
  interests: string[];
  skills: StudentSkill[];
  bio: string;
  isInstitutionVerified?: boolean;
  institutionVerificationDate?: string;
  completedCertificates: { title: string; issuer: string; date: string; verified: boolean }[];
  projects: { title: string; description: string; tag: string }[];
  // Academic Bank of Credits (ABC ID / APAAR)
  abcId?: string;
  isAbcLinked?: boolean;
  abcCredits?: number;
  abcLastSynced?: string;
  abcInstitution?: string;
  abcCreditBreakdown?: { category: string; credits: number; level: string; verifiedBy: string }[];
}

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';
  matchScore: number;
  studentName: string;
  studentCollege: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'selection' | 'endorsement' | 'recommendation' | 'verification' | 'opportunity';
  read: boolean;
  link?: string;
}

export interface UnverifiedStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  degree: string;
  year: string;
  cgpa: number;
  digiLockerId: string;
  abcId?: string;
  abcCredits?: number;
  status: 'Pending' | 'Verified' | 'Flagged';
  submittedDate: string;
}

export interface LearningRecommendation {
  skillId: string;
  skillName: string;
  courseTitle: string;
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  linkText: string;
  reason: string;
}

export const INITIAL_STUDENT: StudentProfile = {
  id: 'stu-1',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@aiia.gov.in',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  college: 'All India Institute of Ayurveda (AIIA), New Delhi',
  degree: 'Bachelor of Ayurvedic Medicine & Surgery (BAMS)',
  year: 'Final Year (4th Professional)',
  cgpa: 8.8,
  readinessScore: 84,
  prakriti: 'Pitta-Kapha',
  preferredMode: 'Hybrid',
  preferredLocation: 'Delhi NCR / Dehradun',
  interests: ['Panchakarma', 'Clinical Ayurveda', 'Integrative Medicine', 'Ahara & Poshan'],
  skills: [
    { skillId: 'panchakarma-therapy', skillName: 'Panchakarma Therapy Procedures', level: 4, isVerified: true, endorsedBy: 'Dr. Rajesh Mishra (AIIA)' },
    { skillId: 'patient-counseling', skillName: 'Holistic Patient Communication & Counseling', level: 4, isVerified: true, endorsedBy: 'Prof. K. S. Dhiman' },
    { skillId: 'nadi-pariksha', skillName: 'Nadi Pariksha (Pulse Diagnosis)', level: 3, isVerified: false },
    { skillId: 'prakriti-evaluation', skillName: 'Prakriti & Agni Assessment', level: 4, isVerified: true, endorsedBy: 'Dr. Rajesh Mishra (AIIA)' },
    { skillId: 'ahara-poshan', skillName: 'Ayurvedic Dietetics (Ahara & Poshan)', level: 3, isVerified: false },
    { skillId: 'dravyaguna-identification', skillName: 'Dravyaguna Herb Identification', level: 2, isVerified: false },
    { skillId: 'clinical-documentation', skillName: 'Ayurveda EHR & Digital Health Records', level: 2, isVerified: false },
    { skillId: 'rasashastra-qa', skillName: 'Rasashastra & Formulation QA', level: 1, isVerified: false },
  ],
  bio: 'Final year BAMS scholar passionate about evidence-based Panchakarma and integrative healthcare protocols. Experienced in clinical pulse diagnosis and hospital IPD patient management.',
  completedCertificates: [
    { title: 'Clinical Panchakarma Immersion Fellowship', issuer: 'National Ayurveda Research Institute', date: 'Jan 2026', verified: true },
    { title: 'Good Clinical Practice (GCP) for Herbal Medicine', issuer: 'Healthcare Sector Skill Council (HSSC)', date: 'Nov 2025', verified: true },
    { title: 'AyushGrid Hospital Management System Certification', issuer: 'Ministry of Ayush', date: 'Aug 2025', verified: true }
  ],
  projects: [
    { title: 'Standardized Virechana Protocol for Psoriasis', description: 'Clinical case documentation of 25 patients under supervised OPD setup with standardized herbal formulation tracking.', tag: 'Clinical Study' },
    { title: 'Ahara Dietetics App for Metabolic Syndromes', description: 'Prototype algorithm correlating Prakriti with glycemic index of indigenous Indian grains.', tag: 'Digital Health' }
  ],
  abcId: '8472-1920-3841',
  isAbcLinked: true,
  abcCredits: 148,
  abcLastSynced: '12 Sep 2026, 11:20 IST',
  abcInstitution: 'All India Institute of Ayurveda (AIIA), New Delhi',
  abcCreditBreakdown: [
    { category: 'Core Ayush Clinical Practicum', credits: 84, level: 'NSQF Level 7', verifiedBy: 'AIIA Academic Council' },
    { category: 'Pharmacognosy & Phytochemistry Lab', credits: 32, level: 'NSQF Level 7', verifiedBy: 'PCIM&H / Ministry of Ayush' },
    { category: 'Hospital IPD/OPD Clinical Residency', credits: 20, level: 'NSQF Level 7', verifiedBy: 'AIIA Hospital Wing' },
    { category: 'Integrative Health & Digital Health Records', credits: 12, level: 'NSQF Level 6', verifiedBy: 'AyushGrid National Portal' },
  ],
};

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Panchakarma Clinical Resident Intern',
    company: 'All India Institute of Ayurveda (Hospital Wing)',
    category: 'Internship',
    location: 'Sarita Vihar, New Delhi',
    mode: 'On-site',
    duration: '6 Months',
    stipend: '₹22,000 / month',
    minEligibility: 'Final Year BAMS or Internee',
    targetDomain: ['Panchakarma', 'Clinical Ayurveda', 'Patient Care'],
    description: 'Hands-on clinical internship in AIIA 200-bed hospital. Candidate will assist senior vaidyas in IPD Panchakarma therapies (Virechana, Basti), patient monitoring, and clinical documentation.',
    postedAt: '2 days ago',
    applicantsCount: 18,
    requiredSkills: [
      { skillId: 'panchakarma-therapy', skillName: 'Panchakarma Therapy Procedures', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'patient-counseling', skillName: 'Holistic Patient Communication', requiredLevel: 3, importanceWeight: 4 },
      { skillId: 'prakriti-evaluation', skillName: 'Prakriti & Agni Assessment', requiredLevel: 3, importanceWeight: 4 },
      { skillId: 'clinical-documentation', skillName: 'Ayurveda EHR & Digital Health Records', requiredLevel: 3, importanceWeight: 3 }
    ]
  },
  {
    id: 'opp-2',
    title: 'Phytochemistry & Herb Standardization Trainee',
    company: 'Dabur Research Foundation (DRF)',
    category: 'Internship',
    location: 'Ghaziabad, NCR',
    mode: 'Hybrid',
    duration: '3 Months',
    stipend: '₹18,000 / month',
    minEligibility: 'BAMS / B.Pharm (Ayurveda)',
    targetDomain: ['Pharma & Rasashastra', 'Standardization', 'Quality Control'],
    description: 'Work alongside R&D scientists on botanical raw material validation, TLC/HPTLC fingerprinting of Ayurvedic herbs, and Ayurvedic Pharmacopoeia of India (API) test methods.',
    postedAt: 'Just now',
    applicantsCount: 7,
    requiredSkills: [
      { skillId: 'dravyaguna-identification', skillName: 'Dravyaguna Herb Identification', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'rasashastra-qa', skillName: 'Rasashastra & Formulation QA', requiredLevel: 3, importanceWeight: 5 },
      { skillId: 'research-methodology', skillName: 'Integrative Clinical Trial Methodology', requiredLevel: 2, importanceWeight: 3 }
    ]
  },
  {
    id: 'opp-3',
    title: 'Ayurvedic Wellness & Dietetic Consultant Intern',
    company: 'Ananda in the Himalayas / Wellness Corp',
    category: 'Internship',
    location: 'Rishikesh, Uttarakhand',
    mode: 'On-site',
    duration: '4 Months',
    stipend: '₹25,000 / month + Stay',
    minEligibility: 'BAMS graduate or Final Year',
    targetDomain: ['Diet & Nutrition', 'Yoga Therapy', 'Wellness Tourism'],
    description: 'Consult luxury wellness guests on personalized Ahara (dietary routines), Dinacharya, lifestyle modifications, and therapeutic Yoga. Tremendous exposure to global wellness travelers.',
    postedAt: '1 day ago',
    applicantsCount: 29,
    requiredSkills: [
      { skillId: 'ahara-poshan', skillName: 'Ayurvedic Dietetics (Ahara & Poshan)', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'prakriti-evaluation', skillName: 'Prakriti & Agni Assessment', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'patient-counseling', skillName: 'Holistic Patient Communication', requiredLevel: 4, importanceWeight: 4 },
      { skillId: 'yoga-therapy', skillName: 'Therapeutic Yoga & Pranayama Protocols', requiredLevel: 3, importanceWeight: 3 }
    ]
  },
  {
    id: 'opp-4',
    title: 'National Faculty Development Program (FDP): Phytomedicine & Clinical Validation',
    company: 'CSIR - Central Drug Research Institute & Ministry of Ayush',
    category: 'Faculty FDP',
    location: 'Lucknow / Virtual',
    mode: 'Hybrid',
    duration: '2 Weeks (AICTE/UGC Recognized)',
    stipend: 'Fully Funded + ₹10,000 Contingency',
    minEligibility: 'Ayurveda Faculty (Assistant/Associate/Professors)',
    targetDomain: ['Faculty Training', 'Research Collaboration', 'Standardization'],
    description: 'Prestigious industry immersion FDP for academicians. Hands-on modules in LC-MS drug fingerprinting, ethical committee clearances, and joint industry consultancy grants.',
    postedAt: '3 days ago',
    applicantsCount: 42,
    requiredSkills: [
      { skillId: 'research-methodology', skillName: 'Integrative Clinical Trial Methodology', requiredLevel: 4, importanceWeight: 5 },
      { skillId: 'dravyaguna-identification', skillName: 'Dravyaguna Herb Identification', requiredLevel: 4, importanceWeight: 4 }
    ]
  }
];

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    opportunityTitle: 'Panchakarma Clinical Resident Intern',
    company: 'All India Institute of Ayurveda (Hospital Wing)',
    appliedDate: '10 Sep 2026',
    status: 'Shortlisted',
    matchScore: 92,
    studentName: 'Ananya Sharma',
    studentCollege: 'AIIA New Delhi'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-3',
    opportunityTitle: 'Ayurvedic Wellness & Dietetic Consultant Intern',
    company: 'Ananda in the Himalayas',
    appliedDate: '11 Sep 2026',
    status: 'Under Review',
    matchScore: 78,
    studentName: 'Ananya Sharma',
    studentCollege: 'AIIA New Delhi'
  },
  {
    id: 'app-3',
    opportunityId: 'opp-1',
    opportunityTitle: 'Panchakarma Clinical Resident Intern',
    company: 'All India Institute of Ayurveda (Hospital Wing)',
    appliedDate: '09 Sep 2026',
    status: 'Applied',
    matchScore: 81,
    studentName: 'Rohan Deshmukh',
    studentCollege: 'Govt. Ayurvedic College, Mumbai'
  }
];

export const INITIAL_ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    category: 'Panchakarma',
    question: 'In Purvakarma, what is the primary clinical endpoint indicator for completion of Snehana (internal oleation)?',
    options: [
      { text: 'Appearance of unctuous stool (Snigdha Purisha) & Vatanulomana', correct: true, levelGain: 4, skillId: 'panchakarma-therapy' },
      { text: 'Increase in body weight by 2 kg', correct: false, levelGain: 1, skillId: 'panchakarma-therapy' },
      { text: 'Total cessation of thirst and hunger', correct: false, levelGain: 1, skillId: 'panchakarma-therapy' },
      { text: 'High systolic blood pressure elevation', correct: false, levelGain: 1, skillId: 'panchakarma-therapy' },
    ],
    explanation: 'Samyak Snigdha Lakshanas include Vatanulomana, Deeptagni, Snigdha Varcha, and Asamhatatva of stool according to Charaka Samhita Sutrasthana 13.'
  },
  {
    id: 'q2',
    category: 'AYUSH Clinical',
    question: 'During Nadi Pariksha, which finger positioned at the radial artery primarily assesses Pitta Dosha rhythm and movement (Gati)?',
    options: [
      { text: 'Index finger (Vata)', correct: false, levelGain: 1, skillId: 'nadi-pariksha' },
      { text: 'Middle finger (Pitta - Manduka / Frog gait)', correct: true, levelGain: 4, skillId: 'nadi-pariksha' },
      { text: 'Ring finger (Kapha - Hamsa / Swan gait)', correct: false, levelGain: 1, skillId: 'nadi-pariksha' },
      { text: 'Little finger (Ojas)', correct: false, levelGain: 1, skillId: 'nadi-pariksha' },
    ],
    explanation: 'The middle finger resting below the radial styloid captures Pitta pulsation, typically rapid, bounding and jumping like a frog (Manduka Gati).'
  },
  {
    id: 'q3',
    category: 'Pharma & Rasashastra',
    question: 'Which test confirms the non-metallic, micro-fine nature of a genuine Ayurvedic Bhasma?',
    options: [
      { text: 'Rekhapurnatva (enters fingerprint ridges) & Varitara (floats on water)', correct: true, levelGain: 4, skillId: 'rasashastra-qa' },
      { text: 'Boiling at 200°C without color change', correct: false, levelGain: 1, skillId: 'rasashastra-qa' },
      { text: 'Total dissolution in concentrated nitric acid', correct: false, levelGain: 1, skillId: 'rasashastra-qa' },
      { text: 'Immediate magnetic attraction', correct: false, levelGain: 1, skillId: 'rasashastra-qa' },
    ],
    explanation: 'Bhasma Parikshas (Varitara, Rekhapurnatva, Unama, Apunarbhava) prove particle micronization below colloidal threshold.'
  },
  {
    id: 'q4',
    category: 'Diet & Nutrition',
    question: 'For a Pitta-predominant patient with hyperacidity (Amlapitta), which Ahara regimen is therapeutic according to classical principles?',
    options: [
      { text: 'Tikta-Madhura Rasa, cooling Virya (e.g. Mudga Yusha, Dadima, Shatavari ksheera)', correct: true, levelGain: 4, skillId: 'ahara-poshan' },
      { text: 'Amla & Lavana rasa fermented preparations (Kanjika, curd)', correct: false, levelGain: 1, skillId: 'ahara-poshan' },
      { text: 'Heavy deep-fried spicy snacks', correct: false, levelGain: 1, skillId: 'ahara-poshan' },
      { text: 'Dry pungent spices with alcohol', correct: false, levelGain: 1, skillId: 'ahara-poshan' },
    ],
    explanation: 'Tikta and Madhura Rasa with Sheeta Virya pacify aggravated Pitta Dosha without vitiating Agni.'
  },
  {
    id: 'q5',
    category: 'Research & Digital Health',
    question: 'Under the Ministry of Ayush NAMASTE portal and Ayush Grid, what is the purpose of the National Ayush Morbidity Codes (NAMC)?',
    options: [
      { text: 'Standardizing standardized diagnosis terminology mapped to WHO ICD-11 (TM-2)', correct: true, levelGain: 4, skillId: 'clinical-documentation' },
      { text: 'Calculating doctor consultation fees automatically', correct: false, levelGain: 1, skillId: 'clinical-documentation' },
      { text: 'Tracking student college attendance', correct: false, levelGain: 1, skillId: 'clinical-documentation' },
      { text: 'Limiting patient prescription quantities', correct: false, levelGain: 1, skillId: 'clinical-documentation' },
    ],
    explanation: 'NAMASTE portal integrates Ayush terminology with WHO ICD-11 Traditional Medicine Chapter 2 for global EHR interoperability.'
  },
  {
    id: 'q6',
    category: 'Soft Skills',
    question: 'When a chronic pain patient expresses skepticism about Ayurvedic lifestyle treatment compliance, what is the best empathetic response?',
    options: [
      { text: 'Acknowledge their distress, explain the stepwise progression of Dosha balance, and co-design realistic daily micro-habits', correct: true, levelGain: 4, skillId: 'patient-counseling' },
      { text: 'Tell them they must follow every single rule strictly or leave the clinic', correct: false, levelGain: 1, skillId: 'patient-counseling' },
      { text: 'Ignore their concerns and prescribe more medicines', correct: false, levelGain: 1, skillId: 'patient-counseling' },
      { text: 'Refer them immediately elsewhere without discussion', correct: false, levelGain: 1, skillId: 'patient-counseling' },
    ],
    explanation: 'Motivational interviewing and collaborative pacing dramatically increase patient adherence in chronic holistic regimens.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Candidate Shortlisted',
    message: 'Dabur Research Foundation has moved your application for "Ayurvedic Clinical Research Fellow" to Shortlisted status.',
    timestamp: '10m ago',
    type: 'selection',
    read: false,
    link: '/student/internships',
  },
  {
    id: 'notif-2',
    title: 'Skill Endorsement Received',
    message: 'Dr. Rajesh Mishra (Faculty) endorsed your "Panchakarma Therapy Procedures" competency.',
    timestamp: '2h ago',
    type: 'endorsement',
    read: false,
    link: '/student/portfolio',
  },
  {
    id: 'notif-3',
    title: 'Institutional Verification Complete',
    message: 'AIIA Academic Cell verified your enrollment credentials and DigiLocker BAMS records.',
    timestamp: '1d ago',
    type: 'verification',
    read: true,
    link: '/student/portfolio',
  },
  {
    id: 'notif-4',
    title: 'Personalized Skill Path Ready',
    message: 'Based on your Gap Analysis, 2 bridge learning modules have been recommended in Rasashastra QA.',
    timestamp: '1d ago',
    type: 'recommendation',
    read: true,
    link: '/student/dashboard',
  },
];

export const INITIAL_UNVERIFIED_STUDENTS: UnverifiedStudent[] = [
  {
    id: 'unv-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@aiia.gov.in',
    rollNumber: 'AIIA/BAMS/2022/041',
    degree: 'BAMS (Ayurvedacharya)',
    year: 'Final Year',
    cgpa: 8.8,
    digiLockerId: 'DL-AYUSH-9921-X',
    abcId: '8472-1920-3841',
    abcCredits: 148,
    status: 'Verified',
    submittedDate: '12 Sep 2026',
  },
  {
    id: 'unv-2',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@aiia.gov.in',
    rollNumber: 'AIIA/BAMS/2022/088',
    degree: 'BAMS (Ayurvedacharya)',
    year: 'Final Year',
    cgpa: 8.3,
    digiLockerId: 'DL-AYUSH-8834-Y',
    abcId: '7729-3810-4491',
    abcCredits: 132,
    status: 'Pending',
    submittedDate: '11 Sep 2026',
  },
  {
    id: 'unv-3',
    name: 'Priyanka Nambiar',
    email: 'priyanka.n@aiia.gov.in',
    rollNumber: 'AIIA/MD/2024/012',
    degree: 'MD (Ayurveda) - Dravyaguna',
    year: '2nd Year',
    cgpa: 9.1,
    digiLockerId: 'DL-AYUSH-7711-K',
    abcId: '6619-4820-1934',
    abcCredits: 164,
    status: 'Pending',
    submittedDate: '10 Sep 2026',
  },
  {
    id: 'unv-4',
    name: 'Kavita Joshi',
    email: 'kavita.j@aiia.gov.in',
    rollNumber: 'AIIA/BAMS/2023/019',
    degree: 'BAMS (Ayurvedacharya)',
    year: '3rd Year',
    cgpa: 7.9,
    digiLockerId: 'DL-AYUSH-6643-M',
    abcId: '5501-9231-8842',
    abcCredits: 96,
    status: 'Pending',
    submittedDate: '09 Sep 2026',
  },
];

export const INSTITUTION_ANALYTICS = {
  totalEnrolled: 420,
  verifiedLearners: 396,
  verificationRate: 94.3,
  activeInternships: 78,
  placementRate: 88.6,
  averageStipend: '₹32,500 / mo',
  partnerMoUs: 28,
  topSkillsDemand: [
    { skill: 'Panchakarma Clinical Protocols', count: 48, percentage: 38 },
    { skill: 'Formulation QA & Rasashastra', count: 32, percentage: 25 },
    { skill: 'AyushGrid EHR & Digital Health', count: 26, percentage: 21 },
    { skill: 'Botanical Identification (Dravyaguna)', count: 20, percentage: 16 },
  ],
  cohortTrends: [
    { year: '2023', placed: 74, rate: 77 },
    { year: '2024', placed: 89, rate: 82 },
    { year: '2025', placed: 112, rate: 88.6 },
  ],
  hiringPartners: [
    { name: 'Dabur Research Foundation', hires: 18, logo: 'DRF' },
    { name: 'Patanjali Research Institute', hires: 15, logo: 'PRI' },
    { name: 'Himalaya Wellness R&D', hires: 14, logo: 'HW' },
    { name: 'All India Institute of Ayurveda OPD', hires: 12, logo: 'AIIA' },
    { name: 'Charak Pharma Clinical Wing', hires: 9, logo: 'CP' },
  ],
};

export const LEARNING_RECOMMENDATIONS: Record<string, LearningRecommendation> = {
  'rasashastra-qa': {
    skillId: 'rasashastra-qa',
    skillName: 'Rasashastra & Formulation QA',
    courseTitle: 'Ayurvedic Pharmacopeia & Bhasma Quality Control Certification',
    provider: 'Pharmacopoeia Commission for Indian Medicine & Homeopathy (PCIM&H)',
    duration: '4 Weeks • Self-Paced',
    difficulty: 'Intermediate',
    linkText: 'Enroll in Bridge Module',
    reason: 'Fulfills industry GMP requirement for pharma and R&D internships.',
  },
  'dravyaguna-identification': {
    skillId: 'dravyaguna-identification',
    skillName: 'Dravyaguna Herb Identification',
    courseTitle: 'Field Botany, Herbarium Curation & Raw Drug Macro/Microscopy',
    provider: 'National Medicinal Plants Board (NMPB) & CCRAS',
    duration: '3 Weeks • Hybrid Clinical',
    difficulty: 'Intermediate',
    linkText: 'Enroll in Bridge Module',
    reason: 'Closes gap in species adulteration detection for formulation testing.',
  },
  'clinical-documentation': {
    skillId: 'clinical-documentation',
    skillName: 'Ayurveda EHR & Digital Health Records',
    courseTitle: 'National Ayush Morbidity Codes (NAMASTE) & WHO ICD-11 Integration',
    provider: 'Ministry of Ayush Digital Health Mission',
    duration: '2 Weeks • Interactive Online',
    difficulty: 'Beginner',
    linkText: 'Enroll in Bridge Module',
    reason: 'Mandatory for hospital OPD residency and NABH Ayush compliance.',
  },
  'nadi-pariksha': {
    skillId: 'nadi-pariksha',
    skillName: 'Nadi Pariksha (Pulse Diagnosis)',
    courseTitle: 'Advanced Sphygmology & Dosha Rhythmics Clinical Masterclass',
    provider: 'AIIA Dept. of Roga Nidana',
    duration: '3 Weeks • Clinical Practical',
    difficulty: 'Advanced',
    linkText: 'Enroll in Clinical Practicum',
    reason: 'Elevates pulse diagnosis precision from level 3 to master level 4+.',
  },
  'ahara-poshan': {
    skillId: 'ahara-poshan',
    skillName: 'Ayurvedic Dietetics (Ahara & Poshan)',
    courseTitle: 'Prakriti-Based Therapeutic Nutrition Protocols & Clinical Ahara',
    provider: 'AIIA Center for Integrative Nutrition',
    duration: '3 Weeks • Self-Paced',
    difficulty: 'Intermediate',
    linkText: 'Enroll in Bridge Module',
    reason: 'Enhances holistic lifestyle prescription acumen.',
  },
};
