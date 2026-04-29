import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { vision2030Goals, getOutcomeSummary, deriveIndicatorStatus } from '@/lib/data/vision2030';
import type { NationalOutcome, Vision2030Indicator, IndicatorStatus } from '@/lib/types';

const STATUS_CONFIG: Record<IndicatorStatus, { dot: string; text: string; label: string; bar: string }> = {
  on_track: { dot: 'bg-green', text: 'text-green', label: 'On Track', bar: 'bg-green' },
  at_risk: { dot: 'bg-gold', text: 'text-gold-dark', label: 'At Risk', bar: 'bg-gold' },
  off_track: { dot: 'bg-status-off-track', text: 'text-status-off-track', label: 'Off Track', bar: 'bg-status-off-track' },
  no_data: { dot: 'bg-border-default', text: 'text-text-secondary', label: 'No Data', bar: 'bg-border-default' },
};

function ProgressBar({ indicator }: { indicator: Vision2030Indicator }) {
  const status = deriveIndicatorStatus(indicator);
  const cfg = STATUS_CONFIG[status];

  if (indicator.latestActual === null || indicator.baseline2007 === null) {
    return <div className="w-full h-1.5 rounded-full bg-border-default/30" />;
  }

  const target = typeof indicator.target2027 === 'number' ? indicator.target2027 : null;
  if (target === null) {
    return <div className={`w-full h-1.5 rounded-full ${cfg.bar}/30`} />;
  }

  const range = Math.abs(target - indicator.baseline2007);
  if (range === 0) return <div className="w-full h-1.5 rounded-full bg-green" />;

  const progress = Math.abs(indicator.latestActual - indicator.baseline2007);
  const pct = Math.min(Math.max((progress / range) * 100, 0), 100);

  return (
    <div className="w-full h-1.5 rounded-full bg-border-default/30 overflow-hidden">
      <div className={`h-full rounded-full ${cfg.bar} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function IndicatorRow({ indicator }: { indicator: Vision2030Indicator }) {
  const status = deriveIndicatorStatus(indicator);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="py-[var(--space-xs)]">
      <div className="flex items-center justify-between gap-[var(--space-sm)]">
        <div className="flex items-center gap-[var(--space-xs)] min-w-0 flex-1">
          <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className="text-[length:var(--text-micro)] text-text-primary truncate leading-tight">
            {indicator.name}
          </span>
        </div>
        <div className="flex items-center gap-[var(--space-xs)] flex-shrink-0">
          {indicator.latestActual !== null ? (
            <span className={`text-[length:var(--text-micro)] font-bold tabular-nums ${cfg.text}`}>
              {formatValue(indicator.latestActual, indicator.unit)}
            </span>
          ) : indicator.discontinued ? (
            <span className="text-[length:var(--text-micro)] text-text-secondary/30 italic">disc.</span>
          ) : (
            <span className="text-[length:var(--text-micro)] text-text-secondary/30">—</span>
          )}
          {indicator.target2027 !== null && (
            <span className="text-[length:var(--text-micro)] text-text-secondary/40 tabular-nums">
              /{formatTarget(indicator.target2027, indicator.unit)}
            </span>
          )}
        </div>
      </div>
      <div className="mt-0.5 ml-[calc(0.375rem+var(--space-xs))]">
        <ProgressBar indicator={indicator} />
      </div>
    </div>
  );
}

function formatValue(val: number, unit: string): string {
  if (unit === 'Index' && val < 10) return val.toFixed(2);
  if (unit === 'Index') return val.toFixed(1);
  if (unit === '%' || unit.includes('Per 100,000') || unit.includes('Per 1,000')) {
    return val % 1 === 0 ? String(val) : val.toFixed(1);
  }
  if (unit === 'US$') return `$${val.toLocaleString()}`;
  if (unit.includes('BTU')) return val.toLocaleString();
  return val % 1 === 0 ? String(val) : val.toFixed(1);
}

function formatTarget(target: number | string, unit: string): string {
  if (typeof target === 'string') return target;
  return formatValue(target, unit);
}

function OutcomeCard({ outcome }: { outcome: NationalOutcome }) {
  const summary = getOutcomeSummary(outcome);

  return (
    <Link
      href={`/national-outcomes/${outcome.id}`}
      className="group block rounded-lg border border-border-default bg-surface/50 p-[var(--space-md)] sm:p-[var(--space-lg)] hover:border-gold/40 hover:bg-surface transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-[var(--space-sm)] mb-[var(--space-sm)]">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-[var(--space-xs)]">
            <span className="text-[length:var(--text-micro)] text-text-secondary/30 font-semibold tabular-nums">
              #{outcome.id}
            </span>
            <h3 className="text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] font-bold text-text-primary group-hover:text-gold-dark transition-colors leading-tight">
              {outcome.name}
            </h3>
          </div>
        </div>
        <svg className="w-3.5 h-3.5 flex-shrink-0 text-text-secondary/15 group-hover:text-gold-dark group-hover:translate-x-0.5 transition-all mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      {/* Status summary bar */}
      <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
        {summary.onTrack > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-green font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" /> {summary.onTrack}
          </span>
        )}
        {summary.atRisk > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-gold-dark font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" /> {summary.atRisk}
          </span>
        )}
        {summary.offTrack > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-status-off-track font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-status-off-track inline-block" /> {summary.offTrack}
          </span>
        )}
        {summary.noData > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-text-secondary/40 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-border-default inline-block" /> {summary.noData}
          </span>
        )}
        <span className="text-[length:var(--text-micro)] text-text-secondary/30 ml-auto">
          {summary.total} indicator{summary.total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Indicators list */}
      <div className="border-t border-border-default/50 pt-[var(--space-xs)]">
        {outcome.indicators.map(ind => (
          <IndicatorRow key={ind.id} indicator={ind} />
        ))}
      </div>
    </Link>
  );
}

export default function NationalOutcomesPage() {
  const totalIndicators = vision2030Goals.flatMap(g => g.outcomes).flatMap(o => o.indicators).length;
  const allIndicators = vision2030Goals.flatMap(g => g.outcomes).flatMap(o => o.indicators);
  const allStatuses = allIndicators.map(deriveIndicatorStatus);
  const globalSummary = {
    onTrack: allStatuses.filter(s => s === 'on_track').length,
    atRisk: allStatuses.filter(s => s === 'at_risk').length,
    offTrack: allStatuses.filter(s => s === 'off_track').length,
    noData: allStatuses.filter(s => s === 'no_data').length,
  };

  return (
    <DashboardShell
      freshness={<DataFreshness inline />}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Vision 2030' },
      ]}
    >
      <div className="animate-fade-up">
        <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
          <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
            Vision 2030 National Outcomes
          </h1>
          <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
            {vision2030Goals.length} goals · 15 outcomes · {totalIndicators} indicators · MTF 2024-2027 targets
          </p>

          {/* Global status summary */}
          <div className="flex flex-wrap items-center gap-[var(--space-md)] mt-[var(--space-md)] p-[var(--space-sm)] sm:p-[var(--space-md)] rounded-lg bg-surface/70 border border-border-default/50">
            <div className="flex items-center gap-[var(--space-xs)]">
              <span className="w-2.5 h-2.5 rounded-full bg-green" />
              <span className="text-[length:var(--text-caption)] font-bold text-green">{globalSummary.onTrack}</span>
              <span className="text-[length:var(--text-micro)] text-text-secondary">On Track</span>
            </div>
            <div className="flex items-center gap-[var(--space-xs)]">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" />
              <span className="text-[length:var(--text-caption)] font-bold text-gold-dark">{globalSummary.atRisk}</span>
              <span className="text-[length:var(--text-micro)] text-text-secondary">At Risk</span>
            </div>
            <div className="flex items-center gap-[var(--space-xs)]">
              <span className="w-2.5 h-2.5 rounded-full bg-status-off-track" />
              <span className="text-[length:var(--text-caption)] font-bold text-status-off-track">{globalSummary.offTrack}</span>
              <span className="text-[length:var(--text-micro)] text-text-secondary">Off Track</span>
            </div>
            <div className="flex items-center gap-[var(--space-xs)]">
              <span className="w-2.5 h-2.5 rounded-full bg-border-default" />
              <span className="text-[length:var(--text-caption)] font-bold text-text-secondary">{globalSummary.noData}</span>
              <span className="text-[length:var(--text-micro)] text-text-secondary">No Data</span>
            </div>
          </div>
        </header>

        {vision2030Goals.map((goal, gi) => (
          <section key={goal.id} className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <div className="mb-[var(--space-md)] sm:mb-[var(--space-lg)]">
              <p className="text-[length:var(--text-micro)] font-semibold uppercase tracking-wider text-text-secondary/50">
                Goal {goal.id}
              </p>
              <h2 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h2)] font-bold text-text-primary mt-[var(--space-xs)]">
                {goal.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
              {goal.outcomes.map((outcome, oi) => (
                <div
                  key={outcome.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(gi * 5 + oi + 1) * 40}ms` }}
                >
                  <OutcomeCard outcome={outcome} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DashboardShell>
  );
}
