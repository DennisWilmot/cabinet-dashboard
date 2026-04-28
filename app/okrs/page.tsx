'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ministryRegistry, ministryOrder } from '@/lib/data';
import { opmLeadership } from '@/lib/data/people/opm';

const MARKS_OKRS = [
  {
    objective: 'Accelerate Digital Transformation of Public Services',
    keyResults: [
      { name: 'Public services digitised end-to-end', unit: 'count', target: 50, actual: 18, type: 'output' as const },
      { name: 'National Digital ID cards issued', unit: 'K', target: 500, actual: 127, type: 'outcome' as const },
      { name: 'Average transaction time for govt services', unit: 'min', target: 5, actual: 14, type: 'outcome' as const },
    ],
  },
  {
    objective: 'Improve Government Operational Efficiency',
    keyResults: [
      { name: 'Ministries with automated procurement workflows', unit: 'count', target: 17, actual: 5, type: 'output' as const },
      { name: 'Public service customer satisfaction score', unit: '%', target: 75, actual: 62, type: 'outcome' as const },
    ],
  },
  {
    objective: 'Establish Data-Driven Cabinet Accountability',
    keyResults: [
      { name: 'Ministries reporting real-time budget data', unit: 'count', target: 17, actual: 3, type: 'output' as const },
      { name: 'Action item completion rate across cabinet', unit: '%', target: 90, actual: 58, type: 'outcome' as const },
    ],
  },
];

type StatusType = 'on_track' | 'at_risk' | 'off_track';

function deriveKpiStatus(actual: number, target: number): StatusType {
  if (target === 0) return 'on_track';
  const ratio = actual / target;
  if (ratio >= 0.7) return 'on_track';
  if (ratio >= 0.4) return 'at_risk';
  return 'off_track';
}

function progressColor(status: StatusType): string {
  if (status === 'on_track') return 'bg-jm-green';
  if (status === 'at_risk') return 'bg-gold';
  return 'bg-status-off-track';
}

function statusLabel(status: StatusType): { text: string; bg: string; fg: string } {
  if (status === 'on_track') return { text: 'On Track', bg: 'bg-jm-green/15', fg: 'text-jm-green-dark' };
  if (status === 'at_risk') return { text: 'At Risk', bg: 'bg-gold/15', fg: 'text-gold-dark' };
  return { text: 'Off Track', bg: 'bg-status-off-track/15', fg: 'text-status-off-track' };
}

interface MinisterOKR {
  slug: string;
  ministerName: string;
  ministryName: string;
  avatarUrl: string;
  isPortfolio: boolean;
  objectives: Array<{
    name: string;
    keyResults: Array<{ name: string; unit: string; target: number; actual: number; type: 'output' | 'outcome' }>;
  }>;
  overallProgress: number;
  overallStatus: StatusType;
}

function buildAllOKRs(): MinisterOKR[] {
  const result: MinisterOKR[] = [];

  const marksMinister = opmLeadership.find(o => o.name.includes('Audrey') && o.name.includes('Marks'));
  if (marksMinister) {
    const allKRs = MARKS_OKRS.flatMap(o => o.keyResults);
    const avgProgress = allKRs.reduce((sum, kr) => sum + (kr.target > 0 ? Math.min(kr.actual / kr.target, 1) : 0), 0) / allKRs.length;
    const onTrack = allKRs.filter(kr => deriveKpiStatus(kr.actual, kr.target) === 'on_track').length;
    const overallStatus: StatusType = avgProgress >= 0.7 ? 'on_track' : avgProgress >= 0.4 ? 'at_risk' : 'off_track';
    result.push({
      slug: 'audrey-marks',
      ministerName: marksMinister.name,
      ministryName: 'Digital Transformation (OPM)',
      avatarUrl: marksMinister.avatarUrl,
      isPortfolio: true,
      objectives: MARKS_OKRS.map(o => ({ name: o.objective, keyResults: o.keyResults })),
      overallProgress: Math.round(avgProgress * 100),
      overallStatus,
    });
  }

  for (const slug of ministryOrder) {
    const m = ministryRegistry[slug];
    const entities = m.operational.entities;
    const objectives: MinisterOKR['objectives'] = [];

    for (const entity of entities) {
      if (entity.kpis.length === 0) continue;
      objectives.push({
        name: entity.name,
        keyResults: entity.kpis.map(k => ({
          name: k.name,
          unit: k.unit,
          target: k.target,
          actual: k.actual,
          type: k.type,
        })),
      });
    }

    if (objectives.length === 0) continue;

    const allKRs = objectives.flatMap(o => o.keyResults);
    const onTrack = allKRs.filter(kr => deriveKpiStatus(kr.actual, kr.target) === 'on_track').length;
    const avgProgress = allKRs.reduce((sum, kr) => sum + (kr.target > 0 ? Math.min(kr.actual / kr.target, 1) : 0), 0) / allKRs.length;
    const overallStatus: StatusType = avgProgress >= 0.7 ? 'on_track' : avgProgress >= 0.4 ? 'at_risk' : 'off_track';

    result.push({
      slug,
      ministerName: m.overview.minister.name,
      ministryName: m.overview.shortName,
      avatarUrl: m.overview.minister.avatarUrl,
      isPortfolio: false,
      objectives,
      overallProgress: Math.round(avgProgress * 100),
      overallStatus,
    });
  }

  return result;
}

type FilterStatus = 'all' | StatusType;

export default function OKRsPage() {
  const allOKRs = useMemo(buildAllOKRs, []);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = allOKRs;
    if (statusFilter !== 'all') list = list.filter(m => m.overallStatus === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(m =>
        m.ministerName.toLowerCase().includes(q) ||
        m.ministryName.toLowerCase().includes(q) ||
        m.objectives.some(o =>
          o.name.toLowerCase().includes(q) ||
          o.keyResults.some(kr => kr.name.toLowerCase().includes(q))
        )
      );
    }
    return list;
  }, [allOKRs, statusFilter, search]);

  const stats = useMemo(() => {
    const onTrack = allOKRs.filter(m => m.overallStatus === 'on_track').length;
    const atRisk = allOKRs.filter(m => m.overallStatus === 'at_risk').length;
    const offTrack = allOKRs.filter(m => m.overallStatus === 'off_track').length;
    const totalKRs = allOKRs.reduce((s, m) => s + m.objectives.reduce((ss, o) => ss + o.keyResults.length, 0), 0);
    const avgProgress = allOKRs.length > 0 ? Math.round(allOKRs.reduce((s, m) => s + m.overallProgress, 0) / allOKRs.length) : 0;
    return { onTrack, atRisk, offTrack, total: allOKRs.length, totalKRs, avgProgress };
  }, [allOKRs]);

  return (
    <>
      <DashboardShell breadcrumbs={[{ label: 'OKRs' }]}>
        <div className="animate-fade-up">
          <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
              Objectives & Key Results
            </h1>
            <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
              Minister-level OKRs derived from entity KPIs across all ministries
            </p>
          </header>

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-[var(--space-md)] sm:gap-[var(--space-lg)] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <SummaryCard label="Average Progress" value={`${stats.avgProgress}%`} sub={`${stats.totalKRs} key results tracked`} />
            <SummaryCard label="On Track" value={String(stats.onTrack)} color="green" onClick={() => setStatusFilter(statusFilter === 'on_track' ? 'all' : 'on_track')} active={statusFilter === 'on_track'} />
            <SummaryCard label="At Risk" value={String(stats.atRisk)} color="gold" onClick={() => setStatusFilter(statusFilter === 'at_risk' ? 'all' : 'at_risk')} active={statusFilter === 'at_risk'} />
            <SummaryCard label="Off Track" value={String(stats.offTrack)} color="red" onClick={() => setStatusFilter(statusFilter === 'off_track' ? 'all' : 'off_track')} active={statusFilter === 'off_track'} />
            <SummaryCard label="Total OKRs" value={String(stats.totalKRs)} sub={`across ${stats.total} ministers`} />
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-[var(--space-md)] sm:items-center mb-[var(--space-lg)] sm:mb-[var(--space-xl)]">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ministers, objectives, key results..."
                aria-label="Search OKRs"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border-default bg-surface text-[length:var(--text-caption)] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-border-default/50 transition-colors cursor-pointer">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <div className="flex gap-1 p-1 bg-surface border border-border-default rounded-lg w-fit">
              {(['all', 'on_track', 'at_risk', 'off_track'] as FilterStatus[]).map(fs => (
                <button key={fs} onClick={() => setStatusFilter(fs)}
                  className={`px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === fs ? 'bg-sidebar text-text-on-dark' : 'text-text-secondary hover:text-text-primary'
                  }`}>
                  {fs === 'all' ? 'All' : statusLabel(fs as StatusType).text}
                </button>
              ))}
            </div>
          </div>

          {/* Minister OKR cards */}
          <div className="space-y-4">
            {filtered.map((minister, i) => {
              const isExpanded = expandedSlug === minister.slug;
              const s = statusLabel(minister.overallStatus);

              return (
                <div key={minister.slug} className="border border-border-default rounded-lg overflow-hidden animate-fade-up bg-surface" style={{ animationDelay: `${i * 30}ms` }}>
                  {/* Minister header row */}
                  <button
                    onClick={() => setExpandedSlug(isExpanded ? null : minister.slug)}
                    aria-expanded={isExpanded}
                    className="w-full text-left px-[var(--space-md)] sm:px-[var(--space-lg)] py-[var(--space-md)] flex items-center gap-[var(--space-md)] hover:bg-page/50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-inset focus-visible:outline-none"
                  >
                    <Link href={`/minister/${minister.slug}`} onClick={e => e.stopPropagation()} className="flex-shrink-0">
                      <img
                        src={minister.avatarUrl}
                        alt={minister.ministerName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-[var(--space-sm)] flex-wrap">
                        <Link href={`/minister/${minister.slug}`} onClick={e => e.stopPropagation()} className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold text-text-primary hover:text-gold-dark transition-colors truncate">
                          {minister.ministerName}
                        </Link>
                        {minister.isPortfolio && (
                          <span className="px-2 py-0.5 text-[length:var(--text-micro)] font-semibold uppercase tracking-wide rounded bg-gold/15 text-gold-dark">OPM</span>
                        )}
                      </div>
                      <p className="text-[length:var(--text-caption)] text-text-secondary truncate">{minister.ministryName}</p>
                    </div>
                    <div className="flex items-center gap-[var(--space-md)] flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-[var(--space-sm)] w-32">
                        <div className="flex-1 h-2 rounded-full bg-border-default/50 overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${progressColor(minister.overallStatus)}`} style={{ width: `${minister.overallProgress}%` }} />
                        </div>
                        <span className="text-[length:var(--text-caption)] font-semibold text-text-secondary w-10 text-right">{minister.overallProgress}%</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[length:var(--text-caption)] font-semibold ${s.bg} ${s.fg}`}>
                        {s.text}
                      </span>
                      <svg className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded: objectives + key results */}
                  {isExpanded && (
                    <div className="border-t border-border-default">
                      {minister.objectives.map((obj, oi) => (
                        <div key={oi} className={oi > 0 ? 'border-t border-border-default' : ''}>
                          <div className="px-[var(--space-md)] sm:px-[var(--space-lg)] pt-[var(--space-md)] pb-[var(--space-xs)]">
                            <h4 className="text-[length:var(--text-body)] font-bold text-text-primary tracking-tight">{obj.name}</h4>
                          </div>
                          <div className="divide-y divide-border-default/50">
                            {obj.keyResults.map((kr) => {
                              const pct = kr.target > 0 ? Math.min((kr.actual / kr.target) * 100, 100) : 0;
                              const status = deriveKpiStatus(kr.actual, kr.target);
                              return (
                                <div key={kr.name} className="px-[var(--space-md)] sm:px-[var(--space-lg)] py-[var(--space-sm)] sm:py-[var(--space-md)] flex flex-col sm:flex-row sm:items-center gap-[var(--space-xs)] sm:gap-[var(--space-lg)]">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-[var(--space-sm)]">
                                      <p className="text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-primary truncate">{kr.name}</p>
                                      <span className="flex-shrink-0 text-[length:var(--text-micro)] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-border-default/50 text-text-secondary">
                                        {kr.type}
                                      </span>
                                    </div>
                                    <p className="text-[length:var(--text-micro)] sm:text-[length:var(--text-caption)] text-text-secondary mt-0.5">
                                      <span className="font-semibold text-text-primary">{kr.actual}{kr.unit === '%' ? '%' : kr.unit === 'count' ? '' : kr.unit}</span>
                                      {' / '}
                                      {kr.target}{kr.unit === '%' ? '%' : kr.unit === 'count' ? '' : kr.unit} target
                                    </p>
                                  </div>
                                  <div className="w-full sm:w-48 flex items-center gap-[var(--space-sm)]">
                                    <div className="flex-1 h-2 rounded-full bg-border-default/50 overflow-hidden">
                                      <div className={`h-full rounded-full transition-all ${progressColor(status)}`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-[length:var(--text-caption)] font-semibold text-text-secondary w-10 text-right">{Math.round(pct)}%</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center border border-border-default rounded-lg bg-surface">
              <p className="text-text-secondary text-[length:var(--text-body)]">No ministers match this filter.</p>
            </div>
          )}
        </div>
      </DashboardShell>
    </>
  );
}

function SummaryCard({ label, value, sub, color, onClick, active }: {
  label: string; value: string; sub?: string; color?: 'green' | 'gold' | 'red'; onClick?: () => void; active?: boolean;
}) {
  const colors = {
    green: { bg: 'bg-jm-green/5', border: 'border-jm-green/30', dot: 'bg-jm-green' },
    gold: { bg: 'bg-gold/5', border: 'border-gold/30', dot: 'bg-gold' },
    red: { bg: 'bg-status-off-track/5', border: 'border-status-off-track/30', dot: 'bg-status-off-track' },
  };
  const c = color ? colors[color] : { bg: 'bg-surface', border: 'border-border-default', dot: '' };
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={`p-[var(--space-md)] sm:p-[var(--space-lg)] rounded-lg border transition-all text-left ${
        active ? `${c.bg} ${c.border} ring-2 ring-offset-1` : `${c.bg} ${c.border} ${onClick ? 'hover:shadow-sm cursor-pointer' : ''}`
      }`}
    >
      <div className="flex items-center gap-[var(--space-xs)] mb-[var(--space-sm)]">
        {c.dot && <span className={`w-2 h-2 rounded-full ${c.dot}`} />}
        <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">{label}</p>
      </div>
      <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-display)] font-bold text-text-primary">{value}</p>
      {sub && <p className="text-[length:var(--text-micro)] text-text-secondary mt-[var(--space-xs)]">{sub}</p>}
    </Tag>
  );
}
