import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { rankOpportunitiesWithAI } from '@/lib/backend/aiEngine';
import { enforceRateLimit, parseJsonBody, serverError } from '@/lib/apiHelpers';
import type { StudentProfile } from '@/lib/seedData';
import type { Opportunity } from '@/lib/matchingEngine';

/**
 * POST /api/ai/match
 * Evaluates candidate competency vector against all active opportunities
 * using mathematical Vector Cosine Similarity.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'ai:match', 60, 60_000);
  if (limited) return limited;

  try {
    const body =
      (await parseJsonBody<{ student?: StudentProfile; opportunities?: Opportunity[] }>(req)) ?? {};
    const student =
      body.student && typeof body.student === 'object' && Array.isArray(body.student.skills)
        ? body.student
        : db.getStudent();
    const opportunities =
      Array.isArray(body.opportunities) && body.opportunities.length > 0
        ? body.opportunities.slice(0, 100)
        : db.getOpportunities();

    const rankedMatches = rankOpportunitiesWithAI(student, opportunities);

    return NextResponse.json({
      success: true,
      algorithm: 'Vector Cosine Similarity (Normalized Euclidean Space)',
      timestamp: new Date().toISOString(),
      studentId: student.id,
      totalEvaluated: opportunities.length,
      matches: rankedMatches,
    });
  } catch (error: unknown) {
    return serverError('ai/match:POST', error, 'AI Matching failed');
  }
}

/**
 * GET /api/ai/match
 * Convenience endpoint returning ranked opportunities for the primary demo scholar.
 */
export async function GET() {
  try {
    const student = db.getStudent();
    const opportunities = db.getOpportunities();
    const rankedMatches = rankOpportunitiesWithAI(student, opportunities);

    return NextResponse.json({
      success: true,
      algorithm: 'Vector Cosine Similarity',
      timestamp: new Date().toISOString(),
      studentName: student.name,
      matches: rankedMatches,
    });
  } catch (error: unknown) {
    return serverError('ai/match:GET', error, 'AI Matching failed');
  }
}
