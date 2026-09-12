'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { GraduationCap, Building2, BookOpenCheck, ShieldCheck, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('ananya.sharma@aiia.gov.in');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<'student' | 'industry' | 'faculty' | 'institution'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'student') router.push('/student/dashboard');
    else if (selectedRole === 'industry') router.push('/industry/dashboard');
    else if (selectedRole === 'faculty') router.push('/faculty/dashboard');
    else if (selectedRole === 'institution') router.push('/institution/dashboard');
  };

  const quickDemoLogin = (role: 'student' | 'industry' | 'faculty' | 'institution') => {
    login(role);
    if (role === 'student') router.push('/student/dashboard');
    else if (role === 'industry') router.push('/industry/dashboard');
    else if (role === 'faculty') router.push('/faculty/dashboard');
    else if (role === 'institution') router.push('/institution/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.03)] transition-colors">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 mx-auto mb-3 shadow-sm bg-slate-50 dark:bg-slate-800">
          <img src="/logo.png" alt="KaryaSetu Logo" className="w-full h-full object-cover scale-110" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to KaryaSetu</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Academia–Industry Collaboration Platform (AIIA / Ayush)</p>
      </div>

      {/* Quick Role Sign-In */}
      <div className="mb-6 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          Quick Role Sign-In:
        </span>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <button
            type="button"
            onClick={() => quickDemoLogin('student')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-medium transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <GraduationCap className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <span className="text-[11px]">Student</span>
          </button>
          <button
            type="button"
            onClick={() => quickDemoLogin('industry')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-medium transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <Building2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="text-[11px]">Industry</span>
          </button>
          <button
            type="button"
            onClick={() => quickDemoLogin('faculty')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-medium transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <BookOpenCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="text-[11px]">Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => quickDemoLogin('institution')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-medium transition-all text-center flex flex-col items-center gap-1 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="text-[11px]">Institution</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Select Role</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['student', 'industry', 'faculty', 'institution'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`py-2 px-1 rounded-xl font-medium capitalize border transition-all text-center text-[11px] ${
                  selectedRole === r
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Institutional / Professional Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        New to KaryaSetu?{' '}
        <Link href="/register" className="text-emerald-700 font-semibold hover:underline">
          Register Institutional Profile
        </Link>
      </div>
    </div>
  );
}
