import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';
import { isFirebaseConfigured } from './config';
import { db as localDb } from '@/lib/backend/db';
import type { Opportunity } from '@/lib/matchingEngine';
import type { StudentProfile, ApplicationItem, AppNotification } from '@/lib/seedData';

const COLLECTIONS = {
  STUDENTS: 'students',
  OPPORTUNITIES: 'opportunities',
  APPLICATIONS: 'applications',
  NOTIFICATIONS: 'notifications',
} as const;

/**
 * Service Layer: Bridges Next.js with Cloud Firestore
 * Includes automatic offline/demo fallback when Firebase credentials are not yet configured.
 */

export async function getStudentProfile(studentId: string = 'stu-1'): Promise<StudentProfile> {
  if (!isFirebaseConfigured()) {
    return localDb.getStudent();
  }

  try {
    const docRef = doc(db, COLLECTIONS.STUDENTS, studentId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
    // Fallback if record doesn't exist yet
    return localDb.getStudent();
  } catch (err) {
    console.warn('[Firestore] Error fetching student profile, using fallback:', err);
    return localDb.getStudent();
  }
}

export async function getOpportunities(): Promise<Opportunity[]> {
  if (!isFirebaseConfigured()) {
    return localDb.getOpportunities();
  }

  try {
    const colRef = collection(db, COLLECTIONS.OPPORTUNITIES);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Opportunity));
    }
    return localDb.getOpportunities();
  } catch (err) {
    console.warn('[Firestore] Error fetching opportunities, using fallback:', err);
    return localDb.getOpportunities();
  }
}

export async function submitApplication(
  opportunityId: string,
  studentName: string,
  college: string
): Promise<ApplicationItem | null> {
  // Always update local memory store for instant UI reactivity
  const appItem = localDb.createApplication(opportunityId, studentName, college);
  if (!appItem) return null;

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, COLLECTIONS.APPLICATIONS, appItem.id);
      await setDoc(docRef, {
        ...appItem,
        appliedAt: Timestamp.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Error persisting application:', err);
    }
  }

  return appItem;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected'
): Promise<ApplicationItem | null> {
  const updated = localDb.updateApplicationStatus(applicationId, status);
  if (!updated) return null;

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Error updating application status:', err);
    }
  }

  return updated;
}

export async function getNotifications(): Promise<AppNotification[]> {
  if (!isFirebaseConfigured()) {
    return localDb.getNotifications();
  }

  try {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification));
    }
    return localDb.getNotifications();
  } catch (err) {
    console.warn('[Firestore] Error fetching notifications, using fallback:', err);
    return localDb.getNotifications();
  }
}
