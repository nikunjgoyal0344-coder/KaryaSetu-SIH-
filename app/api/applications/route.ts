import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { LEARNING_RECOMMENDATIONS } from '@/lib/seedData';

/**
 * GET /api/applications
 * Returns active applications across student and recruiter portals.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const oppId = searchParams.get('opportunityId');
    let list = db.getApplications();

    if (oppId) {
      list = list.filter((a) => a.opportunityId === oppId);
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      applications: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications
 * Submits a 1-click candidate application for an opportunity.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId, studentName, college } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'opportunityId is required' },
        { status: 400 }
      );
    }

    const application = db.createApplication(opportunityId, studentName, college);

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Trigger notification
    db.addNotification({
      title: 'Application Submitted',
      message: `Your application for ${application.opportunityTitle} at ${application.company} was received.`,
      type: 'opportunity',
      link: '/student/dashboard',
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Application submission failed' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/applications
 * Recruiter updates applicant status (Shortlisted, Selected, Rejected).
 * Enhanced with automated feedback loop:
 *   - Selected   → readiness score boost +2, success notification
 *   - Rejected   → skill gap analysis, remediation notification with bridge course links
 *   - Shortlisted → congratulations notification
 * After ANY status change: matching engine recalibration + new-matches notification
 */
const ALLOWED_APPLICATION_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'] as const;
type ApplicationStatus = (typeof ALLOWED_APPLICATION_STATUSES)[number];

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { applicationId, status } = body;

    if (!applicationId || typeof applicationId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'applicationId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!status || !ALLOWED_APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${ALLOWED_APPLICATION_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = db.updateApplicationStatus(applicationId, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    let notification;

    // ── Status-specific feedback actions ──────────────────────────────────────
    if (status === 'Selected') {
      // Boost readiness score by +2 upon selection
      db.boostReadinessScore(2);

      // Record positive feedback event in the training loop
      db.recordFeedback('placement_outcome', 'positive', `Selected for ${updated.opportunityTitle}`);

      notification = db.addNotification({
        title: '🎉 Congratulations — You are Selected!',
        message: `You have been selected for ${updated.opportunityTitle} at ${updated.company}. Your readiness score has been boosted. Well done!`,
        type: 'selection',
        link: '/student/dashboard',
      });

    } else if (status === 'Rejected') {
      // Identify skill gaps for the rejected opportunity
      const opportunity = db.getOpportunityById(updated.opportunityId);
      const student = db.getStudent();

      let bridgeCourseText = '';
      if (opportunity) {
        const studentSkillMap = new Map(student.skills.map((s) => [s.skillId, s.level]));
        const gapSkills = opportunity.requiredSkills
          .filter((req) => {
            const studentLevel = studentSkillMap.get(req.skillId) || 0;
            return studentLevel < req.requiredLevel;
          })
          .sort((a, b) => b.importanceWeight - a.importanceWeight)
          .slice(0, 2);

        if (gapSkills.length > 0) {
          const courses = gapSkills
            .map((gap) => {
              const rec = LEARNING_RECOMMENDATIONS[gap.skillId];
              return rec
                ? `• ${rec.skillName}: "${rec.courseTitle}" (${rec.provider}, ${rec.duration})`
                : `• ${gap.skillName}: Complete a practical training module (Target Level: ${gap.requiredLevel}/5)`;
            })
            .join('\n');
          bridgeCourseText = ` Recommended bridge courses:\n${courses}`;

          // Record gap feedback for each identified skill
          gapSkills.forEach((gap) => {
            db.recordFeedback(gap.skillId, 'negative', `Gap identified after rejection from ${updated.opportunityTitle}`);
          });
        }
      }

      notification = db.addNotification({
        title: 'Application Not Selected — Skill Gap Analysis',
        message:
          `Your application for ${updated.opportunityTitle} was not selected this time. ` +
          `Our AI has identified skill gaps to help you grow.${bridgeCourseText ? '\n' + bridgeCourseText : ''}`,
        type: 'recommendation',
        link: '/student/learning-path',
      });

    } else if (status === 'Shortlisted') {
      notification = db.addNotification({
        title: '🌟 Shortlisted — Great Progress!',
        message: `Congratulations! You have been shortlisted for ${updated.opportunityTitle} at ${updated.company}. Prepare for the next round.`,
        type: 'selection',
        link: '/student/dashboard',
      });
    } else {
      // Generic status change notification
      notification = db.addNotification({
        title: `Application Status Updated: ${status}`,
        message: `Your application for ${updated.opportunityTitle} is now marked as ${status}.`,
        type: 'opportunity',
        link: '/student/dashboard',
      });
    }

    // ── Matching Engine Recalibration (runs after every status change) ────────
    const recalibration = db.recalibrateMatchingEngine();

    // Fetch titles for top re-ranked opportunities
    const topOpportunity = recalibration.topOpportunities.length > 0
      ? db.getOpportunityById(recalibration.topOpportunities[0])
      : null;

    // Notify about newly re-ranked opportunities
    db.addNotification({
      title: '🔁 AI Matching Engine Recalibrated',
      message: topOpportunity
        ? `Based on your latest activity, new top match: "${topOpportunity.title}" at ${topOpportunity.company}. Check your opportunities!`
        : 'Your opportunity rankings have been recalibrated based on latest profile data.',
      type: 'recommendation',
      link: '/student/internships',
    });

    return NextResponse.json({
      success: true,
      application: updated,
      matchingEngineUpdate: {
        newTopOpportunity: topOpportunity
          ? { id: topOpportunity.id, title: topOpportunity.title, company: topOpportunity.company }
          : null,
        recalibratedAt: recalibration.recalibratedAt,
      },
      notification,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Status update failed' },
      { status: 500 }
    );
  }
}
