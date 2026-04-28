'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { allMinisters } from '@/lib/meetings/data';
import type { MeetingAttendee } from '@/lib/meetings/types';

interface Props {
  meetingId: string;
  defaultAttendees: MeetingAttendee[];
  onUpdate: (attendees: MeetingAttendee[]) => void;
}

export function AttendanceEditor({ meetingId, defaultAttendees, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() =>
    new Set(defaultAttendees.map(a => a.ministrySlug))
  );
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/attendance?meetingId=${encodeURIComponent(meetingId)}`);
        const data = await res.json();
        if (!cancelled && data?.ministrySlugs) {
          const slugs = new Set<string>(data.ministrySlugs as string[]);
          setSelected(slugs);
          onUpdate(allMinisters.filter(m => slugs.has(m.ministrySlug)));
        }
      } catch {
        // API may not be available yet — use defaults
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [meetingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback((slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const slugs = Array.from(selected);
    try {
      await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, ministrySlugs: slugs }),
      });
    } catch {
      // Silently fail for demo — DB table may not exist yet
    }
    onUpdate(allMinisters.filter(m => selected.has(m.ministrySlug)));
    setSaving(false);
    setOpen(false);
  }, [meetingId, selected, onUpdate]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[length:var(--text-caption)] font-medium text-text-secondary hover:text-text-primary border border-border-default hover:border-border-strong transition-colors cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        Edit
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-md bg-page border border-border-default rounded-xl shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default flex-shrink-0">
          <div>
            <h3 className="text-[length:var(--text-h3)] font-bold text-text-primary">Edit Attendance</h3>
            <p className="text-[length:var(--text-caption)] text-text-secondary mt-0.5">{selected.size} of {allMinisters.length} present</p>
          </div>
          <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {allMinisters.map(m => {
            const isSelected = selected.has(m.ministrySlug);
            return (
              <button
                key={m.ministrySlug}
                onClick={() => toggle(m.ministrySlug)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors cursor-pointer ${
                  isSelected ? 'bg-jm-green/10' : 'hover:bg-surface'
                }`}
              >
                <Image
                  src={m.avatarUrl}
                  alt={m.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[length:var(--text-body)] font-medium text-text-primary truncate">{m.name}</p>
                  <p className="text-[length:var(--text-caption)] text-text-secondary truncate">{m.title}</p>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-jm-green text-white' : 'border-2 border-border-strong'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border-default flex-shrink-0">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg text-[length:var(--text-caption)] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-sidebar text-text-on-dark text-[length:var(--text-caption)] font-semibold hover:bg-sidebar/90 transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
}
