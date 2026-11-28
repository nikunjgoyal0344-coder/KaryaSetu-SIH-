'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  QrCode,
  Search,
  Award,
  Building,
  CreditCard,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

interface EndorsedSkillRecord {
  skillId: string;
  skillName: string;
  level: number;
  endorsedBy: string;
}

interface VerifiedCredentialDetails {
  studentId: string;
  studentName: string;
  college: string;
  degree: string;
  readinessScore: number;
  competencyScore: number;
  nsqfLevel: number;
  isInstitutionVerified: boolean;
  institutionVerificationDate: string;
  abcId: string;
  abcCredits: number;
  isAbcLinked: boolean;
  verifiedSkillsCount: number;
  endorsedSkills: EndorsedSkillRecord[];
  signatureDigestPrefix: string;
  canonicalPayloadPreview: string;
}

interface VerifyApiResponse {
  success: boolean;
  verified?: boolean;
  status?: 'AUTHENTIC' | 'TAMPERED' | 'UNKNOWN_SCHOLAR';
  matchMode?: string;
  algorithm?: string;
  reason?: string;
  error?: string;
  verifiedAt?: string;
  checkedAt?: string;
  credential?: VerifiedCredentialDetails;
  scholarSummary?: { id: string; name: string; college: string };
}

function VerifyPortalContent() {
  const searchParams = useSearchParams();
  const [studentId, setStudentId] = useState(searchParams.get('studentId') || 'stu-1');
  const [signature, setSignature] = useState(searchParams.get('sig') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyApiResponse | null>(null);

  const runVerification = useCallback(async (idValue: string, sigValue: string) => {
    const trimmedId = idValue.trim();
    const trimmedSig = sigValue.trim();
    if (!trimmedId || !trimmedSig) {
      setResult({
        success: false,
        verified: false,
        error: 'Enter both Scholar ID and Cryptographic Signature / QR Token.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: trimmedId, signature: trimmedSig }),
      });
      const data = (await res.json()) as VerifyApiResponse;
      setResult(data);
    } catch {
      setResult({
        success: false,
        verified: false,
        error: 'Unable to reach verification gateway. Please retry.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const paramId = searchParams.get('studentId');
    const paramSig = searchParams.get('sig');
    if (paramId && paramSig) {
      setStudentId(paramId);
      setSignature(paramSig);
      void runVerification(paramId, paramSig);
    }
  }, [searchParams, runVerification]);

  const handleLoadValidCredential = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/profile-generate');
      if (res.ok) {
        const data = await res.json();
        const generatedId = data?.profile?.studentId || 'stu-1';
        const generatedSig = data?.profile?.digitalSignature || '';
        setStudentId(generatedId);
        setSignature(generatedSig);
        if (generatedSig) {
          await runVerification(generatedId, generatedSig);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    const forgedSig = '0xdeadbeef0000111122223333tampered9999';
    setStudentId('stu-1');
    setSignature(forgedSig);
    await runVerification('stu-1', forgedSig);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron-light text-xs font-semibold uppercase tracking-wider">
              <QrCode className="w-3.5 h-3.5 text-saffron" aria-hidden="true" />
              <span>HMAC-SHA256 Sovereign Credential Inspector</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Sovereign Credential Verification Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Verify AYUSH Digital Skill Passports, faculty clinical endorsements, and APAAR/ABC ledger signatures in real time to prevent resume forgery.
            </p>
          </div>

          <Link
            href="/student/portfolio"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-colors self-start md:self-auto shrink-0"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>View Digital Passport</span>
          </Link>
        </div>
      </div>

      {/* Verification Form */}
      <ScrollReveal variant="fade-up">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runVerification(studentId, signature);
          }}
          className="bg-white dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5 text-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                Verify Scholar Attestation Hash or QR Token
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Paste the full SHA-256 HMAC digest from a Digital Skill Passport or open directly via QR code scan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleLoadValidCredential()}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold transition-colors cursor-pointer"
              >
                Load Authentic Passport
              </button>
              <button
                type="button"
                onClick={() => void handleSimulateTamper()}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-bold transition-colors cursor-pointer"
              >
                Simulate Tampered Hash
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 space-y-1.5">
              <label htmlFor="verify-scholar-id" className="block font-bold text-slate-700 dark:text-slate-300">
                Scholar ID
              </label>
              <input
                id="verify-scholar-id"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. stu-1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-saffron"
                required
              />
            </div>

            <div className="md:col-span-8 space-y-1.5">
              <label htmlFor="verify-signature-hash" className="block font-bold text-slate-700 dark:text-slate-300">
                Cryptographic Signature / QR Token
              </label>
              <input
                id="verify-signature-hash"
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="0x..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-saffron"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>{loading ? 'Verifying HMAC Signature...' : 'Verify Credential Authenticity'}</span>
          </button>
        </form>
      </ScrollReveal>

      {/* Live Verification Result */}
      {result && (
        <div role="status" aria-live="polite">
          {result.verified && result.credential ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/60 shadow-xl overflow-hidden text-xs">
              <div className="bg-emerald-600 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-base font-black tracking-tight">
                      AUTHENTIC CREDENTIAL VERIFIED
                    </h3>
                    <p className="text-emerald-100 text-[11px]">
                      {result.algorithm} • Match Mode: {result.matchMode}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 font-mono text-[11px] font-bold self-start sm:self-auto">
                  NSQF Level {result.credential.nsqfLevel}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Scholar</span>
                    <p className="text-sm font-extrabold text-navy-900 dark:text-white mt-0.5">
                      {result.credential.studentName}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{result.credential.degree}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building className="w-3 h-3" aria-hidden="true" /> Institution
                    </span>
                    <p className="text-sm font-extrabold text-navy-900 dark:text-white mt-0.5 line-clamp-1">
                      {result.credential.college}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      {result.credential.isInstitutionVerified ? 'Dean Endorsed' : 'Pending Review'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" aria-hidden="true" /> AI Competency
                    </span>
                    <p className="text-xl font-black text-saffron mt-0.5">{result.credential.competencyScore}%</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {result.credential.verifiedSkillsCount} Faculty-Verified Skills
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" aria-hidden="true" /> APAAR / ABC Ledger
                    </span>
                    <p className="text-sm font-black text-navy-900 dark:text-white mt-0.5 font-mono">
                      {result.credential.abcCredits} Credits
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                      ID: {result.credential.abcId}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-saffron" aria-hidden="true" />
                    Faculty-Endorsed Clinical Competencies ({result.credential.endorsedSkills.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.credential.endorsedSkills.map((skill) => (
                      <div
                        key={skill.skillId}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-navy-900 dark:text-white">{skill.skillName}</p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            Endorsed by {skill.endorsedBy}
                          </p>
                        </div>
                        <span className="font-mono font-black text-navy-900 dark:text-white text-sm">
                          {skill.level}/5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1">
                  <div>Canonical Payload: {result.credential.canonicalPayloadPreview}</div>
                  <div>Verified Digest: {result.credential.signatureDigestPrefix}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500/60 text-rose-900 dark:text-rose-200 flex items-start gap-4 shadow-md text-xs">
              {result.status === 'TAMPERED' ? (
                <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
              )}
              <div className="space-y-1.5">
                <h3 className="text-base font-black">
                  {result.status === 'TAMPERED'
                    ? 'VERIFICATION FAILED — CREDENTIAL HASH MISMATCH / TAMPERED'
                    : 'CREDENTIAL RECORD NOT VERIFIED'}
                </h3>
                <p className="leading-relaxed">
                  {result.reason ||
                    result.error ||
                    'Could not match the submitted scholar identifier and cryptographic signature.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyCredentialPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-500">Loading sovereign verification registry...</div>}>
      <VerifyPortalContent />
    </Suspense>
  );
}
