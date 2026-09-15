import { NextRequest, NextResponse } from 'next/server';

/**
 * Hardcoded MCQ question bank for AYUSH skill assessments.
 * Each question has 4 options, a correct index (0-based), and a clinical explanation.
 * Scores per question when answered: correctIndex → 4, others → 0 (mapped by client).
 */
interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTION_BANK: Record<string, QuizQuestion[]> = {
  'panchakarma-therapy': [
    {
      id: 'pk-1',
      questionText:
        'In Purvakarma, what is the primary clinical endpoint indicator confirming completion of Snehana (internal oleation) before Vamana?',
      options: [
        'Appearance of unctuous stool (Snigdha Purisha) and Vatanulomana',
        'Increase in body weight by 2 kg over 3 days',
        'Total cessation of thirst and hunger sensations',
        'Elevated systolic blood pressure above 140 mmHg',
      ],
      correctIndex: 0,
      explanation:
        'Samyak Snigdha Lakshanas include Vatanulomana, Deeptagni, Snigdha Varcha, and Asamhatatva of stool according to Charaka Samhita Sutrasthana Ch. 13. These classical signs confirm adequate oleation before shodhana karmas.',
    },
    {
      id: 'pk-2',
      questionText:
        'Which classical formulation is the standard Niruha Basti base decoction for Vata disorders according to Charaka Samhita?',
      options: [
        'Dashamula Kwatha combined with Saindhava Lavana, Honey, and oil',
        'Triphala Kwatha with Guggulu and Shilajit',
        'Panchatikta Ghrita with Haridra and Nimba',
        'Mahamanjisthadi Kwatha with Neem leaf powder',
      ],
      correctIndex: 0,
      explanation:
        'Classical Niruha Basti contains Dashamula decoction (Panchamula group of roots) as base, combined with Saindhava Lavana, Madhu (honey), Sneha (oil/ghee), and Kalka (fine herbal paste). This composition provides Vata-pacifying, deepana, and anulomana properties.',
    },
    {
      id: 'pk-3',
      questionText:
        'What is the correct sequence of Samsarjana Krama (post-Virechana dietary rehabilitation) as per classical protocol?',
      options: [
        'Peya → Vilepi → Akrita Yusha → Krita Yusha → Akrita Mamsa rasa → Krita Mamsa rasa → normal diet',
        'Normal diet from Day 1 with no restrictions required',
        'Milk alone for 7 days followed by solid food',
        'Raw fruits and salads immediately after purification',
      ],
      correctIndex: 0,
      explanation:
        'Samsarjana Krama is a structured 3–7 day graduated diet protocol post-Shodhana. It begins with Peya (thin rice gruel), progresses to Vilepi (thick gruel), then Yusha (lentil soup), and finally meat broths before resuming normal diet. This prevents Agni damage after purification.',
    },
    {
      id: 'pk-4',
      questionText:
        'In which disease condition is Nasya (nasal drug administration) considered the most appropriate primary Panchakarma intervention according to Ashtanga Hridayam?',
      options: [
        'Urdhwajatrugata Rogas (diseases above the clavicle — ENT, neurological)',
        'Adho Jatrugata Rogas (diseases below the waist — rectal, genital)',
        'Madyama Sharira Rogas (thoracic and abdominal disorders)',
        'Twak Vikaras (skin diseases affecting the limbs)',
      ],
      correctIndex: 0,
      explanation:
        'Nasya is specifically indicated for Urdhwajatrugata Rogas (diseases originating above the clavicle). The nasal route allows direct drug delivery to Shringataka Marma (central sinus plexus), which distributes therapeutic effects to all sensory organs and the brain.',
    },
    {
      id: 'pk-5',
      questionText:
        'What is the medically accepted contraindication (Nirvapachara) for Raktamokshana via Jalaukavacharana (leech therapy)?',
      options: [
        'Anemia (Pandu Roga), pregnancy, and immunocompromised states',
        'Obesity and high cholesterol levels',
        'Strong digestion (Tikshna Agni) and athletic body type',
        'Seasonal preference for Vasanta Ritu (Spring)',
      ],
      correctIndex: 0,
      explanation:
        'Jalaukavacharana (leech therapy) is contraindicated in patients with Pandu (anemia/low hemoglobin), pregnant women, immunodeficient patients, and those on anticoagulant therapy, as it involves controlled blood removal which can be harmful in these states.',
    },
  ],

  'nadi-pariksha': [
    {
      id: 'np-1',
      questionText:
        'During Nadi Pariksha, which finger positioned at the radial artery primarily assesses Pitta Dosha rhythm and movement (Gati)?',
      options: [
        'Index finger — Vata (Sarpa/Snake gait)',
        'Middle finger — Pitta (Manduka/Frog gait)',
        'Ring finger — Kapha (Hamsa/Swan gait)',
        'Little finger — Ojas assessment',
      ],
      correctIndex: 1,
      explanation:
        'The three-finger Nadi Pariksha placement: Index finger (Vata — serpentine Sarpa Gati), Middle finger (Pitta — jumping Manduka Gati), Ring finger (Kapha — graceful Hamsa Gati). The middle finger below the radial styloid captures Pitta pulsation — rapid, bounding, and jumping like a frog.',
    },
    {
      id: 'np-2',
      questionText:
        'What is the classical description of Vata Nadi Gati (Vata pulse character) in Nadi Pariksha?',
      options: [
        'Thin, cold, irregular, moves like a serpent (Sarpa Gati) — felt under index finger',
        'Slow, heavy, cool, and rhythmic like a swan gliding on water',
        'Rapid, hot, bounding, and jumping like a frog under the middle finger',
        'Deep, steady, and wiry like a taut bowstring',
      ],
      correctIndex: 0,
      explanation:
        'Vata Nadi is described as thin (Sukshma), cold (Sheeta), irregular (Vishama), and moves in a serpentine pattern (Sarpa Gati) felt prominently under the index finger. It indicates dominance of Vata Dosha in the individual\'s constitution or pathological state.',
    },
    {
      id: 'np-3',
      questionText:
        'At which time of day is Nadi Pariksha classically recommended to be performed for most accurate Dosha assessment?',
      options: [
        'Early morning (Brahmi Muhurta) before any food, exercise, or sun exposure',
        'Immediately after a full meal for maximum Agni assessment',
        'Late afternoon during peak Pitta period (2 PM – 4 PM)',
        'During exercise or physical exertion for dynamic Vata reading',
      ],
      correctIndex: 0,
      explanation:
        'Nadi Pariksha is most accurate in Brahmi Muhurta (dawn, approximately 4:30–6:00 AM) when the body is in its natural, undisturbed state before food, physical activity, or sun exposure alter the Dosha-pulse relationship. This timing eliminates confounding variables.',
    },
    {
      id: 'np-4',
      questionText:
        'In classical Nadi Vigyana, which Nadi (pulse pattern) indicates a Tridoshic vitiation with poor prognosis (Arishta Nadi)?',
      options: [
        'A pulse that is intermittent, feeble, trembling, and disappears momentarily (Nirdaya/Kaka Gati)',
        'A strong, bounding pulse felt equally under all three fingers simultaneously',
        'A rapid but regular pulse in a young and healthy individual',
        'A slightly slower than normal pulse in the elderly during winter',
      ],
      correctIndex: 0,
      explanation:
        'Arishta Nadi (pulse of poor prognosis) includes patterns like Kaka Gati (crow-like, erratic), Matsya Gati (fish-like, gasping), and Mesha Gati (ram-like, butting) — characterized by irregularity, trembling, intermittence, and weakness, indicating severe Tridosha vitiation.',
    },
    {
      id: 'np-5',
      questionText:
        'Which clinical condition would a Kapha-dominant Nadi with Hamsa Gati (swan-like pulse) most likely indicate when found in excess?',
      options: [
        'Sthoulya (obesity), Prameha (diabetes), Shwasa (respiratory disorders), Aruchi',
        'Vata-dominant neurological disorders like tremors and anxiety',
        'Pitta-dominant inflammatory conditions like fever and gastritis',
        'Balanced Tridoshic health with strong immunity',
      ],
      correctIndex: 0,
      explanation:
        'Excessive Kapha Nadi (Hamsa Gati — slow, cool, heavy, gliding like a swan) indicates Kapha vitiation pathologies: Sthoulya (obesity), Prameha (metabolic/diabetic conditions), Kaphaja Shwasa (mucus-predominant respiratory issues), and Aruchi (loss of taste and appetite).',
    },
  ],

  'rasashastra-qa': [
    {
      id: 'rq-1',
      questionText:
        'Which combined test confirms the non-metallic, micro-fine nature of a genuine Ayurvedic Bhasma according to classical Bhasma Pariksha?',
      options: [
        'Rekhapurnatva (enters fingerprint ridges) and Varitaratva (floats on water surface)',
        'Boiling at 200°C without color change for 30 minutes',
        'Total dissolution in concentrated nitric acid without residue',
        'Strong magnetic attraction indicating metallic nano-particles',
      ],
      correctIndex: 0,
      explanation:
        'Classical Bhasma Parikshas include: Varitaratva (floats on still water surface due to ultra-fine particle surface tension), Rekhapurnatva (fills finger ridges when rubbed), Unama (color, smell, taste conform to standard), Apunarbhava (does not revert to metallic form on heat with Mitra Panchaka). These prove micronization below colloidal threshold.',
    },
    {
      id: 'rq-2',
      questionText:
        'What is the permissible limit for Lead (Pb) in Ayurvedic heavy metal Bhasma formulations as per Ayurvedic Formulary of India (AFI) and PLIM guidelines?',
      options: [
        '≤ 10.0 ppm (parts per million) by atomic absorption spectrometry (AAS)',
        '≤ 100 ppm — same as international food safety standards',
        'No specific limit — Bhasma lead is non-toxic after shodhana',
        '≤ 0.01 ppm — stricter than WHO limits for drinking water',
      ],
      correctIndex: 0,
      explanation:
        'The AFI (Ayurvedic Formulary of India) and PLIM (Pharmacopoeial Laboratory for Indian Medicine) mandate: Lead (Pb) ≤ 10 ppm, Arsenic (As) ≤ 3 ppm, Cadmium (Cd) ≤ 0.3 ppm, Mercury (Hg) ≤ 1 ppm. Testing is by AAS (Atomic Absorption Spectrometry) or ICP-MS (Inductively Coupled Plasma Mass Spectrometry).',
    },
    {
      id: 'rq-3',
      questionText:
        'What is the total number of Puta (heat treatment cycles) classically required in the preparation of Lauha Bhasma (Iron Calcination)?',
      options: [
        '100 Putas (Shataputa Lauha) for maximum therapeutic potency and Apunarbhava quality',
        '3 Putas sufficient for clinical application',
        '1 single incineration at 900°C in electric furnace',
        '21 Putas — same as Ksharasutra preparation',
      ],
      correctIndex: 0,
      explanation:
        'Shataputa Lauha Bhasma undergoes 100 heating cycles (Putas) in traditional earthen crucibles. Each Puta progressively reduces particle size and transforms the crystalline iron structure. The repetitive calcination-quenching process achieves the Apunarbhava quality (inability to return to metallic form).',
    },
    {
      id: 'rq-4',
      questionText:
        'Which chromatographic technique is the gold standard for TLC/HPTLC phytochemical fingerprinting of Ayurvedic raw material authentication?',
      options: [
        'High Performance Thin Layer Chromatography (HPTLC) with Rf values at 254 nm and 366 nm UV',
        'Gas Chromatography-Mass Spectrometry (GC-MS) for all herb types',
        'Nuclear Magnetic Resonance (NMR) spectroscopy for field testing',
        'Simple paper chromatography with visible light scanning',
      ],
      correctIndex: 0,
      explanation:
        'HPTLC (High Performance Thin Layer Chromatography) is the standard for Ayurvedic herb authentication. Rf (retardation factor) values of active phytochemical markers are compared at 254 nm and 366 nm UV light against authenticated reference standards, as mandated by the Ayurvedic Pharmacopoeia of India (API).',
    },
    {
      id: 'rq-5',
      questionText:
        'In Shodhana (purification) of Parada (Mercury) for Rasashastra formulations, what is the classical Kajjali preparation step?',
      options: [
        'Trituration of purified Parada with Shuddha Gandhaka (purified sulphur) until Kajjali (black sulphide) forms with no metallic mercury visible',
        'Heating Parada alone at 400°C until it vaporizes and re-condenses',
        'Dissolving Parada in hydrochloric acid and then neutralizing with alkali',
        'Mixing Parada with Trikatu churna and drying in sunlight',
      ],
      correctIndex: 0,
      explanation:
        'Kajjali (Black Sulphide of Mercury — HgS) is prepared by triturating (grinding) Shuddha Parada (purified mercury) with Shuddha Gandhaka (purified sulphur) in a 1:1 ratio until all metallic mercury is chemically converted and no separate mercury globules remain visible — confirmed by the Anjana Sannibha test.',
    },
  ],

  'dravyaguna-identification': [
    {
      id: 'dg-1',
      questionText:
        'Which microscopic cellular feature is pathognomonic (diagnostic) for identifying Zingiber officinale (Shunthi/Ginger) rhizome in raw drug examination?',
      options: [
        'Parenchymatous cells with yellowish oleoresin globules and starch grains with central hilum',
        'Rosette calcium oxalate crystals arranged in a radial pattern',
        'Unicellular thick-walled trichomes with warty surface',
        'Cork cells with suberin lamellae and no starch grains',
      ],
      correctIndex: 0,
      explanation:
        'Shunthi (Zingiber officinale) rhizome shows parenchyma cells containing characteristic yellowish oleoresin globules (responsible for spicy aroma — gingerols and shogaols) and starch grains with a distinctive central (concentric) hilum pattern under microscopy.',
    },
    {
      id: 'dg-2',
      questionText:
        'According to Ayurvedic Pharmacopoeia of India (API), which physicochemical test determines siliceous earth contamination in herbal raw drugs?',
      options: [
        'Acid Insoluble Ash (AIA) value — residue after HCl treatment of total ash',
        'Water Soluble Extractive value — determines alcohol-soluble actives',
        'Loss on Drying (LOD) — measures moisture content at 105°C',
        'Swelling Index — measures water absorption capacity',
      ],
      correctIndex: 0,
      explanation:
        'Acid Insoluble Ash (AIA) is the residue remaining after treating the total ash with dilute hydrochloric acid. It represents siliceous earth (sand, soil) and inorganic impurities. API mandates specific AIA limits for each raw drug to detect adulteration with sand or silica.',
    },
    {
      id: 'dg-3',
      questionText:
        'Which active phytochemical marker is quantified by HPLC for quality standardization of Withania somnifera (Ashwagandha) root powder per API?',
      options: [
        'Withanolides (particularly Withaferin-A) — measured as total withanolide content ≥ 0.3%',
        'Curcuminoids — the same as used for Haridra (turmeric) standardization',
        'Piperine — the active alkaloid common to all Solanaceae plants',
        'Azadirachtin — the primary active in all bitter AYUSH herbs',
      ],
      correctIndex: 0,
      explanation:
        'Withania somnifera (Ashwagandha) is standardized by its Withanolide content (steroidal lactones, primarily Withaferin-A) using HPLC. The API specification requires ≥ 0.3% total withanolides. These compounds are responsible for adaptogenic, immunomodulatory, and anti-stress activities.',
    },
    {
      id: 'dg-4',
      questionText:
        'What is the classical Ayurvedic method for confirming the purity of Shilajit (Asphaltum purificatum) before therapeutic use?',
      options: [
        'It dissolves completely in warm water without residue and soft consistency at room temperature but hard when cold',
        'It sinks immediately in water and does not dissolve even when boiled',
        'It produces a burning flame when ignited like camphor',
        'It forms metallic deposits when mixed with mineral acids',
      ],
      correctIndex: 0,
      explanation:
        'Authentic Shuddha Shilajit dissolves completely in warm water forming a dark brownish-black solution (no insoluble residue), is soft and moldable at room temperature but becomes brittle when cold, and has a characteristic petrochemical odor. These are classical Shilajit Pariksha (purity tests) per classical and modern pharmacopoeial standards.',
    },
    {
      id: 'dg-5',
      questionText:
        'Which type of calcium oxalate crystal arrangement is characteristic of Emblica officinalis (Amalaki) fruit tissue under microscopy?',
      options: [
        'Cluster crystals (Druses/Rosette) of calcium oxalate in parenchyma cells',
        'Prismatic crystals arranged in a linear palisade pattern',
        'Sandy/microspicular crystals uniformly distributed throughout mesophyll',
        'Styloid crystals in elongated idioblast cells',
      ],
      correctIndex: 0,
      explanation:
        'Emblica officinalis (Amalaki) fruit tissue characteristically shows rosette (druse) cluster crystals of calcium oxalate in parenchyma cells. These stellate rosette crystals are a key microscopic identification feature in pharmacognostical authentication of Amalaki raw drug.',
    },
  ],
};

/**
 * Generic fallback questions for unrecognized skill IDs.
 * Covers general AYUSH competency baseline.
 */
const GENERIC_QUESTIONS: QuizQuestion[] = [
  {
    id: 'gen-1',
    questionText:
      'What does AYUSH stand for in the context of India\'s traditional medicine systems?',
    options: [
      'Ayurveda, Yoga & Naturopathy, Unani, Siddha, Homeopathy',
      'Ayurveda, Yoga, Unani, Surgery, Homeopathy',
      'Allopathy, Yoga, Unani, Siddha, Herbalism',
      'Ayurveda, Yogic Health, Unani, Siddha, Herbal',
    ],
    correctIndex: 0,
    explanation:
      'AYUSH is an acronym for the six Indian traditional medicine systems formally recognized and regulated by the Ministry of AYUSH, Government of India: Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy.',
  },
  {
    id: 'gen-2',
    questionText:
      'Which national regulatory body governs quality standards for Ayurvedic formulations and raw drugs in India?',
    options: [
      'Pharmacopoeia Commission for Indian Medicine & Homeopathy (PCIM&H), Ministry of AYUSH',
      'Food Safety and Standards Authority of India (FSSAI)',
      'Central Drugs Standard Control Organization (CDSCO)',
      'Bureau of Indian Standards (BIS)',
    ],
    correctIndex: 0,
    explanation:
      'The Pharmacopoeia Commission for Indian Medicine & Homeopathy (PCIM&H), functioning under the Ministry of AYUSH, publishes the Ayurvedic Pharmacopoeia of India (API), Unani Pharmacopoeia, and Siddha Pharmacopoeia, establishing binding quality standards for traditional medicine formulations.',
  },
  {
    id: 'gen-3',
    questionText:
      'What is the National Skill Qualification Framework (NSQF) level assigned to qualified Panchakarma Technicians under the Healthcare Sector Skill Council (HSSC)?',
    options: [
      'NSQF Level 4 (HSS/Q3601) with structured clinical practicum mandate',
      'NSQF Level 2 — basic entry level with no practical requirement',
      'NSQF Level 7 — same as post-graduate clinical researchers',
      'NSQF Level 6 — equivalent to engineering diploma holders',
    ],
    correctIndex: 0,
    explanation:
      'The Healthcare Sector Skill Council (HSSC) assigns NSQF Level 4 to the Panchakarma Technician qualification pack (HSS/Q3601). This requires structured supervised clinical practicum, assessment in all five Panchakarma procedures, and theoretical grounding in Purvakarma and Paschatkarma protocols.',
  },
  {
    id: 'gen-4',
    questionText:
      'What does the NAMASTE portal (National Ayush Morbidity And Standardized Terminologies Electronic) primarily enable?',
    options: [
      'Standardized AYUSH clinical diagnosis coding mapped to WHO ICD-11 Traditional Medicine Module for EHR interoperability',
      'Online booking of Panchakarma spa appointments at wellness resorts',
      'Certification of Ayurvedic product advertisements for television',
      'Digital enrollment of BAMS students in academic institutions',
    ],
    correctIndex: 0,
    explanation:
      'The NAMASTE portal, developed by the Ministry of AYUSH and CDAC, standardizes Ayurvedic clinical diagnostic terminology and maps it to WHO ICD-11 Traditional Medicine Module 2 codes, enabling seamless electronic health record (EHR) integration and insurance billing across national and international healthcare systems.',
  },
  {
    id: 'gen-5',
    questionText:
      'Which traditional Ayurvedic concept forms the foundational framework for personalized medicine (Precision Medicine) in Ayurveda?',
    options: [
      'Prakriti (individual constitutional type based on Dosha dominance at conception)',
      'Agni (digestive fire strength measured by metabolic rate)',
      'Ojas (vital essence determined by immune function)',
      'Prana (life force assessed by respiratory capacity)',
    ],
    correctIndex: 0,
    explanation:
      'Prakriti (Sanskrit: प्रकृति) refers to an individual\'s inherent physical and psychological constitution determined at conception by the relative proportions of Vata, Pitta, and Kapha Doshas. It forms the Ayurvedic foundation for personalized treatment, dietary recommendations, and lifestyle modifications — analogous to modern genomics-based precision medicine.',
  },
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/ai/quiz?skillId=panchakarma-therapy&difficulty=intermediate
 * Returns 5 MCQ questions for a given AYUSH skill.
 * Falls back to generic AYUSH questions if skillId is not in the bank.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get('skillId') ?? '';
    const difficulty = searchParams.get('difficulty') ?? 'intermediate';

    const questions: QuizQuestion[] = QUESTION_BANK[skillId] ?? GENERIC_QUESTIONS;

    return NextResponse.json(
      {
        success: true,
        skillId: skillId || 'general-ayush',
        difficulty,
        totalQuestions: questions.length,
        questions,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('[/api/ai/quiz] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
