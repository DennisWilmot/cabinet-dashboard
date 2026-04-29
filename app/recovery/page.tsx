import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataFreshness } from '@/components/layout/DataFreshness';

export default function RecoveryPage() {
  return (
    <DashboardShell
      freshness={<DataFreshness inline />}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Hurricane Recovery' },
      ]}
    >
      <div className="animate-fade-up">
        <header className="mb-[var(--space-xl)] sm:mb-[var(--space-2xl)]">
          <h1 className="text-[length:var(--text-h1)] sm:text-[length:var(--text-display)] font-bold text-text-primary tracking-tight">
            Hurricane Melissa Recovery
          </h1>
          <p className="text-text-secondary text-[length:var(--text-caption)] sm:text-[length:var(--text-body)] mt-[var(--space-xs)]">
            Cross-ministry reconstruction tracker · Landfall: October 28, 2025
          </p>
        </header>

        <div className="py-[var(--space-2xl)] px-[var(--space-lg)] border border-border-default rounded-sm bg-surface text-center max-w-2xl">
          <svg className="w-10 h-10 mx-auto text-text-secondary/40 mb-[var(--space-md)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p className="text-[length:var(--text-body)] font-medium text-text-primary mb-[var(--space-xs)]">
            Recovery tracking data is being compiled
          </p>
          <p className="text-[length:var(--text-caption)] text-text-secondary max-w-md mx-auto leading-relaxed">
            This page will aggregate reconstruction spending across all ministries,
            track capital projects tagged for hurricane recovery, and show parish-level
            damage assessments from the PIOJ/ECLAC DaLA report.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
