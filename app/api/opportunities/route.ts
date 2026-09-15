import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';

/**
 * GET /api/opportunities
 * Returns opportunity listings with optional search and filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');
    const mode = searchParams.get('mode');
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let list = db.getOpportunities();

    if (domain) {
      list = list.filter((item) => item.targetDomain.includes(domain));
    }
    if (mode) {
      list = list.filter((item) => item.mode === mode);
    }
    if (category) {
      list = list.filter((item) => item.category === category);
    }
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      opportunities: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/opportunities
 * Allows industry recruiters to post a new internship or residency.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, company, category, location, mode, duration, stipend, requiredSkills, description, targetDomain } = body;

    if (!title || !company || !description) {
      return NextResponse.json(
        { success: false, error: 'Title, Company, and Description are required' },
        { status: 400 }
      );
    }

    const created = db.addOpportunity({
      title,
      company,
      category: category || 'Internship',
      location: location || 'All India',
      mode: mode || 'Hybrid',
      duration: duration || '3 Months',
      stipend: stipend || '₹15,000 / mo',
      requiredSkills: requiredSkills || [],
      minEligibility: body.minEligibility || 'Final Year BAMS / Post-Graduate Scholar',
      targetDomain: targetDomain || ['Clinical Ayurveda'],
      description,
    });

    return NextResponse.json(
      { success: true, opportunity: created },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to post opportunity' },
      { status: 500 }
    );
  }
}
