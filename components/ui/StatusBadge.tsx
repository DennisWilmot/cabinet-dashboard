'use client';

import { useState, useRef, useEffect } from 'react';
import type { Status, StaffingHealth } from '@/lib/types';

const statusConfig: Record<Status, { label: string; color: string; dot: string }> = {
  on_track: { label: 'On Track', color: 'text-jm-green-dark', dot: 'bg-jm-green' },
  at_risk: { label: 'At Risk', color: 'text-gold-dark', dot: 'bg-gold' },
  off_track: { label: 'Off Track', color: 'text-status-off-track', dot: 'bg-status-off-track' },
};

const staffingConfig: Record<StaffingHealth, { label: string; color: string; dot: string }> = {
  healthy: { label: 'Healthy', color: 'text-jm-green-dark', dot: 'bg-jm-green' },
  concern: { label: 'Concern', color: 'text-gold-dark', dot: 'bg-gold' },
  critical: { label: 'Critical', color: 'text-status-off-track', dot: 'bg-status-off-track' },
};

function Tooltip({ text, visible, triggerRef }: { text: string; visible: boolean; triggerRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState<'bottom' | 'top'>('bottom');
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos(rect.top > 260 ? 'top' : 'bottom');
    }
  }, [visible, triggerRef]);

  if (!visible) return null;

  return (
    <div
      ref={tipRef}
      className={`absolute z-[100] w-64 sm:w-72 px-[var(--space-md)] py-[var(--space-sm)] bg-sidebar text-text-inverse rounded-lg shadow-lg text-[length:var(--text-micro)] leading-relaxed pointer-events-none ${
        pos === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
      } right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2`}
    >
      {text}
    </div>
  );
}

export function StatusBadge({ status, tooltip, size = 'md' }: { status: Status; tooltip: string; size?: 'sm' | 'md' }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'text-[length:var(--text-body)]' : 'text-[length:var(--text-h3)]';

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-center gap-[6px] font-semibold cursor-help ${config.color} ${sizeClass}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      role="status"
    >
      <span className={`inline-block w-[8px] h-[8px] rounded-full ${config.dot}`} />
      {config.label}
      <Tooltip text={tooltip} visible={show} triggerRef={ref} />
    </span>
  );
}

export function StaffingBadge({ health, tooltip }: { health: StaffingHealth; tooltip: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const config = staffingConfig[health];

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-center gap-[6px] text-[length:var(--text-body)] font-semibold cursor-help ${config.color}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      role="status"
    >
      <span className={`inline-block w-[8px] h-[8px] rounded-full ${config.dot}`} />
      {config.label}
      <Tooltip text={tooltip} visible={show} triggerRef={ref} />
    </span>
  );
}
