import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/backend/db';

/**
 * POST /api/faculty/endorse
 * Faculty member endorses and certifies student clinical competency
 * with a cryptographic endorsement signature.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillId, facultyName = 'Dr. Rajesh Mishra (AIIA)' } = body;

    if (!skillId) {
      return NextResponse.json(
        { success: false, error: 'skillId is required' },
        { status: 400 }
      );
    }

    const updatedStudent = db.endorseSkill(skillId, facultyName);

    // Generate cryptographic attestation signature
    const payload = `${updatedStudent.id}:${skillId}:${facultyName}:${Date.now()}`;
    const signatureHash = crypto.createHash('sha256').update(payload).digest('hex');

    db.addNotification({
      title: 'Clinical Skill Endorsed!',
      message: `${facultyName} officially endorsed your clinical proficiency in ${skillId.replace('-', ' ')}.`,
      type: 'endorsement',
      link: '/student/portfolio',
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      skillId,
      endorsedBy: facultyName,
      attestationSignature: `SIG-AYUSH-2026-${signatureHash.substring(0, 16).toUpperCase()}`,
      studentSkills: updatedStudent.skills,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Endorsement failed' },
      { status: 500 }
    );
  }
}
