import type { MonthlySnapshot } from '@/lib/types';

export const CY = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'] as const;
export const PY = [
  '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09',
  '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03',
] as const;

export function snap(cum: number[], months: readonly string[] = CY): MonthlySnapshot[] {
  return months.map((period, i) => ({
    period,
    cumulative: cum[i],
    monthly: i === 0 ? cum[0] : Math.round((cum[i] - cum[i - 1]) * 1000) / 1000,
  }));
}

export function pySnap(total: number, w: number[]): MonthlySnapshot[] {
  let c = 0;
  return PY.map((period, i) => {
    let m = Math.round(total * w[i]);
    if (i === 11) m = total - c;
    c += m;
    return { period, cumulative: c, monthly: m };
  });
}

export function sumSnaps(...arrays: MonthlySnapshot[][]): MonthlySnapshot[] {
  return arrays[0].map((s, i) => ({
    period: s.period,
    cumulative: Math.round(arrays.reduce((a, arr) => a + arr[i].cumulative, 0) * 100) / 100,
    monthly: Math.round(arrays.reduce((a, arr) => a + arr[i].monthly, 0) * 100) / 100,
  }));
}

export const W_LIN = [0.082, 0.083, 0.084, 0.083, 0.084, 0.082, 0.084, 0.083, 0.085, 0.083, 0.084, 0.083];
export const W_FRONT = [0.20, 0.15, 0.10, 0.08, 0.07, 0.07, 0.06, 0.06, 0.06, 0.05, 0.05, 0.05];
export const W_BACK = [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.09, 0.10, 0.11, 0.11, 0.11, 0.11];

export const EMPTY_REVENUE = {
  totalCollected: 0,
  totalTarget: 0,
  variance: 0,
  variancePct: 0,
  bySplit: [] as { entity: string; amount: number; pct: number }[],
  actuals: [] as MonthlySnapshot[],
  priorYearActuals: [] as MonthlySnapshot[],
};
