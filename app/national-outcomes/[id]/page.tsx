import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { getOutcomeById, getGoalForOutcome, deriveIndicatorStatus, getStatusTooltip } from '@/lib/data/vision2030';
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
  const ministries = indicator.responsibleMinistries.map(slug =>
    ministryRegistry[slug]?.overview.shortName || slug
  );

  return (
    <div
      className={`rounded-lg border ${cfg.border} ${cfg.bg} p-[var(--space-md)] animate-fade-up`}
      style={{ animationDelay: `${(index + 1) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-[var(--space-md)] mb-[var(--space-sm)]">
        <div className="min-w-0 flex-1">
          <h4 className="text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] font-bold text-text-primary leading-snug">
            {indicator.name}
          </h4>
          <p className="text-[length:var(--text-micro)] text-text-secondary/50 mt-0.5">
            {indicator.unit} · {indicator.source}
          </p>
        </div>
        <div className="group relative flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[length:var(--text-micro)] font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
            {cfg.label}
          </span>
          <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 rounded-lg border border-border-default bg-page p-2 text-[length:var(--text-micro)] text-text-secondary shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50">
            {tooltip}
          </div>
        </div>
      </div>

      {/* Values row */}
      <div className="grid grid-cols-3 gap-[var(--space-sm)] mb-[var(--space-sm)]">
        <div>
          <p className="text-[length:var(--text-micro)] text-text-secondary/40">Baseline 2007</p>
          <p className="text-[length:var(--text-caption)] font-semibold text-text-secondary tabular-nums">
            {indicator.baseline2007 !== null ? formatValue(indicator.baseline2007, indicator.unit) : '—'}
          </p>
        </div>
        <div>
          <p className="text-[length:var(--text-micro)] text-text-secondary/40">Target 2027</p>
          <p className="text-[length:var(--text-caption)] font-semibold text-text-primary tabular-nums">
            {indicator.target2027 !== null ? (typeof indicator.target2027 === 'string' ? indicator.target2027 : formatValue(indicator.target2027, indicator.unit)) : '—'}
          </p>
        </div>
        <div>
          <p className="text-[length:var(--text-micro)] text-text-secondary/40">Latest</p>
          {indicator.latestActual !== null ? (
            <>
              <p className={`text-[length:var(--text-caption)] font-bold tabular-nums ${cfg.text}`}>
                {formatValue(indicator.latestActual, indicator.unit)}
              </p>
              <p className="text-[length:var(--text-micro)] text-text-secondary/40">
                {indicator.latestPeriod}
              </p>
            </>
          ) : (
            <p className="text-[length:var(--text-caption)] text-text-secondary/30">
              {indicator.discontinued ? 'Disc.' : '—'}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar indicator={indicator} />

      {/* Footer: notes + ministries */}
      <div className="flex items-center justify-between gap-[var(--space-sm)] mt-[var(--space-sm)]">
        <div className="flex flex-wrap gap-1">
          {ministries.map(name => (
            <span key={name} className="text-[length:var(--text-micro)] font-medium px-1.5 py-0.5 rounded bg-gold/10 text-gold-dark">
              {name}
            </span>
          ))}
        </div>
        {indicator.direction === 'lower_is_better' && (
          <span className="text-[length:var(--text-micro)] text-text-secondary/30">lower is better</span>
        )}
      </div>

      {indicator.note && (
        <p className="text-[length:var(--text-micro)] text-text-secondary/60 italic mt-[var(--space-xs)] leading-tight">
          {indicator.note}
        </p>
      )}
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OutcomeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const outcomeId = parseInt(id, 10);
  const outcome = getOutcomeById(outcomeId);

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

          {/* Status summary */}
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

        {/* Indicator cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
          {outcome.indicators.map((indicator, i) => (
            <IndicatorCard key={indicator.id} indicator={indicator} index={i} />
          ))}
        </div>

        {/* Footer */}
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
