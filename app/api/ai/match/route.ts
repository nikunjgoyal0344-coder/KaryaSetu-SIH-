import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { rankOpportunitiesWithAI } from '@/lib/backend/aiEngine';

/**
 * POST /api/ai/match
 * Evaluates candidate competency vector against all active opportunities
 * using mathematical Vector Cosine Similarity.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const student = body.student || db.getStudent();
    const opportunities = body.opportunities || db.getOpportunities();

    const rankedMatches = rankOpportunitiesWithAI(student, opportunities);

    return NextResponse.json({
      success: true,
      algorithm: 'Vector Cosine Similarity (Normalized Euclidean Space)',
      timestamp: new Date().toISOString(),
      studentId: student.id,
      totalEvaluated: opportunities.length,
      matches: rankedMatches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'AI Matching failed' },
      { status: 500 }
    );
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'AI Matching failed' },
      { status: 500 }
    );
  }
}
