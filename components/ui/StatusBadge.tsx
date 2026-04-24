'use client';

import type { Status, StaffingHealth } from '@/lib/types';

const statusConfig: Record<Status, { label: string; color: string }> = {
  on_track: { label: 'On Track', color: 'text-jm-green-dark' },
  at_risk: { label: 'At Risk', color: 'text-gold-dark' },
  off_track: { label: 'Off Track', color: 'text-status-off-track' },
};

const staffingConfig: Record<StaffingHealth, { label: string; color: string }> = {
  healthy: { label: 'Healthy', color: 'text-jm-green-dark' },
  concern: { label: 'Concern', color: 'text-gold-dark' },
  critical: { label: 'Critical', color: 'text-status-off-track' },
};

export function StatusBadge({ status, tooltip, size = 'md' }: { status: Status; tooltip: string; size?: 'sm' | 'md' }) {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'text-[length:var(--text-caption)]' : 'text-[length:var(--text-body)]';

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-[6px] font-semibold cursor-help ${config.color} ${sizeClass}`}
    >
      <span
        className={`inline-block w-[6px] h-[6px] rounded-full ${
          status === 'on_track' ? 'bg-jm-green' : status === 'at_risk' ? 'bg-gold' : 'bg-status-off-track'
        }`}
      />
      {config.label}
    </span>
  );
}

export function StaffingBadge({ health, tooltip }: { health: StaffingHealth; tooltip: string }) {
  const config = staffingConfig[health];

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-[6px] text-[length:var(--text-caption)] font-semibold cursor-help ${config.color}`}
    >
      <span
        className={`inline-block w-[6px] h-[6px] rounded-full ${
          health === 'healthy' ? 'bg-jm-green' : health === 'concern' ? 'bg-gold' : 'bg-status-off-track'
        }`}
      />
      {config.label}
    </span>
  );
}
