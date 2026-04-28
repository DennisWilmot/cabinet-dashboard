'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMockData } from '@/lib/context';
import { useAuth } from '@/lib/auth-context';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function CabinetNav({ breadcrumbs }: { breadcrumbs?: BreadcrumbItem[] }) {
  const { mockDataEnabled, toggleMockData } = useMockData();
  const { logout, user } = useAuth();

  return (
    <nav className="bg-sidebar text-text-inverse sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-[var(--space-base)] sm:px-[var(--space-lg)] h-14 flex items-center justify-between gap-[var(--space-sm)]">
        <div className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)] min-w-0">
          <Link href="/dashboard" className="flex items-center gap-[var(--space-sm)] hover:opacity-90 transition-opacity flex-shrink-0">
            <Image
              src="/Coat_of_arms_of_Jamaica.svg.png"
              alt="Jamaica Coat of Arms"
              width={28}
              height={28}
              className="w-7 h-7"
            />
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

          {!breadcrumbs && (
            <Link
              href="/meetings"
              className="ml-[var(--space-sm)] sm:ml-[var(--space-lg)] text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-inverse/60 hover:text-gold transition-colors font-medium"
            >
              Meetings
            </Link>
          )}
        </div>

        <div className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)]">
          <button
            onClick={toggleMockData}
            className="flex items-center gap-[var(--space-sm)] text-[length:var(--text-caption)] font-medium px-[var(--space-sm)] sm:px-[var(--space-md)] py-[6px] rounded-full transition-all border border-text-inverse/20 hover:border-gold/50 flex-shrink-0"
          >
            <span className={`w-2 h-2 rounded-full ${mockDataEnabled ? 'bg-jm-green' : 'bg-status-off-track'}`} />
            <span className="hidden sm:inline">Mock Data</span> {mockDataEnabled ? 'ON' : 'OFF'}
          </button>

          {user && (
            <div className="flex items-center gap-[var(--space-sm)] sm:gap-[var(--space-md)]">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover hidden sm:block"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={logout}
                className="flex items-center gap-[6px] text-[length:var(--text-caption)] text-text-inverse/60 hover:text-gold transition-colors flex-shrink-0 cursor-pointer"
                title={`Signed in as ${user.name}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
