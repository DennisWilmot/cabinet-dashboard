import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { YoYBadge } from '@/components/ui/YoYBadge';
import { formatCurrency, formatPct } from '@/lib/utils';
import type { StatusResult } from '@/lib/types';

export function BucketCard({
  title,
  subtitle,
  href,
  allocation,
  priorYearAllocation,
  spent,
  utilizationPct,
  statusResult,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  allocation: number;
  priorYearAllocation: number;
  spent: number;
  utilizationPct: number;
  statusResult: StatusResult;
  children?: React.ReactNode;
}) {
  const color = statusResult.status === 'on_track' ? 'green' : statusResult.status === 'at_risk' ? 'gold' : 'red';

  return (
    <Link
      href={href}
      className="group block border-t-2 border-border-strong pt-[var(--space-base)] hover:border-gold transition-colors"
    >
      <div className="flex items-start justify-between mb-[var(--space-md)]">
        <div>
          <h3 className="font-bold text-[length:var(--text-h3)] text-text-primary group-hover:text-gold-dark transition-colors">
            {title}
          </h3>
          <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">{subtitle}</p>
        </div>
        <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} size="sm" />
      </div>

      <div className="flex items-baseline gap-[var(--space-sm)] mb-[var(--space-xs)]">
        <span className="text-[length:var(--text-h2)] font-bold text-text-primary">{formatCurrency(allocation)}</span>
        <YoYBadge current={allocation} prior={priorYearAllocation} />
      </div>
      <p className="text-[length:var(--text-caption)] text-text-secondary mb-[var(--space-md)]">
        {formatCurrency(spent)} spent · {formatPct(utilizationPct)} utilized
      </p>

      <ProgressBar value={utilizationPct} color={color} height="sm" />

      {children && <div className="mt-[var(--space-md)] pt-[var(--space-md)] border-t border-border-default">{children}</div>}

      <div className="mt-[var(--space-md)] flex items-center gap-[4px] text-[length:var(--text-caption)] font-medium text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity">
        View details
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
