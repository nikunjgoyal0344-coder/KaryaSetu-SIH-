export interface SkillTaxonomyItem {
  id: string;
  name: string;
  category: 'AYUSH Clinical' | 'Panchakarma' | 'Pharma & Rasashastra' | 'Diet & Nutrition' | 'Yoga Therapy' | 'Research & Digital Health' | 'Soft Skills';
  hsscQpCode?: string; // Healthcare Sector Skill Council Qualification Pack Code
  description: string;
  demandLevel: 'High' | 'Very High' | 'Moderate';
}

export const AYUSH_SKILLS_TAXONOMY: SkillTaxonomyItem[] = [
  {
    id: 'panchakarma-therapy',
    name: 'Panchakarma Therapy Procedures',
    category: 'Panchakarma',
    hsscQpCode: 'HSS/Q3601 (Panchakarma Technician)',
    description: 'Practical administration of Vamana, Virechana, Basti, Nasya, and Raktamokshana protocols.',
    demandLevel: 'Very High',
  },
  {
    id: 'nadi-pariksha',
    name: 'Nadi Pariksha (Pulse Diagnosis)',
    category: 'AYUSH Clinical',
    description: 'Traditional Ayurvedic pulse diagnosis for Dosha imbalance assessment.',
    demandLevel: 'Very High',
  },
  {
    id: 'dravyaguna-identification',
    name: 'Dravyaguna Herb Identification & Standardization',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q3702 (Medicinal Plant Processing)',
    description: 'Pharmacognostical identification, purity verification, and botanical taxonomy of medicinal herbs.',
    demandLevel: 'High',
  },
  {
    id: 'ahara-poshan',
    name: 'Ayurvedic Dietetics (Ahara & Poshan)',
    category: 'Diet & Nutrition',
    hsscQpCode: 'HSS/Q3801 (Ayurveda Ahara Sahayak)',
    description: 'Personalized dietary regimen planning based on Prakriti, Agni, and seasonal Ritus.',
    demandLevel: 'Very High',
  },
  {
    id: 'prakriti-evaluation',
    name: 'Prakriti & Agni Assessment',
    category: 'AYUSH Clinical',
    description: 'Comprehensive physical, psychological, and physiological constitution analysis.',
    demandLevel: 'High',
  },
  {
    id: 'clinical-documentation',
    name: 'Ayurveda EHR & Digital Health Records',
    category: 'Research & Digital Health',
    description: 'Standardized Namaste Portal terminology, Ayush Grid coding, and clinical trial documentation.',
    demandLevel: 'High',
  },
  {
    id: 'rasashastra-qa',
    name: 'Rasashastra & Formulation QA',
    category: 'Pharma & Rasashastra',
    hsscQpCode: 'HSS/Q3901 (Ayurveda Pharmacy Assistant)',
    description: 'Quality control, heavy metal testing, and Bhasma standardization conforming to Ayurvedic Pharmacopoeia.',
    demandLevel: 'High',
  },
  {
    id: 'yoga-therapy',
    name: 'Therapeutic Yoga & Pranayama Protocols',
    category: 'Yoga Therapy',
    hsscQpCode: 'HSS/Q4001 (Yoga Wellness Trainer)',
    description: 'Application of Asana, Pranayama, and Shatkriya for chronic metabolic and musculoskeletal disorders.',
    demandLevel: 'Very High',
  },
  {
    id: 'patient-counseling',
    name: 'Holistic Patient Communication & Counseling',
    category: 'Soft Skills',
    description: 'Empathetic doctor-patient interaction, compliance counseling, and lifestyle modification guidance.',
    demandLevel: 'Very High',
  },
  {
    id: 'research-methodology',
    name: 'Integrative Clinical Trial Methodology',
    category: 'Research & Digital Health',
    description: 'GCP compliance, randomized controlled trials (RCT) design for herbal therapeutics, and bio-statistics.',
    demandLevel: 'Moderate',
  }
];

export const PROFICIENCY_LEVELS = [
  { level: 1, label: 'Beginner / Theoretical Knowledge' },
  { level: 2, label: 'Elementary / Supervised Practice' },
  { level: 3, label: 'Intermediate / Independent Competence' },
  { level: 4, label: 'Advanced / Industry-Ready' },
  { level: 5, label: 'Expert / Research & Mentorship Level' },
];
