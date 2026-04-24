import { ProgressBar } from './ProgressBar';
import { formatPct } from '@/lib/utils';

export function UtilizationGauge({
  actual,
  expected,
  label,
}: {
  actual: number;
  expected: number;
  label?: string;
}) {
  const color = Math.abs(actual - expected) <= 5 ? 'green' : Math.abs(actual - expected) <= 15 ? 'gold' : 'red';

  return (
    <div className="space-y-[var(--space-xs)]">
      {label && <p className="text-[length:var(--text-caption)] text-text-secondary">{label}</p>}
      <div className="relative">
        <ProgressBar value={actual} color={color} />
        <div
          className="absolute top-0 h-full w-[2px] bg-chart-accent/40"
          style={{ left: `${Math.min(expected, 100)}%` }}
          title={`Expected pace: ${formatPct(expected)}`}
        />
      </div>
      <div className="flex justify-between text-[length:var(--text-caption)] text-text-secondary">
        <span>{formatPct(actual)} spent</span>
        <span>{formatPct(expected)} expected</span>
      </div>
    </div>
  );
}
