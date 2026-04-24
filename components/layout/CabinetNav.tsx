'use client';

import Link from 'next/link';
import { useMockData } from '@/lib/context';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function CabinetNav({ breadcrumbs }: { breadcrumbs?: BreadcrumbItem[] }) {
  const { mockDataEnabled, toggleMockData } = useMockData();

  return (
    <nav className="bg-sidebar text-text-inverse sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-[var(--space-base)] sm:px-[var(--space-lg)] h-14 flex items-center justify-between gap-[var(--space-sm)]">
        <div className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)] min-w-0">
          <Link href="/" className="flex items-center gap-[var(--space-sm)] hover:opacity-90 transition-opacity flex-shrink-0">
            <div className="w-7 h-7 rounded bg-gold flex items-center justify-center">
              <span className="text-sidebar font-bold text-[length:var(--text-caption)]">JA</span>
            </div>
            <span className="font-semibold text-[length:var(--text-body)] tracking-wide font-[family-name:var(--font-display)] hidden sm:inline">
              Cabinet Dashboard
            </span>
          </Link>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-[4px] sm:gap-[6px] ml-[var(--space-xs)] sm:ml-[var(--space-base)] text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-inverse/60 min-w-0">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-[4px] sm:gap-[6px] min-w-0">
                  <span className="text-text-inverse/25">/</span>
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gold transition-colors truncate">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-inverse/90 truncate">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleMockData}
          className="flex items-center gap-[var(--space-sm)] text-[length:var(--text-caption)] font-medium px-[var(--space-sm)] sm:px-[var(--space-md)] py-[6px] rounded-full transition-all border border-text-inverse/20 hover:border-gold/50 flex-shrink-0"
        >
          <span className={`w-2 h-2 rounded-full ${mockDataEnabled ? 'bg-jm-green' : 'bg-status-off-track'}`} />
          <span className="hidden sm:inline">Mock Data</span> {mockDataEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </nav>
  );
}
