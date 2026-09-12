'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { setRole } = useApp();
  const [roleType, setRoleType] = useState<'student' | 'industry' | 'faculty' | 'institution'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(roleType);
    if (roleType === 'student') router.push('/student/assessment');
    else if (roleType === 'industry') router.push('/industry/dashboard');
    else if (roleType === 'faculty') router.push('/faculty/dashboard');
    else if (roleType === 'institution') router.push('/institution/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs transition-colors">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50 mx-auto mb-3 shadow-lg shadow-amber-900/20 bg-slate-900/10 dark:bg-white/10">
          <img src="/logo.png" alt="KaryaSetu Logo" className="w-full h-full object-cover scale-110" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create KaryaSetu Account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          National Academia–Industry Collaboration Gateway
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Select Stakeholder Role</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'student', label: '🎓 Student' },
              { id: 'industry', label: '🏢 Industry' },
              { id: 'faculty', label: '👨‍🏫 Faculty' },
              { id: 'institution', label: '🏛️ Institution' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoleType(r.id as any)}
                className={`py-2 px-1 rounded-xl font-medium border text-center transition-all text-xs ${
                  roleType === r.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
          <input
            type="text"
            placeholder={roleType === 'student' ? 'e.g. Ananya Sharma' : 'e.g. Dr. Rajesh Mishra'}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Official / Institutional Email</label>
          <input
            type="email"
            placeholder="name@institution.gov.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            {roleType === 'industry' ? 'Company / Organization Name' : 'College / Institute Name'}
          </label>
          <input
            type="text"
            placeholder={
              roleType === 'industry'
                ? 'e.g. Dabur Research Foundation'
                : 'e.g. All India Institute of Ayurveda, New Delhi'
            }
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>Complete Registration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-slate-500">
        Already registered?{' '}
        <Link href="/login" className="text-emerald-700 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
