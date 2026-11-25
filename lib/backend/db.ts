import crypto from 'node:crypto';
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
} from '../seedData';
import type { Opportunity } from '../matchingEngine';
import { type AuthUser, DEMO_USERS } from '../auth';

/**
 * FeedbackEvent — records a student's training loop feedback event.
 */
export interface FeedbackEvent {
  id: string;
  skillId: string;
  outcome: 'positive' | 'negative' | 'neutral' | string;
  details: string;
  timestamp: string;
}

/**
 * Server-Side In-Memory State Repository
 * Uses indexed Maps for O(1) ID lookups alongside ordered arrays.
 */
export class ServerDatabase {
  private student: StudentProfile;
  private opportunities: Opportunity[];
  private opportunityIndex: Map<string, Opportunity>;
  private applications: ApplicationItem[];
  private applicationIndex: Map<string, ApplicationItem>;
  private notifications: AppNotification[];
  private unverifiedStudents: UnverifiedStudent[];
  private unverifiedIndex: Map<string, UnverifiedStudent>;
  private users: Record<string, AuthUser>;
  private feedbackLog: FeedbackEvent[] = [];

  constructor() {
    this.student = structuredClone(INITIAL_STUDENT);
    this.opportunities = structuredClone(INITIAL_OPPORTUNITIES);
    this.opportunityIndex = new Map(this.opportunities.map((o) => [o.id, o]));
    this.applications = structuredClone(INITIAL_APPLICATIONS);
    this.applicationIndex = new Map(this.applications.map((a) => [a.id, a]));
    this.notifications = structuredClone(INITIAL_NOTIFICATIONS);
    this.unverifiedStudents = structuredClone(INITIAL_UNVERIFIED_STUDENTS);
    this.unverifiedIndex = new Map(this.unverifiedStudents.map((s) => [s.id, s]));
    this.users = structuredClone(DEMO_USERS);
  }

  // --- STUDENT ---
  public getStudent(): StudentProfile {
    return this.student;
  }

  public updateSkillLevel(skillId: string, levelGain: number): StudentProfile {
    const existing = this.student.skills.find((s) => s.skillId === skillId);
    if (existing) {
      existing.level = Math.min(5, existing.level + levelGain);
    } else {
      this.student.skills.push({
        skillId,
        skillName: skillId.replace(/-/g, ' ').toUpperCase(),
        level: Math.min(5, 1 + levelGain),
      });
    }

    this.student.readinessScore = Math.min(99, this.student.readinessScore + levelGain * 2);
    return this.student;
  }

  public endorseSkill(skillId: string, facultyName: string): StudentProfile {
    const skill = this.student.skills.find((s) => s.skillId === skillId);
    if (skill) {
      skill.isVerified = true;
      skill.endorsedBy = facultyName;
    }
    return this.student;
  }

  // --- OPPORTUNITIES ---
  public getOpportunities(): Opportunity[] {
    return this.opportunities;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.opportunityIndex.get(id);
  }

  public addOpportunity(newOpp: Omit<Opportunity, 'id' | 'postedAt' | 'applicantsCount'>): Opportunity {
    const created: Opportunity = {
      ...newOpp,
      id: `opp-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      postedAt: 'Just now',
      applicantsCount: 0,
    };
    this.opportunities.unshift(created);
    this.opportunityIndex.set(created.id, created);
    return created;
  }

  // --- APPLICATIONS ---
  public getApplications(): ApplicationItem[] {
    return this.applications;
  }

  public createApplication(oppId: string, studentName?: string, college?: string): ApplicationItem | null {
    const opp = this.opportunityIndex.get(oppId);
    if (!opp) return null;

    const existing = this.applications.find((a) => a.opportunityId === oppId);
    if (existing) return existing;

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      company: opp.company,
      appliedDate: 'Today',
      status: 'Applied',
      matchScore: 92,
      studentName: studentName || this.student.name,
      studentCollege: college || this.student.college,
    };

    this.applications.unshift(newApp);
    this.applicationIndex.set(newApp.id, newApp);
    opp.applicantsCount += 1;
    return newApp;
  }

  public updateApplicationStatus(appId: string, status: ApplicationItem['status']): ApplicationItem | null {
    const app = this.applicationIndex.get(appId);
    if (app) {
      app.status = status;
      return app;
    }
    return null;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): AppNotification[] {
    return this.notifications;
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const created: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      timestamp: 'Just now',
      read: false,
    };
    this.notifications.unshift(created);
    return created;
  }

  public markNotificationRead(id: string): void {
    const n = this.notifications.find((item) => item.id === id);
    if (n) n.read = true;
  }

  // --- INSTITUTION VERIFICATION ---
  public getUnverifiedStudents(): UnverifiedStudent[] {
    return this.unverifiedStudents;
  }

  public verifyStudent(studentId: string, action: 'Verified' | 'Flagged'): UnverifiedStudent | null {
    const target = this.unverifiedIndex.get(studentId);
    if (target) {
      target.status = action;
      return target;
    }
    return null;
  }

  // --- ABC ID / APAAR ---
  public linkAbcId(abcId: string): StudentProfile {
    this.student.abcId = abcId;
    this.student.isAbcLinked = true;
    this.student.abcLastSynced = 'Just now (DigiLocker Synced)';
    return this.student;
  }

  public syncAbcCredits(): StudentProfile {
    this.student.abcCredits = Math.min(160, (this.student.abcCredits || 148) + 4);
    this.student.abcLastSynced = 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return this.student;
  }

  // --- AUTH ---
  public getUser(role: string): AuthUser {
    return this.users[role] || this.users.student;
  }

  // --- FEEDBACK & CONTINUOUS TRAINING LOOP ---
  public recordFeedback(skillId: string, outcome: string, details: string = ''): void {
    const event: FeedbackEvent = {
      id: `fb-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      skillId,
      outcome,
      timestamp: new Date().toISOString(),
      details,
    };
    this.feedbackLog.push(event);
  }

  public getFeedbackHistory(): FeedbackEvent[] {
    return [...this.feedbackLog];
  }

  public recalibrateMatchingEngine(): { recalibratedAt: string; topOpportunities: string[] } {
    const studentSkillMap = new Map(this.student.skills.map((s) => [s.skillId, s.level]));

    const scored = this.opportunities.map((opp) => {
      let score = 0;
      let total = 0;
      for (const req of opp.requiredSkills) {
        const studentLevel = studentSkillMap.get(req.skillId) || 0;
        const ratio = Math.min(1, studentLevel / Math.max(1, req.requiredLevel));
        score += ratio * req.importanceWeight;
        total += req.importanceWeight;
      }
      const matchPct = total > 0 ? Math.round((score / total) * 100) : 50;
      return { id: opp.id, matchPct };
    });

    scored.sort((a, b) => b.matchPct - a.matchPct);

    return {
      recalibratedAt: new Date().toISOString(),
      topOpportunities: scored.slice(0, 3).map((o) => o.id),
    };
  }

  public boostReadinessScore(amount: number): StudentProfile {
    this.student.readinessScore = Math.min(99, this.student.readinessScore + amount);
    return this.student;
  }
}

// Global Singleton for Next.js Server Runtime
const globalForDb = globalThis as unknown as { dbInstance?: ServerDatabase };

export const db = globalForDb.dbInstance ?? new ServerDatabase();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbInstance = db;
}
