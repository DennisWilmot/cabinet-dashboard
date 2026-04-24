'use client';

import Link from 'next/link';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SectionNav } from '@/components/layout/SectionNav';
import { ObligationCard } from '@/components/cards/ObligationCard';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { ReorderableList } from '@/components/ui/ReorderableList';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMockData } from '@/lib/context';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveObligationStatus } from '@/lib/status';
import { useMofData } from '../useMofData';

const NAV_BREADCRUMBS = [
  { label: 'Cabinet', href: '/' },
  { label: 'Finance', href: '/ministry/mof' },
  { label: 'Fixed Obligations' },
];

export default function FixedObligationsPage() {
  const { mockDataEnabled } = useMockData();
  const data = useMofData();
  const { fixedObligations } = data;
  const hasActuals = fixedObligations.actuals.length > 0;

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
          subtitle={`Head ${o.headCode} · ${formatCurrency(o.allocation)} allocated`}
          headerRight={hasActuals ? <StatusBadge status={oStatus.status} tooltip={oStatus.tooltip} size="sm" /> : undefined}
        >
          <ObligationCard obligation={o} headless />
        </CollapsibleCard>
      ),
    };
  });

  return (
    <>
      <CabinetNav breadcrumbs={NAV_BREADCRUMBS} />
      <SectionNav items={sectionItems} />
      <DashboardShell>
        <div>
          <div id="overview" className="animate-fade-up scroll-mt-28">
            <Link href="/ministry/mof" className="inline-flex items-center gap-[4px] text-[length:var(--text-body)] text-text-secondary hover:text-gold-dark transition-colors mb-[var(--space-md)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Ministry Overview
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
                  Fixed Obligations
                </h1>
                <p className="text-text-secondary text-[length:var(--text-body)] mt-[var(--space-xs)]">
                  ~{formatPct(fixedObligations.pctOfMinistry)} of ministry budget · {fixedObligations.obligations.length} obligations
                </p>
              </div>
              {hasActuals && <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} />}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[var(--space-xl)] py-[var(--space-2xl)] border-b border-border-default animate-fade-up stagger-2">
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Allocation</p>
              <p className="text-[length:var(--text-h1)] font-bold">{formatCurrency(fixedObligations.totalAllocation)}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Paid</p>
              <p className="text-[length:var(--text-h1)] font-bold">{hasActuals ? formatCurrency(fixedObligations.totalPaid) : '—'}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
              <p className="text-[length:var(--text-h1)] font-bold">{hasActuals ? formatPct(utilPct) : '—'}</p>
            </div>
          </div>

          {hasActuals && (
            <section className="py-[var(--space-2xl)] animate-fade-up stagger-3">
              <h3 className="text-[length:var(--text-body)] font-semibold mb-[var(--space-md)]">
                Fixed Obligations Spend Trajectory
              </h3>
              <SpendTimeSeries
                currentYear={fixedObligations.actuals}
                priorYear={fixedObligations.priorYearActuals}
                allocation={fixedObligations.totalAllocation}
                height={220}
              />
            </section>
          )}

          <div className="animate-fade-up stagger-4">
            <ReorderableList
              items={cardItems}
              className="grid grid-cols-2 gap-x-[var(--space-xl)] gap-y-[var(--space-lg)]"
            />
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
