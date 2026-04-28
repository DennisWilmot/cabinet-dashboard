'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SectionNav } from '@/components/layout/SectionNav';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ministryRegistry, ministryOrder } from '@/lib/data';
import { opmLeadership } from '@/lib/data/people/opm';
import { getActionItemsByMinistry, getMinisterAttendanceRate, mockMeetings } from '@/lib/meetings/data';
import { formatCurrency, formatPct, EXPECTED_UTILIZATION } from '@/lib/utils';
import { deriveUtilizationStatus, deriveMinistryStatus } from '@/lib/status';
import type { MinistryData, SeniorOfficer, KPI } from '@/lib/types';
import type { ActionItem } from '@/lib/meetings/types';

interface MinisterContext {
  slug: string;
  minister: SeniorOfficer;
  ministry: MinistryData | null;
  isPortfolio: boolean;
}

function resolveMinister(slug: string): MinisterContext | null {
  if (slug === 'audrey-marks') {
    const marks = opmLeadership[1];
    return { slug, minister: marks, ministry: ministryRegistry['opm'] ?? null, isPortfolio: true };
  }
  const ministry = ministryRegistry[slug];
  if (!ministry) return null;
  const minister = ministry.leadership.find(l => l.role === 'minister') ?? ministry.leadership[0];
  return { slug, minister, ministry, isPortfolio: false };
}

const MARKS_OKRS = [
  {
    objective: 'Accelerate Digital Transformation of Public Services',
    keyResults: [
      { name: 'Public services digitised end-to-end', unit: 'count', target: 50, actual: 18, type: 'output' as const },
      { name: 'National Digital ID cards issued', unit: 'K', target: 500, actual: 127, type: 'outcome' as const },
      { name: 'Average government service processing time reduction', unit: '%', target: 30, actual: 14, type: 'outcome' as const },
    ],
  },
  {
    objective: 'Improve Government Operational Efficiency',
    keyResults: [
      { name: 'Ministries with automated procurement workflows', unit: 'count', target: 17, actual: 5, type: 'output' as const },
      { name: 'Public service customer satisfaction score', unit: '%', target: 75, actual: 62, type: 'outcome' as const },
    ],
  },
];

const SECTION_NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'okrs', label: 'OKRs' },
  { id: 'actions', label: 'Action Items' },
  { id: 'team', label: 'Team' },
];

const ACTION_STATUS_STYLES: Record<ActionItem['status'], { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-jm-green/15', text: 'text-jm-green-dark', label: 'Completed' },
  in_progress: { bg: 'bg-gold/15', text: 'text-gold-dark', label: 'In Progress' },
  pending: { bg: 'bg-border-default/50', text: 'text-text-secondary', label: 'Pending' },
};

function deriveKpiStatus(actual: number, target: number): 'on_track' | 'at_risk' | 'off_track' {
  if (target === 0) return 'on_track';
  const ratio = actual / target;
  if (ratio >= 0.7) return 'on_track';
  if (ratio >= 0.4) return 'at_risk';
  return 'off_track';
}

function progressColor(status: 'on_track' | 'at_risk' | 'off_track'): 'green' | 'gold' | 'red' {
  if (status === 'on_track') return 'green';
  if (status === 'at_risk') return 'gold';
  return 'red';
}

export default function MinisterProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const ctx = useMemo(() => resolveMinister(slug), [slug]);

  if (!ctx) {
    return (
      <>
        <DashboardShell breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Not Found' }]}>
          <div className="py-20 text-center">
            <h1 className="text-[length:var(--text-h1)] font-bold text-text-primary">Minister not found</h1>
            <Link href="/dashboard" className="mt-4 inline-block text-gold hover:text-gold-dark transition-colors">
              Back to dashboard
            </Link>
          </div>
        </DashboardShell>
      </>
    );
  }

  const { minister, ministry, isPortfolio } = ctx;
  const profile = minister.profile;
  const ministrySlug = isPortfolio ? 'opm' : slug;

  const actionItems = getActionItemsByMinistry(ministrySlug);
  const attendance = getMinisterAttendanceRate(ministrySlug);

  const completedActions = actionItems.filter(a => a.status === 'completed').length;
  const totalActions = actionItems.length;
  const actionCompletionPct = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  const allKpis: { entity: string; kpis: KPI[] }[] = [];
  let atRiskCount = 0;

  if (ministry && !isPortfolio) {
    for (const entity of ministry.operational.entities) {
      if (entity.kpis.length > 0) {
        allKpis.push({ entity: entity.name, kpis: entity.kpis });
      }
    }
    const fixedUtil = ministry.fixedObligations.totalAllocation > 0
      ? (ministry.fixedObligations.totalPaid / ministry.fixedObligations.totalAllocation) * 100 : 0;
    const opsUtil = ministry.operational.utilizationPct;
    const capUtil = ministry.capital.totalAllocation > 0
      ? (ministry.capital.totalSpent / ministry.capital.totalAllocation) * 100 : 0;

    const statuses = [
      deriveUtilizationStatus(fixedUtil, EXPECTED_UTILIZATION).status,
      deriveUtilizationStatus(opsUtil, EXPECTED_UTILIZATION).status,
      deriveUtilizationStatus(capUtil, EXPECTED_UTILIZATION).status,
    ];
    atRiskCount = statuses.filter(s => s === 'at_risk' || s === 'off_track').length;

    for (const project of ministry.capital.projects) {
      if (project.status === 'at_risk' || project.status === 'delayed') atRiskCount++;
    }
  }

  const okrKpis = allKpis.flatMap(g => g.kpis.filter(k => k.type === 'outcome'));
  const onTrackOkrs = okrKpis.filter(k => deriveKpiStatus(k.actual, k.target) === 'on_track').length;
  const okrProgressPct = okrKpis.length > 0 ? Math.round((onTrackOkrs / okrKpis.length) * 100) : 0;

  const overallUtil = ministry && ministry.overview.totalAllocation > 0
    ? (ministry.overview.totalSpent / ministry.overview.totalAllocation) * 100 : 0;

  const leadershipTeam = ministry
    ? ministry.leadership.filter(l => l.role !== 'minister')
    : [];

  return (
    <>
      <DashboardShell breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: minister.name }]} sectionNav={<SectionNav items={SECTION_NAV_ITEMS} />}>
        <div className="animate-fade-up">

          {/* ── Section 1: Hero / Bio ── */}
          <section id="overview" className="scroll-mt-28 mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
            <div className="flex flex-col sm:flex-row gap-[var(--space-lg)] sm:gap-[var(--space-2xl)]">
              <Image
                src={minister.avatarUrl}
                alt={minister.name}
                width={160}
                height={160}
                className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl object-cover flex-shrink-0 border-2 border-border-default"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight leading-tight">
                  {minister.name}
                </h1>
                <p className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] text-text-secondary mt-[var(--space-xs)]">
                  {minister.title}
                </p>

                {profile && (
                  <p className="text-[length:var(--text-body)] text-text-secondary mt-[var(--space-md)] leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-[var(--space-xl)] gap-y-[var(--space-sm)] mt-[var(--space-lg)] text-[length:var(--text-caption)] text-text-secondary">
                  {profile?.constituency && (
                    <div className="flex items-center gap-[var(--space-xs)]">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {profile.constituency}
                    </div>
                  )}
                  {profile?.officeLocation && (
                    <div className="flex items-center gap-[var(--space-xs)]">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                      {profile.officeLocation}
                    </div>
                  )}
                </div>

                {ministry && (
                  <Link
                    href={`/ministry/${isPortfolio ? 'opm' : slug}`}
                    className="inline-flex items-center gap-[var(--space-sm)] mt-[var(--space-lg)] px-[var(--space-md)] py-[var(--space-sm)] rounded-lg bg-surface border border-border-default hover:border-border-strong transition-colors group"
                  >
                    <span className="text-[length:var(--text-caption)] font-medium text-text-primary">
                      {ministry.overview.shortName}
                    </span>
                    <span className="text-[length:var(--text-caption)] text-text-secondary">
                      · {formatCurrency(ministry.overview.totalAllocation)} allocated · {formatPct(overallUtil)} utilized
                    </span>
                    <svg className="w-3.5 h-3.5 text-text-secondary group-hover:text-gold-dark transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* ── Section 2: Accountability Metrics ── */}
          <section id="metrics" className="scroll-mt-28 mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
            <h2 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary mb-[var(--space-lg)]">
              Accountability Metrics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
              <MetricTile
                label="Action Completion"
                value={`${actionCompletionPct}%`}
                detail={`${completedActions} of ${totalActions} completed`}
                status={actionCompletionPct >= 60 ? 'on_track' : actionCompletionPct >= 30 ? 'at_risk' : 'off_track'}
              />
              <MetricTile
                label="Cabinet Attendance"
                value={`${attendance.pct}%`}
                detail={`${attendance.attended} of ${attendance.total} meetings`}
                status={attendance.pct >= 80 ? 'on_track' : attendance.pct >= 60 ? 'at_risk' : 'off_track'}
              />
              <MetricTile
                label="OKR Progress"
                value={isPortfolio ? '—' : `${okrProgressPct}%`}
                detail={isPortfolio ? 'See OKRs below' : `${onTrackOkrs} of ${okrKpis.length} on track`}
                status={isPortfolio ? 'on_track' : okrProgressPct >= 60 ? 'on_track' : okrProgressPct >= 30 ? 'at_risk' : 'off_track'}
              />
              <MetricTile
                label="At-Risk Flags"
                value={`${atRiskCount}`}
                detail={atRiskCount === 0 ? 'All clear' : `${atRiskCount} area${atRiskCount > 1 ? 's' : ''} need attention`}
                status={atRiskCount === 0 ? 'on_track' : atRiskCount <= 1 ? 'at_risk' : 'off_track'}
              />
            </div>
          </section>

          {/* ── Section 3: OKRs ── */}
          <section id="okrs" className="scroll-mt-28 mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
            <h2 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary mb-[var(--space-lg)]">
              Objectives & Key Results
            </h2>

            {isPortfolio ? (
              <div className="space-y-[var(--space-xl)]">
                {MARKS_OKRS.map((obj, oi) => (
                  <OKRGroup key={oi} objective={obj.objective} keyResults={obj.keyResults} index={oi} />
                ))}
              </div>
            ) : allKpis.length > 0 ? (
              <div className="space-y-[var(--space-xl)]">
                {allKpis.map((group, gi) => (
                  <OKRGroup
                    key={gi}
                    objective={group.entity}
                    keyResults={group.kpis.map(k => ({
                      name: k.name,
                      unit: k.unit,
                      target: k.target,
                      actual: k.actual,
                      type: k.type,
                    }))}
                    index={gi}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-border-default rounded-lg bg-surface">
                <p className="text-text-secondary text-[length:var(--text-body)]">No KPIs configured for this ministry yet.</p>
              </div>
            )}
          </section>

          {/* ── Section 4: Action Items ── */}
          <section id="actions" className="scroll-mt-28 mb-[var(--space-2xl)] sm:mb-[var(--space-3xl)]">
            <h2 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary mb-[var(--space-lg)]">
              Cabinet Action Items
            </h2>

            {actionItems.length > 0 ? (
              <div className="space-y-3">
                {actionItems.map((item, i) => {
                  const s = ACTION_STATUS_STYLES[item.status];
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-start gap-[var(--space-sm)] sm:gap-[var(--space-lg)] p-[var(--space-base)] sm:p-[var(--space-lg)] bg-surface border border-border-default rounded-sm animate-fade-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[length:var(--text-body)] text-text-primary leading-relaxed">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[length:var(--text-caption)] text-text-secondary">
                          <Link
                            href={`/meetings/${item.meetingId}`}
                            className="hover:text-gold-dark transition-colors font-medium"
                          >
                            {new Date(item.meetingDate + 'T12:00:00').toLocaleDateString('en-JM', { month: 'short', day: 'numeric' })} Meeting
                          </Link>
                          <span>Due {new Date(item.dueDate + 'T12:00:00').toLocaleDateString('en-JM', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded text-[length:var(--text-caption)] font-semibold ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center border border-border-default rounded-lg bg-surface">
                <p className="text-text-secondary text-[length:var(--text-body)]">No action items assigned from recent cabinet meetings.</p>
              </div>
            )}
          </section>

          {/* ── Section 5: Leadership Team ── */}
          <section id="team" className="scroll-mt-28">
            <h2 className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary mb-[var(--space-lg)]">
              Leadership Team
            </h2>

            {leadershipTeam.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-md)] sm:gap-[var(--space-lg)]">
                {leadershipTeam.map((person, i) => (
                  <div
                    key={person.name}
                    className="flex items-center gap-[var(--space-md)] p-[var(--space-md)] sm:p-[var(--space-lg)] bg-surface border border-border-default rounded-sm animate-fade-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Image
                      src={person.avatarUrl}
                      alt={person.name}
                      width={48}
                      height={48}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[length:var(--text-body)] font-medium text-text-primary truncate">{person.name}</p>
                      <p className="text-[length:var(--text-caption)] text-text-secondary truncate">{person.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-border-default rounded-lg bg-surface">
                <p className="text-text-secondary text-[length:var(--text-body)]">No direct reports in current organizational structure.</p>
              </div>
            )}
          </section>
        </div>
      </DashboardShell>
    </>
  );
}

function MetricTile({ label, value, detail, status }: {
  label: string;
  value: string;
  detail: string;
  status: 'on_track' | 'at_risk' | 'off_track';
}) {
  const colors = {
    on_track: 'border-jm-green/30 bg-jm-green/5',
    at_risk: 'border-gold/30 bg-gold/5',
    off_track: 'border-status-off-track/30 bg-status-off-track/5',
  };
  const dotColors = {
    on_track: 'bg-jm-green',
    at_risk: 'bg-gold',
    off_track: 'bg-status-off-track',
  };

  return (
    <div className={`p-[var(--space-md)] sm:p-[var(--space-lg)] rounded-lg border ${colors[status]} transition-colors`}>
      <div className="flex items-center gap-[var(--space-xs)] mb-[var(--space-sm)]">
        <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
        <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">{label}</p>
      </div>
      <p className="text-[length:var(--text-h2)] sm:text-[length:var(--text-h1)] font-bold text-text-primary">{value}</p>
      <p className="text-[length:var(--text-caption)] text-text-secondary mt-[var(--space-xs)]">{detail}</p>
    </div>
  );
}

function OKRGroup({ objective, keyResults, index }: {
  objective: string;
  keyResults: { name: string; unit: string; target: number; actual: number; type: 'output' | 'outcome' }[];
  index: number;
}) {
  return (
    <div
      className="border border-border-default rounded-lg overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="px-[var(--space-md)] sm:px-[var(--space-lg)] py-[var(--space-md)] bg-surface border-b border-border-default">
        <h3 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold text-text-primary">
          {objective}
        </h3>
      </div>
      <div className="divide-y divide-border-default">
        {keyResults.map((kr) => {
          const pct = kr.target > 0 ? Math.min((kr.actual / kr.target) * 100, 100) : 0;
          const status = deriveKpiStatus(kr.actual, kr.target);
          return (
            <div key={kr.name} className="px-[var(--space-md)] sm:px-[var(--space-lg)] py-[var(--space-md)] flex flex-col sm:flex-row sm:items-center gap-[var(--space-sm)] sm:gap-[var(--space-lg)]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[var(--space-sm)]">
                  <p className="text-[length:var(--text-body)] text-text-primary truncate">{kr.name}</p>
                  <span className="flex-shrink-0 text-[length:var(--text-micro)] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-border-default/50 text-text-secondary">
                    {kr.type}
                  </span>
                </div>
                <div className="flex items-center gap-[var(--space-sm)] mt-[var(--space-xs)]">
                  <span className="text-[length:var(--text-caption)] font-semibold text-text-primary">
                    {kr.actual}{kr.unit !== 'count' && kr.unit !== '%' ? kr.unit : ''}{kr.unit === '%' ? '%' : ''}
                  </span>
                  <span className="text-[length:var(--text-caption)] text-text-secondary">
                    / {kr.target}{kr.unit !== 'count' && kr.unit !== '%' ? kr.unit : ''}{kr.unit === '%' ? '%' : ''} target
                  </span>
                </div>
              </div>
              <div className="w-full sm:w-48 flex items-center gap-[var(--space-sm)]">
                <div className="flex-1">
                  <ProgressBar value={pct} color={progressColor(status)} />
                </div>
                <span className="text-[length:var(--text-caption)] font-semibold text-text-secondary w-10 text-right">
                  {Math.round(pct)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
