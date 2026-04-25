import type { MilestoneStatus } from '@/lib/types';

interface MilestoneItem {
  name: string;
  status: MilestoneStatus;
  plannedDate: string;
  weightPct: number;
}

const dotColors: Record<MilestoneStatus, string> = {
  completed: 'bg-jm-green',
  in_progress: 'bg-gold',
  upcoming: 'bg-border-strong',
  delayed: 'bg-status-off-track',
  cancelled: 'bg-border-default',
};

export function MilestoneTrack({ milestones }: { milestones: MilestoneItem[] }) {
  return (
    <div className="space-y-[var(--space-md)]">
      <div className="flex items-center">
        {milestones.map((m, i) => (
          <div key={m.name} className="flex items-center" style={{ flex: m.weightPct }}>
            <div
              title={`${m.name} — ${m.status.replace('_', ' ')} (${m.weightPct}%)`}
              className={`w-3 h-3 rounded-full flex-shrink-0 cursor-help ${dotColors[m.status]} ${
                m.status === 'in_progress' ? 'ring-2 ring-gold/30' : m.status === 'delayed' ? 'ring-2 ring-status-off-track/20' : ''
              }`}
            />
            {i < milestones.length - 1 && (
              <div className={`h-[2px] flex-1 mx-1 ${m.status === 'completed' ? 'bg-jm-green/40' : 'bg-border-default'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="space-y-[var(--space-xs)]">
        {milestones.map(m => (
          <div key={m.name} className="flex items-center gap-[var(--space-sm)] text-[length:var(--text-body)]">
            <span className={`w-[8px] h-[8px] rounded-full flex-shrink-0 ${dotColors[m.status]}`} />
            <span className="text-text-secondary truncate flex-1">{m.name}</span>
            <span className="text-text-secondary/60 flex-shrink-0">{m.weightPct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
