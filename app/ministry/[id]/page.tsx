'use client';

import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MetricCard } from '@/components/cards/MetricCard';
import { BucketCard } from '@/components/cards/BucketCard';
import { LeadershipSidebar } from '@/components/people/LeadershipSidebar';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { RevenueSplitBar } from '@/components/charts/RevenueSplitBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { YoYBadge } from '@/components/ui/YoYBadge';
import { UtilizationGauge } from '@/components/ui/UtilizationGauge';
import { useMockData } from '@/lib/context';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveRevenueStatus } from '@/lib/status';
import { mofLeadership } from '@/lib/people-data';

import { useMofData } from './useMofData';

const NAV_BREADCRUMBS = [
  { label: 'Cabinet', href: '/' },
  { label: 'Ministry of Finance' },
];

export default function MinistryPage() {
  const { mockDataEnabled } = useMockData();
  const data = useMofData();
  const hasActuals = data.overview.actuals.length > 0;

  const { overview, revenue, fixedObligations, operational, capital } = data;

  const fixedUtilPct = fixedObligations.totalAllocation > 0
    ? (fixedObligations.totalPaid / fixedObligations.totalAllocation) * 100
    : 0;
  const opsUtilPct = operational.utilizationPct;
  const capitalUtilPct = capital.totalAllocation > 0
    ? (capital.totalSpent / capital.totalAllocation) * 100
    : 0;

  const fixedStatus = deriveUtilizationStatus(fixedUtilPct, EXPECTED_UTILIZATION);
  const opsStatus = deriveUtilizationStatus(opsUtilPct, EXPECTED_UTILIZATION);
  const capitalStatus = deriveUtilizationStatus(capitalUtilPct, EXPECTED_UTILIZATION);
  const revenueStatus = deriveRevenueStatus(revenue.totalCollected, revenue.totalTarget);

  const overallUtilPct = overview.totalAllocation > 0
    ? (overview.totalSpent / overview.totalAllocation) * 100
    : 0;

  return (
    <>
      <CabinetNav breadcrumbs={NAV_BREADCRUMBS} />
      <DashboardShell>
        <div className="flex gap-[var(--space-3xl)]">
          <div className="flex-1 min-w-0">

            <header className="mb-[var(--space-2xl)] animate-fade-up">
              <h1 className="text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
                Ministry of Finance &amp; the Public Service
              </h1>
              <p className="text-text-secondary text-[length:var(--text-body)] mt-[var(--space-xs)]">
                9 budget heads · Fiscal Year 2026-27
                {hasActuals && ' · Reporting: September 2026'}
              </p>
            </header>

            <div className="grid grid-cols-3 gap-[var(--space-xl)] pb-[var(--space-lg)] animate-fade-up stagger-2">
              <MetricCard label="Total Allocation" value={formatCurrency(overview.totalAllocation)}>
                <div className="flex items-center gap-[var(--space-sm)]">
                  <YoYBadge current={overview.totalAllocation} prior={overview.priorYearAllocation} />
                </div>
                <div className="mt-[var(--space-sm)] flex gap-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary">
                  <span>Recurrent: {formatCurrency(overview.recurrentTotal)}</span>
                  <span>Capital: {formatCurrency(overview.capitalTotal)}</span>
                </div>
              </MetricCard>

              <MetricCard label="Budget Utilization" value={hasActuals ? formatPct(overallUtilPct) : '—'}>
                {hasActuals && <UtilizationGauge actual={overallUtilPct} expected={EXPECTED_UTILIZATION} />}
                {!hasActuals && (
                  <p className="text-[length:var(--text-caption)] text-text-secondary mt-[var(--space-xs)]">
                    Awaiting expenditure data
                  </p>
                )}
              </MetricCard>

              <MetricCard label="Revenue Performance" value={hasActuals ? formatCurrency(revenue.totalCollected) : '—'}>
                {hasActuals ? (
                  <>
                    <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
                      <span className="text-[length:var(--text-caption)] text-text-secondary">
                        vs {formatCurrency(revenue.totalTarget)} target
                      </span>
                      <StatusBadge status={revenueStatus.status} tooltip={revenueStatus.tooltip} size="sm" />
                    </div>
                    <div className="text-[length:var(--text-caption)]">
                      <span className={revenue.variancePct >= 0 ? 'text-jm-green-dark font-semibold' : 'text-status-off-track font-semibold'}>
                        {revenue.variancePct >= 0 ? '+' : ''}{formatCurrency(revenue.variance)} ({revenue.variancePct >= 0 ? '+' : ''}{formatPct(revenue.variancePct)})
                      </span>
                    </div>
                    <div className="mt-[var(--space-md)]">
                      <RevenueSplitBar data={revenue.bySplit} />
                    </div>
                  </>
                ) : (
                  <p className="text-[length:var(--text-caption)] text-text-secondary mt-[var(--space-xs)]">
                    Target: {formatCurrency(revenue.totalTarget)}
                  </p>
                )}
              </MetricCard>
            </div>

            <section className="pt-[var(--space-lg)] pb-[var(--space-2xl)] animate-fade-up stagger-3">
              <h2 className="text-[length:var(--text-h1)] font-bold text-text-primary mb-[var(--space-lg)]">
                Budget Breakdown
              </h2>
              <div className="grid grid-cols-3 gap-[var(--space-xl)]">
                <BucketCard
                  title="Fixed Obligations"
                  subtitle={`~${formatPct(fixedObligations.pctOfMinistry)} of ministry budget`}
                  href="/ministry/mof/fixed"
                  allocation={fixedObligations.totalAllocation}
                  priorYearAllocation={fixedObligations.priorYearAllocation}
                  spent={fixedObligations.totalPaid}
                  utilizationPct={fixedUtilPct}
                  statusResult={fixedStatus}
                >
                  <div className="flex gap-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary">
                    <span>{fixedObligations.obligations.length} obligations</span>
                    {hasActuals && <span className="text-jm-green-dark font-semibold">All current</span>}
                  </div>
                </BucketCard>

                <BucketCard
                  title="Operational Programmes"
                  subtitle={`~${formatPct(100 - fixedObligations.pctOfMinistry - (capital.totalAllocation / overview.totalAllocation * 100))} of ministry budget`}
                  href="/ministry/mof/ops"
                  allocation={operational.totalAllocation}
                  priorYearAllocation={operational.priorYearAllocation}
                  spent={operational.totalSpent}
                  utilizationPct={opsUtilPct}
                  statusResult={opsStatus}
                >
                  <div className="flex gap-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary">
                    <span>{operational.entities.length} entities</span>
                    <span>{formatPct(operational.vacancyRate)} vacancy</span>
                  </div>
                </BucketCard>

                <BucketCard
                  title="Capital Projects"
                  subtitle={`~${formatPct((capital.totalAllocation / overview.totalAllocation) * 100)} of ministry budget`}
                  href="/ministry/mof/capital"
                  allocation={capital.totalAllocation}
                  priorYearAllocation={capital.priorYearAllocation}
                  spent={capital.totalSpent}
                  utilizationPct={capitalUtilPct}
                  statusResult={capitalStatus}
                >
                  <div className="flex gap-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary">
                    <span>{capital.projects.length} projects</span>
                  </div>
                </BucketCard>
              </div>
            </section>

            {hasActuals && (
              <section className="py-[var(--space-2xl)] animate-fade-up stagger-4">
                <h3 className="text-[length:var(--text-body)] font-semibold text-text-primary mb-[var(--space-base)]">
                  Ministry Spend Trajectory
                </h3>
                <SpendTimeSeries
                  currentYear={overview.actuals}
                  priorYear={overview.priorYearActuals}
                  allocation={overview.totalAllocation}
                  height={280}
                />
                <div className="flex items-center gap-[var(--space-lg)] mt-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary">
                  <span className="flex items-center gap-[6px]">
                    <span className="inline-block w-4 h-[2px] bg-jm-green rounded-sm" />
                    FY 2026-27 Actual
                  </span>
                  <span className="flex items-center gap-[6px]">
                    <span className="inline-block w-4 h-0 border-t-[1.5px] border-dashed border-chart-prior" />
                    FY 2025-26
                  </span>
                  <span className="flex items-center gap-[6px]">
                    <span className="inline-block w-4 h-0 border-t-[1.5px] border-dashed border-gold" />
                    Expected Pace
                  </span>
                </div>
              </section>
            )}
          </div>

          <aside className="w-56 flex-shrink-0">
            <div className="sticky top-20 animate-fade-up stagger-5">
              <LeadershipSidebar officers={mofLeadership} />
            </div>
          </aside>
        </div>
      </DashboardShell>
    </>
  );
}
