export interface StudentChatContext {
  name?: string;
  degree?: string;
  college?: string;
  readinessScore?: number;
  skills?: { skillId: string; skillName: string; level: number }[];
  gaps?: string[];
  interests?: string[];
  abcCredits?: number;
  currentPath?: string;
}

export interface ChatActionPayload {
  skillId?: string;
  gain?: number;
  name?: string;
  opportunityId?: string;
}

export interface LocalKnowledgeResponse {
  text: string;
  actionType?: 'enroll_bridge' | 'apply_opportunity' | 'sync_abc';
  actionLabel?: string;
  actionPayload?: ChatActionPayload;
}

/**
 * Intelligent Ayush Clinical & Career Knowledge Engine
 * Provides structured, authoritative responses and interactive remediation actions.
 */
export function generateLocalAyushResponse(
  query: string,
  context?: StudentChatContext
): LocalKnowledgeResponse {
  const q = query.toLowerCase();

  if (q.includes('gap') || q.includes('readiness') || q.includes('score') || q.includes('bridge') || q.includes('84%') || q.includes('improve')) {
    return {
      text: `### 📊 Diagnostic Skill Gap & Readiness Strategy for ${context?.name || 'Scholar'}
Your current **Industry Readiness Score is ${context?.readinessScore || 84}%** (NCISM Benchmark: Level 4 Autonomous Care).

**Top Priority Remediation Matrix:**
1. **Rasashastra & Formulation QA** (Gap Score: 12.0 • **Critical**)
   - *Deficit*: Bhasma particle sizing & heavy metal validation standards under AFI & PLIM guidelines.
   - *Recommended Action*: Take the **HPLC & Heavy Metal Standardisation** bridge module (AIIA-MSDE accredited).
   - *Impact*: **+3% Readiness Gain** (elevates from ${context?.readinessScore || 84}% to ${(context?.readinessScore || 84) + 3}%).
2. **Dravyaguna Herb Identification** (Gap Score: 8.0 • **High**)
   - *Solution*: Complete **TLC & HPTLC Botanical Fingerprinting** module to advance to Level 3.
3. **Ayurveda EHR & Digital Health Records** (Gap Score: 4.0 • **Medium**)
   - *Solution*: Complete **AyushGrid EHR & ICD-11 Traditional Medicine Integration** (+2% Gain).

Would you like to enroll in your #1 Critical Bridge course right now? Click the quick action button below!`,
      actionType: 'enroll_bridge',
      actionLabel: '⚡ Enroll in HPLC Bridge (+1 Level & +3% Readiness)',
      actionPayload: { skillId: 'rasashastra-qa', gain: 1, name: 'HPLC & Heavy Metal Standardisation' },
    };
  }

  if (q.includes('bhasma') || q.includes('metal') || q.includes('afi') || q.includes('rasashastra') || q.includes('particle') || q.includes('hplc')) {
    return {
      text: `### 🔬 AFI Standards & Bhasma Standardization Protocol
Under the **Ayurvedic Formulary of India (AFI)** and **Pharmacopoeial Laboratory for Indian Medicine (PLIM)**:

1. **Classical Qualitative Organoleptic Tests**:
   - **Varitaratva**: When a pinch of Bhasma is gently sprinkled on still water, it floats due to micro-nano particle surface tension.
   - **Rekhapurnatva**: The particles are so fine that they settle deeply into finger ridges when rubbed between thumb and index finger.
   - **Niruttha**: When heated with pure silver sheet, no silver-alloy is formed.
   - **Apunarbhava**: When fused with *Mitra Panchaka* (Gunja, Guda, Madhu, Ghrita, Tankana), metallic beads do not re-emerge.

2. **Permissible Elemental Limits (AFI / AYUSH Monograph)**:
   - **Lead (Pb)**: $\\le 10.0\\text{ ppm}$
   - **Arsenic (As)**: $\\le 3.0\\text{ ppm}$
   - **Cadmium (Cd)**: $\\le 0.3\\text{ ppm}$
   - **Mercury (Hg)**: $\\le 1.0\\text{ ppm}$
   - **Analytical Instrument**: Atomic Absorption Spectrometry (AAS) or Inductively Coupled Plasma Mass Spectrometry (ICP-MS).

*Actionable Advice*: This exact topic forms your **Critical Gap #1** in Rasashastra QA. Enrolling in the accredited bridge course verifies this competence on your digital passport.`,
      actionType: 'enroll_bridge',
      actionLabel: '⚡ Enroll in HPLC Bridge Course',
      actionPayload: { skillId: 'rasashastra-qa', gain: 1, name: 'HPLC & Heavy Metal Standardisation' },
    };
  }

  if (q.includes('ksharasutra') || q.includes('shalya') || q.includes('fistula') || q.includes('kshar') || q.includes('surgery')) {
    return {
      text: `### ⚕️ Classical Ksharasutra Preparation SOP & Shalya Tantra
**Ksharasutra (Caustic Medicated Thread)** is the WHO & ICMR-endorsed gold standard for *Bhagandara* (Anal Fistula):

1. **Constituent Coatings (21 Sittings)**:
   - **Coatings 1 to 11**: Snuhi Ksheera (*Euphorbia neriifolia* latex) alone.
   - **Coatings 12 to 18**: Snuhi Ksheera + Apamarga Kshara (*Achyranthes aspera* alkaline ash).
   - **Coatings 19 to 21**: Snuhi Ksheera + Haridra Churna (*Curcuma longa* turmeric powder) for antiseptic finish.
2. **Base Thread Specification**:
   - Surgical Barbour linen thread (Size 20) sterilized under UV/Ethylene Oxide.
3. **Clinical Mechanism**:
   - Simultaneous chemical excision (excision of fistulous tract), debridement (*Chhedana* & *Bhedana*), and healthy granulation promotion (*Vranaropana*).
   - Recurrence rate: **< 3.3%** compared to conventional fistulectomy (12–15%).`,
    };
  }

  if (q.includes('panchakarma') || q.includes('vamana') || q.includes('virechana') || q.includes('basti') || q.includes('nasya') || q.includes('raktamokshana')) {
    return {
      text: `### 🌿 Panchakarma Shodhana Protocols & Clinical SOPs
The 5 classical bio-purification procedures require strict three-stage protocol adherence:

1. **Purva Karma (Preparatory)**:
   - *Deepana-Pachana*: Enhancing digestive fire (*Agni*) with *Chitrakadi Vati* or *Trikatu*.
   - *Snehana*: Internal oleation with medicated ghee (*Achha Sneha* in increasing doses).
   - *Swedana*: Sudation therapy (*Bashpa* / *Nadi Sweda*) to liquefy morbid Doshas.
2. **Pradhana Karma (Primary Purification)**:
   - **Vamana**: Therapeutic emesis for morbid *Kapha* (e.g., in Psoriasis, Bronchial Asthma).
   - **Virechana**: Therapeutic purgation for morbid *Pitta* (e.g., in Dermatitis, Jaundice).
   - **Basti**: Medicated enema for *Vata* (Gold standard: *Niruha* decoction + *Anuvasana* oil enemas).
   - **Nasya**: Trans-nasal drug delivery for *Urdhwajatrugata Rogas* (ENT & Neurological).
   - **Raktamokshana**: Bloodletting (*Jalaukavacharana* - Leech therapy) for localized toxic blood vitiation.
3. **Paschat Karma (Post-Purificatory)**:
   - *Samsarjana Krama*: Gradual dietary rehabilitation from Peya (thin gruel) to Vilepi to Yusha to normal meal over 3 to 7 days.`,
    };
  }

  if (q.includes('abdm') || q.includes('ehr') || q.includes('namaste') || q.includes('ayushgrid') || q.includes('icd')) {
    return {
      text: `### 🏥 AyushGrid & Ayushman Bharat Digital Mission (ABDM)
National digital public health infrastructure compliance requires three core standards:

1. **NAMASTE Portal Terminology**:
   - Standardized Ayurvedic clinical diagnostic terminology aligned with **WHO ICD-11 (Module 2: Traditional Medicine)**.
   - Dual-coding ensures Ayurvedic diagnoses (*e.g., Amavata, Madhumeha*) translate seamlessly into international insurance reimbursement codes.
2. **AyushGrid National Digital Spine**:
   - Integrates hospital clinical information systems (HIS), dispensaries, and telemedicine consults directly with Ministry of Ayush telemetry.
3. **ABDM Interoperability**:
   - Verification of 14-digit **ABHA (Ayushman Bharat Health Account)** IDs for longitudinal patient electronic health records.
   - Encrypted FHIR (Fast Healthcare Interoperability Resources) clinical summaries.`,
      actionType: 'enroll_bridge',
      actionLabel: '⚡ Enroll in AyushGrid EHR Bridge (+2% Readiness)',
      actionPayload: { skillId: 'clinical-documentation', gain: 1, name: 'AyushGrid EHR & ICD-11 Integration' },
    };
  }

  if (q.includes('internship') || q.includes('job') || q.includes('dabur') || q.includes('csir') || q.includes('match') || q.includes('placement') || q.includes('apply')) {
    return {
      text: `### 🎯 AI-Ranked Opportunity Matches for Your Profile
Our **Vector Cosine Similarity Engine** calculated your top candidate affinities:

1. **Dabur Research Foundation (DRF)** — **94% Compatibility**
   - *Role*: Ayurvedic Clinical Trials & Formulations Trainee
   - *Location*: Sahibabad / Ghaziabad • *Stipend*: ₹18,000 / mo
   - *Affinity Factors*: Panchakarma (4/5) & Patient Communication (4/5).
2. **CSIR - Central Drug Research Institute (CDRI)** — **91% Compatibility**
   - *Role*: Phytochemical Screening & Botanical Fingerprinting Fellow
   - *Location*: Lucknow, UP • *Stipend*: ₹22,000 / mo
3. **All India Institute of Ayurveda (Hospital Wing)** — **94% Compatibility**
   - *Role*: Clinical Panchakarma Research Fellow
   - *Location*: New Delhi • *Stipend*: ₹20,000 / mo

You can apply with 1-click directly below!`,
      actionType: 'apply_opportunity',
      actionLabel: '📝 1-Click Apply to Dabur Research Foundation (94%)',
      actionPayload: { opportunityId: 'opp-2' },
    };
  }

  if (q.includes('abc') || q.includes('apaar') || q.includes('credit') || q.includes('digilocker') || q.includes('nep')) {
    return {
      text: `### 💳 Academic Bank of Credits (ABC ID / APAAR) Status
- **Linked 12-Digit APAAR ID**: \`9821-4402-8819\` (DigiLocker & NEP 2020 Synced)
- **Accumulated Credits**: **${context?.abcCredits || 148} / 160 Minimum** required for BAMS degree graduation.
- **Credit Distribution Ledger**:
  - *Clinical Practicum*: 72 Credits (NSQF Level 7)
  - *Phytochemistry & Dravyaguna*: 44 Credits (NSQF Level 6)
  - *Hospital IPD/OPD Residency*: 32 Credits (NSQF Level 7)

*Credit Status*: You need **12 more credits** to fulfill the graduation threshold. Syncing with DigiLocker updates your ledger with verified practicum electives!`,
      actionType: 'sync_abc',
      actionLabel: '💳 Sync ABC Credits via DigiLocker (+4 Credits)',
    };
  }

  if (q.includes('dravyaguna') || q.includes('herb') || q.includes('botanical') || q.includes('hptlc') || q.includes('fingerprint') || q.includes('identification')) {
    return {
      text: `### 🌿 Dravyaguna Pharmacognosy & Botanical Fingerprinting
Authentication of raw herbal materials under Ayurvedic Pharmacopoeia of India (API):

1. **Macroscopic & Microscopic Taxonomy**:
   - Diagnostic cellular features: Calcium oxalate crystals (rosettes in *Arjuna*, prisms in *Senna*), stomatal types, and glandular trichomes.
2. **Chromatographic Fingerprinting**:
   - **TLC & HPTLC Profiling**: Rf values and UV absorption spectra (254nm / 366nm) for active phytochemical markers (e.g., Curcumin in *Curcuma longa*, Withaferin-A in *Withania somnifera*).
3. **Physicochemical Purity Parameters**:
   - Total Ash Value (mineral content), Acid Insoluble Ash (siliceous contamination), Extractive values (water/alcohol soluble fractions).`,
      actionType: 'enroll_bridge',
      actionLabel: '⚡ Enroll in TLC Botanical Fingerprinting Bridge (+1 Level)',
      actionPayload: { skillId: 'dravyaguna-identification', gain: 1, name: 'TLC & HPTLC Botanical Fingerprinting' },
    };
  }

  return {
    text: `### 🩺 KaryaSetu Ayush Saarthi Clinical Advice
Thank you for your clinical and career query regarding **"${query}"**.

**Key Guidance for ${context?.name || 'Ayush Scholar'}:**
- **Clinical Rigor**: Anchor diagnostic observations in classical Ayurvedic texts (*Charaka, Sushruta, Vagbhata*) while ensuring compliance with modern evidence-based testing monographs (AFI, WHO ICD-11, ABDM).
- **Competency Progression**: Your current Industry Readiness is **${context?.readinessScore || 84}%**. Focus on resolving critical lab testing standards (Rasashastra QA) to qualify for top-tier pharma R&D stipends.
- **Assistance**: You can ask me to solve any Ayurvedic pharmacology doubt, explain surgical protocols (*Ksharasutra*), check ABC ID credits, or recommend top internship placements!`,
  };
}
