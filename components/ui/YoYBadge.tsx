import { yoyVariance, formatCurrency, formatPct } from '@/lib/utils';

export function YoYBadge({ current, prior, isCurrency = true }: { current: number; prior: number; isCurrency?: boolean }) {
  const { pct, direction } = yoyVariance(current, prior);

  if (direction === 'flat') return null;

  const arrow = direction === 'up' ? '↑' : '↓';
  const colorClass = direction === 'up' ? 'text-jm-green-dark' : 'text-status-off-track';
  const priorLabel = isCurrency ? formatCurrency(prior) : formatPct(prior);

  return (
    <span
      className={`inline-flex items-center gap-[3px] text-[length:var(--text-body)] font-semibold ${colorClass}`}
      title={`Prior year: ${priorLabel}`}
    >
      {arrow} {Math.abs(pct).toFixed(1)}% YoY
    </span>
  );
}
