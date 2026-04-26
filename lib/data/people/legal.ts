import type { SeniorOfficer } from '@/lib/types';

export const legalLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Delroy Chuck, KC, MP',
    title: 'Minister of Justice, Legal and Constitutional Affairs',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mr. Wayne Robertson, JP',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '27000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const legalEntityOfficers: Record<string, SeniorOfficer> = {};
