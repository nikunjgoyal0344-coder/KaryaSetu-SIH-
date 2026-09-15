// ============================================================
// KaryaSetu - AYUSH + AIIA/HSSC Domain Skill Taxonomy
// Feature 4: Enhanced with NSQF, AIIA module codes, career data
// ============================================================

export interface SkillTaxonomyItem {
  id: string;
  name: string;
  category:
    | 'AYUSH Clinical'
    | 'Panchakarma'
    | 'Pharma & Rasashastra'
    | 'Diet & Nutrition'
    | 'Yoga Therapy'
    | 'Research & Digital Health'
    | 'Soft Skills';
  hsscQpCode?: string;       // Healthcare Sector Skill Council Qualification Pack Code
  aiiaModuleCode?: string;   // AIIA curriculum module code
  description: string;
  demandLevel: 'High' | 'Very High' | 'Moderate';
  nsqfLevel: number;         // 1-8 NSQF framework level
  avgIndustryDemand: number; // 1-10 scale
  relatedCareers: string[];  // Career titles that need this skill
  assessmentType: 'MCQ' | 'Practical' | 'Portfolio' | 'Viva';
  minimumEducation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AYUSH SKILLS TAXONOMY  (10 original + 7 new = 17 total)
// ─────────────────────────────────────────────────────────────────────────────

export const AYUSH_SKILLS_TAXONOMY: SkillTaxonomyItem[] = [
  // ── Panchakarma ──────────────────────────────────────────────
  {
    id: 'panchakarma-therapy',
    name: 'Panchakarma Therapy Procedures',
    category: 'Panchakarma',
    hsscQpCode: 'HSS/Q3601 (Panchakarma Technician)',
    aiiaModuleCode: 'AIIA-PK-301',
    description: 'Practical administration of Vamana, Virechana, Basti, Nasya, and Raktamokshana protocols.',
    demandLevel: 'Very High',
    nsqfLevel: 6,
    avgIndustryDemand: 9,
    relatedCareers: ['Panchakarma Specialist', 'Clinical Ayurveda Practitioner', 'Wellness Consultant', 'Hospital OPD Resident'],
    assessmentType: 'Practical',
    minimumEducation: 'BAMS (3rd Year or above)',
  },
  // ── AYUSH Clinical ────────────────────────────────────────────
  {
    id: 'nadi-pariksha',
    name: 'Nadi Pariksha (Pulse Diagnosis)',
    category: 'AYUSH Clinical',
    aiiaModuleCode: 'AIIA-CL-201',
    description: 'Traditional Ayurvedic pulse diagnosis for Dosha imbalance assessment.',
    demandLevel: 'Very High',
    nsqfLevel: 6,
    avgIndustryDemand: 8,
    relatedCareers: ['Clinical Ayurveda Practitioner', 'Panchakarma Specialist', 'Integrative Researcher', 'Ayurvedic Consultant'],
    assessmentType: 'Practical',
    minimumEducation: 'BAMS (2nd Year or above)',
  },
  {
    id: 'prakriti-evaluation',
    name: 'Prakriti & Agni Assessment',
    category: 'AYUSH Clinical',
    aiiaModuleCode: 'AIIA-CL-101',
    description: 'Comprehensive physical, psychological, and physiological constitution analysis.',
    demandLevel: 'High',
    nsqfLevel: 5,
    avgIndustryDemand: 8,
    relatedCareers: ['Clinical Ayurveda Practitioner', 'Ayurvedic Diet Counselor', 'Wellness Consultant', 'Panchakarma Specialist'],
    assessmentType: 'Viva',
    minimumEducation: 'BAMS (1st Year or above)',
  },
  {
    id: 'nabh-protocols',
    name: 'NABH Ayush Hospital Protocols',
    category: 'AYUSH Clinical',
    hsscQpCode: 'HSS/Q4201 (Ayush Quality Technician)',
    aiiaModuleCode: 'AIIA-QA-401',
    description: 'National Accreditation Board for Hospitals (NABH) compliance standards for Ayush facilities — documentation, patient safety, and clinical SOPs.',
    demandLevel: 'High',
    nsqfLevel: 6,
    avgIndustryDemand: 7,
    relatedCareers: ['AYUSH Quality Officer', 'Clinical Ayurveda Practitioner', 'Hospital Administrator', 'Integrative Researcher'],
    assessmentType: 'Portfolio',
    minimumEducation: 'BAMS / MD Ayurveda',
  },
  // ── Pharma & Rasashastra ──────────────────────────────────────
  {
    id: 'dravyaguna-identification',
    name: 'Dravyaguna Herb Identification & Standardization',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q3702 (Medicinal Plant Processing)',
    aiiaModuleCode: 'AIIA-PH-201',
    description: 'Pharmacognostical identification, purity verification, and botanical taxonomy of medicinal herbs.',
    demandLevel: 'High',
    nsqfLevel: 5,
    avgIndustryDemand: 7,
    relatedCareers: ['Herbal Formulation Specialist', 'AYUSH Quality Officer', 'Integrative Researcher', 'Pharmaceutical R&D Scientist'],
    assessmentType: 'Practical',
    minimumEducation: 'BAMS / B.Pharm (Ayurveda)',
  },
  {
    id: 'rasashastra-qa',
    name: 'Rasashastra & Formulation QA',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q3901 (Ayurveda Pharmacy Assistant)',
    aiiaModuleCode: 'AIIA-PH-301',
    description: 'Quality control, heavy metal testing, and Bhasma standardization conforming to Ayurvedic Pharmacopoeia.',
    demandLevel: 'High',
    nsqfLevel: 6,
    avgIndustryDemand: 7,
    relatedCareers: ['AYUSH Quality Officer', 'Herbal Formulation Specialist', 'Pharmaceutical R&D Scientist', 'Regulatory Affairs Specialist'],
    assessmentType: 'Practical',
    minimumEducation: 'BAMS / B.Pharm (Ayurveda)',
  },
  {
    id: 'pharmacovigilance',
    name: 'Pharmacovigilance & Adverse Event Reporting',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q4101 (Pharmacovigilance Associate)',
    aiiaModuleCode: 'AIIA-PH-401',
    description: 'Monitoring, detection, assessment, and prevention of adverse effects of herbal and AYUSH medicinal products. Includes PVPI reporting, signal detection, and risk management.',
    demandLevel: 'Moderate',
    nsqfLevel: 6,
    avgIndustryDemand: 6,
    relatedCareers: ['AYUSH Quality Officer', 'Integrative Researcher', 'Regulatory Affairs Specialist', 'Clinical Research Associate'],
    assessmentType: 'MCQ',
    minimumEducation: 'BAMS / MD Ayurveda',
  },
  {
    id: 'good-manufacturing-practices',
    name: 'Good Manufacturing Practices (GMP) for Ayurveda',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q3902 (GMP Compliance Technician)',
    aiiaModuleCode: 'AIIA-PH-402',
    description: 'Schedule T compliance under D&C Act for Ayurvedic drug manufacturing. SOP writing, batch documentation, in-process QC, and facility hygiene standards.',
    demandLevel: 'High',
    nsqfLevel: 6,
    avgIndustryDemand: 8,
    relatedCareers: ['AYUSH Quality Officer', 'Herbal Formulation Specialist', 'Regulatory Affairs Specialist', 'Pharmaceutical QC Analyst'],
    assessmentType: 'Portfolio',
    minimumEducation: 'BAMS / B.Pharm (Ayurveda)',
  },
  {
    id: 'hplc-standardisation',
    name: 'HPLC & Chromatographic Standardisation',
    category: 'Pharma & Rasashastra',
    aiiaModuleCode: 'AIIA-PH-501',
    description: 'High Performance Liquid Chromatography (HPLC) method development and validation for marker compound quantification in polyherbal formulations. Includes TLC/HPTLC fingerprinting.',
    demandLevel: 'Moderate',
    nsqfLevel: 7,
    avgIndustryDemand: 7,
    relatedCareers: ['Herbal Formulation Specialist', 'AYUSH Quality Officer', 'Pharmaceutical Analyst', 'Integrative Researcher'],
    assessmentType: 'Practical',
    minimumEducation: 'MD Ayurveda / M.Pharm (Pharmacognosy)',
  },
  {
    id: 'botanical-fingerprinting',
    name: 'Botanical DNA Fingerprinting & Authentication',
    category: 'Pharma & Rasashastra',
    aiiaModuleCode: 'AIIA-PH-502',
    description: 'Molecular authentication of medicinal plants using DNA barcoding (ITS, matK, rbcL), PCR, and species-specific markers to detect adulteration and substitution.',
    demandLevel: 'Moderate',
    nsqfLevel: 7,
    avgIndustryDemand: 6,
    relatedCareers: ['Herbal Formulation Specialist', 'Integrative Researcher', 'Pharmaceutical Botanist', 'AYUSH Quality Officer'],
    assessmentType: 'Practical',
    minimumEducation: 'MD Ayurveda / MSc Botany',
  },
  {
    id: 'ayurvedic-formulation',
    name: 'Ayurvedic Formulation Development',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q3903 (Formulation Technician)',
    aiiaModuleCode: 'AIIA-PH-601',
    description: 'Classical and contemporary Ayurvedic dosage form development — Kwatha, Churna, Guggulu, Asava, Arista, tablets, and topicals. Includes shodhana, marana, and bhavana processes.',
    demandLevel: 'High',
    nsqfLevel: 6,
    avgIndustryDemand: 8,
    relatedCareers: ['Herbal Formulation Specialist', 'AYUSH Quality Officer', 'Pharmaceutical R&D Scientist', 'Panchakarma Specialist'],
    assessmentType: 'Practical',
    minimumEducation: 'BAMS / B.Pharm (Ayurveda)',
  },
  // ── Diet & Nutrition ──────────────────────────────────────────
  {
    id: 'ahara-poshan',
    name: 'Ayurvedic Dietetics (Ahara & Poshan)',
    category: 'Diet & Nutrition',
    hsscQpCode: 'HSS/Q3801 (Ayurveda Ahara Sahayak)',
    aiiaModuleCode: 'AIIA-DN-101',
    description: 'Personalized dietary regimen planning based on Prakriti, Agni, and seasonal Ritus.',
    demandLevel: 'Very High',
    nsqfLevel: 5,
    avgIndustryDemand: 8,
    relatedCareers: ['Ayurvedic Diet Counselor', 'Wellness Consultant', 'Clinical Ayurveda Practitioner', 'Yoga Wellness Trainer'],
    assessmentType: 'Portfolio',
    minimumEducation: 'BAMS (2nd Year or above)',
  },
  // ── Yoga Therapy ──────────────────────────────────────────────
  {
    id: 'yoga-therapy',
    name: 'Therapeutic Yoga & Pranayama Protocols',
    category: 'Yoga Therapy',
    hsscQpCode: 'HSS/Q4001 (Yoga Wellness Trainer)',
    aiiaModuleCode: 'AIIA-YT-201',
    description: 'Application of Asana, Pranayama, and Shatkriya for chronic metabolic and musculoskeletal disorders.',
    demandLevel: 'Very High',
    nsqfLevel: 5,
    avgIndustryDemand: 9,
    relatedCareers: ['Ayurvedic Diet Counselor', 'Wellness Consultant', 'Yoga Instructor', 'Integrative Health Coach'],
    assessmentType: 'Practical',
    minimumEducation: 'Diploma in Yoga / BAMS',
  },
  // ── Research & Digital Health ─────────────────────────────────
  {
    id: 'clinical-documentation',
    name: 'Ayurveda EHR & Digital Health Records',
    category: 'Research & Digital Health',
    aiiaModuleCode: 'AIIA-DH-101',
    description: 'Standardized Namaste Portal terminology, Ayush Grid coding, and clinical trial documentation.',
    demandLevel: 'High',
    nsqfLevel: 5,
    avgIndustryDemand: 7,
    relatedCareers: ['Clinical Ayurveda Practitioner', 'AYUSH Quality Officer', 'Integrative Researcher', 'Health Informatics Specialist'],
    assessmentType: 'MCQ',
    minimumEducation: 'BAMS (Any Year)',
  },
  {
    id: 'research-methodology',
    name: 'Integrative Clinical Trial Methodology',
    category: 'Research & Digital Health',
    aiiaModuleCode: 'AIIA-DH-301',
    description: 'GCP compliance, randomized controlled trials (RCT) design for herbal therapeutics, and bio-statistics.',
    demandLevel: 'Moderate',
    nsqfLevel: 7,
    avgIndustryDemand: 6,
    relatedCareers: ['Integrative Researcher', 'AYUSH Quality Officer', 'Clinical Research Associate', 'Academic Faculty'],
    assessmentType: 'Portfolio',
    minimumEducation: 'MD Ayurveda / MPH',
  },
  {
    id: 'clinical-research',
    name: 'Clinical Research & Evidence-Based Ayurveda',
    category: 'Research & Digital Health',
    aiiaModuleCode: 'AIIA-DH-401',
    description: 'Systematic literature reviews, meta-analysis of Ayurvedic interventions, CONSORT-TM reporting, and integration of classical knowledge with modern evidence frameworks.',
    demandLevel: 'Moderate',
    nsqfLevel: 7,
    avgIndustryDemand: 7,
    relatedCareers: ['Integrative Researcher', 'Clinical Research Associate', 'AYUSH Quality Officer', 'Academic Faculty'],
    assessmentType: 'Portfolio',
    minimumEducation: 'MD Ayurveda / MPH',
  },
  // ── Soft Skills ───────────────────────────────────────────────
  {
    id: 'patient-counseling',
    name: 'Holistic Patient Communication & Counseling',
    category: 'Soft Skills',
    aiiaModuleCode: 'AIIA-SS-101',
    description: 'Empathetic doctor-patient interaction, compliance counseling, and lifestyle modification guidance.',
    demandLevel: 'Very High',
    nsqfLevel: 5,
    avgIndustryDemand: 9,
    relatedCareers: ['Clinical Ayurveda Practitioner', 'Ayurvedic Diet Counselor', 'Panchakarma Specialist', 'Wellness Consultant'],
    assessmentType: 'Viva',
    minimumEducation: 'BAMS (Any Year)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CAREER ROLES TAXONOMY
// ─────────────────────────────────────────────────────────────────────────────

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];    // Skill IDs from AYUSH_SKILLS_TAXONOMY
  minNsqfLevel: number;
  avgSalaryRange: string;
  sector: string;
  demandsBy: string[];         // Organisations that typically hire this role
}

export const CAREER_ROLES_TAXONOMY: CareerRole[] = [
  {
    id: 'panchakarma-specialist',
    title: 'Panchakarma Specialist',
    description: 'Expert in all five Panchakarma Shodhana therapies, Purvakarma procedures, and post-procedure patient monitoring in hospital or wellness settings.',
    requiredSkills: ['panchakarma-therapy', 'nadi-pariksha', 'prakriti-evaluation', 'patient-counseling'],
    minNsqfLevel: 6,
    avgSalaryRange: '\u20b94.5 \u2013 \u20b99 LPA',
    sector: 'Hospital & Wellness',
    demandsBy: ['AIIA Hospital Wing', 'Kottakkal Arya Vaidya Sala', 'Ananda in the Himalayas', 'Patanjali Research Institute'],
  },
  {
    id: 'clinical-ayurveda-practitioner',
    title: 'Clinical Ayurveda Practitioner',
    description: 'Qualified BAMS/MD practitioner delivering evidence-based Ayurvedic care in OPD/IPD settings with NABH-compliant documentation and digital health record management.',
    requiredSkills: ['prakriti-evaluation', 'nadi-pariksha', 'clinical-documentation', 'nabh-protocols', 'patient-counseling'],
    minNsqfLevel: 6,
    avgSalaryRange: '\u20b95 \u2013 \u20b912 LPA',
    sector: 'AYUSH Clinical',
    demandsBy: ['Government AYUSH Hospitals', 'NABH-accredited Ayurveda Hospitals', 'Private Clinics', 'Integrative Health Centres'],
  },
  {
    id: 'ayush-quality-officer',
    title: 'AYUSH Quality Officer',
    description: 'Ensures GMP compliance, pharmacovigilance reporting, NABH Ayush standards, and regulatory submissions for herbal manufacturing units and hospital pharmacy wings.',
    requiredSkills: ['good-manufacturing-practices', 'pharmacovigilance', 'rasashastra-qa', 'nabh-protocols', 'clinical-documentation'],
    minNsqfLevel: 6,
    avgSalaryRange: '\u20b95.5 \u2013 \u20b911 LPA',
    sector: 'Pharma & Regulatory',
    demandsBy: ['Dabur Research Foundation', 'Himalaya Wellness', 'Charak Pharma', 'Emami Agrotech'],
  },
  {
    id: 'integrative-researcher',
    title: 'Integrative Researcher',
    description: 'Designs and conducts clinical trials integrating Ayurvedic interventions with modern biomarkers. Works on systematic reviews, RCT protocols, and WHO ICD-11 TM alignment.',
    requiredSkills: ['research-methodology', 'clinical-research', 'clinical-documentation', 'dravyaguna-identification'],
    minNsqfLevel: 7,
    avgSalaryRange: '\u20b96 \u2013 \u20b914 LPA',
    sector: 'Research & Academia',
    demandsBy: ['CSIR-CDRI', 'CCRAS', 'Ministry of Ayush', 'All India Institute of Ayurveda'],
  },
  {
    id: 'herbal-formulation-specialist',
    title: 'Herbal Formulation Specialist',
    description: 'Develops and standardizes classical and novel Ayurvedic formulations using HPLC, botanical authentication, and GMP-compliant production processes.',
    requiredSkills: ['ayurvedic-formulation', 'hplc-standardisation', 'botanical-fingerprinting', 'dravyaguna-identification', 'good-manufacturing-practices'],
    minNsqfLevel: 6,
    avgSalaryRange: '\u20b95 \u2013 \u20b913 LPA',
    sector: 'Pharma R&D',
    demandsBy: ['Dabur Research Foundation', 'Patanjali R&D Centre', 'Himalaya Drug Company', 'Sami-Sabinsa Group'],
  },
  {
    id: 'ayurvedic-diet-counselor',
    title: 'Ayurvedic Diet & Lifestyle Counselor',
    description: 'Provides Prakriti-based personalized diet and lifestyle prescriptions for chronic disease management, wellness tourism, and corporate wellness programs.',
    requiredSkills: ['ahara-poshan', 'prakriti-evaluation', 'yoga-therapy', 'patient-counseling'],
    minNsqfLevel: 5,
    avgSalaryRange: '\u20b93.5 \u2013 \u20b98 LPA',
    sector: 'Wellness & Nutrition',
    demandsBy: ['Luxury Wellness Resorts', 'Corporate Wellness Platforms', 'Telemedicine Startups', 'Ayurvedic Lifestyle Apps'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HSSC QUALIFICATION PACKS
// ─────────────────────────────────────────────────────────────────────────────

export interface HsscQualificationPack {
  qpCode: string;
  title: string;
  sector: string;
  nsqfLevel: number;
  duration: string;
  creditHours: number;
  eligibility: string;
  skills: string[];   // Skill IDs from AYUSH_SKILLS_TAXONOMY
}

export const HSSC_QUALIFICATION_PACKS: HsscQualificationPack[] = [
  {
    qpCode: 'HSS/Q3601',
    title: 'Panchakarma Technician',
    sector: 'Healthcare & Life Sciences',
    nsqfLevel: 6,
    duration: '6 Months',
    creditHours: 480,
    eligibility: 'BAMS 3rd Year or above / Diploma in Ayurveda',
    skills: ['panchakarma-therapy', 'prakriti-evaluation', 'patient-counseling'],
  },
  {
    qpCode: 'HSS/Q3702',
    title: 'Medicinal Plant Processing & Identification Technician',
    sector: 'Pharmaceuticals & Life Sciences',
    nsqfLevel: 5,
    duration: '3 Months',
    creditHours: 240,
    eligibility: '12th Science / Diploma in Botany or Pharmacy',
    skills: ['dravyaguna-identification', 'botanical-fingerprinting'],
  },
  {
    qpCode: 'HSS/Q3901',
    title: 'Ayurveda Pharmacy & QA Assistant',
    sector: 'Pharmaceuticals & Life Sciences',
    nsqfLevel: 6,
    duration: '6 Months',
    creditHours: 400,
    eligibility: 'BAMS / B.Pharm (Ayurveda)',
    skills: ['rasashastra-qa', 'good-manufacturing-practices', 'ayurvedic-formulation'],
  },
  {
    qpCode: 'HSS/Q3801',
    title: 'Ayurveda Ahara Sahayak (Diet Support Worker)',
    sector: 'Healthcare & Wellness',
    nsqfLevel: 5,
    duration: '3 Months',
    creditHours: 200,
    eligibility: '12th Science / Basic knowledge of Ayurveda',
    skills: ['ahara-poshan', 'prakriti-evaluation'],
  },
  {
    qpCode: 'HSS/Q4001',
    title: 'Yoga Wellness Trainer',
    sector: 'Healthcare & Life Sciences',
    nsqfLevel: 5,
    duration: '4 Months',
    creditHours: 320,
    eligibility: 'Yoga Diploma / BAMS (Any Year)',
    skills: ['yoga-therapy', 'patient-counseling', 'prakriti-evaluation'],
  },
  {
    qpCode: 'HSS/Q4201',
    title: 'AYUSH Hospital Quality & Compliance Technician',
    sector: 'Health Systems & Policy',
    nsqfLevel: 6,
    duration: '4 Months',
    creditHours: 350,
    eligibility: 'BAMS / MD Ayurveda / B.Pharm (Ayurveda)',
    skills: ['nabh-protocols', 'good-manufacturing-practices', 'pharmacovigilance', 'clinical-documentation'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPETENCY FRAMEWORK
// ─────────────────────────────────────────────────────────────────────────────

export const COMPETENCY_FRAMEWORK = {
  nsqfDescriptors: {
    1: { level: 1, label: 'Foundation', description: 'Basic Ayurvedic terminology, general awareness of herbal and clinical practices.', typical: 'School leavers, entry-level helpers' },
    2: { level: 2, label: 'Basic Operative', description: 'Can follow simple SOPs, observe clinical procedures under close supervision.', typical: 'Yoga assistants, pharmacy helpers' },
    3: { level: 3, label: 'Semi-Skilled Operative', description: 'Performs routine clinical or manufacturing tasks with minimal supervision.', typical: 'Diploma holders, nursing assistants' },
    4: { level: 4, label: 'Skilled Worker', description: 'Independently executes AYUSH clinical procedures, formulations, or diagnostic assessments.', typical: 'BAMS Interns, Panchakarma technicians, QC analysts' },
    5: { level: 5, label: 'Supervisory Technician', description: 'Supervises teams, trains juniors, and adapts Ayurvedic protocols to patient-specific needs.', typical: 'Senior BAMS graduates, Wellness supervisors' },
  },
  domainWeights: {
    'AYUSH Clinical': 0.30,
    'Panchakarma': 0.20,
    'Pharma & Rasashastra': 0.20,
    'Diet & Nutrition': 0.10,
    'Yoga Therapy': 0.08,
    'Research & Digital Health': 0.07,
    'Soft Skills': 0.05,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFICIENCY LEVELS (preserved from original)
// ─────────────────────────────────────────────────────────────────────────────

export const PROFICIENCY_LEVELS = [
  { level: 1, label: 'Beginner / Theoretical Knowledge' },
  { level: 2, label: 'Elementary / Supervised Practice' },
  { level: 3, label: 'Intermediate / Independent Competence' },
  { level: 4, label: 'Advanced / Industry-Ready' },
  { level: 5, label: 'Expert / Research & Mentorship Level' },
];
