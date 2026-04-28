'use client';

import Link from 'next/link';
import { DataFreshness } from '@/components/layout/DataFreshness';
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
import { useMinistryData } from '../useMofData';

export default function CapitalPage() {
  const { mockDataEnabled } = useMockData();
  const data = useMinistryData();
  const { capital, overview } = data;
  const hasActuals = capital.actuals.length > 0;

  const breadcrumbs = [
    { label: 'Cabinet', href: '/dashboard' },
    { label: overview.shortName, href: `/ministry/${overview.id}` },
    { label: 'Capital Expenditure' },
  ];

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
                  Capital Expenditure
                </h1>
                <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
                  {capital.projects.length} projects
                  {hasActuals && ` · Avg physical progress: ${formatPct(avgPhysical)}`}
                </p>
              </div>
              {hasActuals && <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} />}
            </div>
          </div>

          {/* Mobile: description panel */}
          <div className="lg:hidden mt-[var(--space-lg)] p-[var(--space-lg)] bg-card rounded-lg border border-border-default animate-fade-up stagger-2">
            <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed">
              Capital expenditure funds long-term investments — infrastructure, technology systems, construction, and major equipment. These projects span multiple fiscal years and are tracked by both financial disbursement and physical completion milestones.
            </p>
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
              className="space-y-[var(--space-xl)]"
            />
          </div>
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20 animate-fade-up stagger-5">
              <h3 className="text-[length:var(--text-body)] font-semibold text-text-primary uppercase tracking-widest mb-[var(--space-md)]">About</h3>
              <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed">
                Capital expenditure funds long-term investments — infrastructure, technology systems, construction, and major equipment. These projects span multiple fiscal years and are tracked by both financial disbursement and physical completion milestones.
              </p>
              <div className="mt-[var(--space-xl)] pt-[var(--space-xl)] border-t border-border-default space-y-[var(--space-lg)]">
                <div>
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Total Allocation</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {formatCurrency(capital.totalAllocation)}
                  </p>
                </div>
                <div className="border-t border-border-default pt-[var(--space-lg)]">
                  <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Projects</p>
                  <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                    {capital.projects.length}
                  </p>
                </div>
                {hasActuals && (
                  <>
                    <div className="border-t border-border-default pt-[var(--space-lg)]">
                      <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Avg Physical Progress</p>
                      <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                        {formatPct(avgPhysical)}
                      </p>
                    </div>
                    <div className="border-t border-border-default pt-[var(--space-lg)]">
                      <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">Utilization</p>
                      <p className="text-[length:var(--text-h2)] font-bold text-text-primary tracking-tight mt-[2px]">
                        {formatPct(utilPct)}
                      </p>
                      <div className="flex items-center gap-[var(--space-sm)] mt-[var(--space-xs)]">
                        <StatusBadge status={statusResult.status} tooltip={statusResult.tooltip} size="sm" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </DashboardShell>
    </>
  );
}
