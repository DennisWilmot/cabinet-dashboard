'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { MilestoneTrack } from '@/components/ui/MilestoneTrack';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { FundingSplit } from '@/components/charts/RevenueSplitBar';
import { formatCurrency, formatPct, formatFullDate } from '@/lib/utils';
import { deriveProjectStatus } from '@/lib/status';
import type { CapitalProject } from '@/lib/types';

const riskColors: Record<string, string> = {
  low: 'text-jm-green-dark',
  moderate: 'text-gold-dark',
  high: 'text-status-off-track',
};

export function ProjectCard({ project, headless = false }: { project: CapitalProject; headless?: boolean }) {
  const p = project;
  const statusResult = deriveProjectStatus(p);

  return (
    <article className={headless ? '' : 'border-t-2 border-border-strong pt-[var(--space-base)]'}>
      {!headless && (
        <div className="flex items-start justify-between mb-[var(--space-base)]">
          <div>
            <h3 className="font-bold text-[length:var(--text-h3)] text-text-primary">{p.name}</h3>
            <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">Code {p.code}</p>
          </div>
          <div className="flex items-center gap-[var(--space-md)]">
            <span className={`text-[length:var(--text-caption)] font-semibold ${riskColors[p.riskLevel]}`}>
              {p.riskLevel.charAt(0).toUpperCase() + p.riskLevel.slice(1)} Risk
            </span>
            <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} size="sm" />
          </div>
        </div>
      )}

      {p.isContingency ? (
        <ContingencyView project={p} />
      ) : (
        <StandardProjectView project={p} />
      )}
    </article>
  );
}

function ContingencyView({ project: p }: { project: CapitalProject }) {
  return (
    <div className="space-y-[var(--space-lg)]">
      <div className="grid grid-cols-2 gap-[var(--space-md)] sm:gap-[var(--space-xl)] pb-[var(--space-lg)] border-b border-border-default">
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Reserve Budget</p>
          <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{formatCurrency(p.currentYearBudget)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Drawn Down</p>
          <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{formatCurrency(p.currentYearSpent)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Remaining</p>
          <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-jm-green-dark">{formatCurrency(p.currentYearBudget - p.currentYearSpent)}</p>
        </div>
      </div>
      <p className="text-[length:var(--text-h3)] text-text-secondary leading-relaxed">{p.narrative}</p>
      {p.mediumTermProjection && (
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary mb-[var(--space-xs)]">Medium-term Trajectory</p>
          <div className="flex flex-wrap gap-[var(--space-md)] sm:gap-[var(--space-lg)] text-[length:var(--text-body)]">
            {p.mediumTermProjection.map((v, i) => (
              <div key={i}>
                <p className="font-semibold">{formatCurrency(v)}</p>
                <p className="text-text-secondary">{2026 + i}-{27 + i}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StandardProjectView({ project: p }: { project: CapitalProject }) {
  return (
    <div className="space-y-[var(--space-lg)]">
      <div className="grid grid-cols-2 gap-[var(--space-md)] sm:gap-[var(--space-xl)] pb-[var(--space-lg)] border-b border-border-default">
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Current Year Budget</p>
          <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{formatCurrency(p.currentYearBudget)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Current Year Spent</p>
          <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{formatCurrency(p.currentYearSpent)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Total Project Cost</p>
          <p className="text-[length:var(--text-h3)] font-semibold">{formatCurrency(p.totalProjectCost)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Cumulative Spend</p>
          <p className="text-[length:var(--text-h3)] font-semibold">{formatCurrency(p.cumulativeSpend)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[var(--space-md)] sm:gap-[var(--space-xl)]">
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary mb-[var(--space-xs)]">Financial Progress</p>
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="flex-1 h-[8px] bg-border-default/30 rounded-sm overflow-hidden">
              <div className="h-full bg-jm-green rounded-sm" style={{ width: `${p.financialProgressPct}%` }} />
            </div>
            <span className="text-[length:var(--text-body)] font-semibold">{formatPct(p.financialProgressPct)}</span>
          </div>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary mb-[var(--space-xs)]">Physical Progress</p>
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="flex-1 h-[8px] bg-border-default/30 rounded-sm overflow-hidden">
              <div className="h-full bg-chart-accent rounded-sm" style={{ width: `${p.physicalProgressPct}%` }} />
            </div>
            <span className="text-[length:var(--text-body)] font-semibold">{formatPct(p.physicalProgressPct)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[var(--space-md)] text-[length:var(--text-body)]">
        <div>
          <p className="text-text-secondary">Start</p>
          <p className="font-semibold">{formatFullDate(p.startDate)}</p>
        </div>
        <div>
          <p className="text-text-secondary">End</p>
          <p className="font-semibold">
            {formatFullDate(p.originalEndDate)}
            {p.revisedEndDate && (
              <span className="text-status-off-track ml-[var(--space-xs)]">(revised: {formatFullDate(p.revisedEndDate)})</span>
            )}
          </p>
        </div>
      </div>

      <p className="text-[length:var(--text-h3)] text-text-secondary leading-relaxed pt-[var(--space-lg)] border-t border-border-default">{p.narrative}</p>

      {p.milestones.length > 0 && (
        <div className="pt-[var(--space-lg)] border-t border-border-default">
          <p className="text-[length:var(--text-body)] text-text-secondary font-semibold uppercase tracking-widest mb-[var(--space-sm)]">
            Milestones
          </p>
          <MilestoneTrack milestones={p.milestones} />
        </div>
      )}

      {p.funding.length > 0 && (
        <div className="pt-[var(--space-lg)] border-t border-border-default">
          <p className="text-[length:var(--text-body)] text-text-secondary font-semibold uppercase tracking-widest mb-[var(--space-sm)]">
            Funding Sources
          </p>
          <FundingSplit data={p.funding.map(f => ({ source: f.source, committed: f.committed, disbursed: f.disbursed }))} />
        </div>
      )}

      {p.actuals.length > 0 && (
        <div className="pt-[var(--space-lg)] border-t border-border-default">
          <p className="text-[length:var(--text-body)] text-text-secondary mb-[var(--space-sm)]">Spend Trajectory</p>
          <SpendTimeSeries
            currentYear={p.actuals}
            allocation={p.currentYearBudget}
            height={180}
            compact
          />
        </div>
      )}
    </div>
  );
}
