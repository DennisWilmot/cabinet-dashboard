import type { SeniorOfficer } from '@/lib/types';

export const tourismLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Edmund Bartlett, OJ, CD, MP',
    title: 'Minister of Tourism',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Tova Hamilton, MP',
    title: 'Minister of State, Tourism',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Jennifer Griffith, CD, JP',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '17000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const tourismEntityOfficers: Record<string, SeniorOfficer> = {
  jtb: {
    name: 'Donovan White',
    title: 'Director of Tourism, Jamaica Tourist Board',
    role: 'head_officer',
    headCode: '17000',
    avatarUrl: '/avatars/placeholder.svg',
  },
  tpdco: {
    name: 'Director, TPDCO',
    title: 'Tourism Product Development Company',
    role: 'head_officer',
    headCode: '17000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
