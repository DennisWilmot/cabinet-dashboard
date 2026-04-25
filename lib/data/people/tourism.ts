import type { SeniorOfficer } from '@/lib/types';

export const tourismLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Edmund Bartlett, MP',
    title: 'Minister of Tourism',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Jennifer Griffith',
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
