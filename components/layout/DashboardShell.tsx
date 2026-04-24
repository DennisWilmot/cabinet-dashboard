import type { ReactNode } from 'react';

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-[var(--space-lg)] py-[var(--space-2xl)]">
      {children}
    </main>
  );
}
