import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { rankOpportunitiesWithAI } from '@/lib/backend/aiEngine';

/**
 * POST /api/ai/explain
 * Returns explainable AI insights, vector affinity breakdown, and remedial roadmap
 * for a specific opportunity and candidate.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'opportunityId is required' },
        { status: 400 }
      );
    }

    const student = body.student || db.getStudent();
    const opportunity = db.getOpportunityById(opportunityId);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'AI explanation generation failed' },
      { status: 500 }
    );
  }
}
