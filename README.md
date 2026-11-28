# KaryaSetu — National AYUSH & Life Sciences Skill-to-Career Verification Grid

**KaryaSetu** is an AI-powered centralized academia-industry collaboration platform built for the Smart India Hackathon (SIH) in alignment with the **Ministry of Ayush**, **NCISM**, **Healthcare Sector Skill Council (HSSC)**, **NSDC**, and **NEP 2020** (NSQF Levels 6–8 & Academic Bank of Credits / APAAR).

---

## Core Capabilities & Problem Alignment

1. **Multi-Role Sovereign Portals**
   - **Students (`student`)**: 8-axis HSSC Clinical Competency Radar, automated skill gap diagnostics ($W_{imp} \times (\text{Req} - \text{Cur})$), DigiLocker **ABC / APAAR** credit ledger sync, verifiable digital skill passport with **scannable ISO QR + `/verify` registry**, and 1-click applications.
   - **Industry Partners (`industry`)**: Weighted skill-based internship/job posting, candidate compatibility scoring, and real-time shortlisting/selection loop.
   - **Faculty (`faculty`)**: Clinical competency endorsement with cryptographic SHA-256/HMAC attestation signatures and Faculty Development Programs (FDPs).
   - **Institutions (`institution`)**: Student verification queue, NAAC/NIRF placement analytics, and institutional seals.

2. **Explainable AI Matching Engine (`lib/backend/aiEngine.ts`)**
   - **Layer 1 — Vector Cosine Similarity (55%)**: Evaluates candidates and opportunities across a 15-dimensional AYUSH competency vector space (`panchakarma-therapy`, `nadi-pariksha`, `dravyaguna-identification`, `rasashastra-qa`, `clinical-documentation`, etc.).
   - **Layer 2 — Content-Based Filtering (25%)**: Computes pre-compiled Jaccard keyword similarity across AYUSH clinical, research, pharmacognosy, and digital health domains.
   - **Layer 3 — Domain & Mode Affinity (20%)**: Aligns preferred work modality and career domain interests.

3. **Hybrid Cloud Firestore & Local Backend (`lib/firebase/`)**
   - Seamless integration with **Firebase Client SDK** and **Firebase Admin SDK**, backed by production-grade role-based **Cloud Firestore Security Rules** (`firestore.rules`) that block privilege escalation and student self-verification.
   - Automatically falls back to the indexed in-memory repository (`lib/backend/db.ts`) when offline or unconfigured.

4. **Security & Accessibility (GIGW / WCAG 2.1 AA+)**
   - Centralized security utilities (`lib/security.ts`, `lib/auth.ts`, `lib/apiHelpers.ts`) providing fail-closed JWT secret resolution (`HS256`), role-based access control (`ROLE_PERMISSIONS`, optional or strict `REQUIRE_STRICT_AUTH=true` token validation), input sanitization, ABC ID format validation, scrypt password hashing, HMAC credential signing, and fixed-window rate limiting.
   - Strict HTTP defense headers across `middleware.ts` and `next.config.js` (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Cross-Origin-Opener-Policy`, `Referrer-Policy`, `Permissions-Policy`, and production `Strict-Transport-Security`).
   - Bilingual English / Hindi (`हिन्दी`) engine, live font-size scaling (`A-`, `A`, `A+`), `prefers-reduced-motion` scroll animations (`ScrollProgressBar`, `ScrollReveal`), skip-to-content navigation, and full ARIA/keyboard support.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript (Strict)
- **Styling & UX**: Tailwind CSS, GPU-composited `IntersectionObserver` scroll animations
- **Backend & Auth**: Firebase (`firebase`, `firebase-admin`), JWT (`jsonwebtoken`), `bcryptjs`
- **Testing & CI**: Node.js Native Test Runner (`node --test --experimental-strip-types`) with TSX component SSR checks & GitHub Actions workflow (`.github/workflows/ci.yml`)

---

## Local Setup & Verification

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional — falls back to local demo mode automatically)
cp .env.example .env.local

# 3. Start local development server
npm run dev

# 4. Run full quality, security, test coverage, and build verification
npm run lint
npx tsc --noEmit
npm run test:coverage
npm run build
```
