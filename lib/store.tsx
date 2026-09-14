'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_STUDENT, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_UNVERIFIED_STUDENTS,
  StudentProfile, 
  ApplicationItem,
  AppNotification,
  UnverifiedStudent
} from './seedData';
import { Opportunity } from './matchingEngine';

export type UserRole = 'student' | 'industry' | 'faculty' | 'institution';
export type ThemeMode = 'light' | 'dark';
export type WallpaperMode = 'live' | 'plain';
export type Language = 'en' | 'hi';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  wallpaperMode: WallpaperMode;
  setWallpaperMode: (mode: WallpaperMode) => void;
  toggleWallpaperMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  applications: ApplicationItem[];
  applyToOpportunity: (opp: Opportunity) => boolean;
  updateApplicationStatus: (appId: string, status: ApplicationItem['status']) => void;
  endorseStudentSkill: (skillId: string, facultyName: string) => void;
  updateSkillLevel: (skillId: string, levelGain: number) => void;
  postNewOpportunity: (opp: Omit<Opportunity, 'id' | 'postedAt' | 'applicantsCount'>) => void;
  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  // Institution Actions
  unverifiedStudents: UnverifiedStudent[];
  verifyStudent: (studentId: string) => void;
  flagStudent: (studentId: string) => void;
  // Academic Bank of Credits (ABC ID / APAAR)
  linkAbcId: (abcId: string) => void;
  syncAbcCredits: () => void;
  // Demo Data Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('student');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [wallpaperMode, setWallpaperMode] = useState<WallpaperMode>('live');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [unverifiedStudents, setUnverifiedStudents] = useState<UnverifiedStudent[]>(INITIAL_UNVERIFIED_STUDENTS);
  const [language, setLanguageState] = useState<Language>('en');

  // Sync theme, wallpaper, language and dynamic entity state with document and localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('karyasetu-theme') as ThemeMode;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(effectiveTheme);
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    const savedWallpaper = localStorage.getItem('karyasetu-wallpaper') as WallpaperMode;
    if (savedWallpaper === 'live' || savedWallpaper === 'plain') {
      setWallpaperMode(savedWallpaper);
    }

    const savedLang = localStorage.getItem('karyasetu-lang') as Language;
    if (savedLang === 'hi' || savedLang === 'en') {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
      if (savedLang === 'hi') {
        document.cookie = 'googtrans=/en/hi; path=/';
        try {
          if (window.location.hostname) {
            document.cookie = `googtrans=/en/hi; path=/; domain=${window.location.hostname}`;
          }
        } catch (e) {}
      }
    }

    // Hydrate dynamic entity state for true multi-page persistence
    try {
      const savedStudent = localStorage.getItem('karyasetu-student');
      if (savedStudent) setStudent(JSON.parse(savedStudent));

      const savedOpps = localStorage.getItem('karyasetu-opportunities');
      if (savedOpps) setOpportunities(JSON.parse(savedOpps));

      const savedApps = localStorage.getItem('karyasetu-applications');
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedNotifs = localStorage.getItem('karyasetu-notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedUnv = localStorage.getItem('karyasetu-unverified');
      if (savedUnv) setUnverifiedStudents(JSON.parse(savedUnv));

      const savedRole = localStorage.getItem('karyasetu-role') as UserRole;
      if (savedRole && ['student', 'industry', 'faculty', 'institution'].includes(savedRole)) {
        setRole(savedRole);
      }

      const savedAuth = localStorage.getItem('karyasetu-auth');
      if (savedAuth !== null) setIsLoggedIn(savedAuth === 'true');
    } catch (e) {
      console.warn('Could not restore state from localStorage:', e);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('karyasetu-student', JSON.stringify(student));
    } catch (e) {}
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem('karyasetu-opportunities', JSON.stringify(opportunities));
    } catch (e) {}
  }, [opportunities]);

  useEffect(() => {
    try {
      localStorage.setItem('karyasetu-applications', JSON.stringify(applications));
    } catch (e) {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('karyasetu-notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('karyasetu-unverified', JSON.stringify(unverifiedStudents));
    } catch (e) {}
  }, [unverifiedStudents]);

  useEffect(() => {
    try {
      localStorage.setItem('karyasetu-role', role);
      localStorage.setItem('karyasetu-auth', String(isLoggedIn));
    } catch (e) {}
  }, [role, isLoggedIn]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('karyasetu-lang', newLang);
      document.documentElement.lang = newLang;

      const hostname = window.location.hostname;
      if (newLang === 'hi') {
        document.cookie = 'googtrans=/en/hi; path=/';
        if (hostname) {
          document.cookie = `googtrans=/en/hi; path=/; domain=${hostname}`;
        }
      } else {
        document.cookie = 'googtrans=/en/en; path=/';
        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        if (hostname) {
          document.cookie = `googtrans=/en/en; path=/; domain=${hostname}`;
          document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        }
      }

      // If Google Translate element combo is available, trigger change event
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = newLang;
        combo.dispatchEvent(new Event('change'));
      }
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('karyasetu-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      return next;
    });
  };

  const toggleWallpaperMode = () => {
    setWallpaperMode((prev) => {
      const next = prev === 'live' ? 'plain' : 'live';
      localStorage.setItem('karyasetu-wallpaper', next);
      return next;
    });
  };

  const login = (newRole: UserRole) => {
    setRole(newRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Notification helpers
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Apply to opportunity (Opportunity Flow)
  const applyToOpportunity = (opp: Opportunity): boolean => {
    const existing = applications.find(
      (a) => a.opportunityId === opp.id && a.studentName === student.name
    );
    if (existing) return false;

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      company: opp.company,
      appliedDate: 'Today',
      status: 'Applied',
      matchScore: 88,
      studentName: student.name,
      studentCollege: student.college,
    };

    setApplications((prev) => [newApp, ...prev]);
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, applicantsCount: o.applicantsCount + 1 } : o))
    );

    addNotification({
      title: 'Application Submitted',
      message: `Your application for "${opp.title}" at ${opp.company} has been dispatched.`,
      type: 'opportunity',
      link: '/student/internships',
    });

    return true;
  };

  // Update application status (Industry Selection Updates -> Student Application Tracking)
  const updateApplicationStatus = (appId: string, status: ApplicationItem['status']) => {
    const targetApp = applications.find((a) => a.id === appId);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );

    if (targetApp) {
      addNotification({
        title: `Status Update: ${status}`,
        message: `${targetApp.company} updated your application status for "${targetApp.opportunityTitle}" to ${status}.`,
        type: 'selection',
        link: '/student/internships',
      });
    }
  };

  // Faculty endorsement (Faculty Actions -> Skill Profile Generation)
  const endorseStudentSkill = (skillId: string, facultyName: string) => {
    const skillObj = student.skills.find((s) => s.skillId === skillId);
    const skillTitle = skillObj?.skillName || skillId;

    setStudent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.skillId === skillId
          ? { ...s, isVerified: true, endorsedBy: `${facultyName} (AIIA Faculty)` }
          : s
      ),
      readinessScore: Math.min(100, prev.readinessScore + 3),
    }));

    addNotification({
      title: 'Faculty Skill Endorsement',
      message: `${facultyName} has verified and endorsed your competency in "${skillTitle}".`,
      type: 'endorsement',
      link: '/student/portfolio',
    });
  };

  // Update skill after assessment (User Journey -> Skill Profile Generation)
  const updateSkillLevel = (skillId: string, levelGain: number) => {
    setStudent((prev) => {
      const exists = prev.skills.find((s) => s.skillId === skillId);
      let updatedSkills;
      if (exists) {
        updatedSkills = prev.skills.map((s) =>
          s.skillId === skillId ? { ...s, level: Math.min(5, Math.max(s.level, levelGain)) } : s
        );
      } else {
        updatedSkills = [
          ...prev.skills,
          { skillId, skillName: skillId.replace('-', ' '), level: levelGain },
        ];
      }
      return {
        ...prev,
        skills: updatedSkills,
        readinessScore: Math.min(96, prev.readinessScore + 2),
      };
    });
  };

  // Post opportunity (Industry Actions -> Skill & Opportunity Matching)
  const postNewOpportunity = (opp: Omit<Opportunity, 'id' | 'postedAt' | 'applicantsCount'>) => {
    const created: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      postedAt: 'Just now',
      applicantsCount: 0,
    };
    setOpportunities((prev) => [created, ...prev]);

    addNotification({
      title: 'New Matched Opportunity Live',
      message: `"${opp.title}" posted by ${opp.company} is now matching student profiles.`,
      type: 'opportunity',
      link: '/student/internships',
    });
  };

  // Institution Actions: Verify Student Credentials
  const verifyStudent = (studentId: string) => {
    setUnverifiedStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'Verified' } : s))
    );

    // If verifying current student
    setStudent((prev) => ({
      ...prev,
      isInstitutionVerified: true,
      institutionVerificationDate: '12 Sep 2026',
    }));

    addNotification({
      title: 'Institution Verification Approved',
      message: 'AIIA Academic Registrar has verified student credentials and pushed verified learner data.',
      type: 'verification',
      link: '/institution/verify',
    });
  };

  // Institution Actions: Flag Student
  const flagStudent = (studentId: string) => {
    setUnverifiedStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'Flagged' } : s))
    );
  };

  // Academic Bank of Credits (ABC ID / APAAR) Integration
  const linkAbcId = (newAbcId: string) => {
    const formatted = newAbcId.trim();
    const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setStudent((prev) => ({
      ...prev,
      abcId: formatted,
      isAbcLinked: true,
      abcLastSynced: timestamp,
    }));

    addNotification({
      title: 'Academic Bank of Credits (ABC) Linked',
      message: `ABC ID ${formatted} successfully mapped to DigiLocker and AIIA academic records.`,
      type: 'verification',
      link: '/student/portfolio',
    });
  };

  const syncAbcCredits = () => {
    const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setStudent((prev) => ({
      ...prev,
      isAbcLinked: true,
      abcLastSynced: timestamp,
    }));

    addNotification({
      title: 'ABC Credits Synchronized',
      message: `Academic Bank of Credits synchronized with DigiLocker. ${student.abcCredits || 148} Credits authenticated.`,
      type: 'verification',
      link: '/student/dashboard',
    });
  };

  // Reset Demo Data
  const resetDemoData = () => {
    try {
      localStorage.removeItem('karyasetu-student');
      localStorage.removeItem('karyasetu-opportunities');
      localStorage.removeItem('karyasetu-applications');
      localStorage.removeItem('karyasetu-notifications');
      localStorage.removeItem('karyasetu-unverified');
      localStorage.removeItem('karyasetu-role');
      localStorage.removeItem('karyasetu-auth');
      setStudent(INITIAL_STUDENT);
      setOpportunities(INITIAL_OPPORTUNITIES);
      setApplications(INITIAL_APPLICATIONS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setUnverifiedStudents(INITIAL_UNVERIFIED_STUDENTS);
      setRole('student');
      setIsLoggedIn(false);
      addNotification({
        title: 'Demo Data Reset',
        message: 'System data re-synchronized to pristine national cohort benchmark.',
        type: 'verification',
      });
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        login,
        logout,
        theme,
        toggleTheme,
        wallpaperMode,
        setWallpaperMode,
        toggleWallpaperMode,
        language,
        setLanguage,
        student,
        setStudent,
        opportunities,
        setOpportunities,
        applications,
        applyToOpportunity,
        updateApplicationStatus,
        endorseStudentSkill,
        updateSkillLevel,
        postNewOpportunity,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        unverifiedStudents,
        verifyStudent,
        flagStudent,
        linkAbcId,
        syncAbcCredits,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
