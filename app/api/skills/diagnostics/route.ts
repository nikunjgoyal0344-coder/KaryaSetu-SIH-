import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { clampNumber, sanitizeString } from '@/lib/security';
import { badRequest, parseJsonBody, serverError } from '@/lib/apiHelpers';

/**
 * POST /api/skills/diagnostics
 * Updates student skill level upon completing clinical diagnostic quiz or bridge course.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody<{
      skillId?: unknown;
      levelGain?: unknown;
      moduleTitle?: unknown;
    }>(req);

    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const skillId = sanitizeString(body.skillId, 80);
    if (!skillId) {
      return badRequest('skillId is required');
    }

    const levelGain = clampNumber(body.levelGain ?? 1, 1, 5, 1);
    const moduleTitle = sanitizeString(body.moduleTitle, 150) || skillId;

    const updatedStudent = db.updateSkillLevel(skillId, levelGain);

    db.addNotification({
      title: 'Skill Level Upgraded!',
      message: `Completed "${moduleTitle}". Competency upgraded by +${levelGain}.`,
      type: 'recommendation',
      link: '/student/dashboard',
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      updatedSkillId: skillId,
      newReadinessScore: updatedStudent.readinessScore,
      skills: updatedStudent.skills,
    });
  } catch (error: unknown) {
    return serverError('skills/diagnostics', error, 'Diagnostic skill update failed');
  }
}
