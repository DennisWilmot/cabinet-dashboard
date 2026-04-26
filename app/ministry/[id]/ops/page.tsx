'use client';

import Link from 'next/link';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SectionNav } from '@/components/layout/SectionNav';
import { EntityCard } from '@/components/cards/EntityCard';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { ReorderableList } from '@/components/ui/ReorderableList';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMockData } from '@/lib/context';
import { formatCurrency, formatPct, formatNumber, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus } from '@/lib/status';
import { useMinistryData } from '../useMofData';

export default function OperationalPage() {
  const { mockDataEnabled } = useMockData();
  const data = useMinistryData();
  const { operational, overview } = data;
  const hasActuals = operational.actuals.length > 0;

  const breadcrumbs = [
    { label: 'Cabinet', href: '/dashboard' },
    { label: overview.shortName, href: `/ministry/${overview.id}` },
    { label: 'Operational Programmes' },
  ];

  const statusResult = deriveUtilizationStatus(operational.utilizationPct, EXPECTED_UTILIZATION);

  const sectionItems = [
    { id: 'overview', label: 'Overview' },
    ...operational.entities.map(e => ({ id: e.id, label: e.name })),
  ];

  const cardItems = operational.entities.map(e => {
    const eStatus = deriveUtilizationStatus(e.utilizationPct, EXPECTED_UTILIZATION);
    return {
      id: e.id,
      content: (
        <CollapsibleCard
          id={e.id}
          title={e.name}
          subtitle={<>Head <span className="relative group/head inline cursor-help border-b border-dotted border-text-secondary/40">{e.headCode}<span className="invisible group-hover/head:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-52 px-3 py-2 text-[length:var(--text-caption)] text-page bg-text-primary rounded shadow-lg z-50 text-center leading-snug font-normal">Official reference number from the Estimates of Expenditure</span></span>{e.headOfficer ? ` · ${e.headOfficer.name}` : ''}</>}
          headerRight={hasActuals ? <StatusBadge status={eStatus.status} tooltip={eStatus.tooltip} size="sm" /> : undefined}
        >
          <EntityCard entity={e} headless />
        </CollapsibleCard>
      ),
    };
  });

  return (
    <>
      <CabinetNav breadcrumbs={breadcrumbs} />
      <DataFreshness lastUpdated={overview.lastUpdated} />
      <SectionNav items={sectionItems} />
      <DashboardShell>
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
                  Operational Programmes
                </h1>
                <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
                  {operational.entities.length} entities · {formatNumber(operational.totalApprovedPosts)} approved posts
                </p>
              </div>
              {hasActuals && <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} />}
            </div>
          </div>

          {/* Mobile: description panel */}
          <div className="lg:hidden mt-[var(--space-lg)] p-[var(--space-lg)] bg-card rounded-lg border border-border-default animate-fade-up stagger-2">
            <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed">
              Operational programmes fund the ministry&apos;s day-to-day activities — staffing, administration, service delivery, and programme execution. Each entity (department or agency) operates under an approved establishment of posts with its own allocation and performance targets.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--space-md)] sm:gap-[var(--space-xl)] py-[var(--space-lg)] sm:py-[var(--space-2xl)] border-b border-border-default animate-fade-up stagger-2">
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Allocation</p>
              <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold">{formatCurrency(operational.totalAllocation)}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Spent</p>
              <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold">{hasActuals ? formatCurrency(operational.totalSpent) : '—'}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
              <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold">{hasActuals ? formatPct(operational.utilizationPct) : '—'}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Vacancy Rate</p>
              <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold">{formatPct(operational.vacancyRate)}</p>
            </div>
          </div>

          {hasActuals && (
            <section className="py-[var(--space-lg)] sm:py-[var(--space-2xl)] animate-fade-up stagger-3">
              <h3 className="text-[length:var(--text-body)] font-semibold mb-[var(--space-md)]">
                Operational Spend Trajectory
              </h3>
              <div className="w-full overflow-x-auto -mx-[var(--space-base)] px-[var(--space-base)] sm:mx-0 sm:px-0">
                <div className="min-w-[400px]">
                  <SpendTimeSeries
                    currentYear={operational.actuals}
                    priorYear={operational.priorYearActuals}
                    allocation={operational.totalAllocation}
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
                Operational programmes fund the ministry&apos;s day-to-day activities — staffing, administration, service delivery, and programme execution. Each entity (department or agency) operates under an approved establishment of posts with its own allocation and performance targets.
              </p>
              <div className="mt-[var(--space-xl)] pt-[var(--space-xl)] border-t border-border-default space-y-[var(--space-lg)]">
                <div>
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Total Allocation</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {formatCurrency(operational.totalAllocation)}
                  </p>
                </div>
                <div className="border-t border-border-default pt-[var(--space-lg)]">
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Entities</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {operational.entities.length}
                  </p>
                </div>
                <div className="border-t border-border-default pt-[var(--space-lg)]">
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Approved Posts</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {formatNumber(operational.totalApprovedPosts)}
                  </p>
                  <p className="text-[length:var(--text-caption)] text-text-secondary mt-[var(--space-xs)]">
                    {formatPct(operational.vacancyRate)} vacancy rate
                  </p>
                </div>
                {hasActuals && (
                  <div className="border-t border-border-default pt-[var(--space-lg)]">
                    <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Utilization</p>
                    <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                      {formatPct(operational.utilizationPct)}
                    </p>
                    <div className="flex items-center gap-[var(--space-sm)] mt-[var(--space-xs)]">
                      <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} size="sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </DashboardShell>
    </>
  );
}
