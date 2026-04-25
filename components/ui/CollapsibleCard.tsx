'use client';

import { useState, useRef, type ReactNode } from 'react';

interface CollapsibleCardProps {
  id: string;
  title: string;
  subtitle?: React.ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleCard({
  id,
  title,
  subtitle,
  headerRight,
  children,
  defaultOpen = true,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article
      id={id}
      className="scroll-mt-28 bg-card rounded-lg border border-border-default shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]"
      data-card-id={id}
    >
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-start justify-between gap-[var(--space-md)] px-[var(--space-lg)] pt-[var(--space-lg)] pb-[var(--space-md)] text-left group cursor-pointer"
      >
        <div className="flex-1 min-w-0 flex items-start gap-[var(--space-md)]">
          <svg
            className={`w-5 h-5 mt-[2px] flex-shrink-0 text-text-secondary transition-transform duration-200 ${
              open ? 'rotate-90' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <div className="min-w-0">
            <h3 className="font-bold text-[length:var(--text-h2)] text-text-primary group-hover:text-gold-dark transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[length:var(--text-body)] text-text-secondary mt-[4px]">{subtitle}</p>
            )}
          </div>
        </div>
        {headerRight && (
          <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
            {headerRight}
          </div>
        )}
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-[var(--space-lg)] pb-[var(--space-lg)]">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
