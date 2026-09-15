import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';

/**
 * POST /api/skills/diagnostics
 * Updates student skill level upon completing clinical diagnostic quiz or bridge course.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skillId, levelGain = 1, moduleTitle } = body;

    if (!skillId) {
      return NextResponse.json(
        { success: false, error: 'skillId is required' },
        { status: 400 }
      );
    }

    const updatedStudent = db.updateSkillLevel(skillId, levelGain);

    db.addNotification({
      title: 'Skill Level Upgraded!',
      message: `Completed "${moduleTitle || skillId}". Competency upgraded by +${levelGain}.`,
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Diagnostic skill update failed' },
      { status: 500 }
    );
  }
}
