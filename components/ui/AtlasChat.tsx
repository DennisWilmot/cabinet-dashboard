'use client';

import { useState, useEffect, useCallback } from 'react';

export function AtlasChat() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        className={`fixed z-50 bottom-0 right-0 sm:right-6 sm:bottom-6 flex flex-col bg-page border border-border-default shadow-2xl transition-all duration-300 ease-out origin-bottom-right ${
          open
            ? 'w-full sm:w-[420px] h-dvh sm:h-[calc(100dvh-48px)] sm:rounded-xl opacity-100 scale-100'
            : 'w-0 h-0 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-jm-green/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-jm-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>
            <div>
              <p className="text-[length:var(--text-body)] font-bold text-text-primary leading-tight">Atlas</p>
              <p className="text-[length:var(--text-micro)] text-text-secondary">Budget intelligence assistant</p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close Atlas"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-jm-green/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-jm-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
          <p className="text-[length:var(--text-h3)] font-semibold text-text-primary">Ask Atlas anything</p>
          <p className="text-[length:var(--text-caption)] text-text-secondary mt-2 max-w-[260px] leading-relaxed">
            Budget analysis, ministry comparisons, spending trends — coming soon.
          </p>
        </div>

        {/* Input (disabled placeholder) */}
        <div className="px-4 pb-4 pt-2 border-t border-border-default flex-shrink-0">
          <div className="flex items-center gap-2 bg-surface border border-border-default rounded-lg px-4 py-3">
            <input
              type="text"
              disabled
              placeholder="Ask a question..."
              className="flex-1 bg-transparent text-[length:var(--text-body)] placeholder:text-text-secondary/50 outline-none disabled:cursor-not-allowed"
            />
            <div className="w-8 h-8 rounded-lg bg-jm-green/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-jm-green/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* FAB trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full bg-sidebar text-gold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
          aria-label="Open Atlas assistant"
        >
          <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
          </svg>
        </button>
      )}
    </>
  );
}
