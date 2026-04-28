'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { mockBlockers } from '@/lib/blockers/data';
import type { Blocker, BlockerStatus, EscalationLevel, ActivityEntry } from '@/lib/blockers/types';

type FilterStatus = 'all' | BlockerStatus;
type FilterLevel = 'all' | EscalationLevel;

const STATUS_CONFIG: Record<BlockerStatus, { bg: string; text: string; label: string; dot: string }> = {
  open: { bg: 'bg-status-off-track/15', text: 'text-status-off-track', label: 'Open', dot: 'bg-status-off-track' },
  in_progress: { bg: 'bg-gold/15', text: 'text-gold-dark', label: 'In Progress', dot: 'bg-gold' },
  resolved: { bg: 'bg-jm-green/15', text: 'text-jm-green-dark', label: 'Resolved', dot: 'bg-jm-green' },
};

const LEVEL_CONFIG: Record<EscalationLevel, { bg: string; text: string; label: string }> = {
  pm: { bg: 'bg-status-off-track/10', text: 'text-status-off-track', label: 'PM-Level' },
  minister: { bg: 'bg-gold/10', text: 'text-gold-dark', label: 'Minister-Level' },
};

function daysSince(dateStr: string): number {
  const created = new Date(dateStr + 'T00:00:00');
  return Math.floor((new Date().getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-JM', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-JM', { hour: '2-digit', minute: '2-digit' });
}

export default function BlockersPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [levelFilter, setLevelFilter] = useState<FilterLevel>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [blockerOverrides, setBlockerOverrides] = useState<Record<string, { status: BlockerStatus; activity: ActivityEntry[] }>>({});
  const [draft, setDraft] = useState('');

  const allBlockers = useMemo(() => {
    return mockBlockers.map(b => {
      const override = blockerOverrides[b.id];
      if (!override) return b;
      return { ...b, status: override.status, activity: override.activity };
    });
  }, [blockerOverrides]);

  const sorted = useMemo(() => {
    return [...allBlockers].sort((a, b) => {
      const aOpen = a.status !== 'resolved' ? 0 : 1;
      const bOpen = b.status !== 'resolved' ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return a.createdDate.localeCompare(b.createdDate);
    });
  }, [allBlockers]);

  const filtered = useMemo(() => {
    return sorted.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (levelFilter !== 'all' && b.escalationLevel !== levelFilter) return false;
      return true;
    });
  }, [sorted, statusFilter, levelFilter]);

  const stats = useMemo(() => {
    const open = allBlockers.filter(b => b.status !== 'resolved').length;
    const pm = allBlockers.filter(b => b.escalationLevel === 'pm' && b.status !== 'resolved').length;
    const minister = allBlockers.filter(b => b.escalationLevel === 'minister' && b.status !== 'resolved').length;
    const resolved = allBlockers.filter(b => b.status === 'resolved').length;
    return { open, pm, minister, resolved, total: allBlockers.length };
  }, [allBlockers]);

  const selected = useMemo(() => selectedId ? allBlockers.find(b => b.id === selectedId) : null, [selectedId, allBlockers]);
  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (levelFilter !== 'all' ? 1 : 0);

  const closePanel = useCallback(() => { setSelectedId(null); setDraft(''); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closePanel]);

  const addComment = useCallback(() => {
    if (!draft.trim() || !selected) return;
    const entry: ActivityEntry = {
      id: `user-${Date.now()}`,
      type: 'comment',
      author: 'You',
      content: draft.trim(),
      timestamp: new Date().toISOString(),
    };
    setBlockerOverrides(prev => ({
      ...prev,
      [selected.id]: {
        status: selected.status,
        activity: [...selected.activity, entry],
      },
    }));
    setDraft('');
  }, [draft, selected]);

  const changeStatus = useCallback((newStatus: BlockerStatus) => {
    if (!selected || selected.status === newStatus) return;
    const entry: ActivityEntry = {
      id: `status-${Date.now()}`,
      type: 'status_change',
      author: 'You',
      content: 'Status changed',
      timestamp: new Date().toISOString(),
      previousStatus: selected.status,
      newStatus,
    };
    setBlockerOverrides(prev => ({
      ...prev,
      [selected.id]: {
        status: newStatus,
        activity: [...selected.activity, entry],
      },
    }));
  }, [selected]);

  return (
    <>
      <CabinetNav breadcrumbs={[{ label: 'Blockers' }]} />
      <DashboardShell>
        <div className="animate-fade-up">
          <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
              Blockers
            </h1>
            <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
              Escalated issues preventing progress on projects and action items
            </p>
          </header>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)] sm:gap-[var(--space-lg)] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <SummaryCard label="Open Blockers" value={stats.open} color="red"
              onClick={() => { setStatusFilter(statusFilter === 'open' ? 'all' : 'open'); setLevelFilter('all'); }}
              active={statusFilter === 'open'} />
            <SummaryCard label="PM-Level" value={stats.pm} color="red"
              onClick={() => { setLevelFilter(levelFilter === 'pm' ? 'all' : 'pm'); setStatusFilter('all'); }}
              active={levelFilter === 'pm'} />
            <SummaryCard label="Minister-Level" value={stats.minister} color="gold"
              onClick={() => { setLevelFilter(levelFilter === 'minister' ? 'all' : 'minister'); setStatusFilter('all'); }}
              active={levelFilter === 'minister'} />
            <SummaryCard label="Resolved" value={stats.resolved} color="green"
              onClick={() => { setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved'); setLevelFilter('all'); }}
              active={statusFilter === 'resolved'} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-[var(--space-md)] mb-[var(--space-lg)] sm:mb-[var(--space-xl)]">
            <div className="flex gap-1 p-1 bg-surface border border-border-default rounded-lg">
              {(['all', 'open', 'in_progress', 'resolved'] as FilterStatus[]).map(fs => (
                <button key={fs} onClick={() => setStatusFilter(fs)}
                  className={`px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === fs ? 'bg-sidebar text-text-on-dark' : 'text-text-secondary hover:text-text-primary'
                  }`}>
                  {fs === 'all' ? 'All' : STATUS_CONFIG[fs].label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 bg-surface border border-border-default rounded-lg">
              {(['all', 'pm', 'minister'] as FilterLevel[]).map(fl => (
                <button key={fl} onClick={() => setLevelFilter(fl)}
                  className={`px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    levelFilter === fl ? 'bg-sidebar text-text-on-dark' : 'text-text-secondary hover:text-text-primary'
                  }`}>
                  {fl === 'all' ? 'All Levels' : LEVEL_CONFIG[fl].label}
                </button>
              ))}
            </div>
            {activeFilters > 0 && (
              <button onClick={() => { setStatusFilter('all'); setLevelFilter('all'); }}
                className="px-3 py-2 text-[length:var(--text-caption)] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                Clear ({activeFilters})
              </button>
            )}
          </div>

          {/* Blocker list */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((blocker, i) => {
                const s = STATUS_CONFIG[blocker.status];
                const l = LEVEL_CONFIG[blocker.escalationLevel];
                const age = daysSince(blocker.createdDate);
                const commentCount = blocker.activity.filter(a => a.type === 'comment').length;
                const isSelected = selectedId === blocker.id;

                return (
                  <button
                    key={blocker.id}
                    onClick={() => setSelectedId(isSelected ? null : blocker.id)}
                    className={`w-full text-left p-[var(--space-base)] sm:p-[var(--space-lg)] bg-surface border rounded-sm transition-colors animate-fade-up cursor-pointer ${
                      isSelected ? 'border-gold ring-1 ring-gold/20' : 'border-border-default hover:border-border-strong'
                    }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-[var(--space-sm)] sm:gap-[var(--space-lg)]">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-[var(--space-sm)] mb-[var(--space-xs)]">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[length:var(--text-micro)] font-semibold uppercase tracking-wide ${l.bg} ${l.text}`}>
                            {l.label}
                          </span>
                          {blocker.status !== 'resolved' && age > 21 && (
                            <span className="text-[length:var(--text-micro)] font-semibold text-status-off-track uppercase tracking-wide">{age}d old</span>
                          )}
                        </div>
                        <h3 className="text-[length:var(--text-body)] sm:text-[length:var(--text-h3)] font-bold text-text-primary leading-snug">{blocker.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-[var(--space-sm)] text-[length:var(--text-caption)] text-text-secondary">
                          <span className="font-medium">{blocker.assignedTo}</span>
                          {blocker.linkedName && <span>Linked: {blocker.linkedName}</span>}
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                            {commentCount}
                          </span>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[length:var(--text-caption)] font-semibold ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center border border-border-default rounded-lg bg-surface">
              <p className="text-text-secondary text-[length:var(--text-body)]">No blockers match your filters.</p>
            </div>
          )}
        </div>
      </DashboardShell>

      {/* ── Slide-over panel ── */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={closePanel} />
          <aside className="fixed z-50 top-0 right-0 h-dvh w-full sm:w-[520px] bg-page border-l border-border-default shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
            {/* Panel header */}
            <div className="flex items-start justify-between gap-[var(--space-md)] px-5 py-4 border-b border-border-default flex-shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-[var(--space-sm)] mb-[var(--space-xs)]">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[length:var(--text-micro)] font-semibold uppercase tracking-wide ${LEVEL_CONFIG[selected.escalationLevel].bg} ${LEVEL_CONFIG[selected.escalationLevel].text}`}>
                    {LEVEL_CONFIG[selected.escalationLevel].label}
                  </span>
                  <span className="text-[length:var(--text-caption)] text-text-secondary">{daysSince(selected.createdDate)}d old</span>
                </div>
                <h2 className="text-[length:var(--text-h3)] sm:text-[length:var(--text-h2)] font-bold text-text-primary leading-snug">{selected.title}</h2>
              </div>
              <button onClick={closePanel} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer flex-shrink-0 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Description */}
              <p className="text-[length:var(--text-body)] text-text-secondary leading-relaxed mb-[var(--space-lg)]">{selected.description}</p>

              {/* Metadata */}
              <div className="flex flex-col gap-[var(--space-sm)] mb-[var(--space-lg)] text-[length:var(--text-caption)]">
                <div>
                  <span className="text-text-secondary/60">Assigned to </span>
                  <Link href={`/minister/${selected.assignedMinistrySlug}`} className="font-medium text-text-primary hover:text-gold-dark transition-colors" onClick={closePanel}>
                    {selected.assignedTo}
                  </Link>
                </div>
                {selected.linkedName && selected.linkedHref && (
                  <div>
                    <span className="text-text-secondary/60">Linked to </span>
                    <Link href={selected.linkedHref} className="font-medium text-text-primary hover:text-gold-dark transition-colors" onClick={closePanel}>
                      {selected.linkedName}
                    </Link>
                  </div>
                )}
              </div>

              {/* Status controls */}
              <div className="flex flex-wrap items-center gap-[var(--space-sm)] mb-[var(--space-xl)] p-[var(--space-md)] bg-surface border border-border-default rounded-lg">
                <span className="text-[length:var(--text-caption)] font-medium text-text-secondary mr-[var(--space-xs)]">Status:</span>
                {(['open', 'in_progress', 'resolved'] as BlockerStatus[]).map(st => {
                  const cfg = STATUS_CONFIG[st];
                  const isCurrent = selected.status === st;
                  return (
                    <button key={st} onClick={() => changeStatus(st)} disabled={isCurrent}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-semibold transition-colors cursor-pointer ${
                        isCurrent ? `${cfg.bg} ${cfg.text} ring-2 ring-offset-1` : 'bg-page border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? cfg.dot : 'bg-text-secondary/40'}`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Activity feed */}
              <h3 className="text-[length:var(--text-h3)] font-bold text-text-primary mb-[var(--space-md)]">Activity</h3>
              <div className="relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border-default" />
                <div className="space-y-[var(--space-md)]">
                  {selected.activity.map((entry) => (
                    <div key={entry.id} className="relative flex gap-[var(--space-md)]">
                      {entry.type === 'status_change' ? (
                        <>
                          <div className="relative z-10 w-8 h-8 rounded-full bg-surface border-2 border-border-default flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-[length:var(--text-caption)] text-text-secondary">
                              <span className="font-medium text-text-primary">{entry.author}</span>
                              {' changed status from '}
                              {entry.previousStatus && <span className={`font-semibold ${STATUS_CONFIG[entry.previousStatus].text}`}>{STATUS_CONFIG[entry.previousStatus].label}</span>}
                              {' to '}
                              {entry.newStatus && <span className={`font-semibold ${STATUS_CONFIG[entry.newStatus].text}`}>{STATUS_CONFIG[entry.newStatus].label}</span>}
                            </p>
                            <p className="text-[length:var(--text-micro)] text-text-secondary/60 mt-0.5">{formatTimestamp(entry.timestamp)}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative z-10 w-8 h-8 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-text-on-dark">{entry.author.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                          </div>
                          <div className="flex-1 p-[var(--space-md)] bg-surface border border-border-default rounded-lg">
                            <div className="flex items-center justify-between gap-[var(--space-sm)] mb-[var(--space-xs)]">
                              <span className="text-[length:var(--text-caption)] font-medium text-text-primary">{entry.author}</span>
                              <span className="text-[length:var(--text-micro)] text-text-secondary/60 flex-shrink-0">{formatTimestamp(entry.timestamp)}</span>
                            </div>
                            <p className="text-[length:var(--text-caption)] text-text-secondary leading-relaxed">{entry.content}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel footer — comment input */}
            <div className="flex-shrink-0 border-t border-border-default px-5 py-4">
              <div className="flex gap-[var(--space-sm)]">
                <input
                  type="text"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addComment(); }}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2.5 bg-surface border border-border-default rounded-lg text-[length:var(--text-body)] placeholder:text-text-secondary/50 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/30"
                />
                <button onClick={addComment} disabled={!draft.trim()}
                  className="px-4 py-2.5 rounded-lg bg-sidebar text-text-on-dark text-[length:var(--text-caption)] font-semibold hover:bg-sidebar/90 transition-colors cursor-pointer disabled:opacity-40">
                  Post
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function SummaryCard({ label, value, color, onClick, active }: {
  label: string; value: number; color: 'red' | 'gold' | 'green'; onClick: () => void; active: boolean;
}) {
  const colors = {
    red: { bg: 'bg-status-off-track/5', border: 'border-status-off-track/30', dot: 'bg-status-off-track' },
    gold: { bg: 'bg-gold/5', border: 'border-gold/30', dot: 'bg-gold' },
    green: { bg: 'bg-jm-green/5', border: 'border-jm-green/30', dot: 'bg-jm-green' },
  };
  const c = colors[color];
  return (
    <button onClick={onClick}
      className={`p-[var(--space-md)] sm:p-[var(--space-lg)] rounded-lg border transition-all cursor-pointer text-left ${
        active ? `${c.bg} ${c.border} ring-2 ring-offset-1` : `${c.bg} ${c.border} hover:shadow-sm`
      }`}>
      <div className="flex items-center gap-[var(--space-xs)] mb-[var(--space-sm)]">
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        <p className="text-[length:var(--text-caption)] text-text-secondary font-medium">{label}</p>
      </div>
      <p className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary">{value}</p>
    </button>
  );
}
