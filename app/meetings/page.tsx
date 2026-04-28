'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CabinetNav } from '@/components/layout/CabinetNav';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { mockMeetings } from '@/lib/meetings/data';
import type { CabinetMeeting } from '@/lib/meetings/types';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-JM', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-JM', { month: 'short', day: 'numeric' });
}

function StatusLabel({ meeting }: { meeting: CabinetMeeting }) {
  const today = new Date().toISOString().split('T')[0];
  if (meeting.date === today || meeting.status === 'in_progress') {
    return (
      <span
        role="link"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(meeting.meetLink, '_blank', 'noopener,noreferrer'); }}
        className="inline-flex items-center gap-1.5 text-[length:var(--text-caption)] font-semibold text-jm-green hover:text-jm-green-dark transition-colors cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-jm-green animate-pulse" />
        Join Meeting
      </span>
    );
  }
  if (meeting.date > today) {
    return <span className="text-[length:var(--text-caption)] text-text-secondary font-medium">Upcoming</span>;
  }
  return <span className="text-[length:var(--text-caption)] text-text-secondary/60 font-medium">Completed</span>;
}

function AttendeeStack({ attendees }: { attendees: CabinetMeeting['attendees'] }) {
  const shown = attendees.slice(0, 6);
  const overflow = attendees.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((a, i) => (
        <Image
          key={`${a.ministrySlug}-${i}`}
          src={a.avatarUrl}
          alt={a.name}
          width={32}
          height={32}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-page"
          title={a.name}
        />
      ))}
      {overflow > 0 && (
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-border-default flex items-center justify-center text-[length:var(--text-micro)] font-bold text-text-secondary border-2 border-page flex-shrink-0">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function TranscriptBadge({ status }: { status: CabinetMeeting['transcriptStatus'] }) {
  if (status === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[length:var(--text-caption)] font-medium text-jm-green">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        Uploaded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[length:var(--text-caption)] font-medium text-text-secondary/50">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      Pending
    </span>
  );
}

function ListView({ meetings }: { meetings: CabinetMeeting[] }) {
  return (
    <div className="border border-border-default rounded-sm overflow-hidden">
      <div className="hidden sm:grid grid-cols-[140px_1fr_120px_100px_100px] gap-[var(--space-md)] px-[var(--space-lg)] py-[var(--space-sm)] bg-surface text-[length:var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wide border-b border-border-default">
        <span>Date</span>
        <span>Attendees</span>
        <span>Status</span>
        <span>Transcript</span>
        <span />
      </div>
      {meetings.map((m, i) => (
        <Link
          key={m.id}
          href={`/meetings/${m.id}`}
          className={`grid grid-cols-1 sm:grid-cols-[140px_1fr_120px_100px_100px] gap-[var(--space-xs)] sm:gap-[var(--space-md)] items-center px-[var(--space-base)] sm:px-[var(--space-lg)] py-[var(--space-md)] sm:py-[var(--space-base)] hover:bg-surface transition-colors animate-fade-up ${
            i < meetings.length - 1 ? 'border-b border-border-default' : ''
          }`}
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-sidebar flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-gold uppercase leading-none">
                {new Date(m.date + 'T12:00:00').toLocaleDateString('en-JM', { month: 'short' })}
              </span>
              <span className="text-[length:var(--text-body)] font-bold text-text-on-dark leading-none mt-0.5">
                {new Date(m.date + 'T12:00:00').getDate()}
              </span>
            </div>
            <div className="sm:hidden">
              <p className="text-[length:var(--text-body)] font-semibold text-text-primary">{formatDate(m.date)}</p>
            </div>
          </div>
          <AttendeeStack attendees={m.attendees} />
          <StatusLabel meeting={m} />
          <TranscriptBadge status={m.transcriptStatus} />
          <span className="hidden sm:flex items-center justify-end text-text-secondary/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}

function CalendarView({ meetings, currentMonth, onMonthChange }: {
  meetings: CabinetMeeting[];
  currentMonth: Date;
  onMonthChange: (d: Date) => void;
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const meetingsByDate = useMemo(() => {
    const map: Record<string, CabinetMeeting[]> = {};
    for (const m of meetings) {
      (map[m.date] ??= []).push(m);
    }
    return map;
  }, [meetings]);

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const monthLabel = currentMonth.toLocaleDateString('en-JM', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-[var(--space-lg)]">
        <button
          onClick={() => onMonthChange(new Date(year, month - 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="text-[length:var(--text-h2)] font-bold text-text-primary font-[family-name:var(--font-display)]">{monthLabel}</h3>
        <button
          onClick={() => onMonthChange(new Date(year, month + 1, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border-default border border-border-default rounded-sm overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="bg-surface px-2 py-2 text-center text-[length:var(--text-micro)] sm:text-[length:var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wide">
            {d}
          </div>
        ))}
        {weeks.flat().map((day, i) => {
          const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
          const dayMeetings = dateStr ? meetingsByDate[dateStr] || [] : [];
          const isToday = dateStr === today;

          return (
            <div
              key={i}
              className={`bg-page min-h-[60px] sm:min-h-[80px] p-1.5 sm:p-2 ${!day ? 'bg-surface/50' : ''}`}
            >
              {day && (
                <>
                  <span className={`text-[length:var(--text-caption)] font-medium ${isToday ? 'w-6 h-6 rounded-full bg-gold text-sidebar flex items-center justify-center font-bold' : 'text-text-secondary'}`}>
                    {day}
                  </span>
                  {dayMeetings.map(m => (
                    <Link
                      key={m.id}
                      href={`/meetings/${m.id}`}
                      className="block mt-1 px-1.5 py-0.5 rounded bg-gold/15 text-gold-dark text-[length:var(--text-micro)] font-semibold truncate hover:bg-gold/25 transition-colors"
                    >
                      Cabinet
                    </Link>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 3, 1));

  const sorted = useMemo(
    () => [...mockMeetings].sort((a, b) => b.date.localeCompare(a.date)),
    []
  );

  return (
    <>
      <CabinetNav breadcrumbs={[{ label: 'Meetings' }]} />
      <DashboardShell>
        <div className="animate-fade-up">
          <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[var(--space-md)]">
            <div>
              <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
                Cabinet Meetings
              </h1>
              <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
                {mockMeetings.length} meetings · Fiscal Year 2026-27
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-surface border border-border-default rounded-lg">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-medium transition-colors cursor-pointer ${
                  view === 'list' ? 'bg-sidebar text-text-on-dark' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  List
                </span>
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded-md text-[length:var(--text-caption)] font-medium transition-colors cursor-pointer ${
                  view === 'calendar' ? 'bg-sidebar text-text-on-dark' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Calendar
                </span>
              </button>
            </div>
          </header>

          {view === 'list' ? (
            <ListView meetings={sorted} />
          ) : (
            <CalendarView meetings={mockMeetings} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
          )}
        </div>
      </DashboardShell>
    </>
  );
}
