'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMockData } from '@/lib/context';
import { mofData } from '@/lib/mock-data';
import { stripActuals } from '@/lib/strip-actuals';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveMinistryStatus } from '@/lib/status';

export default function CabinetOverview() {
  const { mockDataEnabled } = useMockData();
  const data = useMemo(
    () => mockDataEnabled ? mofData : stripActuals(mofData),
    [mockDataEnabled]
  );

  const { overview, fixedObligations, operational, capital } = data;

  const overallUtil = overview.totalAllocation > 0
    ? (overview.totalSpent / overview.totalAllocation) * 100 : 0;
  const fixedUtil = fixedObligations.totalAllocation > 0
    ? (fixedObligations.totalPaid / fixedObligations.totalAllocation) * 100 : 0;
  const opsUtil = operational.utilizationPct;
  const capUtil = capital.totalAllocation > 0
    ? (capital.totalSpent / capital.totalAllocation) * 100 : 0;

  const fixedStatus = deriveUtilizationStatus(fixedUtil, EXPECTED_UTILIZATION);
  const opsStatus = deriveUtilizationStatus(opsUtil, EXPECTED_UTILIZATION);
  const capitalStatus = deriveUtilizationStatus(capUtil, EXPECTED_UTILIZATION);
  const ministryStatus = deriveMinistryStatus([fixedStatus.status, opsStatus.status, capitalStatus.status]);
  const utilStatus = deriveUtilizationStatus(overallUtil, EXPECTED_UTILIZATION);

  return (
    <>
      <CabinetNav />
      <DashboardShell>
        <div className="animate-fade-up">
          <header className="mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
            <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
              Cabinet Dashboard
            </h1>
            <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
              Budget execution overview · Fiscal Year 2026-27
              {mockDataEnabled && ' · Reporting period: September 2026'}
            </p>
          </header>

          <section className="max-w-2xl animate-fade-up stagger-2">
            <p className="text-[length:var(--text-caption)] font-medium text-text-secondary uppercase tracking-widest mb-[var(--space-lg)]">
              Active Ministries
            </p>

            <Link
              href="/ministry/mof"
              className="group block"
            >
              <div className="flex items-start gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
                <Image
                  src={overview.minister.avatarUrl}
                  alt={overview.minister.name}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-border-default flex-shrink-0 mt-1 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-xs)] sm:gap-[var(--space-base)]">
                    <div className="min-w-0">
                      <h2 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary group-hover:text-gold-dark transition-colors">
                        {overview.name}
                      </h2>
                      <p className="text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-secondary mt-[2px]">
                        {overview.minister.name}
                      </p>
                    </div>
                    {mockDataEnabled && (
                      <StatusBadge status={ministryStatus.status} tooltip={ministryStatus.tooltip} />
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--space-md)] sm:gap-[var(--space-xl)] mt-[var(--space-md)] sm:mt-[var(--space-lg)]">
                    <div>
                      <p className="text-[length:var(--text-caption)] text-text-secondary">Allocation</p>
                      <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold mt-[2px]">{formatCurrency(overview.totalAllocation)}</p>
                    </div>
                    <div>
                      <p className="text-[length:var(--text-caption)] text-text-secondary">Spent to Date</p>
                      <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold mt-[2px]">
                        {mockDataEnabled ? formatCurrency(overview.totalSpent) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
                      <p className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold mt-[2px]">
                        {mockDataEnabled ? formatPct(overallUtil) : '—'}
                      </p>
                    </div>
                  </div>

                  {mockDataEnabled && (
                    <div className="mt-[var(--space-md)] sm:mt-[var(--space-lg)]">
                      <ProgressBar
                        value={overallUtil}
                        color={utilStatus.status === 'on_track' ? 'green' : utilStatus.status === 'at_risk' ? 'gold' : 'red'}
                      />
                    </div>
                  )}

                  <div className="mt-[var(--space-md)] flex items-center gap-[6px] text-[length:var(--text-body)] font-medium text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity">
                    View ministry details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {!mockDataEnabled && (
            <div className="mt-[var(--space-lg)] sm:mt-[var(--space-2xl)] py-[var(--space-base)] px-[var(--space-base)] sm:px-[var(--space-lg)] border border-gold/30 bg-gold-light/30 rounded-sm max-w-2xl">
              <p className="text-[length:var(--text-body)] text-gold-dark font-medium">
                Mock expenditure data is off.
              </p>
              <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">
                Allocation and prior-year estimates are still visible. Toggle mock data on to see simulated 6-month spend progression.
              </p>
            </div>
          )}

          <div className="mt-[var(--space-2xl)] sm:mt-[var(--space-4xl)] pt-[var(--space-lg)] sm:pt-[var(--space-xl)] border-t border-border-default animate-fade-up stagger-3">
            <div className="flex items-center gap-[var(--space-md)] text-text-secondary">
              <div className="flex -space-x-1.5 flex-shrink-0">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-border-default border-2 border-page" />
                ))}
              </div>
              <p className="text-[length:var(--text-caption)] sm:text-[length:var(--text-body)]">
                <span className="font-semibold text-text-primary">15 more ministries</span>{' '}
                coming soon
              </p>
            </div>
          </div>
        </div>
      </DashboardShell>
    </>
  );
}
