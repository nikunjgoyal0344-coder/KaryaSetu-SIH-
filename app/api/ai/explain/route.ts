import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { rankOpportunitiesWithAI } from '@/lib/backend/aiEngine';
import { sanitizeString } from '@/lib/security';
import { badRequest, enforceRateLimit, notFound, parseJsonBody, serverError } from '@/lib/apiHelpers';
import type { StudentProfile } from '@/lib/seedData';

/**
 * POST /api/ai/explain
 * Returns explainable AI insights, vector affinity breakdown, and remedial roadmap
 * for a specific opportunity and candidate.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'ai:explain', 60, 60_000);
  if (limited) return limited;

  try {
    const body = await parseJsonBody<{ opportunityId?: unknown; student?: StudentProfile }>(req);
    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const opportunityId = sanitizeString(body.opportunityId, 64);
    if (!opportunityId) {
      return badRequest('opportunityId is required');
    }

    const student =
      body.student && typeof body.student === 'object' && Array.isArray(body.student.skills)
        ? body.student
        : db.getStudent();
    const opportunity = db.getOpportunityById(opportunityId);

    if (!opportunity) {
      return notFound('Opportunity not found');
    }

    const [matchResult] = rankOpportunitiesWithAI(student, [opportunity]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      studentName: student.name,
      cosineSimilarity: matchResult.cosineSimilarity,
      compositeScore: matchResult.compositeMatchScore,
      explainableReasoning: matchResult.explainableReasoning,
      competencyAlignment: matchResult.matchedCompetencies,
      criticalGaps: matchResult.criticalGaps,
      remedialRoadmap: matchResult.recommendationRoadmap,
    });
  } catch (error: unknown) {
    return serverError('ai/explain', error, 'AI explanation generation failed');
  }
}
