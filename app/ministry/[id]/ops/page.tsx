'use client';

import Link from 'next/link';
import { CabinetNav } from '@/components/layout/CabinetNav';
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
    { label: 'Cabinet', href: '/' },
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
          subtitle={`Head ${e.headCode}${e.headOfficer ? ` · ${e.headOfficer.name}` : ''}`}
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
      <SectionNav items={sectionItems} />
      <DashboardShell>
        <div>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-x-[var(--space-xl)] gap-y-[var(--space-lg)]"
            />
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
