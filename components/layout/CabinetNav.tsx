'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBarProps {
  breadcrumbs?: BreadcrumbItem[];
  freshness?: React.ReactNode;
}

export function PageBar({ breadcrumbs, freshness }: PageBarProps) {
  if (!breadcrumbs?.length && !freshness) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--space-xs)] py-[var(--space-sm)]">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="min-w-0 pl-10 lg:pl-0">
          <ol className="flex items-center gap-[var(--space-xs)] text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] text-text-secondary">
            <li><Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link></li>
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-[var(--space-xs)] min-w-0">
                <span className="text-text-secondary/40" aria-hidden>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-text-primary transition-colors truncate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-primary font-medium truncate" aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {freshness && (
        <div className="text-[length:var(--text-caption)] text-text-secondary pl-10 lg:pl-0">
          {freshness}
        </div>
      )}
    </div>
  );
}
