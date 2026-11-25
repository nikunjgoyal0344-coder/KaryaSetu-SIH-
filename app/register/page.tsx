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
  School,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setStudent, addNotification } = useApp();

  const roleParam = searchParams.get('role') as UserRole | null;
  const initialRole: UserRole =
    roleParam === 'industry' || roleParam === 'faculty' || roleParam === 'institution'
      ? roleParam
      : 'student';

  const [roleType, setRoleType] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [abcId, setAbcId] = useState('8472-1920-3841');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentDigiLocker, setConsentDigiLocker] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const roleMeta = {
    student: {
      name: 'Students Portal',
      icon: GraduationCap,
      idLabel: 'Student Enrollment ID / University Roll No.',
      idPlaceholder: 'e.g. AIIA-2024-BAMS-042 or STU-8841',
      orgLabel: 'College / Institute Name',
      orgPlaceholder: 'e.g. All India Institute of Ayurveda, New Delhi',
      route: '/student/dashboard',
    },
    industry: {
      name: 'Industry Portal',
      icon: Building2,
      idLabel: 'Corporate CIN / GSTIN / Partner Registration No.',
      idPlaceholder: 'e.g. L85110DL1930PLC001428',
      orgLabel: 'Company / Enterprise Name',
      orgPlaceholder: 'e.g. Dabur Research Foundation',
      route: '/industry/dashboard',
    },
    faculty: {
      name: 'Faculty Portal',
      icon: BookOpenCheck,
      idLabel: 'Faculty Employee Code / NKN ID',
      idPlaceholder: 'e.g. FAC-AIIA-108',
      orgLabel: 'Department / University Name',
      orgPlaceholder: 'e.g. Dept of Dravyaguna, AIIA New Delhi',
      route: '/faculty/dashboard',
    },
    institution: {
      name: 'Institution Portal',
      icon: ShieldCheck,
      idLabel: 'AISHE Code / Regulatory Affiliation Code',
      idPlaceholder: 'e.g. AISHE-U-0123 / UGC-ND-004',
      orgLabel: 'Institutional Campus Name',
      orgPlaceholder: 'e.g. National Institute of Ayurveda, Jaipur',
      route: '/institution/dashboard',
    },
  };

  const currentMeta = roleMeta[roleType];

  const handleFillSample = () => {
    if (roleType === 'student') {
      setFullName('Ananya Sharma');
      setEnrollmentId('AIIA-2024-BAMS-042');
      setEmail('ananya.sharma@aiia.gov.in');
      setOrganization('All India Institute of Ayurveda, New Delhi');
      setPassword('Student@2026');
      setConfirmPassword('Student@2026');
    } else if (roleType === 'industry') {
      setFullName('Dr. Vikramaditya Sen');
      setEnrollmentId('CIN-DABUR-2024-RND');
      setEmail('vikram.sen@dabur.com');
      setOrganization('Dabur Research Foundation');
      setPassword('Industry@2026');
      setConfirmPassword('Industry@2026');
    } else if (roleType === 'faculty') {
      setFullName('Dr. Rajesh Mishra');
      setEnrollmentId('FAC-AIIA-D77');
      setEmail('rajesh.mishra@aiia.gov.in');
      setOrganization('Dept of Dravyaguna & Clinical Pharmacology, AIIA');
      setPassword('Faculty@2026');
      setConfirmPassword('Faculty@2026');
    } else {
      setFullName('Registrar Office');
      setEnrollmentId('AISHE-U-0123');
      setEmail('registrar@aiia.gov.in');
      setOrganization('All India Institute of Ayurveda, New Delhi');
      setPassword('Admin@2026');
      setConfirmPassword('Admin@2026');
    }
    setErrorMessage('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !enrollmentId.trim() || !email.trim() || !organization.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required sign-in details.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setErrorMessage('');

    // If registering as student, update store student profile with user's entered details
    if (roleType === 'student') {
      setStudent((prev) => ({
        ...prev,
        name: fullName.trim(),
        email: email.trim(),
        college: organization.trim(),
        abcId: abcId.trim() || prev.abcId || '8472-1920-3841',
        isAbcLinked: true,
        abcCredits: prev.abcCredits || 148,
        isInstitutionVerified: true,
      }));
    }

    login(roleType);

    addNotification({
      title: `Account Registered for ${fullName.trim()}`,
      message: `Signed in as ${currentMeta.name}. DigiLocker verification connected.`,
      type: 'endorsement',
    });

    router.push(currentMeta.route);
  };

  return (
    <div className="max-w-lg mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.03)] transition-colors">
      {/* Emblem Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/60 mx-auto mb-3 shadow-sm bg-navy-900 flex items-center justify-center">
          <Image src="/logo.png" alt="KaryaSetu Logo" width={64} height={62} priority className="w-full h-full object-cover scale-110" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white">Sign In &amp; Register</h1>
        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
          Provide your official details to establish your authenticated portal profile
        </p>
      </div>

      {/* Mode Switcher Tabs: Log In vs Sign In */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5 font-semibold text-xs text-center">
        <Link
          href={`/login?role=${roleType}`}
          className="py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white font-semibold transition-colors"
        >
          Log In (ID &amp; Password)
        </Link>
        <div className="py-2 rounded-xl bg-saffron text-white shadow-xs font-bold">
          Sign In (Provide Details)
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Your Role:
          </label>
          <button
            type="button"
            onClick={handleFillSample}
            className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Sparkles className="w-3 h-3" />
            <span>Fill Sample Sign-In Details</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(['student', 'industry', 'faculty', 'institution'] as const).map((r) => {
            const meta = roleMeta[r];
            const Icon = meta.icon;
            const isSelected = roleType === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRoleType(r);
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

      {/* Registration Details Form */}
      <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
        {/* Full Name */}
        <div>
          <label htmlFor="reg-fullname" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="reg-fullname"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g. Ananya Sharma"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
              required
            />
          </div>
        </div>

        {/* Enrollment / Institutional ID */}
        <div>
          <label htmlFor="reg-enrollment" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            {currentMeta.idLabel} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="reg-enrollment"
              type="text"
              value={enrollmentId}
              onChange={(e) => {
                setEnrollmentId(e.target.value);
                setErrorMessage('');
              }}
              placeholder={currentMeta.idPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs font-mono"
              required
            />
          </div>
        </div>

        {/* Academic Bank of Credits (ABC ID / APAAR) for Students */}
        {roleType === 'student' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="reg-abc" className="block text-slate-700 dark:text-slate-300 font-semibold">
                Academic Bank of Credits (ABC ID / APAAR)
              </label>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                NEP 2020 Aligned
              </span>
            </div>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
              <input
                id="reg-abc"
                type="text"
                value={abcId}
                onChange={(e) => setAbcId(e.target.value)}
                placeholder="e.g. 8472-1920-3841"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Connects your DigiLocker credits to Ayush clinical internships and university records.
            </p>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            Official / Institutional Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              placeholder="name@institution.gov.in"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
              required
            />
          </div>
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="reg-org" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
            {currentMeta.orgLabel} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              id="reg-org"
              type="text"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                setErrorMessage('');
              }}
              placeholder={currentMeta.orgPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
              required
            />
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-password" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Create Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Min 6 characters"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" aria-hidden="true" /> : <Eye className="w-3.5 h-3.5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Repeat password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* DigiLocker Consent */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 text-[11px] text-emerald-900 dark:text-emerald-300">
          <input
            type="checkbox"
            id="digilocker-consent"
            checked={consentDigiLocker}
            onChange={(e) => setConsentDigiLocker(e.target.checked)}
            className="mt-0.5 rounded border-emerald-400 text-emerald-700 focus:ring-emerald-600"
          />
          <label htmlFor="digilocker-consent" className="cursor-pointer leading-tight">
            Authorize DigiLocker &amp; National Academic Depository (NAD) to link and verify my institutional credentials under GIGW standards.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-saffron hover:bg-saffron-hover text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-3"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Complete Sign In &amp; Enter {currentMeta.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Log In */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an authenticated ID &amp; Password?{' '}
        <Link
          href={`/login?role=${roleType}`}
          className="text-slate-900 dark:text-white font-bold hover:underline"
        >
          Log In with Credentials
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 font-medium text-sm">Loading Registration Gateway...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
