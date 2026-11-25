import { NextRequest, NextResponse } from 'next/server';
import { sanitizeString } from '@/lib/security';
import { getRestrictedCorsHeaders, serverError } from '@/lib/apiHelpers';
import { getQuestionsForSkill } from '@/lib/backend/quizBank';

const CORS_HEADERS = getRestrictedCorsHeaders('GET, OPTIONS');

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/ai/quiz?skillId=panchakarma-therapy&difficulty=intermediate
 * Returns 5 MCQ questions for a given AYUSH skill, falling back to generic questions.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = sanitizeString(searchParams.get('skillId'), 80);
    const difficulty = sanitizeString(searchParams.get('difficulty'), 32) || 'intermediate';

    const questions = getQuestionsForSkill(skillId);

    return NextResponse.json(
      {
        success: true,
        skillId: skillId || 'general-ayush',
        difficulty,
        totalQuestions: questions.length,
        questions,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    return serverError('ai/quiz', error, 'Internal server error', CORS_HEADERS);
  }
}
