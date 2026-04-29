import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { getOutcomeById, getGoalForOutcome, deriveIndicatorStatus, getStatusTooltip } from '@/lib/data/vision2030';
import { ministryRegistry } from '@/lib/data';
import type { Vision2030Indicator, IndicatorStatus } from '@/lib/types';

function StatusBadge({ status }: { status: IndicatorStatus }) {
  const config: Record<IndicatorStatus, { bg: string; text: string; label: string }> = {
    on_track: { bg: 'bg-green/15', text: 'text-green', label: 'On Track' },
    at_risk: { bg: 'bg-gold/15', text: 'text-gold-dark', label: 'At Risk' },
    off_track: { bg: 'bg-status-off-track/15', text: 'text-status-off-track', label: 'Off Track' },
    no_data: { bg: 'bg-border-default/30', text: 'text-text-secondary', label: 'No Data' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[length:var(--text-micro)] font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function IndicatorRow({ indicator, index }: { indicator: Vision2030Indicator; index: number }) {
  const status = deriveIndicatorStatus(indicator);
  const tooltip = getStatusTooltip(status, indicator);

  return (
    <div
      className="grid grid-cols-12 gap-[var(--space-sm)] sm:gap-[var(--space-md)] items-start py-[var(--space-md)] border-t border-border-default animate-fade-up"
      style={{ animationDelay: `${(index + 1) * 40}ms` }}
    >
      {/* Indicator Name */}
      <div className="col-span-12 sm:col-span-4">
        <p className="text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] font-medium text-text-primary leading-snug">
          {indicator.name}
        </p>
        {indicator.source && (
          <p className="text-[length:var(--text-micro)] text-text-secondary/50 mt-0.5">
            Source: {indicator.source}
          </p>
        )}
        {indicator.discontinued && (
          <p className="text-[length:var(--text-micro)] text-status-off-track/60 mt-0.5 italic">
            Discontinued
          </p>
        )}
        {indicator.note && (
          <p className="text-[length:var(--text-micro)] text-text-secondary mt-0.5 italic leading-tight">
            {indicator.note}
          </p>
        )}
      </div>

      {/* Unit */}
      <div className="col-span-3 sm:col-span-1">
        <p className="text-[length:var(--text-micro)] text-text-secondary/50 sm:hidden">Unit</p>
        <p className="text-[length:var(--text-caption)] text-text-secondary tabular-nums">
          {indicator.unit}
        </p>
      </div>

      {/* Baseline 2007 */}
      <div className="col-span-3 sm:col-span-1 text-right sm:text-center">
        <p className="text-[length:var(--text-micro)] text-text-secondary/50 sm:hidden">2007</p>
        <p className="text-[length:var(--text-caption)] text-text-secondary tabular-nums">
          {indicator.baseline2007 ?? '—'}
        </p>
      </div>

      {/* Target 2027 */}
      <div className="col-span-3 sm:col-span-2 text-right sm:text-center">
        <p className="text-[length:var(--text-micro)] text-text-secondary/50 sm:hidden">Target 2027</p>
        <p className="text-[length:var(--text-caption)] font-medium text-text-primary tabular-nums">
          {indicator.target2027 ?? '—'}
        </p>
      </div>

      {/* Latest Actual */}
      <div className="col-span-3 sm:col-span-2 text-right sm:text-center">
        <p className="text-[length:var(--text-micro)] text-text-secondary/50 sm:hidden">Actual</p>
        {indicator.latestActual !== null ? (
          <>
            <p className="text-[length:var(--text-caption)] font-bold text-text-primary tabular-nums">
              {indicator.latestActual}
            </p>
            <p className="text-[length:var(--text-micro)] text-text-secondary/50">
              {indicator.latestPeriod}
            </p>
          </>
        ) : (
          <p className="text-[length:var(--text-caption)] text-text-secondary/40">—</p>
        )}
      </div>

      {/* Status + Ministries */}
      <div className="col-span-12 sm:col-span-2 flex items-center sm:justify-end gap-[var(--space-sm)] mt-[var(--space-xs)] sm:mt-0">
        <div className="group relative">
          <StatusBadge status={status} />
          <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-56 rounded-lg border border-border-default bg-surface p-2 text-[length:var(--text-micro)] text-text-secondary shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50">
            {tooltip}
          </div>
        </div>
        <div className="flex gap-0.5 sm:hidden">
          {indicator.responsibleMinistries.slice(0, 2).map(slug => (
            <span key={slug} className="text-[length:var(--text-micro)] font-medium px-1 py-0.5 rounded bg-gold/10 text-gold-dark">
              {ministryRegistry[slug]?.overview.shortName || slug}
            </span>
          ))}
        </div>
      </div>
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
        {/* Header */}
        <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
          {goal && (
            <p className="text-[length:var(--text-micro)] font-semibold uppercase tracking-wider text-text-secondary/50 mb-[var(--space-xs)]">
              Goal {goal.id} — {goal.name}
            </p>
          )}
          <h1 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
            <span className="text-text-secondary/40">#{outcome.id}</span>{' '}
            {outcome.name}
          </h1>

          {/* Summary Bar */}
          <div className="flex flex-wrap items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)] mt-[var(--space-md)]">
            <span className="text-[length:var(--text-caption)] text-text-secondary">
              {counts.total} indicator{counts.total !== 1 ? 's' : ''}
            </span>
            {counts.onTrack > 0 && <StatusBadge status="on_track" />}
            {counts.onTrack > 0 && (
              <span className="text-[length:var(--text-caption)] text-text-secondary">{counts.onTrack}</span>
            )}
            {counts.atRisk > 0 && <StatusBadge status="at_risk" />}
            {counts.atRisk > 0 && (
              <span className="text-[length:var(--text-caption)] text-text-secondary">{counts.atRisk}</span>
            )}
            {counts.offTrack > 0 && <StatusBadge status="off_track" />}
            {counts.offTrack > 0 && (
              <span className="text-[length:var(--text-caption)] text-text-secondary">{counts.offTrack}</span>
            )}
            {counts.noData > 0 && <StatusBadge status="no_data" />}
            {counts.noData > 0 && (
              <span className="text-[length:var(--text-caption)] text-text-secondary">{counts.noData}</span>
            )}
          </div>

          {outcome.sdgs.length > 0 && (
            <div className="flex items-center gap-1 mt-[var(--space-sm)]">
              <span className="text-[length:var(--text-micro)] text-text-secondary/50">Aligned SDGs:</span>
              {outcome.sdgs.map(sdg => (
                <span key={sdg} className="text-[length:var(--text-micro)] font-medium text-text-secondary/70 bg-surface px-1.5 py-0.5 rounded">
                  Goal {sdg}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Column Headers (desktop only) */}
        <div className="hidden sm:grid grid-cols-12 gap-[var(--space-md)] pb-[var(--space-sm)] text-[length:var(--text-micro)] font-semibold uppercase tracking-wider text-text-secondary/40">
          <div className="col-span-4">Indicator</div>
          <div className="col-span-1">Unit</div>
          <div className="col-span-1 text-center">2007</div>
          <div className="col-span-2 text-center">Target 2027</div>
          <div className="col-span-2 text-center">Latest</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Indicator Rows */}
        {outcome.indicators.map((indicator, i) => (
          <IndicatorRow key={indicator.id} indicator={indicator} index={i} />
        ))}

        {/* Footer */}
        <div className="mt-[var(--space-xl)] pt-[var(--space-lg)] border-t border-border-default">
          <p className="text-[length:var(--text-micro)] text-text-secondary/50 leading-relaxed">
            Targets from the Medium-Term Socio-Economic Policy Framework (MTF) 2024-2027.
            Baseline values from Vision 2030 Jamaica National Development Plan (2007).
            Actuals are populated where publicly available from PIOJ, STATIN, or the relevant ministry.
          </p>
          <div className="mt-[var(--space-md)] flex items-center gap-[var(--space-md)]">
            <Link
              href="/national-outcomes"
              className="text-[length:var(--text-caption)] text-gold-dark hover:text-gold transition-colors font-medium"
            >
              &larr; All Outcomes
            </Link>
            {outcome.id < 15 && (
              <Link
                href={`/national-outcomes/${outcome.id + 1}`}
                className="text-[length:var(--text-caption)] text-gold-dark hover:text-gold transition-colors font-medium"
              >
                Outcome #{outcome.id + 1} &rarr;
              </Link>
            )}
            {outcome.id > 1 && (
              <Link
                href={`/national-outcomes/${outcome.id - 1}`}
                className="text-[length:var(--text-caption)] text-gold-dark hover:text-gold transition-colors font-medium"
              >
                &larr; Outcome #{outcome.id - 1}
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
