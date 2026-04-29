import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { vision2030Goals, getOutcomeSummary, deriveIndicatorStatus } from '@/lib/data/vision2030';
import { ministryRegistry } from '@/lib/data';
import type { NationalOutcome } from '@/lib/types';

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    on_track: 'bg-green',
    at_risk: 'bg-gold',
    off_track: 'bg-status-off-track',
    no_data: 'bg-border-default',
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status] || colors.no_data}`} />;
}

function OutcomeCard({ outcome }: { outcome: NationalOutcome }) {
  const summary = getOutcomeSummary(outcome);
  const headlineIndicator = outcome.indicators.find(i => i.latestActual !== null) || outcome.indicators[0];
  const headlineStatus = deriveIndicatorStatus(headlineIndicator);

  const ministries = [...new Set(outcome.indicators.flatMap(i => i.responsibleMinistries))];

  return (
    <Link
      href={`/national-outcomes/${outcome.id}`}
      className="group block border-t border-border-default pt-[var(--space-lg)]"
    >
      <div className="flex items-start justify-between gap-[var(--space-md)]">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-[var(--space-sm)]">
            <span className="text-[length:var(--text-caption)] text-text-secondary font-medium tabular-nums">
              #{outcome.id}
            </span>
            <h3 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h2)] font-bold text-text-primary group-hover:text-gold-dark transition-colors leading-tight">
              {outcome.name}
            </h3>
          </div>

          <div className="flex items-center gap-[var(--space-sm)] mt-[var(--space-sm)]">
            <div className="flex items-center gap-1">
              {summary.onTrack > 0 && (
                <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-green font-medium">
                  <StatusDot status="on_track" /> {summary.onTrack}
                </span>
              )}
              {summary.atRisk > 0 && (
                <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-gold-dark font-medium">
                  <StatusDot status="at_risk" /> {summary.atRisk}
                </span>
              )}
              {summary.offTrack > 0 && (
                <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-status-off-track font-medium">
                  <StatusDot status="off_track" /> {summary.offTrack}
                </span>
              )}
              {summary.noData > 0 && (
                <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-text-secondary font-medium">
                  <StatusDot status="no_data" /> {summary.noData}
                </span>
              )}
            </div>
            <span className="text-[length:var(--text-micro)] text-text-secondary">
              of {summary.total} indicator{summary.total !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          {headlineIndicator.latestActual !== null ? (
            <div>
              <p className="text-[length:var(--text-h3)] font-bold text-text-primary tabular-nums">
                {headlineIndicator.latestActual}{headlineIndicator.unit === '%' ? '%' : ''}
              </p>
              <p className="text-[length:var(--text-micro)] text-text-secondary mt-0.5">
                {headlineIndicator.name.length > 30 ? headlineIndicator.name.slice(0, 28) + '...' : headlineIndicator.name}
              </p>
            </div>
          ) : (
            <p className="text-[length:var(--text-caption)] text-text-secondary/50 italic">
              Awaiting data
            </p>
          )}
        </div>
      </div>

      {ministries.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-[var(--space-sm)]">
          {ministries.slice(0, 4).map(slug => {
            const ministry = ministryRegistry[slug];
            return (
              <span
                key={slug}
                className="text-[length:var(--text-micro)] font-medium px-1.5 py-0.5 rounded bg-gold/10 text-gold-dark"
              >
                {ministry?.overview.shortName || slug}
              </span>
            );
          })}
          {ministries.length > 4 && (
            <span className="text-[length:var(--text-micro)] text-text-secondary">
              +{ministries.length - 4} more
            </span>
          )}
        </div>
      )}

      {outcome.sdgs.length > 0 && (
        <div className="flex items-center gap-1 mt-[var(--space-xs)]">
          <span className="text-[length:var(--text-micro)] text-text-secondary/50">SDGs:</span>
          {outcome.sdgs.map(sdg => (
            <span key={sdg} className="text-[length:var(--text-micro)] font-medium text-text-secondary/70 bg-surface px-1 py-0.5 rounded">
              {sdg}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function NationalOutcomesPage() {
  const totalIndicators = vision2030Goals.flatMap(g => g.outcomes).flatMap(o => o.indicators).length;

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-lg)] sm:gap-[var(--space-xl)]">
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
