import type { SeniorOfficer } from '@/lib/types';

export const legalLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Marlene Malahoo Forte, KC, MP',
    title: 'Minister of Legal & Constitutional Affairs',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, Ministry of Legal Affairs',
    role: 'ps',
    headCode: '27000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const legalEntityOfficers: Record<string, SeniorOfficer> = {};
