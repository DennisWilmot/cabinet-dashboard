import type { MinistryData } from './types';

/**
 * Returns a copy of the ministry data with all current-year mock actuals
 * stripped out. Estimates of Expenditure data (allocations, prior year,
 * entity structure, personnel, project details) is preserved.
 */
export function stripActuals(data: MinistryData): MinistryData {
  const emptySnaps = () => [] as MinistryData['overview']['actuals'];

  return {
    ...data,
    overview: {
      ...data.overview,
      totalSpent: 0,
      actuals: emptySnaps(),
    },
    revenue: {
      ...data.revenue,
      totalCollected: 0,
      variance: -data.revenue.totalTarget,
      variancePct: -100,
      bySplit: data.revenue.bySplit.map(s => ({ ...s, amount: 0, pct: 0 })),
      actuals: emptySnaps(),
    },
    fixedObligations: {
      ...data.fixedObligations,
      totalPaid: 0,
      actuals: emptySnaps(),
      priorYearActuals: data.fixedObligations.priorYearActuals,
      obligations: data.fixedObligations.obligations.map(o => ({
        ...o,
        paid: 0,
        paymentStatus: 'pending' as const,
        actuals: emptySnaps(),
      })),
    },
    operational: {
      ...data.operational,
      totalSpent: 0,
      utilizationPct: 0,
      actuals: emptySnaps(),
      entities: data.operational.entities.map(e => ({
        ...e,
        spent: 0,
        utilizationPct: 0,
        actuals: emptySnaps(),
        ...(e.revenueData ? {
          revenueData: {
            ...e.revenueData,
            collected: 0,
            variance: -e.revenueData.target,
            variancePct: -100,
            actuals: emptySnaps(),
          },
        } : {}),
        kpis: e.kpis.map(k => ({ ...k, actual: 0 })),
      })),
    },
    capital: {
      ...data.capital,
      totalSpent: 0,
      actuals: emptySnaps(),
      projects: data.capital.projects.map(p => ({
        ...p,
        currentYearSpent: 0,
        cumulativeSpend: p.cumulativeSpend - p.currentYearSpent,
        financialProgressPct: p.totalProjectCost > 0
          ? ((p.cumulativeSpend - p.currentYearSpent) / p.totalProjectCost) * 100
          : 0,
        actuals: emptySnaps(),
      })),
    },
    leadership: data.leadership,
  };
}
