'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { vision2030Goals, getOutcomeSummary, deriveIndicatorStatus, stripGoalActuals } from '@/lib/data/vision2030';
import { useMockData } from '@/lib/context';
import type { NationalGoal, NationalOutcome, Vision2030Indicator, IndicatorStatus } from '@/lib/types';

const STATUS_CONFIG: Record<IndicatorStatus, { dot: string; text: string; label: string; bar: string }> = {
  on_track: { dot: 'bg-green', text: 'text-green', label: 'On Track', bar: 'bg-green' },
  at_risk: { dot: 'bg-gold', text: 'text-gold-dark', label: 'At Risk', bar: 'bg-gold' },
  off_track: { dot: 'bg-status-off-track', text: 'text-status-off-track', label: 'Off Track', bar: 'bg-status-off-track' },
  no_data: { dot: 'bg-border-default', text: 'text-text-secondary', label: 'No Data', bar: 'bg-border-default' },
};

type StatusFilter = IndicatorStatus | 'all';

const GOAL_SHORT_NAMES: Record<number, string> = {
  1: 'Empowered',
  2: 'Secure & Just',
  3: 'Prosperous',
  4: 'Environment',
};

function getGoalSummary(goal: NationalGoal) {
  const indicators = goal.outcomes.flatMap(o => o.indicators);
  const statuses = indicators.map(deriveIndicatorStatus);
  return {
    total: indicators.length,
    outcomes: goal.outcomes.length,
    onTrack: statuses.filter(s => s === 'on_track').length,
    atRisk: statuses.filter(s => s === 'at_risk').length,
    offTrack: statuses.filter(s => s === 'off_track').length,
    noData: statuses.filter(s => s === 'no_data').length,
  };
}

function outcomeMatchesSearch(outcome: NationalOutcome, query: string): boolean {
  const q = query.toLowerCase();
  if (outcome.name.toLowerCase().includes(q)) return true;
  return outcome.indicators.some(ind => ind.name.toLowerCase().includes(q));
}

function outcomeMatchesStatus(outcome: NationalOutcome, filter: StatusFilter): boolean {
  if (filter === 'all') return true;
  return outcome.indicators.some(ind => deriveIndicatorStatus(ind) === filter);
}

function filterIndicatorsByStatus(outcome: NationalOutcome, filter: StatusFilter): NationalOutcome {
  if (filter === 'all') return outcome;
  return {
    ...outcome,
    indicators: outcome.indicators.filter(ind => deriveIndicatorStatus(ind) === filter),
  };
}

/* ─── Sub-components ─── */

function GoalCard({ goal, isActive, onClick }: { goal: NationalGoal; isActive: boolean; onClick: () => void }) {
  const summary = getGoalSummary(goal);

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-lg border p-[var(--space-sm)] sm:p-[var(--space-md)] transition-all cursor-pointer ${
        isActive
          ? 'border-gold bg-gold/10 shadow-sm'
          : 'border-border-default bg-surface/50 hover:border-gold/30 hover:bg-surface'
      }`}
    >
      <p className="text-[length:var(--text-micro)] font-semibold uppercase tracking-wider text-text-secondary/50">
        Goal {goal.id}
      </p>
      <h3 className={`text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] font-bold leading-tight mt-0.5 ${isActive ? 'text-gold-dark' : 'text-text-primary'}`}>
        {GOAL_SHORT_NAMES[goal.id]}
      </h3>
      <div className="flex items-center gap-1.5 mt-[var(--space-xs)]">
        {summary.onTrack > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-green font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green" /> {summary.onTrack}
          </span>
        )}
        {summary.atRisk > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-gold-dark font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {summary.atRisk}
          </span>
        )}
        {summary.offTrack > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-status-off-track font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-status-off-track" /> {summary.offTrack}
          </span>
        )}
        {summary.noData > 0 && (
          <span className="flex items-center gap-0.5 text-[length:var(--text-micro)] text-text-secondary/40 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-border-default" /> {summary.noData}
          </span>
        )}
      </div>
      <p className="text-[length:var(--text-micro)] text-text-secondary/40 mt-0.5">
        {summary.outcomes} outcomes · {summary.total} indicators
      </p>
    </button>
  );
}

function ProgressBar({ indicator }: { indicator: Vision2030Indicator }) {
  const status = deriveIndicatorStatus(indicator);
  const cfg = STATUS_CONFIG[status];

  if (indicator.latestActual === null || indicator.baseline2007 === null) {
    return <div className="w-full h-1.5 rounded-full bg-border-default/30" />;
  }
  const target = typeof indicator.target2027 === 'number' ? indicator.target2027 : null;
  if (target === null) return <div className={`w-full h-1.5 rounded-full ${cfg.bar}/30`} />;
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

function OutcomeCard({ outcome }: { outcome: NationalOutcome }) {
  const summary = getOutcomeSummary(outcome);

  return (
    <Link
      href={`/national-outcomes/${outcome.id}`}
      className="group block rounded-lg border border-border-default bg-surface/50 p-[var(--space-md)] sm:p-[var(--space-lg)] hover:border-gold/40 hover:bg-surface transition-all"
    >
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

      <div className="border-t border-border-default/50 pt-[var(--space-xs)]">
        {outcome.indicators.map(ind => (
          <IndicatorRow key={ind.id} indicator={ind} />
        ))}
      </div>
    </Link>
  );
}

/* ─── Main Page ─── */

export default function NationalOutcomesPage() {
  const { mockDataEnabled } = useMockData();
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const goals = useMemo(() =>
    mockDataEnabled ? vision2030Goals : vision2030Goals.map(stripGoalActuals),
    [mockDataEnabled]
  );

  const allIndicators = goals.flatMap(g => g.outcomes).flatMap(o => o.indicators);
  const allStatuses = allIndicators.map(deriveIndicatorStatus);
  const globalCounts = {
    total: allIndicators.length,
    onTrack: allStatuses.filter(s => s === 'on_track').length,
    atRisk: allStatuses.filter(s => s === 'at_risk').length,
    offTrack: allStatuses.filter(s => s === 'off_track').length,
    noData: allStatuses.filter(s => s === 'no_data').length,
  };

  const filteredGoals = useMemo(() => {
    let filtered = activeGoalId !== null
      ? goals.filter(g => g.id === activeGoalId)
      : goals;

    if (searchQuery || statusFilter !== 'all') {
      filtered = filtered.map(goal => ({
        ...goal,
        outcomes: goal.outcomes
          .filter(o =>
            (!searchQuery || outcomeMatchesSearch(o, searchQuery)) &&
            outcomeMatchesStatus(o, statusFilter)
          )
          .map(o => statusFilter !== 'all' ? filterIndicatorsByStatus(o, statusFilter) : o),
      })).filter(g => g.outcomes.length > 0);
    }

    return filtered;
  }, [goals, activeGoalId, statusFilter, searchQuery]);

  const visibleOutcomeCount = filteredGoals.reduce((acc, g) => acc + g.outcomes.length, 0);
  const visibleIndicatorCount = filteredGoals.reduce((acc, g) => acc + g.outcomes.reduce((a, o) => a + o.indicators.length, 0), 0);

  const statusChips: { key: StatusFilter; label: string; count: number; dot: string; active: string }[] = [
    { key: 'all', label: 'All', count: globalCounts.total, dot: '', active: 'bg-text-primary text-page' },
    { key: 'on_track', label: 'On Track', count: globalCounts.onTrack, dot: 'bg-green', active: 'bg-green/15 text-green border-green/30' },
    { key: 'at_risk', label: 'At Risk', count: globalCounts.atRisk, dot: 'bg-gold', active: 'bg-gold/15 text-gold-dark border-gold/30' },
    { key: 'off_track', label: 'Off Track', count: globalCounts.offTrack, dot: 'bg-status-off-track', active: 'bg-status-off-track/15 text-status-off-track border-status-off-track/30' },
    { key: 'no_data', label: 'No Data', count: globalCounts.noData, dot: 'bg-border-default', active: 'bg-border-default/20 text-text-secondary border-border-default' },
  ];

  return (
    <DashboardShell
      freshness={<DataFreshness inline />}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Vision 2030' },
      ]}
    >
      <div className="animate-fade-up">
        {/* Page title */}
        <header className="mb-[var(--space-lg)]">
          <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
            Vision 2030 National Outcomes
          </h1>
          <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
            4 goals · 15 outcomes · {globalCounts.total} indicators · MTF 2024-2027 targets
          </p>
        </header>

        {/* Goal summary cards — clickable filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-sm)] sm:gap-[var(--space-md)] mb-[var(--space-lg)]">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isActive={activeGoalId === goal.id}
              onClick={() => setActiveGoalId(activeGoalId === goal.id ? null : goal.id)}
            />
          ))}
        </div>

        {/* Search + Status filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[var(--space-sm)] mb-[var(--space-lg)]">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-[var(--space-sm)] top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search indicators…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-[var(--space-2xl)] pr-[var(--space-md)] py-[var(--space-sm)] text-[length:var(--text-body)] bg-surface border border-border-default rounded-lg placeholder:text-text-secondary/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-[var(--space-sm)] top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/40 hover:text-text-primary transition-colors cursor-pointer"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusChips.map(chip => (
              <button
                key={chip.key}
                onClick={() => setStatusFilter(statusFilter === chip.key ? 'all' : chip.key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[length:var(--text-micro)] font-semibold border transition-all cursor-pointer ${
                  statusFilter === chip.key
                    ? chip.active
                    : 'border-border-default/50 text-text-secondary hover:border-border-default hover:bg-surface/50'
                }`}
              >
                {chip.dot && <span className={`w-2 h-2 rounded-full ${chip.dot}`} />}
                {chip.label}
                <span className={`tabular-nums ${statusFilter === chip.key ? 'opacity-100' : 'opacity-50'}`}>
                  {chip.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active filter context */}
        {(activeGoalId !== null || statusFilter !== 'all' || searchQuery) && (
          <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary">
            <span>
              Showing {visibleOutcomeCount} outcome{visibleOutcomeCount !== 1 ? 's' : ''} · {visibleIndicatorCount} indicator{visibleIndicatorCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => { setActiveGoalId(null); setStatusFilter('all'); setSearchQuery(''); }}
              className="text-gold-dark hover:text-gold font-medium transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Outcome cards grid */}
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal, gi) => (
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
                    style={{ animationDelay: `${(gi * 5 + oi + 1) * 30}ms` }}
                  >
                    <OutcomeCard outcome={outcome} />
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="py-[var(--space-2xl)] text-center">
            <p className="text-[length:var(--text-h3)] font-bold text-text-secondary/30">No matches</p>
            <p className="text-[length:var(--text-caption)] text-text-secondary/50 mt-[var(--space-xs)]">
              Try a different search term or clear filters
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
