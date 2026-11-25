'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  LayoutDashboard,
  Award,
  Briefcase,
  FileCheck2,
  PlusCircle,
  Users,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { role, isLoggedIn, language } = useApp();
  const isHi = language === 'hi';

  const guestLinks = [
    { href: '/', label: isHi ? 'होम' : 'Home', icon: LayoutDashboard },
    { href: '/student/internships', label: isHi ? 'अवसर' : 'Opportunities', icon: Briefcase },
    { href: '/workflow', label: isHi ? 'वर्कफ़्लो' : 'Workflow', icon: BookOpen },
    { href: '/login', label: isHi ? 'पोर्टल' : 'Portals', icon: GraduationCap },
  ];

  const studentLinks = [
    { href: '/student/dashboard', label: isHi ? 'डैशबोर्ड' : 'Dashboard', icon: LayoutDashboard },
    { href: '/student/assessment', label: isHi ? 'मूल्यांकन' : 'Assessment', icon: Award },
    { href: '/student/internships', label: isHi ? 'अवसर' : 'Matches', icon: Briefcase },
    { href: '/student/learning-path', label: isHi ? 'सीखें' : 'Learn', icon: BookOpen },
    { href: '/student/portfolio', label: isHi ? 'पोर्टफोलियो' : 'Portfolio', icon: FileCheck2 },
  ];

  const industryLinks = [
    { href: '/industry/dashboard', label: isHi ? 'डैशबोर्ड' : 'Dashboard', icon: LayoutDashboard },
    { href: '/industry/post-internship', label: isHi ? 'पोस्ट करें' : 'Post Role', icon: PlusCircle },
    { href: '/industry/applicants', label: isHi ? 'उम्मीदवार' : 'Candidates', icon: Users },
  ];

  const facultyLinks = [
    { href: '/faculty/dashboard', label: isHi ? 'एफडीपी' : 'FDP Hub', icon: BookOpen },
    { href: '/student/dashboard', label: isHi ? 'विद्यार्थी' : 'Mentees', icon: GraduationCap },
  ];

  const institutionLinks = [
    { href: '/institution/dashboard', label: isHi ? 'अवलोकन' : 'Overview', icon: LayoutDashboard },
    { href: '/institution/verify', label: isHi ? 'सत्यापन' : 'Verify', icon: Award },
    { href: '/institution/analytics', label: isHi ? 'एनालिटिक्स' : 'Analytics', icon: Briefcase },
  ];

  const links = !isLoggedIn
    ? guestLinks
    : role === 'student'
    ? studentLinks
    : role === 'industry'
    ? industryLinks
    : role === 'faculty'
    ? facultyLinks
    : institutionLinks;

  return (
    <nav aria-label="Mobile Navigation Bar" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-emerald-900/10 dark:border-slate-800 shadow-2xl px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-h-[50px] transition-all relative ${
                isActive
                  ? 'text-saffron-dark dark:text-saffron font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-saffron rounded-full animate-in fade-in zoom-in duration-200" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-orange-100/80 dark:bg-saffron/20 shadow-xs scale-105 text-saffron-dark dark:text-saffron'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
