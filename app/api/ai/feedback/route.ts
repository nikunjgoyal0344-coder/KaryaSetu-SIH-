import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { isAllowedEnum, sanitizeString } from '@/lib/security';
import { badRequest, enforceRateLimit, parseJsonBody, serverError } from '@/lib/apiHelpers';

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

const VALID_FEEDBACK_TYPES = ['placement_outcome', 'course_completed', 'skill_practised'] as const;
const VALID_FEEDBACK_OUTCOMES = ['positive', 'negative', 'neutral'] as const;

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'ai:feedback', 40, 60_000);
  if (limited) return limited;

  try {
    const body = await parseJsonBody<{
      type?: unknown;
      skillId?: unknown;
      outcome?: unknown;
      details?: unknown;
    }>(req);

    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const skillId = sanitizeString(body.skillId, 80);
    const details = sanitizeString(body.details, 500);

    if (!body.type || !skillId || !body.outcome) {
      return badRequest('type, skillId, and outcome are required');
    }

    if (!isAllowedEnum(body.type, VALID_FEEDBACK_TYPES)) {
      return badRequest(`Invalid type. Must be one of: ${VALID_FEEDBACK_TYPES.join(', ')}`);
    }

    if (!isAllowedEnum(body.outcome, VALID_FEEDBACK_OUTCOMES)) {
      return badRequest(`Invalid outcome. Must be one of: ${VALID_FEEDBACK_OUTCOMES.join(', ')}`);
    }

    const type = body.type;
    const outcome = body.outcome;

    // ── Record feedback in training loop ───────────────────────────────────────
    db.recordFeedback(skillId, outcome, details);

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
  } catch (error: unknown) {
    return serverError('ai/feedback:POST', error, 'Feedback processing failed');
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
  } catch (error: unknown) {
    return serverError('ai/feedback:GET', error, 'Failed to fetch feedback history');
  }
}
