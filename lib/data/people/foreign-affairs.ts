import type { SeniorOfficer } from '@/lib/types';

export const foreignAffairsLeadership: SeniorOfficer[] = [
  {
    name: 'Senator Hon. Kamina Johnson Smith',
    title: 'Minister of Foreign Affairs & Foreign Trade',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Alando Terrelonge, MP',
    title: 'Minister of State, Foreign Affairs & Foreign Trade',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Ambassador Sheila Sealy Monteith, CD, JP',
    title: 'Permanent Secretary & Head of the Foreign Service',
    role: 'ps',
    headCode: '30000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const foreignAffairsEntityOfficers: Record<string, SeniorOfficer> = {};
