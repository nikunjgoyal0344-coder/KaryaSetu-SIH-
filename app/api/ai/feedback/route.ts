import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';

/**
 * POST /api/ai/feedback
 * Explicit feedback submission for the Continuous Training Loop.
 *
 * Body:
 *   type:    'placement_outcome' | 'course_completed' | 'skill_practised'
 *   skillId: string  — the AYUSH skill identifier
 *   outcome: 'positive' | 'negative' | 'neutral'
 *   details: string  — optional free-text context
 *
 * Behaviour:
 *   positive → skill level +0.5 (capped at 5)
 *   negative → no level change, skill flagged for assessment
 *   neutral  → feedback logged only, no level mutation
 *
 * After processing: re-ranks top 3 opportunities via matching engine.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, skillId, outcome, details } = body as {
      type: 'placement_outcome' | 'course_completed' | 'skill_practised';
      skillId: string;
      outcome: 'positive' | 'negative' | 'neutral';
      details?: string;
    };

    // ── Validation ─────────────────────────────────────────────────────────────
    if (!type || !skillId || !outcome) {
      return NextResponse.json(
        { success: false, error: 'type, skillId, and outcome are required' },
        { status: 400 }
      );
    }

    const validTypes = ['placement_outcome', 'course_completed', 'skill_practised'];
    const validOutcomes = ['positive', 'negative', 'neutral'];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validOutcomes.includes(outcome)) {
      return NextResponse.json(
        { success: false, error: `Invalid outcome. Must be one of: ${validOutcomes.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Record feedback in training loop ───────────────────────────────────────
    db.recordFeedback(skillId, outcome, details || '');

    const student = db.getStudent();
    const existingSkill = student.skills.find((s) => s.skillId === skillId);
    const prevLevel = existingSkill?.level ?? 0;

    let updated = false;
    let newSkillLevel = prevLevel;
    let notificationTitle = '';
    let notificationMessage = '';
    let notificationType: 'recommendation' | 'selection' | 'endorsement' | 'opportunity' = 'recommendation';

    // ── Outcome-specific mutations ─────────────────────────────────────────────
    if (outcome === 'positive') {
      // Positive feedback → +0.5 skill level (capped at 5)
      const updatedStudent = db.updateSkillLevel(skillId, 0.5);
      const updatedSkill = updatedStudent.skills.find((s) => s.skillId === skillId);
      newSkillLevel = updatedSkill?.level ?? prevLevel;
      updated = true;

      notificationTitle = '📈 Learning Loop Updated — Skill Level Increased';
      notificationMessage = `Great feedback! Based on your ${type.replace(/_/g, ' ')} outcome, your "${existingSkill?.skillName || skillId}" skill has been updated to Level ${newSkillLevel.toFixed(1)}/5. Keep it up!`;
      notificationType = 'recommendation';

    } else if (outcome === 'negative') {
      // Negative feedback → no level change, but flag the skill for re-assessment
      // We record the flag without mutation
      updated = false;
      newSkillLevel = prevLevel;

      notificationTitle = '🔍 Skill Flagged for Re-Assessment';
      notificationMessage = `Based on your recent ${type.replace(/_/g, ' ')} feedback, "${existingSkill?.skillName || skillId}" has been flagged for a deeper assessment. Complete a targeted practice session to level up.`;
      notificationType = 'recommendation';

    } else {
      // Neutral → just log it
      updated = false;
      newSkillLevel = prevLevel;

      notificationTitle = '📝 Feedback Noted — Learning Loop Updated';
      notificationMessage = `Your neutral feedback on "${existingSkill?.skillName || skillId}" has been logged. Continue practising to improve your proficiency score.`;
      notificationType = 'opportunity';
    }

    // ── Add notification ───────────────────────────────────────────────────────
    const notification = db.addNotification({
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      link: '/student/learning-path',
    });

    // ── Recalibrate matching engine ────────────────────────────────────────────
    const recalibration = db.recalibrateMatchingEngine();

    // Fetch top 3 re-ranked opportunities with details
    const rerankedOpportunities = recalibration.topOpportunities
      .map((oppId) => {
        const opp = db.getOpportunityById(oppId);
        if (!opp) return null;
        return {
          id: opp.id,
          title: opp.title,
          company: opp.company,
          stipend: opp.stipend,
          location: opp.location,
          mode: opp.mode,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      updated,
      newSkillLevel,
      feedbackType: type,
      outcome,
      rerankedOpportunities,
      notification,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Feedback processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/feedback
 * Returns the complete feedback history for admin/analytics review.
 */
export async function GET() {
  try {
    const history = db.getFeedbackHistory();
    return NextResponse.json({
      success: true,
      count: history.length,
      feedbackHistory: history,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch feedback history' },
      { status: 500 }
    );
  }
}
