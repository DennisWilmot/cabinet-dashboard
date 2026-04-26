'use client';

import { useMockData } from '@/lib/context';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
}

function freshnessColor(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 14) return 'text-jm-green-dark';
  if (diffDays <= 45) return 'text-gold-dark';
  return 'text-status-off-track';
}

interface DataFreshnessProps {
  lastUpdated?: string;
}

export function DataFreshness({ lastUpdated }: DataFreshnessProps) {
  const { mockDataEnabled } = useMockData();

  return (
    <div className="w-full border-b border-border-default bg-surface/60">
      <div className="max-w-7xl mx-auto px-[var(--space-base)] sm:px-[var(--space-lg)] py-[var(--space-xs)] flex flex-wrap items-center gap-x-[var(--space-md)] gap-y-[2px] text-[length:var(--text-caption)] text-text-secondary">
        {lastUpdated && (
          <>
            <span className="flex items-center gap-[6px]">
              <svg className="w-3.5 h-3.5 text-text-secondary/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Last updated <strong className={`font-semibold ${freshnessColor(lastUpdated)}`}>{timeAgo(lastUpdated)}</strong>
            </span>
            <span className="text-text-secondary/30 hidden sm:inline">·</span>
          </>
        )}
        {!lastUpdated && (
          <>
            <span className="flex items-center gap-[6px]">
              <svg className="w-3.5 h-3.5 text-text-secondary/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Updated <strong className="font-semibold text-text-primary">monthly</strong>
            </span>
            <span className="text-text-secondary/30 hidden sm:inline">·</span>
          </>
        )}
        {mockDataEnabled && (
          <>
            <span>Reporting period: <strong className="font-semibold text-text-primary">Apr – Sep 2026</strong></span>
            <span className="text-text-secondary/30 hidden sm:inline">·</span>
          </>
        )}
        <span>Source: Estimates of Expenditure 2026-27</span>
      </div>
    </div>
  );
}
