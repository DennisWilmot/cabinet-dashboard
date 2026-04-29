'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DataFreshness } from '@/components/layout/DataFreshness';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMockData } from '@/lib/context';
import { ministryRegistry, ministryOrder } from '@/lib/data';
import { opmLeadership } from '@/lib/data/people/opm';
import { stripActuals } from '@/lib/strip-actuals';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveMinistryStatus } from '@/lib/status';
import { nationalPulse } from '@/lib/data/national';
import type { MinistryData, NationalMetric, DisasterEvent } from '@/lib/types';

interface SearchHit {
  ministrySlug: string;
  type: 'ministry' | 'person' | 'project' | 'entity' | 'obligation';
  label: string;
  detail: string;
  href: string;
}

function buildSearchIndex(allData: MinistryData[]): SearchHit[] {
  const hits: SearchHit[] = [];

  for (const d of allData) {
    const slug = d.overview.id;
    const base = `/ministry/${slug}`;

    hits.push({
      ministrySlug: slug,
      type: 'ministry',
      label: d.overview.name,
      detail: d.overview.shortName,
      href: base,
    });

    for (const person of d.leadership) {
      hits.push({
        ministrySlug: slug,
        type: 'person',
        label: person.name,
        detail: `${person.title} · ${d.overview.shortName}`,
        href: base,
      });
    }

    for (const entity of d.operational.entities) {
      hits.push({
        ministrySlug: slug,
        type: 'entity',
        label: entity.name,
        detail: `Entity · ${d.overview.shortName}`,
        href: `${base}/ops`,
      });
      if (entity.headOfficer) {
        hits.push({
          ministrySlug: slug,
          type: 'person',
          label: entity.headOfficer.name,
          detail: `${entity.headOfficer.title} · ${d.overview.shortName}`,
          href: `${base}/ops`,
        });
      }
    }

    for (const project of d.capital.projects) {
      hits.push({
        ministrySlug: slug,
        type: 'project',
        label: project.name,
        detail: `Capital Project · ${d.overview.shortName}`,
        href: `${base}/capital`,
      });
    }

    for (const ob of d.fixedObligations.obligations) {
      hits.push({
        ministrySlug: slug,
        type: 'obligation',
        label: ob.name,
        detail: `Recurring Expenditure · ${d.overview.shortName}`,
        href: `${base}/fixed`,
      });
    }
  }

  return hits;
}

const TYPE_LABELS: Record<SearchHit['type'], string> = {
  ministry: 'Ministry',
  person: 'Person',
  project: 'Project',
  entity: 'Entity',
  obligation: 'Obligation',
};

const TYPE_COLORS: Record<SearchHit['type'], string> = {
  ministry: 'bg-green/15 text-green-dark',
  person: 'bg-gold/20 text-gold-dark',
  project: 'bg-green-dark/15 text-green-dark',
  entity: 'bg-gold-light/40 text-text-primary',
  obligation: 'bg-border-default/50 text-text-secondary',
};

function SearchBar({ allData }: { allData: MinistryData[] }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const index = useMemo(() => buildSearchIndex(allData), [allData]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index
      .filter(h => h.label.toLowerCase().includes(q) || h.detail.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, index]);

  const showDropdown = focused && query.trim().length >= 2;

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <svg
          className="absolute left-[var(--space-md)] top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search ministries, projects, people..."
          className="w-full pl-[var(--space-2xl)] pr-[var(--space-md)] py-[var(--space-sm)] sm:py-[var(--space-md)] text-[length:var(--text-body)] bg-surface border border-border-default rounded-sm placeholder:text-text-secondary/60 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/30 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-[var(--space-md)] top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 top-full mt-[var(--space-xs)] left-0 right-0 bg-page border border-border-default rounded-sm shadow-lg max-h-[360px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-[var(--space-lg)] py-[var(--space-lg)] text-text-secondary text-[length:var(--text-body)]">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((hit, i) => (
              <Link
                key={`${hit.type}-${hit.label}-${i}`}
                href={hit.href}
                className="flex items-start gap-[var(--space-md)] px-[var(--space-md)] sm:px-[var(--space-lg)] py-[var(--space-sm)] sm:py-[var(--space-md)] hover:bg-surface transition-colors border-b border-border-default last:border-b-0"
              >
                <span className={`mt-[2px] flex-shrink-0 text-[length:var(--text-caption)] font-medium px-[6px] py-[1px] rounded ${TYPE_COLORS[hit.type]}`}>
                  {TYPE_LABELS[hit.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[length:var(--text-body)] font-medium text-text-primary truncate">{hit.label}</p>
                  <p className="text-[length:var(--text-caption)] text-text-secondary truncate">{hit.detail}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MinistryCard({ data, mockDataEnabled }: { data: MinistryData; mockDataEnabled: boolean }) {
  const router = useRouter();
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
    <div
      className="group block cursor-pointer"
      onClick={() => router.push(`/ministry/${overview.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') router.push(`/ministry/${overview.id}`); }}
    >
      <div className="flex items-start gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
        <Link
          href={`/minister/${overview.id}`}
          className="flex-shrink-0 mt-1"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={overview.minister.avatarUrl}
            alt={overview.minister.name}
            width={56}
            height={56}
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-border-default object-cover hover:ring-2 hover:ring-gold/50 transition-shadow"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-xs)] sm:gap-[var(--space-base)]">
            <div className="min-w-0">
              <h2 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h2)] font-bold text-text-primary group-hover:text-gold-dark transition-colors leading-tight">
                {overview.shortName}
              </h2>
              <Link
                href={`/minister/${overview.id}`}
                className="text-[length:var(--text-caption)] text-text-secondary mt-[2px] truncate block hover:text-gold-dark transition-colors"
                onClick={e => e.stopPropagation()}
              >
                {overview.minister.name}
              </Link>
            </div>
            {mockDataEnabled && (
              <StatusBadge status={ministryStatus.status} tooltip={ministryStatus.tooltip} />
            )}
          </div>

          <div className="grid grid-cols-3 gap-[var(--space-sm)] sm:gap-[var(--space-md)] mt-[var(--space-sm)] sm:mt-[var(--space-md)]">
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Allocation</p>
              <p className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold mt-[1px]">{formatCurrency(overview.totalAllocation)}</p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Spent</p>
              <p className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold mt-[1px]">
                {mockDataEnabled ? formatCurrency(overview.totalSpent) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[length:var(--text-caption)] text-text-secondary">Utilization</p>
              <p className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold mt-[1px]">
                {mockDataEnabled ? formatPct(overallUtil) : '—'}
              </p>
            </div>
          </div>

          {mockDataEnabled && (
            <div className="mt-[var(--space-sm)] sm:mt-[var(--space-md)]">
              <ProgressBar
                value={overallUtil}
                color={utilStatus.status === 'on_track' ? 'green' : utilStatus.status === 'at_risk' ? 'gold' : 'red'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioMinisterCard({ officer, parentMinistry, parentSlug }: {
  officer: { name: string; title: string; avatarUrl: string };
  parentMinistry: string;
  parentSlug: string;
}) {
  const router = useRouter();
  return (
    <div
      className="group block cursor-pointer"
      onClick={() => router.push(`/ministry/${parentSlug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') router.push(`/ministry/${parentSlug}`); }}
    >
      <div className="flex items-start gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
        <Link
          href="/minister/audrey-marks"
          className="flex-shrink-0 mt-1"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={officer.avatarUrl}
            alt={officer.name}
            width={56}
            height={56}
            className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-border-default object-cover hover:ring-2 hover:ring-gold/50 transition-shadow"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[var(--space-xs)] sm:gap-[var(--space-base)]">
            <div className="min-w-0">
              <h2 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h2)] font-bold text-text-primary group-hover:text-gold-dark transition-colors leading-tight">
                {officer.title.replace(/^Minister w\/o Portfolio – /, '')}
              </h2>
              <Link
                href="/minister/audrey-marks"
                className="text-[length:var(--text-caption)] text-text-secondary mt-[2px] truncate block hover:text-gold-dark transition-colors"
                onClick={e => e.stopPropagation()}
              >
                {officer.name}
              </Link>
            </div>
            <span className="flex-shrink-0 text-[length:var(--text-micro)] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-gold/15 text-gold-dark w-fit">
              {parentMinistry}
            </span>
          </div>
          <p className="mt-[var(--space-sm)] sm:mt-[var(--space-md)] text-[length:var(--text-caption)] text-text-secondary leading-relaxed max-w-md">
            Minister without Portfolio — budget captured under {parentMinistry}.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── National Pulse Components ─── */

function trendArrow(trend: NationalMetric['trend'], inverted = false) {
  const isGood = inverted ? trend === 'declining' : trend === 'improving';
  const isBad = inverted ? trend === 'improving' : trend === 'declining';
  if (trend === 'stable') return <span className="text-text-secondary">—</span>;
  return (
    <span className={isGood ? 'text-green' : isBad ? 'text-status-off-track' : 'text-text-secondary'}>
      {trend === 'improving' ? '↑' : '↓'}
    </span>
  );
}

function formatMetricValue(metric: NationalMetric): string {
  if (metric.unit === 'percent') return `${metric.value}%`;
  if (metric.unit === 'index') return metric.value.toFixed(3);
  if (metric.unit === 'rate') return metric.value.toFixed(1);
  return String(metric.value);
}

function previousValueLabel(metric: NationalMetric): string | null {
  if (metric.history.length < 2) return null;
  const prev = metric.history[metric.history.length - 2];
  const val = metric.unit === 'percent' ? `${prev.value}%` : String(prev.value);
  return `${val} (${prev.period})`;
}

function isInvertedMetric(id: string): boolean {
  return ['unemployment_rate', 'poverty_rate'].includes(id);
}

function PulseTooltip({ metric }: { metric: NationalMetric }) {
  const prev = previousValueLabel(metric);
  return (
    <div className="text-[length:var(--text-caption)] leading-relaxed max-w-[260px]">
      <p className="font-semibold text-text-primary mb-1">{metric.label}</p>
      {metric.context && <p className="text-text-secondary mb-1.5">{metric.context}</p>}
      {prev && <p className="text-text-secondary">Prior: {prev}</p>}
      <div className="mt-2 pt-2 border-t border-border-default space-y-0.5">
        <p className="text-text-secondary">Source: {metric.source}</p>
        <p className="text-text-secondary">Period: {metric.period}</p>
        <p className="text-text-secondary">Published: {new Date(metric.asOf).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
    </div>
  );
}

function MelissaTooltip({ disaster }: { disaster: DisasterEvent }) {
  return (
    <div className="text-[length:var(--text-caption)] leading-relaxed max-w-[280px]">
      <p className="font-semibold text-text-primary mb-1">{disaster.name}</p>
      <p className="text-text-secondary mb-1.5">{disaster.description}</p>
      {disaster.comparison && (
        <p className="text-text-secondary mb-1.5">
          Comparison: {disaster.comparison.event} ({disaster.comparison.year}) cost J${(disaster.comparison.cost / 1e12).toFixed(2)}T
        </p>
      )}
      <div className="mt-2 pt-2 border-t border-border-default space-y-0.5">
        <p className="text-text-secondary">Source: {disaster.source}</p>
        <p className="text-text-secondary">Date: {new Date(disaster.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <p className="text-text-secondary">Published: {new Date(disaster.asOf).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
    </div>
  );
}

function PulseCard({ metric }: { metric: NationalMetric }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const inverted = isInvertedMetric(metric.id);
  const prev = metric.history.length >= 2 ? metric.history[metric.history.length - 2] : null;

  const trendColor =
    metric.trend === 'stable' ? 'text-text-secondary'
    : (inverted ? metric.trend === 'declining' : metric.trend === 'improving') ? 'text-green'
    : 'text-status-off-track';

  return (
    <div className="relative flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-[length:var(--text-caption)] text-text-secondary font-medium truncate">
          {metric.label}
        </p>
        <button
          className="relative flex-shrink-0 w-3.5 h-3.5 text-text-secondary/50 hover:text-text-secondary transition-colors cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label={`Info about ${metric.label}`}
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-page border border-border-default rounded-sm shadow-lg p-3 whitespace-normal">
              <PulseTooltip metric={metric} />
            </div>
          )}
        </button>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary leading-none tracking-tight">
          {formatMetricValue(metric)}
        </span>
        <span className={`text-[length:var(--text-caption)] font-semibold ${trendColor}`}>
          {trendArrow(metric.trend, inverted)}
        </span>
      </div>
      {prev && (
        <p className="text-[length:var(--text-micro)] text-text-secondary/70 truncate">
          {metric.unit === 'percent' ? `${prev.value}%` : prev.value} {prev.period}
        </p>
      )}
    </div>
  );
}

function DisasterCard({ disaster }: { disaster: DisasterEvent }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const damageT = (disaster.totalDamage / 1e12).toFixed(2);

  return (
    <Link href="/recovery" className="relative flex flex-col gap-1 min-w-0 group">
      <div className="flex items-center gap-1.5">
        <p className="text-[length:var(--text-caption)] text-status-off-track font-medium truncate">
          {disaster.name}
        </p>
        <button
          className="relative flex-shrink-0 w-3.5 h-3.5 text-status-off-track/50 hover:text-status-off-track transition-colors cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          onClick={e => e.preventDefault()}
          aria-label={`Info about ${disaster.name}`}
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-page border border-border-default rounded-sm shadow-lg p-3 whitespace-normal">
              <MelissaTooltip disaster={disaster} />
            </div>
          )}
        </button>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary leading-none tracking-tight group-hover:text-gold-dark transition-colors">
          J${damageT}T
        </span>
      </div>
      <p className="text-[length:var(--text-micro)] text-text-secondary/70 truncate">
        {disaster.gdpPctImpact}% of GDP · {disaster.category}
      </p>
    </Link>
  );
}

function UtilizationCard({ allData, mockDataEnabled }: { allData: MinistryData[]; mockDataEnabled: boolean }) {
  const totalAlloc = allData.reduce((s, d) => s + d.overview.totalAllocation, 0);
  const totalSpent = allData.reduce((s, d) => s + d.overview.totalSpent, 0);
  const utilPct = totalAlloc > 0 ? (totalSpent / totalAlloc) * 100 : 0;

  return (
    <div className="relative flex flex-col gap-1 min-w-0">
      <p className="text-[length:var(--text-caption)] text-text-secondary font-medium truncate">
        GOJ Utilization
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary leading-none tracking-tight">
          {mockDataEnabled ? formatPct(utilPct) : '—'}
        </span>
      </div>
      <p className="text-[length:var(--text-micro)] text-text-secondary/70 truncate">
        {mockDataEnabled
          ? `${formatCurrency(totalSpent)} of ${formatCurrency(totalAlloc)}`
          : 'Enable mock data to view'
        }
      </p>
    </div>
  );
}

function NationalPulseBand({ allData, mockDataEnabled }: { allData: MinistryData[]; mockDataEnabled: boolean }) {
  const { metrics, disasters } = nationalPulse;

  return (
    <section className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
      <div className="flex items-baseline justify-between mb-[var(--space-md)] sm:mb-[var(--space-lg)]">
        <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
          Jamaica at a Glance
        </h1>
        <p className="text-[length:var(--text-micro)] text-text-secondary hidden sm:block">
          As of {nationalPulse.lastUpdated}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[var(--space-lg)] sm:gap-[var(--space-xl)] py-[var(--space-lg)] sm:py-[var(--space-xl)] px-[var(--space-base)] sm:px-[var(--space-lg)] bg-surface border border-border-default rounded-sm">
        {metrics.map(metric => (
          <PulseCard key={metric.id} metric={metric} />
        ))}
        {disasters.map(disaster => (
          <DisasterCard key={disaster.id} disaster={disaster} />
        ))}
        <UtilizationCard allData={allData} mockDataEnabled={mockDataEnabled} />
      </div>
    </section>
  );
}

export default function CabinetOverview() {
  const { mockDataEnabled } = useMockData();

  const ministries = useMemo(() =>
    ministryOrder.map(slug => {
      const raw = ministryRegistry[slug];
      return mockDataEnabled ? raw : stripActuals(raw);
    }),
    [mockDataEnabled]
  );

  return (
    <>
      <DashboardShell freshness={<DataFreshness inline />}>
        <div className="animate-fade-up">
          <NationalPulseBand allData={ministries} mockDataEnabled={mockDataEnabled} />

          <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)] border-t border-border-default pt-[var(--space-lg)] sm:pt-[var(--space-xl)]">
            <h2 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary tracking-tight">
              All Ministries
            </h2>
            <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
              Budget execution overview · Fiscal Year 2026-27 · {ministries.length} ministries
              {mockDataEnabled && ' · Reporting period: September 2026'}
            </p>
          </header>

          <div className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <SearchBar allData={ministries} />
          </div>

          {!mockDataEnabled && (
            <div className="mb-[var(--space-lg)] sm:mb-[var(--space-2xl)] py-[var(--space-base)] px-[var(--space-base)] sm:px-[var(--space-lg)] border border-gold/30 bg-gold-light/30 rounded-sm max-w-3xl">
              <p className="text-[length:var(--text-body)] text-gold-dark font-medium">
                Mock expenditure data is off.
              </p>
              <p className="text-[length:var(--text-caption)] text-text-secondary mt-[2px]">
                Allocation and prior-year estimates are still visible. Toggle mock data on to see simulated 6-month spend progression.
              </p>
            </div>
          )}

          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-xl)] sm:gap-[var(--space-2xl)]">
              {ministries.map((data, i) => (
                <div
                  key={data.overview.id}
                  className="animate-fade-up border-t border-border-default pt-[var(--space-lg)]"
                  style={{ animationDelay: `${(i + 1) * 40}ms` }}
                >
                  <MinistryCard data={data} mockDataEnabled={mockDataEnabled} />
                </div>
              ))}
              <div
                className="animate-fade-up border-t border-border-default pt-[var(--space-lg)]"
                style={{ animationDelay: `${(ministries.length + 1) * 40}ms` }}
              >
                <PortfolioMinisterCard
                  officer={opmLeadership[1]}
                  parentMinistry="OPM"
                  parentSlug="opm"
                />
              </div>
            </div>
          </section>
        </div>
      </DashboardShell>
    </>
  );
}
