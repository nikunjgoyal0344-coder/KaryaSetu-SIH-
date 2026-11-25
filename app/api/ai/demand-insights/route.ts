import { NextResponse } from 'next/server';
import { db } from '@/lib/backend/db';
import { serverError } from '@/lib/apiHelpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ai/demand-insights
 * Returns real-time AYUSH skill demand trends derived from opportunity data.
 *
 * Groups all required skills across live opportunities and computes:
 *   - demandScore      : weighted importance score across all opportunities
 *   - opportunityCount : number of opportunities requiring this skill
 *   - avgStipend       : average stipend of opportunities requiring this skill
 *   - trend            : 'Rising' | 'Stable' | 'Declining' (based on demand score thresholds)
 *   - topCompanies     : companies with the highest importance weight for this skill
 *
 * Useful for students deciding which AYUSH skills to prioritise.
 */
export async function GET() {
  try {
    const opportunities = db.getOpportunities();
    const lastUpdated = new Date().toISOString();

    // ── Aggregate skill demand from all opportunities ──────────────────────────
    interface SkillAggregate {
      skillId: string;
      skillName: string;
      totalWeight: number;      // sum of importanceWeights
      opportunityCount: number;
      stipendValues: number[];  // extracted numeric stipend values (₹/month)
      companiesMap: Map<string, number>; // company → max importance weight
    }

    const skillMap = new Map<string, SkillAggregate>();

    opportunities.forEach((opp) => {
      // Extract numeric stipend value for averaging (e.g. "₹22,000 / month" → 22000)
      const stipendMatch = opp.stipend.replace(/,/g, '').match(/[\d]+/);
      const stipendValue = stipendMatch ? parseInt(stipendMatch[0], 10) : 0;

      opp.requiredSkills.forEach((req) => {
        if (!skillMap.has(req.skillId)) {
          skillMap.set(req.skillId, {
            skillId: req.skillId,
            skillName: req.skillName,
            totalWeight: 0,
            opportunityCount: 0,
            stipendValues: [],
            companiesMap: new Map(),
          });
        }

        const agg = skillMap.get(req.skillId)!;
        agg.totalWeight += req.importanceWeight;
        agg.opportunityCount += 1;
        if (stipendValue > 0) {
          agg.stipendValues.push(stipendValue);
        }

        // Track company with its max importance weight for this skill
        const currentCompanyWeight = agg.companiesMap.get(opp.company) || 0;
        agg.companiesMap.set(opp.company, Math.max(currentCompanyWeight, req.importanceWeight));
      });
    });

    // ── Build insights array ───────────────────────────────────────────────────
    const insights = Array.from(skillMap.values())
      .map((agg) => {
        const demandScore = Math.round((agg.totalWeight / Math.max(1, opportunities.length)) * 20); // scale 0–100

        // Average stipend across opportunities that have this skill
        const avgStipendValue = agg.stipendValues.length > 0
          ? Math.round(agg.stipendValues.reduce((sum, v) => sum + v, 0) / agg.stipendValues.length)
          : 0;
        const avgStipend = avgStipendValue > 0
          ? `₹${avgStipendValue.toLocaleString('en-IN')} / month`
          : 'Not specified';

        // Trend classification based on demand score
        let trend: 'Rising' | 'Stable' | 'Declining';
        if (demandScore >= 60) trend = 'Rising';
        else if (demandScore >= 30) trend = 'Stable';
        else trend = 'Declining';

        // Top companies sorted by importance weight (descending), take top 3
        const topCompanies = Array.from(agg.companiesMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([company]) => company);

        return {
          skillId: agg.skillId,
          skillName: agg.skillName,
          demandScore,
          opportunityCount: agg.opportunityCount,
          avgStipend,
          trend,
          topCompanies,
        };
      })
      // Sort by demandScore descending
      .sort((a, b) => b.demandScore - a.demandScore);

    return NextResponse.json({
      success: true,
      insights,
      lastUpdated,
    });
  } catch (error: unknown) {
    return serverError('ai/demand-insights', error, 'Failed to generate demand insights');
  }
}
