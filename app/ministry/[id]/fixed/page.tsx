'use client';

import Link from 'next/link';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SectionNav } from '@/components/layout/SectionNav';
import { ObligationCard } from '@/components/cards/ObligationCard';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { ReorderableList } from '@/components/ui/ReorderableList';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { DebtServiceDonut } from '@/components/charts/DebtServiceDonut';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMockData } from '@/lib/context';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveObligationStatus } from '@/lib/status';
import { useMinistryData } from '../useMofData';

export default function FixedObligationsPage() {
  const { mockDataEnabled } = useMockData();
  const data = useMinistryData();
  const { overview } = data;
  const { fixedObligations } = data;
  const hasActuals = fixedObligations.actuals.length > 0;

  const breadcrumbs = [
    { label: 'Cabinet', href: '/dashboard' },
    { label: overview.shortName, href: `/ministry/${overview.id}` },
    { label: 'Recurring Expenditure' },
  ];

  const utilPct = fixedObligations.totalAllocation > 0
    ? (fixedObligations.totalPaid / fixedObligations.totalAllocation) * 100
    : 0;
  const statusResult = deriveUtilizationStatus(utilPct, EXPECTED_UTILIZATION);

  const sectionItems = [
    { id: 'overview', label: 'Overview' },
    ...fixedObligations.obligations.map(o => ({ id: o.id, label: o.name })),
  ];

  const cardItems = fixedObligations.obligations.map(o => {
    const oStatus = deriveObligationStatus([{ status: o.paymentStatus }]);
    return {
      id: o.id,
      content: (
        <CollapsibleCard
          id={o.id}
          title={o.name}
          subtitle={<>Head <span className="relative group/head inline cursor-help border-b border-dotted border-text-secondary/40">{o.headCode}<span className="invisible group-hover/head:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 px-3 py-2 text-[length:var(--text-caption)] text-page bg-text-primary rounded shadow-lg z-50 text-center leading-snug font-normal">Official reference number from the Estimates of Expenditure</span></span> · {formatCurrency(o.allocation)} allocated</>}
          headerRight={hasActuals ? <StatusBadge status={oStatus.status} tooltip={oStatus.tooltip} size="sm" /> : undefined}
        >
          <ObligationCard obligation={o} headless />
        </CollapsibleCard>
      ),
    };
  });

  return (
    <>
      <DashboardShell breadcrumbs={breadcrumbs} freshness={<DataFreshness inline lastUpdated={overview.lastUpdated} />} sectionNav={<SectionNav items={sectionItems} />}>
        <div className="flex flex-col lg:flex-row gap-[var(--space-2xl)] lg:gap-[var(--space-3xl)]">
          <div className="flex-1 min-w-0">
          <div id="overview" className="animate-fade-up scroll-mt-28">
            <Link href={`/ministry/${overview.id}`} className="inline-flex items-center gap-[4px] text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-secondary hover:text-gold-dark transition-colors mb-[var(--space-md)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Ministry Overview
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-xs)]">
              <div>
                <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
                  Recurring Expenditure
                </h1>
                <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
                  ~{formatPct(fixedObligations.pctOfMinistry)} of ministry budget · {fixedObligations.obligations.length} obligations
                </p>
              </div>
              {hasActuals && <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} />}
            </div>
          </div>

          {/* Mobile: description panel */}
          <div className="lg:hidden mt-[var(--space-lg)] p-[var(--space-lg)] bg-card rounded-lg border border-border-default animate-fade-up stagger-2">
            <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed">
              Recurring expenditure covers the government&apos;s legally binding financial commitments — debt servicing, pension obligations, insurance premiums, international memberships, and transfers to public bodies. These are non-discretionary costs that must be paid regardless of revenue performance.
            </p>
            {hasActuals && fixedObligations.debtService && (
              <div className="mt-[var(--space-lg)] pt-[var(--space-lg)] border-t border-border-default">
                <h4 className="text-[length:var(--text-body)] font-semibold text-text-primary uppercase tracking-widest mb-[var(--space-md)]">Debt Service vs New Borrowing</h4>
                <DebtServiceDonut data={fixedObligations.debtService} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--space-md)] sm:gap-[var(--space-xl)] py-[var(--space-lg)] sm:py-[var(--space-2xl)] border-b border-border-default animate-fade-up stagger-2">
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Allocation</p>
              <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{formatCurrency(fixedObligations.totalAllocation)}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Paid</p>
              <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{hasActuals ? formatCurrency(fixedObligations.totalPaid) : '—'}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
              <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{hasActuals ? formatPct(utilPct) : '—'}</p>
            </div>
          </div>

          {hasActuals && (
            <section className="py-[var(--space-lg)] sm:py-[var(--space-2xl)] animate-fade-up stagger-3">
              <h3 className="text-[length:var(--text-body)] font-semibold mb-[var(--space-md)]">
                Recurring Expenditure Spend Trajectory
              </h3>
              <div className="w-full overflow-x-auto -mx-[var(--space-base)] px-[var(--space-base)] sm:mx-0 sm:px-0">
                <div className="min-w-[400px]">
                  <SpendTimeSeries
                    currentYear={fixedObligations.actuals}
                    priorYear={fixedObligations.priorYearActuals}
                    allocation={fixedObligations.totalAllocation}
                    height={220}
                  />
                </div>
              </div>
            </section>
          )}

          <div className="animate-fade-up stagger-4">
            <ReorderableList
              items={cardItems}
              className="space-y-[var(--space-xl)]"
            />
          </div>
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20 animate-fade-up stagger-5">
              <h3 className="text-[length:var(--text-body)] font-semibold text-text-primary uppercase tracking-widest mb-[var(--space-md)]">About</h3>
              <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed">
                Recurring expenditure covers the government&apos;s legally binding financial commitments — debt servicing, pension obligations, insurance premiums, international memberships, and transfers to public bodies. These are non-discretionary costs that must be paid regardless of revenue performance.
              </p>
              <div className="mt-[var(--space-xl)] pt-[var(--space-xl)] border-t border-border-default space-y-[var(--space-lg)]">
                <div>
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Total Allocation</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {formatCurrency(fixedObligations.totalAllocation)}
                  </p>
                  <p className="text-[length:var(--text-caption)] text-text-secondary mt-[var(--space-xs)]">
                    ~{formatPct(fixedObligations.pctOfMinistry)} of ministry budget
                  </p>
                </div>
                <div className="border-t border-border-default pt-[var(--space-lg)]">
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Obligations</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {fixedObligations.obligations.length}
                  </p>
                </div>
                {hasActuals && (
                  <div className="border-t border-border-default pt-[var(--space-lg)]">
                    <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Utilization</p>
                    <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                      {formatPct(utilPct)}
                    </p>
                    <div className="flex items-center gap-[var(--space-sm)] mt-[var(--space-xs)]">
                      <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} size="sm" />
                    </div>
                  </div>
                )}
              </div>
              {hasActuals && fixedObligations.debtService && (
                <div className="mt-[var(--space-xl)] pt-[var(--space-xl)] border-t border-border-default">
                  <h3 className="text-[length:var(--text-body)] font-semibold text-text-primary uppercase tracking-widest mb-[var(--space-md)]">
                    Debt Service vs New Borrowing
                  </h3>
                  <DebtServiceDonut data={fixedObligations.debtService} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </DashboardShell>
    </>
  );
}
