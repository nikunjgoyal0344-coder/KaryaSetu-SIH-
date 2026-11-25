'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  INITIAL_STUDENT,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_UNVERIFIED_STUDENTS,
  type StudentProfile,
  type ApplicationItem,
  type AppNotification,
  type UnverifiedStudent,
} from './seedData';
import type { Opportunity } from './matchingEngine';

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
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  unverifiedStudents: UnverifiedStudent[];
  verifyStudent: (studentId: string) => void;
  flagStudent: (studentId: string) => void;
  linkAbcId: (abcId: string) => void;
  syncAbcCredits: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('student');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [wallpaperMode, setWallpaperModeState] = useState<WallpaperMode>('live');
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [unverifiedStudents, setUnverifiedStudents] = useState<UnverifiedStudent[]>(
    INITIAL_UNVERIFIED_STUDENTS
  );
  const [language, setLanguageState] = useState<Language>('en');
  const isHydratedRef = useRef(false);

  // Hydrate preferences and persisted domain state once on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('karyasetu-theme') as ThemeMode | null;
    const prefersDark =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    const effectiveTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(effectiveTheme);
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    document.documentElement.classList.toggle('light', effectiveTheme !== 'dark');

    const savedWallpaper = localStorage.getItem('karyasetu-wallpaper') as WallpaperMode | null;
    if (savedWallpaper === 'live' || savedWallpaper === 'plain') {
      setWallpaperModeState(savedWallpaper);
    }

    const savedLang = localStorage.getItem('karyasetu-lang') as Language | null;
    if (savedLang === 'hi') {
      setLanguageState('hi');
      document.documentElement.lang = 'hi';
    } else {
      setLanguageState('en');
      document.documentElement.lang = 'en';
      if (typeof document !== 'undefined') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=/en/en; path=/;';
        if (typeof window !== 'undefined' && window.location.hostname) {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname};`;
        }
      }
    }

    try {
      const savedStudent = safeJsonParse<StudentProfile>(localStorage.getItem('karyasetu-student'));
      if (savedStudent && typeof savedStudent === 'object' && Array.isArray(savedStudent.skills)) {
        setStudent(savedStudent);
      }

      const savedOpps = safeJsonParse<Opportunity[]>(localStorage.getItem('karyasetu-opportunities'));
      if (Array.isArray(savedOpps)) setOpportunities(savedOpps);

      const savedApps = safeJsonParse<ApplicationItem[]>(localStorage.getItem('karyasetu-applications'));
      if (Array.isArray(savedApps)) setApplications(savedApps);

      const savedNotifs = safeJsonParse<AppNotification[]>(localStorage.getItem('karyasetu-notifications'));
      if (Array.isArray(savedNotifs)) setNotifications(savedNotifs);

      const savedUnv = safeJsonParse<UnverifiedStudent[]>(localStorage.getItem('karyasetu-unverified'));
      if (Array.isArray(savedUnv)) setUnverifiedStudents(savedUnv);

      const savedRole = localStorage.getItem('karyasetu-role') as UserRole | null;
      if (savedRole && ['student', 'industry', 'faculty', 'institution'].includes(savedRole)) {
        setRole(savedRole);
      }

      const savedAuth = localStorage.getItem('karyasetu-auth');
      if (savedAuth !== null) setIsLoggedIn(savedAuth === 'true');
    } catch (e) {
      console.warn('Could not restore state from localStorage:', e);
    } finally {
      isHydratedRef.current = true;
    }
  }, []);

  // Persist domain changes only after initial hydration completes
  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('karyasetu-student', JSON.stringify(student));
    } catch {
      // Ignore storage quota errors
    }
  }, [student]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('karyasetu-opportunities', JSON.stringify(opportunities));
    } catch {
      // Ignore storage quota errors
    }
  }, [opportunities]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('karyasetu-applications', JSON.stringify(applications));
    } catch {
      // Ignore storage quota errors
    }
  }, [applications]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('karyasetu-notifications', JSON.stringify(notifications));
    } catch {
      // Ignore storage quota errors
    }
  }, [notifications]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('karyasetu-unverified', JSON.stringify(unverifiedStudents));
    } catch {
      // Ignore storage quota errors
    }
  }, [unverifiedStudents]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('karyasetu-role', role);
      localStorage.setItem('karyasetu-auth', String(isLoggedIn));
    } catch {
      // Ignore storage quota errors
    }
  }, [role, isLoggedIn]);

  const setLanguage = useCallback((newLang: Language) => {
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

      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = newLang;
        combo.dispatchEvent(new Event('change'));
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('karyasetu-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next !== 'dark');
      return next;
    });
  }, []);

  const setWallpaperMode = useCallback((mode: WallpaperMode) => {
    setWallpaperModeState(mode);
    try {
      localStorage.setItem('karyasetu-wallpaper', mode);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleWallpaperMode = useCallback(() => {
    setWallpaperModeState((prev) => {
      const next = prev === 'live' ? 'plain' : 'live';
      try {
        localStorage.setItem('karyasetu-wallpaper', next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const login = useCallback((newRole: UserRole) => {
    setRole(newRole);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: AppNotification = {
        ...notif,
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const applyToOpportunity = useCallback(
    (opp: Opportunity): boolean => {
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
    },
    [applications, student.name, student.college, addNotification]
  );

  const updateApplicationStatus = useCallback(
    (appId: string, status: ApplicationItem['status']) => {
      const targetApp = applications.find((a) => a.id === appId);
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));

      if (targetApp) {
        addNotification({
          title: `Status Update: ${status}`,
          message: `${targetApp.company} updated your application status for "${targetApp.opportunityTitle}" to ${status}.`,
          type: 'selection',
          link: '/student/internships',
        });
      }
    },
    [applications, addNotification]
  );

  const endorseStudentSkill = useCallback(
    (skillId: string, facultyName: string) => {
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
    },
    [student.skills, addNotification]
  );

  const updateSkillLevel = useCallback((skillId: string, levelGain: number) => {
    setStudent((prev) => {
      const exists = prev.skills.find((s) => s.skillId === skillId);
      const updatedSkills = exists
        ? prev.skills.map((s) =>
            s.skillId === skillId ? { ...s, level: Math.min(5, Math.max(s.level, levelGain)) } : s
          )
        : [
            ...prev.skills,
            { skillId, skillName: skillId.replace(/-/g, ' '), level: levelGain },
          ];

      return {
        ...prev,
        skills: updatedSkills,
        readinessScore: Math.min(96, prev.readinessScore + 2),
      };
    });
  }, []);

  const postNewOpportunity = useCallback(
    (opp: Omit<Opportunity, 'id' | 'postedAt' | 'applicantsCount'>) => {
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
    },
    [addNotification]
  );

  const verifyStudent = useCallback(
    (studentId: string) => {
      setUnverifiedStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: 'Verified' } : s))
      );

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
    },
    [addNotification]
  );

  const flagStudent = useCallback((studentId: string) => {
    setUnverifiedStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'Flagged' } : s))
    );
  }, []);

  const linkAbcId = useCallback(
    (newAbcId: string) => {
      const formatted = newAbcId.trim();
      const timestamp =
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ', ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' IST';

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
    },
    [addNotification]
  );

  const syncAbcCredits = useCallback(() => {
    const timestamp =
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ', ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' IST';

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
  }, [student.abcCredits, addNotification]);

  const resetDemoData = useCallback(() => {
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
    } catch {
      // Ignore storage errors
    }
  }, [addNotification]);

  const contextValue = useMemo<AppContextType>(
    () => ({
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
    }),
    [
      role,
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
      opportunities,
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
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
