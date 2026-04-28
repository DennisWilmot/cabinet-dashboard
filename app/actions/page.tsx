'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getAllActionItems, allMinisters, mockMeetings } from '@/lib/meetings/data';
import type { ActionItemWithMeeting } from '@/lib/meetings/data';
import type { ActionItemStatus } from '@/lib/meetings/types';

type FilterStatus = 'all' | ActionItemStatus;

const STATUS_CONFIG: Record<ActionItemStatus, { bg: string; text: string; label: string; dot: string }> = {
  completed: { bg: 'bg-jm-green/15', text: 'text-jm-green-dark', label: 'Resolved', dot: 'bg-jm-green' },
  in_progress: { bg: 'bg-gold/15', text: 'text-gold-dark', label: 'In Progress', dot: 'bg-gold' },
  pending: { bg: 'bg-border-default/50', text: 'text-text-secondary', label: 'Open', dot: 'bg-text-secondary' },
};

const FILTER_STATUSES: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Resolved' },
];

function formatMeetingDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-JM', { month: 'short', day: 'numeric' });
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-JM', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate: string, status: ActionItemStatus): boolean {
  if (status === 'completed') return false;
  return new Date(dueDate + 'T23:59:59') < new Date();
}

export default function ActionsPage() {
  const allItems = useMemo(() => getAllActionItems(), []);

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [meetingFilter, setMeetingFilter] = useState<string>('all');
  const [personFilter, setPersonFilter] = useState<string>('all');

  const meetingsWithActions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of allItems) {
      if (!seen.has(item.meetingId)) {
        seen.set(item.meetingId, item.meetingDate);
      }
    }
    return Array.from(seen.entries())
      .sort((a, b) => b[1].localeCompare(a[1]))
      .map(([id, date]) => ({ id, label: `${formatMeetingDate(date)} Meeting` }));
  }, [allItems]);

  const assignees = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of allItems) {
      if (!seen.has(item.ministrySlug)) {
        seen.set(item.ministrySlug, item.assignee);
      }
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([slug, name]) => ({ slug, name }));
  }, [allItems]);

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (meetingFilter !== 'all' && item.meetingId !== meetingFilter) return false;
      if (personFilter !== 'all' && item.ministrySlug !== personFilter) return false;
      return true;
    });
  }, [allItems, statusFilter, meetingFilter, personFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: allItems.length, pending: 0, in_progress: 0, completed: 0 };
    for (const item of allItems) {
      counts[item.status]++;
    }
    return counts;
  }, [allItems]);

  const activeFilters = (statusFilter !== 'all' ? 1 : 0)
    + (meetingFilter !== 'all' ? 1 : 0)
    + (personFilter !== 'all' ? 1 : 0);

  return (
    <>
      <CabinetNav breadcrumbs={[{ label: 'Actions' }]} />
      <DashboardShell>
        <div className="animate-fade-up">
          <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
              Cabinet Action Items
            </h1>
            <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
              {allItems.length} actions across {meetingsWithActions.length} meetings · {statusCounts.pending} open · {statusCounts.in_progress} in progress · {statusCounts.completed} resolved
            </p>
          </header>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-[var(--space-md)] mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            {/* Status pills */}
            <div className="flex gap-1 p-1 bg-surface border border-border-default rounded-lg overflow-x-auto scrollbar-none">
              {FILTER_STATUSES.map(fs => (
                <button
                  key={fs.value}
                  onClick={() => setStatusFilter(fs.value)}
                  className={`px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === fs.value
                      ? 'bg-sidebar text-text-on-dark'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {fs.label}
                  <span className="ml-1.5 opacity-60">{statusCounts[fs.value]}</span>
                </button>
              ))}
            </div>

            {/* Meeting filter */}
            <select
              value={meetingFilter}
              onChange={e => setMeetingFilter(e.target.value)}
              className="px-3 py-2 bg-surface border border-border-default rounded-lg text-[length:var(--text-caption)] text-text-primary cursor-pointer focus:outline-none focus:border-green focus:ring-1 focus:ring-green/30"
            >
              <option value="all">All Meetings</option>
              {meetingsWithActions.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>

            {/* Person filter */}
            <select
              value={personFilter}
              onChange={e => setPersonFilter(e.target.value)}
              className="px-3 py-2 bg-surface border border-border-default rounded-lg text-[length:var(--text-caption)] text-text-primary cursor-pointer focus:outline-none focus:border-green focus:ring-1 focus:ring-green/30"
            >
              <option value="all">All Ministers</option>
              {assignees.map(a => (
                <option key={a.slug} value={a.slug}>{a.name}</option>
              ))}
            </select>

            {activeFilters > 0 && (
              <button
                onClick={() => { setStatusFilter('all'); setMeetingFilter('all'); setPersonFilter('all'); }}
                className="px-3 py-2 text-[length:var(--text-caption)] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear filters ({activeFilters})
              </button>
            )}
          </div>

          {/* Action items list */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((item, i) => (
                <ActionRow key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-border-default rounded-lg bg-surface">
              <svg className="w-10 h-10 mx-auto text-text-secondary/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-text-secondary text-[length:var(--text-body)]">No action items match your filters.</p>
            </div>
          )}
        </div>
      </DashboardShell>
    </>
  );
}

function ActionRow({ item, index }: { item: ActionItemWithMeeting; index: number }) {
  const s = STATUS_CONFIG[item.status];
  const overdue = isOverdue(item.dueDate, item.status);
  const minister = allMinisters.find(m => m.ministrySlug === item.ministrySlug);

  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([]);
  const [draft, setDraft] = useState('');

  const addComment = () => {
    if (!draft.trim()) return;
    setComments(prev => [...prev, {
      author: 'You',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('en-JM', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setDraft('');
  };

  return (
    <div
      className="p-[var(--space-base)] sm:p-[var(--space-lg)] bg-surface border border-border-default rounded-sm animate-fade-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-[var(--space-sm)] sm:gap-[var(--space-lg)]">
        {/* Avatar */}
        {minister && (
          <Link href={`/minister/${item.ministrySlug}`} className="flex-shrink-0 hidden sm:block" onClick={e => e.stopPropagation()}>
            <Image
              src={minister.avatarUrl}
              alt={minister.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-gold/50 transition-shadow"
            />
          </Link>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[length:var(--text-body)] text-text-primary leading-relaxed">{item.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-[var(--space-sm)] text-[length:var(--text-caption)]">
            <Link
              href={`/minister/${item.ministrySlug}`}
              className="font-medium text-text-primary hover:text-gold-dark transition-colors"
            >
              {item.assignee}
            </Link>

            <Link
              href={`/meetings/${item.meetingId}`}
              className="text-text-secondary hover:text-gold-dark transition-colors"
            >
              {formatMeetingDate(item.meetingDate)} Meeting
            </Link>

            <span className={`${overdue ? 'text-status-off-track font-semibold' : 'text-text-secondary'}`}>
              {overdue ? 'Overdue · ' : ''}Due {formatDueDate(item.dueDate)}
            </span>
          </div>

          {/* Comment thread toggle */}
          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="mt-[var(--space-sm)] inline-flex items-center gap-1 text-[length:var(--text-caption)] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            {comments.length > 0 ? `${comments.length} update${comments.length > 1 ? 's' : ''}` : 'Add update'}
          </button>

          {commentOpen && (
            <div className="mt-[var(--space-md)] border-t border-border-default pt-[var(--space-md)]">
              {comments.length > 0 && (
                <div className="space-y-[var(--space-sm)] mb-[var(--space-md)]">
                  {comments.map((c, ci) => (
                    <div key={ci} className="flex gap-[var(--space-sm)]">
                      <div className="w-6 h-6 rounded-full bg-sidebar flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-text-on-dark">{c.author[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-[var(--space-sm)]">
                          <span className="text-[length:var(--text-caption)] font-medium text-text-primary">{c.author}</span>
                          <span className="text-[length:var(--text-micro)] text-text-secondary">{c.time}</span>
                        </div>
                        <p className="text-[length:var(--text-caption)] text-text-secondary mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-[var(--space-sm)]">
                <input
                  type="text"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addComment(); }}
                  placeholder="Post a status update..."
                  className="flex-1 px-3 py-2 bg-page border border-border-default rounded-lg text-[length:var(--text-caption)] placeholder:text-text-secondary/50 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/30"
                />
                <button
                  onClick={addComment}
                  disabled={!draft.trim()}
                  className="px-3 py-2 rounded-lg bg-sidebar text-text-on-dark text-[length:var(--text-caption)] font-semibold hover:bg-sidebar/90 transition-colors cursor-pointer disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-[var(--space-sm)] flex-shrink-0 sm:mt-0.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[length:var(--text-caption)] font-semibold ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
      </div>
    </div>
  );
}
