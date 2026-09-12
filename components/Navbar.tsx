'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';
import WallpaperToggle from '@/components/WallpaperToggle';
import {
  LayoutDashboard,
  Award,
  Briefcase,
  FileCheck2,
  PlusCircle,
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  CheckCircle2,
  LogOut,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Network,
} from 'lucide-react';
import NotificationSystem from './NotificationSystem';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isLoggedIn, logout, student } = useApp();
  const currentUser = getCurrentUser(role);

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/assessment', label: 'Skill Assessment', icon: Award },
    { href: '/student/internships', label: 'Opportunities', icon: Briefcase },
    { href: '/student/portfolio', label: 'Verified Portfolio', icon: FileCheck2 },
  ];

  const industryLinks = [
    { href: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/industry/post-internship', label: 'Post Opportunity', icon: PlusCircle },
    { href: '/industry/applicants', label: 'Applicants Pipeline', icon: Users },
  ];

  const facultyLinks = [
    { href: '/faculty/dashboard', label: 'Faculty FDPs & Endorsements', icon: BookOpen },
    { href: '/student/dashboard', label: 'Mentee View', icon: GraduationCap },
  ];

  const institutionLinks = [
    { href: '/institution/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/institution/verify', label: 'Verify Students', icon: ShieldCheck },
    { href: '/institution/analytics', label: 'Placement Analytics', icon: BarChart3 },
  ];

  const links =
    role === 'student'
      ? studentLinks
      : role === 'industry'
      ? industryLinks
      : role === 'faculty'
      ? facultyLinks
      : institutionLinks;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white/75 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-900/10 dark:border-slate-800/80 sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform shrink-0 bg-slate-900/10 dark:bg-white/10">
                <img src="/logo.png" alt="KaryaSetu Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Karya<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AIIA / Ayush
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                  Academia–Industry Collaboration Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Only shown if logged in */}
          {isLoggedIn ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span>National Ayush Skilling Framework</span>
              <span>•</span>
              <span>Healthcare Sector Skill Council Aligned</span>
            </div>
          )}

          {/* Profile Section, System Workflow, Notifications & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Workflow Visualizer Link */}
            <Link
              href="/workflow"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/80 dark:border-emerald-800/60 transition-all shadow-2xs"
            >
              <Network className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Workflow</span>
            </Link>

            {/* Notification System Bell */}
            <NotificationSystem />

            {/* Wallpaper Toggle (Live vs Plain) */}
            <WallpaperToggle showLabels={false} className="hidden sm:inline-flex" />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {isLoggedIn ? (
              /* User Profile & Sign Out Controls */
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/40 shadow-xs"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {role}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                    {currentUser.affiliation}
                  </span>
                </div>

                {/* Sign Out Button (Required to switch roles) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out to switch role"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:border-rose-200 transition-all shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              /* Both Sign In and Log In options for Guest */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all shadow-2xs"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
