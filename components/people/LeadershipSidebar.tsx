import { PersonAvatar } from '@/components/ui/PersonAvatar';
import type { SeniorOfficer } from '@/lib/types';

export function LeadershipSidebar({ officers }: { officers: SeniorOfficer[] }) {
  return (
    <div>
      <h3 className="text-[length:var(--text-caption)] font-semibold text-text-secondary uppercase tracking-widest mb-[var(--space-lg)]">
        Leadership
      </h3>
      <div className="space-y-[var(--space-base)]">
        {officers.map((officer, i) => (
          <div key={officer.name}>
            <PersonAvatar
              name={officer.name}
              title={officer.title}
              avatarUrl={officer.avatarUrl}
              size={i === 0 ? 'md' : 'sm'}
            />
            {i === 0 && <div className="border-b border-border-default mt-[var(--space-base)]" />}
          </div>
        ))}
      </div>
    </div>
  );
}
