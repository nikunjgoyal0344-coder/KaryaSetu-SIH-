export type UserRole = 'student' | 'industry' | 'faculty' | 'institution';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  affiliation: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, readonly string[]> = {
  student: ['assessments:take', 'opportunities:view', 'applications:create', 'portfolio:view', 'abc:sync'],
  industry: ['opportunities:create', 'applications:review', 'applications:shortlist', 'analytics:view'],
  faculty: ['skills:endorse', 'students:mentor', 'fdp:apply'],
  institution: ['students:verify', 'students:flag', 'analytics:export', 'abc:audit'],
};

/**
 * Checks whether a stakeholder role has a granted capability in the RBAC policy matrix.
 */
export function hasRolePermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  student: {
    id: 'stu-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@aiia.gov.in',
    role: 'student',
    affiliation: 'AIIA New Delhi - Final Year BAMS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  industry: {
    id: 'ind-1',
    name: 'Dr. Vikram Malhotra',
    email: 'v.malhotra@dabur.com',
    role: 'industry',
    affiliation: 'Dabur Research Foundation (DRF)',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  faculty: {
    id: 'fac-1',
    name: 'Dr. Rajesh Mishra',
    email: 'rajesh.mishra@aiia.gov.in',
    role: 'faculty',
    affiliation: 'Associate Professor, Dept. of Dravyaguna, AIIA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  institution: {
    id: 'inst-1',
    name: 'Prof. (Dr.) Sujata Kadam',
    email: 'dean.academics@aiia.gov.in',
    role: 'institution',
    affiliation: 'Dean of Academics & Student Affairs, AIIA New Delhi',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
  },
};

export function getCurrentUser(role: 'student' | 'industry' | 'faculty' | 'institution'): AuthUser {
  return DEMO_USERS[role] || DEMO_USERS.student;
}
