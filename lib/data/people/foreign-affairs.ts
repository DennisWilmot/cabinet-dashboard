import type { SeniorOfficer } from '@/lib/types';

export const foreignAffairsLeadership: SeniorOfficer[] = [
  {
    name: 'Senator Hon. Kamina Johnson Smith',
    title: 'Minister of Foreign Affairs & Foreign Trade',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, MFAFT',
    role: 'ps',
    headCode: '30000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const foreignAffairsEntityOfficers: Record<string, SeniorOfficer> = {};
