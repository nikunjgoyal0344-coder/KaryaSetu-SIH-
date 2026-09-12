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
} from 'lucide-react';

export default function PortfolioPage() {
  const { student } = useApp();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 print:p-0 print:m-0 print:max-w-full">
      {/* Action Header (Hidden on print) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Institutionally Endorsed Digital Identity
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Verified Digital e-Portfolio (Skill Passport)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof credentials verified by AIIA faculty and Healthcare Sector Skill Council
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Shareable Public Verification Link copied to clipboard:\nhttps://karyasetu.gov.in/verify/aiia-stu-044-ananya')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable / Verifiable Portfolio Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white p-8 sm:p-10 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black">{student.name}</h2>
                  <span className="bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Scholar
                  </span>
                  {student.isInstitutionVerified && (
                    <span className="bg-indigo-400/25 border border-indigo-300/40 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                      Institution Enrolled ({student.institutionVerificationDate || 'AIIA Verified'})
                    </span>
                  )}
                </div>
                <p className="text-emerald-100 text-sm font-medium">{student.degree}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  {student.college}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-emerald-200 font-mono">
                  <span>CGPA: {student.cgpa}</span>
                  <span>•</span>
                  <span>Prakriti: {student.prakriti}</span>
                  <span>•</span>
                  <span>Roll No: AIIA/2022/BAMS/044</span>
                </div>
              </div>
            </div>

            {/* Verification QR Emblem */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center flex flex-col items-center shrink-0">
              <QrCode className="w-16 h-16 text-white" />
              <span className="text-[10px] font-mono text-emerald-200 mt-1 uppercase tracking-wider">
                ID: KS-AIIA-7492
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Body */}
        <div className="p-8 sm:p-10 space-y-8 text-xs">
          {/* Executive Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Candidate Profile & Focus
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{student.bio}</p>
          </div>

          {/* Verified Skills Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Endorsed & Tested Skill Matrix
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AIIA Faculty Validated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.skills.map((s) => (
                <div
                  key={s.skillId}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{s.skillName}</span>
                      {s.isVerified && (
                        <span title="Faculty Endorsed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    {s.endorsedBy && (
                      <p className="text-[10px] text-emerald-800 font-medium">
                        Endorsed by: {s.endorsedBy}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm">{s.level} / 5</span>
                    <span className="block text-[10px] text-slate-400">Proficiency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Projects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Documented Live Clinical Projects
            </h3>
            <div className="space-y-3">
              {student.projects.map((proj, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      {proj.tag}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Official Certifications & Fellowships
            </h3>
            <div className="space-y-2.5">
              {student.completedCertificates.map((cert, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{cert.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {cert.issuer} • Issued {cert.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DigiLocker Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Stamp Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>Verified through KaryaSetu Portal • National AYUSH Skilling & Digital Credentials Registry</p>
          <p className="font-mono text-[11px]">All India Institute of Ayurveda, New Delhi</p>
        </div>
      </div>
    </div>
  );
}
