import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageBar } from '@/components/layout/CabinetNav';
import { AtlasChat } from '@/components/ui/AtlasChat';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DashboardShell({
  children,
  breadcrumbs,
  freshness,
  sectionNav,
}: {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  freshness?: ReactNode;
  sectionNav?: ReactNode;
}) {
  const hasPageBar = !!(breadcrumbs?.length || freshness);

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {hasPageBar && (
          <div className="w-full border-b border-border-default bg-surface/60 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-[var(--space-base)] sm:px-[var(--space-lg)]">
              <PageBar breadcrumbs={breadcrumbs} freshness={freshness} />
            </div>
          </div>
        )}
        {sectionNav && (
          <div className="sticky top-0 z-30 w-full border-b border-border-default bg-page flex-shrink-0">
            <div className="max-w-7xl mx-auto px-[var(--space-base)] sm:px-[var(--space-lg)]">
              {sectionNav}
            </div>
          </div>
        )}
        <main className="flex-1 w-full max-w-7xl mx-auto px-[var(--space-base)] sm:px-[var(--space-lg)] py-[var(--space-lg)] sm:py-[var(--space-2xl)]">
          {children}
        </main>
      </div>
      <AtlasChat />
    </div>
  );
}
