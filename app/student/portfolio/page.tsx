'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  FileCheck2,
  CheckCircle2,
  Share2,
  Download,
  Building,
  GraduationCap,
  Calendar,
  Award,
  ExternalLink,
  ShieldCheck,
  QrCode,
  CreditCard,
} from 'lucide-react';

export default function PortfolioPage() {
  const { student } = useApp();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-1 border border-emerald-200 dark:border-emerald-800">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Digital Skill Passport • Verifiable Credential</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Ayush Verified Digital Portfolio</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sovereign academic credentials, faculty-endorsed practical competencies, and ABC Credit records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Shareable Public Verification Link copied to clipboard:\nhttps://karyasetu.gov.in/verify/aiia-stu-044-ananya')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-saffron/20"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>      {/* Printable / Verifiable Portfolio Document Card */}
      <div className="bg-white dark:bg-slate-900/95 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-8 sm:p-10 relative border-b border-navy-700/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-saffron/40 shadow-lg shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black">{student.name}</h2>
                  <span className="bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Scholar
                  </span>
                  {student.isInstitutionVerified && (
                    <span className="bg-saffron/25 border border-saffron/40 text-saffron-light text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-saffron-light" />
                      Institution Enrolled ({student.institutionVerificationDate || 'AIIA Verified'})
                    </span>
                  )}
                </div>
                <p className="text-slate-200 text-sm font-medium">{student.degree}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-saffron" />
                  {student.college}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-slate-300 font-mono flex-wrap">
                  <span>CGPA: {student.cgpa}</span>
                  <span>•</span>
                  <span>Prakriti: {student.prakriti}</span>
                  <span>•</span>
                  <span>Roll No: AIIA/2022/BAMS/044</span>
                  <span>•</span>
                  <span className="text-amber-300 font-bold">ABC ID: {student.abcId || '8472-1920-3841'}</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">{student.abcCredits || 148} Cr</span>
                </div>
              </div>
            </div>

            {/* Verification QR Emblem */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center flex flex-col items-center shrink-0">
              <QrCode className="w-16 h-16 text-white" />
              <span className="text-[10px] font-mono text-saffron-light mt-1 uppercase tracking-wider font-semibold">
                ID: KS-AIIA-7492
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Body */}
        <div className="p-8 sm:p-10 space-y-8 text-xs">
          {/* Executive Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Candidate Profile &amp; Focus
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{student.bio}</p>
          </div>

          {/* Verified Skills Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Endorsed &amp; Tested Skill Matrix
              </h3>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> AIIA Faculty Validated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.skills.map((s) => (
                <div
                  key={s.skillId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                      <span>{s.skillName}</span>
                      {s.isVerified && (
                        <span title="Faculty Endorsed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        </span>
                      )}
                    </div>
                    {s.endorsedBy && (
                      <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">
                        Endorsed by: {s.endorsedBy}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-black text-navy-900 dark:text-white text-sm">{s.level} / 5</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">Proficiency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Projects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Documented Live Clinical Projects
            </h3>
            <div className="space-y-3">
              {student.projects.map((proj, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-navy-900 dark:text-white text-sm">{proj.title}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-saffron-dark dark:text-saffron text-[10px] font-semibold border border-orange-200 dark:border-orange-900/60">
                      {proj.tag}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Official Certifications &amp; Fellowships
            </h3>
            <div className="space-y-2.5">
              {/* ABC ID National Credit Depository Attestation */}
              <div className="p-3.5 rounded-xl border border-emerald-300/80 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/50 dark:bg-emerald-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-navy-900 dark:text-white">
                        Academic Bank of Credits (ABC ID: {student.abcId || '8472-1920-3841'})
                      </p>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
                        {student.abcCredits || 148} Academic Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      National Academic Depository (NAD / APAAR) • Ministry of Education &amp; Ayush • NEP 2020 Aligned
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shrink-0 self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> DigiLocker &amp; APAAR Synced
                </span>
              </div>

              {student.completedCertificates.map((cert, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-800 text-saffron flex items-center justify-center font-bold shrink-0 border border-orange-200 dark:border-slate-700">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900 dark:text-white">{cert.title}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {cert.issuer} • Issued {cert.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> DigiLocker Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Stamp Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
          <p>Verified through KaryaSetu Portal • National AYUSH Skilling &amp; Digital Credentials Registry</p>
          <p className="font-mono text-[11px] text-navy-900 dark:text-blue-200 font-bold">All India Institute of Ayurveda, New Delhi</p>
        </div>
      </div>
    </div>
  );
}
