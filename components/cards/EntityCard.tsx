'use client';

import { StatusBadge, StaffingBadge } from '@/components/ui/StatusBadge';
import { YoYBadge } from '@/components/ui/YoYBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { formatCurrency, formatPct, formatNumber, MONTHS_ELAPSED, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveKpiStatus, deriveStaffingHealth } from '@/lib/status';
import type { OperationalEntity } from '@/lib/types';

export function EntityCard({ entity, headless = false }: { entity: OperationalEntity; headless?: boolean }) {
  const e = entity;
  const utilStatus = deriveUtilizationStatus(e.utilizationPct, EXPECTED_UTILIZATION);
  const staffResult = deriveStaffingHealth(e.staffing.vacantPosts, e.staffing.approvedPosts);
  const utilColor = utilStatus.status === 'on_track' ? 'green' : utilStatus.status === 'at_risk' ? 'gold' : 'red';

  return (
    <article className={headless ? '' : 'border-t-2 border-border-strong pt-[var(--space-base)]'}>
      {!headless && (
        <div className="flex items-start justify-between mb-[var(--space-base)]">
          <div>
            <h3 className="font-bold text-[length:var(--text-h3)] text-text-primary">{e.name}</h3>
            <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">Head {e.headCode}</p>
            {e.headOfficer && (
              <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">{e.headOfficer.name}</p>
            )}
          </div>
          <StatusBadge status={utilStatus.status} tooltip={utilStatus.tooltip} size="sm" />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--space-lg)] mb-[var(--space-base)]">
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Allocation</p>
          <p className="text-[length:var(--text-h2)] font-bold">{formatCurrency(e.allocation)}</p>
          <YoYBadge current={e.allocation} prior={e.priorYearAllocation} />
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Spent</p>
          <p className="text-[length:var(--text-h2)] font-bold">{formatCurrency(e.spent)}</p>
          <p className="text-[length:var(--text-body)] text-text-secondary">{formatPct(e.utilizationPct)}</p>
        </div>
        <div>
          <p className="text-[length:var(--text-body)] text-text-secondary">Staffing</p>
          <p className="text-[length:var(--text-h2)] font-bold">{formatNumber(e.staffing.filledPosts)}</p>
          <p className="text-[length:var(--text-body)] text-text-secondary">of {formatNumber(e.staffing.approvedPosts)}</p>
        </div>
      </div>

      <div className="mb-[var(--space-lg)]">
        <ProgressBar value={e.utilizationPct} color={utilColor} height="sm" />
      </div>

      <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-lg)] pb-[var(--space-lg)] border-b border-border-default">
        <StaffingBadge health={staffResult.health} tooltip={staffResult.tooltip} />
        <span className="text-[length:var(--text-body)] text-text-secondary">{formatPct(e.staffing.vacancyRate)} vacancy</span>
      </div>

      {e.revenueData && (
        <div className="mb-[var(--space-base)] py-[var(--space-md)] border-y border-jm-green/15">
          <p className="text-[length:var(--text-body)] font-semibold text-jm-green-dark mb-[var(--space-xs)]">Revenue Collection</p>
          <div className="flex items-baseline gap-[var(--space-sm)]">
            <span className="text-[length:var(--text-h2)] font-bold text-jm-green-dark">{formatCurrency(e.revenueData.collected)}</span>
            <span className="text-[length:var(--text-body)] text-text-secondary">
              vs {formatCurrency(e.revenueData.target)} target
              ({e.revenueData.variancePct > 0 ? '+' : ''}{formatPct(e.revenueData.variancePct)})
            </span>
          </div>
        </div>
      )}

      {e.kpis.length > 0 && (
        <div className="mb-[var(--space-lg)] pb-[var(--space-lg)] border-b border-border-default">
          <p className="text-[length:var(--text-body)] text-text-secondary font-semibold uppercase tracking-widest mb-[var(--space-sm)]">
            Key Performance Indicators
          </p>
          <div className="space-y-[var(--space-sm)]">
            {e.kpis.map(kpi => {
              const kpiResult = deriveKpiStatus(kpi, MONTHS_ELAPSED);
              return (
                <div key={kpi.name} className="flex items-center justify-between text-[length:var(--text-body)]">
                  <span className="text-text-secondary truncate mr-[var(--space-sm)]">{kpi.name}</span>
                  <div className="flex items-center gap-[var(--space-sm)] flex-shrink-0">
                    <span className="font-semibold">
                      {kpi.actual}{kpi.unit} / {kpi.target}{kpi.unit}
                    </span>
                    <StatusBadge status={kpiResult.status} tooltip={kpiResult.tooltip} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {e.actuals.length > 0 && (
        <div className="pt-[var(--space-lg)] border-t border-border-default">
          <p className="text-[length:var(--text-body)] text-text-secondary mb-[var(--space-sm)]">Spend Trajectory</p>
          <SpendTimeSeries
            currentYear={e.actuals}
            priorYear={e.priorYearActuals}
            allocation={e.allocation}
            height={180}
            compact
          />
        </div>
      )}
    </article>
  );
}
