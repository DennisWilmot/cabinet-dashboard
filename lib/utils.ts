export function formatCurrency(value: number, options?: { compact?: boolean; decimals?: number }): string {
  const compact = options?.compact ?? true;
  const decimals = options?.decimals;

  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      const b = value / 1_000_000;
      return `J$${b.toFixed(decimals ?? 1)}T`;
    }
    if (Math.abs(value) >= 1_000) {
      const b = value / 1_000;
      return `J$${b.toFixed(decimals ?? 1)}B`;
    }
    return `J$${value.toFixed(decimals ?? 1)}M`;
  }

  return `J$${value.toLocaleString('en-US', { minimumFractionDigits: decimals ?? 0, maximumFractionDigits: decimals ?? 0 })}M`;
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function yoyVariance(current: number, prior: number): { value: number; pct: number; direction: 'up' | 'down' | 'flat' } {
  const value = current - prior;
  const pct = prior !== 0 ? (value / prior) * 100 : 0;
  const direction = pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat';
  return { value, pct, direction };
}

export const MONTHS_ELAPSED = 6;
export const EXPECTED_UTILIZATION = (MONTHS_ELAPSED / 12) * 100;
export const REPORTING_PERIOD = '2026-09-30';

export const PERIODS_CURRENT_YEAR = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
export const PERIODS_PRIOR_YEAR = ['2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
