'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AttendanceEditor } from '@/components/ui/AttendanceEditor';
import { getMeeting } from '@/lib/meetings/data';
import { supabase, TRANSCRIPT_BUCKET } from '@/lib/supabase';
import type { CabinetMeeting, ActionItem } from '@/lib/meetings/types';

type Tab = 'actions' | 'decisions' | 'minutes' | 'transcript';

const TABS: { id: Tab; label: string }[] = [
  { id: 'actions', label: 'Action Items' },
  { id: 'decisions', label: 'Key Decisions' },
  { id: 'minutes', label: 'Meeting Minutes' },
  { id: 'transcript', label: 'Raw Transcript' },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-JM', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

const ACTION_STATUS_STYLES: Record<ActionItem['status'], { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-jm-green/15', text: 'text-jm-green-dark', label: 'Completed' },
  in_progress: { bg: 'bg-gold/15', text: 'text-gold-dark', label: 'In Progress' },
  pending: { bg: 'bg-border-default/50', text: 'text-text-secondary', label: 'Pending' },
};

function ActionItemsTab({ items }: { items: ActionItem[] }) {
  if (!items || items.length === 0) {
    return <EmptyState message="No action items recorded for this meeting." />;
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
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
                <Link href={`/ministry/${item.ministrySlug}`} className="hover:text-gold-dark transition-colors font-medium">
                  {item.assignee}
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
  );
}

function KeyDecisionsTab({ decisions }: { decisions: CabinetMeeting['keyDecisions'] }) {
  if (!decisions || decisions.length === 0) {
    return <EmptyState message="No key decisions recorded for this meeting." />;
  }
  return (
    <div className="space-y-4">
      {decisions.map((d, i) => (
        <div
          key={d.id}
          className="flex gap-[var(--space-md)] sm:gap-[var(--space-lg)] animate-fade-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sidebar flex items-center justify-center text-[length:var(--text-caption)] font-bold text-gold">
            {i + 1}
          </span>
          <div className="min-w-0 pt-1">
            <p className="text-[length:var(--text-body)] text-text-primary leading-relaxed">{d.decision}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[length:var(--text-caption)] text-text-secondary">
              <span className="font-medium">{d.proposedBy}</span>
              <span className="px-2 py-0.5 rounded bg-gold/10 text-gold-dark text-[length:var(--text-micro)] font-semibold uppercase tracking-wide">{d.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MinutesTab({ minutes }: { minutes?: string }) {
  if (!minutes) {
    return <EmptyState message="No meeting minutes available." />;
  }
  return (
    <div className="prose-custom animate-fade-up">
      {minutes.split('\n').map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-[length:var(--text-h2)] font-bold text-text-primary mt-8 mb-3 first:mt-0 font-[family-name:var(--font-display)]">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('- **')) {
          const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
          if (match) {
            return <p key={i} className="text-[length:var(--text-body)] text-text-secondary leading-relaxed ml-4 my-1">• <strong className="text-text-primary">{match[1]}</strong>{match[2]}</p>;
          }
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return <p key={i} className="text-[length:var(--text-body)] text-text-secondary leading-relaxed my-1">{line}</p>;
      })}
    </div>
  );
}

function TranscriptTab({ meeting, onUploadComplete }: { meeting: CabinetMeeting; onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const path = `${meeting.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(TRANSCRIPT_BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(TRANSCRIPT_BUCKET).getPublicUrl(path);
      onUploadComplete(data.publicUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [meeting.id, onUploadComplete]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const hasTranscript = meeting.rawTranscript || meeting.transcriptUrl;

  return (
    <div className="space-y-6 animate-fade-up">
      {!hasTranscript ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-10 sm:p-16 text-center transition-colors ${
            dragOver ? 'border-gold bg-gold/5' : 'border-border-default hover:border-border-strong'
          }`}
        >
          <svg className="w-10 h-10 mx-auto text-text-secondary/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-[length:var(--text-h3)] font-semibold text-text-primary mb-1">
            {uploading ? 'Uploading...' : 'Upload transcript or recording'}
          </p>
          <p className="text-[length:var(--text-caption)] text-text-secondary mb-4">
            Drag and drop a file here, or click to browse
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sidebar text-text-on-dark text-[length:var(--text-caption)] font-semibold cursor-pointer hover:bg-sidebar/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Choose file
            <input
              type="file"
              className="hidden"
              accept=".txt,.md,.srt,.vtt,.doc,.docx,.pdf"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </label>
          {error && <p className="mt-4 text-[length:var(--text-caption)] text-status-off-track">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[length:var(--text-caption)] text-jm-green font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Transcript available
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[length:var(--text-caption)] font-medium text-text-secondary hover:text-text-primary border border-border-default hover:border-border-strong transition-colors cursor-pointer">
              Replace
              <input
                type="file"
                className="hidden"
                accept=".txt,.md,.srt,.vtt,.doc,.docx,.pdf"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>
          </div>
          {meeting.rawTranscript && (
            <div className="bg-sidebar rounded-lg p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              <pre className="text-[length:var(--text-caption)] text-text-on-dark-muted leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-body)]">
                {meeting.rawTranscript}
              </pre>
            </div>
          )}
          {meeting.transcriptUrl && !meeting.rawTranscript && (
            <a
              href={meeting.transcriptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium"
            >
              Download uploaded transcript
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center animate-fade-up">
      <svg className="w-10 h-10 mx-auto text-text-secondary/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      <p className="text-text-secondary text-[length:var(--text-body)]">{message}</p>
    </div>
  );
}

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>('actions');
  const [meeting, setMeeting] = useState<CabinetMeeting | undefined>(() => getMeeting(meetingId));

  if (!meeting) {
    return (
      <>
        <DashboardShell breadcrumbs={[{ label: 'Meetings', href: '/meetings' }, { label: 'Not Found' }]}>
          <div className="py-20 text-center">
            <h1 className="text-[length:var(--text-h1)] font-bold text-text-primary">Meeting not found</h1>
            <Link href="/meetings" className="mt-4 inline-block text-gold hover:text-gold-dark transition-colors">
              Back to meetings
            </Link>
          </div>
        </DashboardShell>
      </>
    );
  }

  const dateLabel = formatDate(meeting.date);

  return (
    <>
      <DashboardShell breadcrumbs={[{ label: 'Meetings', href: '/meetings' }, { label: dateLabel }]}>
        <div className="animate-fade-up">
          <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
            <Link href="/meetings" className="inline-flex items-center gap-1 text-[length:var(--text-caption)] text-text-secondary hover:text-gold-dark transition-colors mb-[var(--space-md)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              All Meetings
            </Link>
            <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
              {meeting.title}
            </h1>
            <p className="text-text-secondary text-[length:var(--text-body)] mt-[var(--space-xs)]">
              {dateLabel}
            </p>

            <div className="flex flex-wrap items-center gap-[var(--space-md)] sm:gap-[var(--space-lg)] mt-[var(--space-lg)]">
              <div className="flex items-center -space-x-2">
                {meeting.attendees.slice(0, 8).map((a, i) => (
                  <Image
                    key={`${a.ministrySlug}-${i}`}
                    src={a.avatarUrl}
                    alt={a.name}
                    width={36}
                    height={36}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-page"
                    title={a.name}
                  />
                ))}
                {meeting.attendees.length > 8 && (
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-border-default flex items-center justify-center text-[length:var(--text-micro)] font-bold text-text-secondary border-2 border-page">
                    +{meeting.attendees.length - 8}
                  </span>
                )}
              </div>
              <span className="text-[length:var(--text-caption)] text-text-secondary">
                {meeting.attendees.length} ministers present
              </span>
              <AttendanceEditor
                meetingId={meeting.id}
                defaultAttendees={meeting.attendees}
                onUpdate={(updated) => setMeeting(prev => prev ? { ...prev, attendees: updated } : prev)}
              />
            </div>
          </header>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-surface border border-border-default rounded-lg mb-[var(--space-xl)] sm:mb-[var(--space-2xl)] overflow-x-auto scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-md text-[length:var(--text-caption)] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sidebar text-text-on-dark'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'actions' && <ActionItemsTab items={meeting.actionItems || []} />}
          {activeTab === 'decisions' && <KeyDecisionsTab decisions={meeting.keyDecisions} />}
          {activeTab === 'minutes' && <MinutesTab minutes={meeting.minutes} />}
          {activeTab === 'transcript' && (
            <TranscriptTab
              meeting={meeting}
              onUploadComplete={(url) => setMeeting(prev => prev ? { ...prev, transcriptUrl: url, transcriptStatus: 'uploaded' } : prev)}
            />
          )}
        </div>
      </DashboardShell>
    </>
  );
}
