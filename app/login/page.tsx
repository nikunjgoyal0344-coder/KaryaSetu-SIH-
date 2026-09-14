'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp, UserRole } from '@/lib/store';
import {
  GraduationCap,
  Building2,
  BookOpenCheck,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, addNotification } = useApp();

  const roleParam = searchParams.get('role') as UserRole | null;
  const initialRole: UserRole =
    roleParam === 'industry' || roleParam === 'faculty' || roleParam === 'institution'
      ? roleParam
      : 'student';

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roleMeta = {
    student: {
      name: 'Students Portal',
      icon: GraduationCap,
      idLabel: 'Student ID / DigiLocker ID / Email',
      idPlaceholder: 'e.g. STU-2024-8841 or ananya.sharma@aiia.gov.in',
      demoId: 'STU-2024-8841',
      demoPass: 'Student@2026',
      route: '/student/dashboard',
    },
    industry: {
      name: 'Industry Partner Portal',
      icon: Building2,
      idLabel: 'Corporate Partner ID / Official Email',
      idPlaceholder: 'e.g. IND-CORP-402 or r_and_d@dabur.com',
      demoId: 'IND-CORP-402',
      demoPass: 'Industry@2026',
      route: '/industry/dashboard',
    },
    faculty: {
      name: 'Faculty & Guide Portal',
      icon: BookOpenCheck,
      idLabel: 'Faculty ID / Institutional Email',
      idPlaceholder: 'e.g. FAC-AIIA-108 or rajesh.mishra@aiia.gov.in',
      demoId: 'FAC-AIIA-108',
      demoPass: 'Faculty@2026',
      route: '/faculty/dashboard',
    },
    institution: {
      name: 'Institution / Registrar Portal',
      icon: ShieldCheck,
      idLabel: 'AISHE Code / Administrator Email',
      idPlaceholder: 'e.g. AISHE-U-0123 or registrar@aiia.gov.in',
      demoId: 'AISHE-U-0123',
      demoPass: 'Admin@2026',
      route: '/institution/dashboard',
    },
  };

  const currentMeta = roleMeta[selectedRole];

  const handleFillDemo = () => {
    setUserId(currentMeta.demoId);
    setPassword(currentMeta.demoPass);
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setErrorMessage('Please enter your ID, DigiLocker ID, or registered Email.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setErrorMessage('');
    login(selectedRole);
    addNotification({
      title: `Logged into ${currentMeta.name}`,
      message: `Authenticated session verified for ${userId.trim()}.`,
      type: 'endorsement',
    });
    router.push(currentMeta.route);
  };

  return (
    <div className="max-w-md mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.03)] transition-colors">
      {/* Brand Emblem Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/60 mx-auto mb-3 shadow-sm bg-navy-900 flex items-center justify-center">
          <img src="/logo.png" alt="KaryaSetu Logo" className="w-full h-full object-cover scale-110" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">Log In to KaryaSetu</h2>
        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
          National Academia–Industry Collaboration Platform (AIIA / Ayush)
        </p>
      </div>

      {/* Mode Switcher Tabs: Log In vs Sign In */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5 font-semibold text-xs text-center">
        <div className="py-2 rounded-xl bg-saffron text-white shadow-xs font-bold">
          Log In (ID &amp; Password)
        </div>
        <Link
          href={`/register?role=${selectedRole}`}
          className="py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white font-semibold transition-colors"
        >
          Sign In (Register)
        </Link>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-5">
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Select Portal Role:
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(['student', 'industry', 'faculty', 'institution'] as const).map((r) => {
            const meta = roleMeta[r];
            const Icon = meta.icon;
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setSelectedRole(r);
                  setErrorMessage('');
                }}
                className={`p-2.5 rounded-xl border font-medium transition-all text-left flex items-center gap-2 ${
                  isSelected
                    ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-navy-700 dark:text-slate-400'}`} />
                <span className="text-[11px] font-semibold truncate">{meta.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Log In Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            {currentMeta.idLabel}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setErrorMessage('');
              }}
              placeholder={currentMeta.idPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold">
              Password
            </label>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Sample Credentials</span>
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Enter your portal password"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Log In to {currentMeta.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Sign In / Register Details */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an authenticated account?{' '}
        <Link
          href={`/register?role=${selectedRole}`}
          className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
        >
          Sign In (Provide Details)
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium text-sm">Loading Login Gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}
