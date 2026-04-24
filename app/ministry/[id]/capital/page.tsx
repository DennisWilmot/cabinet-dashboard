'use client';

import Link from 'next/link';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SectionNav } from '@/components/layout/SectionNav';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { ReorderableList } from '@/components/ui/ReorderableList';
import { SpendTimeSeries } from '@/components/charts/SpendTimeSeries';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMockData } from '@/lib/context';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveProjectStatus } from '@/lib/status';
import { useMofData } from '../useMofData';

const NAV_BREADCRUMBS = [
  { label: 'Cabinet', href: '/' },
  { label: 'Finance', href: '/ministry/mof' },
  { label: 'Capital Projects' },
];

export default function CapitalPage() {
  const { mockDataEnabled } = useMockData();
  const data = useMofData();
  const { capital } = data;
  const hasActuals = capital.actuals.length > 0;

  const utilPct = capital.totalAllocation > 0 ? (capital.totalSpent / capital.totalAllocation) * 100 : 0;
  const statusResult = deriveUtilizationStatus(utilPct, EXPECTED_UTILIZATION);

  const realProjects = capital.projects.filter(p => !p.isContingency);
  const contingency = capital.projects.find(p => p.isContingency);
  const avgPhysical = realProjects.length > 0
    ? realProjects.reduce((sum, p) => sum + p.physicalProgressPct, 0) / realProjects.length
    : 0;

  const allProjects = [...(contingency ? [contingency] : []), ...realProjects];
  const sectionItems = [
    { id: 'overview', label: 'Overview' },
    ...allProjects.map(p => ({ id: p.id, label: p.name })),
  ];

  const riskColors: Record<string, string> = {
    low: 'text-jm-green-dark',
    moderate: 'text-gold-dark',
    high: 'text-status-off-track',
  };

  const cardItems = allProjects.map(p => {
    const pStatus = deriveProjectStatus(p);
    return {
      id: p.id,
      content: (
        <CollapsibleCard
          id={p.id}
          title={p.name}
          subtitle={`Code ${p.code} · ${formatCurrency(p.currentYearBudget)} budget`}
          headerRight={
            <div className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)]">
              <span className={`text-[length:var(--text-caption)] font-semibold ${riskColors[p.riskLevel]} hidden sm:inline`}>
                {p.riskLevel.charAt(0).toUpperCase() + p.riskLevel.slice(1)} Risk
              </span>
              {hasActuals && <StatusBadge status={pStatus.status} tooltip={pStatus.tooltip} size="sm" />}
            </div>
          }
        >
          <ProjectCard project={p} headless />
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
            <Link href="/ministry/mof" className="inline-flex items-center gap-[4px] text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-secondary hover:text-gold-dark transition-colors mb-[var(--space-md)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Ministry Overview
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-xs)]">
              <div>
                <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
                  Capital Projects
                </h1>
                <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
                  {capital.projects.length} projects
                  {hasActuals && ` · Avg physical progress: ${formatPct(avgPhysical)}`}
                </p>
              </div>
              {hasActuals && <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} />}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--space-md)] sm:gap-[var(--space-xl)] py-[var(--space-lg)] sm:py-[var(--space-2xl)] border-b border-border-default animate-fade-up stagger-2">
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Allocation</p>
              <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{formatCurrency(capital.totalAllocation)}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Total Spent</p>
              <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{hasActuals ? formatCurrency(capital.totalSpent) : '—'}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
              <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold">{hasActuals ? formatPct(utilPct) : '—'}</p>
            </div>
          </div>

          {hasActuals && (
            <section className="py-[var(--space-lg)] sm:py-[var(--space-2xl)] animate-fade-up stagger-3">
              <h3 className="text-[length:var(--text-body)] font-semibold mb-[var(--space-md)]">
                Capital Spend Trajectory
              </h3>
              <div className="w-full overflow-x-auto -mx-[var(--space-base)] px-[var(--space-base)] sm:mx-0 sm:px-0">
                <div className="min-w-[400px]">
                  <SpendTimeSeries
                    currentYear={capital.actuals}
                    priorYear={capital.priorYearActuals}
                    allocation={capital.totalAllocation}
                    height={220}
                  />
                </div>
              </div>
            </section>
          )}

          <div className="animate-fade-up stagger-4">
            <ReorderableList
              items={cardItems}
              className="space-y-[var(--space-lg)]"
            />
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
