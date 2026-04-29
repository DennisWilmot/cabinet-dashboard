'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { getOutcomeById, getGoalForOutcome, deriveIndicatorStatus, getStatusTooltip, stripIndicatorActuals } from '@/lib/data/vision2030';
import { useMockData } from '@/lib/context';
import { ministryRegistry } from '@/lib/data';
import type { Vision2030Indicator, IndicatorStatus } from '@/lib/types';

const STATUS_CONFIG: Record<IndicatorStatus, { bg: string; text: string; label: string; bar: string; border: string }> = {
  on_track: { bg: 'bg-green/10', text: 'text-green', label: 'On Track', bar: 'bg-green', border: 'border-green/20' },
  at_risk: { bg: 'bg-gold/10', text: 'text-gold-dark', label: 'At Risk', bar: 'bg-gold', border: 'border-gold/20' },
  off_track: { bg: 'bg-status-off-track/10', text: 'text-status-off-track', label: 'Off Track', bar: 'bg-status-off-track', border: 'border-status-off-track/20' },
  no_data: { bg: 'bg-border-default/10', text: 'text-text-secondary', label: 'No Data', bar: 'bg-border-default', border: 'border-border-default/30' },
};

function formatValue(val: number, unit: string): string {
  if (unit === 'Index' && val < 10) return val.toFixed(2);
  if (unit === 'Index') return val.toFixed(1);
  if (unit === 'US$') return `$${val.toLocaleString()}`;
  if (unit.includes('BTU')) return val.toLocaleString();
  return val % 1 === 0 ? String(val) : val.toFixed(1);
}

function ProgressBar({ indicator }: { indicator: Vision2030Indicator }) {
  const status = deriveIndicatorStatus(indicator);
  const cfg = STATUS_CONFIG[status];

  if (indicator.latestActual === null || indicator.baseline2007 === null) {
    return <div className="w-full h-2 rounded-full bg-border-default/20" />;
  }

  const target = typeof indicator.target2027 === 'number' ? indicator.target2027 : null;
  if (target === null) return <div className={`w-full h-2 rounded-full ${cfg.bar}/30`} />;

  const range = Math.abs(target - indicator.baseline2007);
  if (range === 0) return <div className="w-full h-2 rounded-full bg-green" />;

  const progress = Math.abs(indicator.latestActual - indicator.baseline2007);
  const pct = Math.min(Math.max((progress / range) * 100, 0), 100);

  return (
    <div className="relative w-full h-2 rounded-full bg-border-default/20 overflow-hidden">
      <div className={`h-full rounded-full ${cfg.bar} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function IndicatorCard({ indicator, index }: { indicator: Vision2030Indicator; index: number }) {
  const status = deriveIndicatorStatus(indicator);
  const cfg = STATUS_CONFIG[status];
  const tooltip = getStatusTooltip(status, indicator);

  const hasData = indicator.latestActual !== null;
  const targetDisplay = indicator.target2027 !== null
    ? (typeof indicator.target2027 === 'string' ? indicator.target2027 : formatValue(indicator.target2027, indicator.unit))
    : null;

  return (
    <div
      className={`rounded-lg border ${cfg.border} p-[var(--space-md)] sm:p-[var(--space-lg)] animate-fade-up`}
      style={{ animationDelay: `${(index + 1) * 40}ms` }}
    >
      {/* Row 1: Name + Status badge */}
      <div className="flex items-start justify-between gap-[var(--space-sm)] mb-[var(--space-md)]">
        <h4 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold text-text-primary leading-snug">
          {indicator.name}
        </h4>
        <div className="group relative flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[length:var(--text-caption)] font-bold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
          <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 rounded-lg border border-border-default bg-page p-3 text-[length:var(--text-caption)] text-text-secondary shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 leading-snug">
            {tooltip}
          </div>
        </div>
      </div>

      {/* Row 2: The hero number */}
      {hasData ? (
        <div className="mb-[var(--space-sm)]">
          <div className="flex items-baseline gap-[var(--space-sm)]">
            <span className={`text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold tabular-nums tracking-tight ${cfg.text}`}>
              {formatValue(indicator.latestActual!, indicator.unit)}
            </span>
            {targetDisplay && (
              <span className="text-[length:var(--text-caption)] text-text-secondary">
                of {targetDisplay} target
              </span>
            )}
          </div>
          <p className="text-[length:var(--text-caption)] text-text-secondary mt-0.5">
            {indicator.latestPeriod} · {indicator.source}
          </p>
        </div>
      ) : (
        <div className="mb-[var(--space-sm)]">
          <div className="flex items-baseline gap-[var(--space-sm)]">
            <span className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold tabular-nums tracking-tight text-text-secondary/20">
              —
            </span>
            {targetDisplay && (
              <span className="text-[length:var(--text-caption)] text-text-secondary">
                target: {targetDisplay}
              </span>
            )}
          </div>
          <p className="text-[length:var(--text-caption)] text-text-secondary/40 mt-0.5">
            {indicator.discontinued ? 'Index discontinued' : `Awaiting data · ${indicator.source}`}
          </p>
        </div>
      )}

      {/* Row 3: Progress bar */}
      <ProgressBar indicator={indicator} />

      {/* Row 4: Context line — baseline + direction + ministry */}
      <div className="flex items-center justify-between gap-[var(--space-sm)] mt-[var(--space-sm)]">
        <span className="text-[length:var(--text-micro)] text-text-secondary/50">
          {indicator.baseline2007 !== null && `From ${formatValue(indicator.baseline2007, indicator.unit)} in 2007`}
          {indicator.direction === 'lower_is_better' && (indicator.baseline2007 !== null ? ' · ' : '')}
          {indicator.direction === 'lower_is_better' && 'lower is better'}
        </span>
        <div className="flex flex-wrap gap-1 justify-end">
          {indicator.responsibleMinistries.slice(0, 2).map(slug => (
            <span key={slug} className="text-[length:var(--text-micro)] font-medium px-1.5 py-0.5 rounded bg-gold/10 text-gold-dark">
              {ministryRegistry[slug]?.overview.shortName || slug}
            </span>
          ))}
        </div>
      </div>

      {/* Row 5: Note (if any) */}
      {indicator.note && (
        <p className={`text-[length:var(--text-caption)] ${cfg.text}/70 mt-[var(--space-sm)] leading-snug`}>
          {indicator.note}
        </p>
      )}
    </div>
  );
}

export default function OutcomeDetailPage() {
  const params = useParams();
  const outcomeId = parseInt(params.id as string, 10);
  const rawOutcome = getOutcomeById(outcomeId);

  const { mockDataEnabled } = useMockData();

  const outcome = useMemo(() => {
    if (!rawOutcome) return null;
    return mockDataEnabled ? rawOutcome : stripIndicatorActuals(rawOutcome);
  }, [rawOutcome, mockDataEnabled]);

  if (!outcome) return notFound();

  const goal = getGoalForOutcome(outcomeId);
  const statuses = outcome.indicators.map(deriveIndicatorStatus);
  const counts = {
    total: outcome.indicators.length,
    onTrack: statuses.filter(s => s === 'on_track').length,
    atRisk: statuses.filter(s => s === 'at_risk').length,
    offTrack: statuses.filter(s => s === 'off_track').length,
    noData: statuses.filter(s => s === 'no_data').length,
  };

  return (
    <DashboardShell
      freshness={<DataFreshness inline />}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Vision 2030', href: '/national-outcomes' },
        { label: `Outcome #${outcome.id}` },
      ]}
    >
      <div className="animate-fade-up">
        <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
          {goal && (
            <p className="text-[length:var(--text-micro)] font-semibold uppercase tracking-wider text-text-secondary/50 mb-[var(--space-xs)]">
              Goal {goal.id} — {goal.name}
            </p>
          )}
          <h1 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
            <span className="text-text-secondary/30">#{outcome.id}</span>{' '}
            {outcome.name}
          </h1>

          <div className="flex flex-wrap items-center gap-[var(--space-md)] mt-[var(--space-md)] p-[var(--space-sm)] sm:p-[var(--space-md)] rounded-lg bg-surface/70 border border-border-default/50">
            <span className="text-[length:var(--text-caption)] text-text-secondary">
              {counts.total} indicator{counts.total !== 1 ? 's' : ''}
            </span>
            {counts.onTrack > 0 && (
              <div className="flex items-center gap-[var(--space-xs)]">
                <span className="w-2 h-2 rounded-full bg-green" />
                <span className="text-[length:var(--text-caption)] font-bold text-green">{counts.onTrack}</span>
                <span className="text-[length:var(--text-micro)] text-text-secondary">On Track</span>
              </div>
            )}
            {counts.atRisk > 0 && (
              <div className="flex items-center gap-[var(--space-xs)]">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[length:var(--text-caption)] font-bold text-gold-dark">{counts.atRisk}</span>
                <span className="text-[length:var(--text-micro)] text-text-secondary">At Risk</span>
              </div>
            )}
            {counts.offTrack > 0 && (
              <div className="flex items-center gap-[var(--space-xs)]">
                <span className="w-2 h-2 rounded-full bg-status-off-track" />
                <span className="text-[length:var(--text-caption)] font-bold text-status-off-track">{counts.offTrack}</span>
                <span className="text-[length:var(--text-micro)] text-text-secondary">Off Track</span>
              </div>
            )}
            {counts.noData > 0 && (
              <div className="flex items-center gap-[var(--space-xs)]">
                <span className="w-2 h-2 rounded-full bg-border-default" />
                <span className="text-[length:var(--text-caption)] font-bold text-text-secondary">{counts.noData}</span>
                <span className="text-[length:var(--text-micro)] text-text-secondary">No Data</span>
              </div>
            )}
            {outcome.sdgs.length > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[length:var(--text-micro)] text-text-secondary/40">SDGs:</span>
                {outcome.sdgs.map(sdg => (
                  <span key={sdg} className="text-[length:var(--text-micro)] font-medium text-text-secondary/50 bg-page px-1.5 py-0.5 rounded">
                    {sdg}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
          {outcome.indicators.map((indicator, i) => (
            <IndicatorCard key={indicator.id} indicator={indicator} index={i} />
          ))}
        </div>

        <div className="mt-[var(--space-xl)] pt-[var(--space-lg)] border-t border-border-default">
          <p className="text-[length:var(--text-micro)] text-text-secondary/50 leading-relaxed">
            Targets from the Medium-Term Socio-Economic Policy Framework (MTF) 2024-2027.
            Baseline values from Vision 2030 Jamaica National Development Plan (2007).
            Status: On Track = meets/exceeds target; At Risk = within 10%; Off Track = &gt;10% gap; No Data = no actuals or range target.
          </p>
          <div className="mt-[var(--space-md)] flex items-center gap-[var(--space-md)]">
            <Link
              href="/national-outcomes"
              className="text-[length:var(--text-caption)] text-gold-dark hover:text-gold transition-colors font-medium"
            >
              &larr; All Outcomes
            </Link>
            {outcome.id > 1 && (
              <Link
                href={`/national-outcomes/${outcome.id - 1}`}
                className="text-[length:var(--text-caption)] text-gold-dark hover:text-gold transition-colors font-medium"
              >
                &larr; #{outcome.id - 1}
              </Link>
            )}
            {outcome.id < 15 && (
              <Link
                href={`/national-outcomes/${outcome.id + 1}`}
                className="text-[length:var(--text-caption)] text-gold-dark hover:text-gold transition-colors font-medium"
              >
                #{outcome.id + 1} &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
