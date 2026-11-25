import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import {
  ALLOWED_OPPORTUNITY_CATEGORIES,
  ALLOWED_WORK_MODES,
  isAllowedEnum,
  sanitizeString,
} from '@/lib/security';
import { badRequest, enforceRateLimit, parseJsonBody, serverError, verifyOptionalSessionRole } from '@/lib/apiHelpers';

/**
 * GET /api/opportunities
 * Returns opportunity listings with single-pass search and filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = sanitizeString(searchParams.get('domain'), 80);
    const mode = sanitizeString(searchParams.get('mode'), 30);
    const category = sanitizeString(searchParams.get('category'), 40);
    const q = sanitizeString(searchParams.get('q'), 120).toLowerCase();

    const list = db.getOpportunities().filter((item) => {
      if (domain && !item.targetDomain.includes(domain)) return false;
      if (mode && item.mode !== mode) return false;
      if (category && item.category !== category) return false;
      if (q) {
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      count: list.length,
      opportunities: list,
    });
  } catch (error: unknown) {
    return serverError('opportunities:GET', error, 'Failed to fetch opportunities');
  }
}

/**
 * POST /api/opportunities
 * Allows industry recruiters to post a new internship or residency with strict validation.
 */
export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, 'opportunities:post', 30, 60_000);
  if (limited) return limited;

  const authError = verifyOptionalSessionRole(req, ['industry', 'institution']);
  if (authError) return authError;

  try {
    const body = await parseJsonBody<Record<string, unknown>>(req);
    if (!body) {
      return badRequest('Invalid JSON request body');
    }

    const title = sanitizeString(body.title, 150);
    const company = sanitizeString(body.company, 150);
    const description = sanitizeString(body.description, 2000);

    if (!title || !company || !description) {
      return badRequest('Title, Company, and Description are required');
    }

    const category = body.category ?? 'Internship';
    if (!isAllowedEnum(category, ALLOWED_OPPORTUNITY_CATEGORIES)) {
      return badRequest(`Invalid category. Must be one of: ${ALLOWED_OPPORTUNITY_CATEGORIES.join(', ')}`);
    }

    const mode = body.mode ?? 'Hybrid';
    if (!isAllowedEnum(mode, ALLOWED_WORK_MODES)) {
      return badRequest(`Invalid mode. Must be one of: ${ALLOWED_WORK_MODES.join(', ')}`);
    }

    const location = sanitizeString(body.location, 120) || 'All India';
    const duration = sanitizeString(body.duration, 60) || '3 Months';
    const stipend = sanitizeString(body.stipend, 60) || '₹15,000 / mo';
    const minEligibility =
      sanitizeString(body.minEligibility, 150) || 'Final Year BAMS / Post-Graduate Scholar';

    const targetDomain = Array.isArray(body.targetDomain)
      ? body.targetDomain
          .map((d) => sanitizeString(d, 60))
          .filter(Boolean)
          .slice(0, 10)
      : ['Clinical Ayurveda'];

    const requiredSkills = Array.isArray(body.requiredSkills)
      ? body.requiredSkills.slice(0, 15)
      : [];

    const created = db.addOpportunity({
      title,
      company,
      category,
      location,
      mode,
      duration,
      stipend,
      requiredSkills,
      minEligibility,
      targetDomain: targetDomain.length > 0 ? targetDomain : ['Clinical Ayurveda'],
      description,
    });

    return NextResponse.json({ success: true, opportunity: created }, { status: 201 });
  } catch (error: unknown) {
    return serverError('opportunities:POST', error, 'Failed to post opportunity');
  }
}
