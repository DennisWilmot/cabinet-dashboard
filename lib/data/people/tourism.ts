import type { SeniorOfficer } from '@/lib/types';

export const tourismLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Edmund Bartlett, OJ, CD, MP',
    title: 'Minister of Tourism',
    role: 'minister',
    avatarUrl: '/avatars/edmund-bartlett.jpg',
    profile: {
      bio: 'Minister of Tourism since 2016. Member of Parliament for East Portland. Globally recognised tourism leader who established the Global Tourism Resilience & Crisis Management Centre.',
      constituency: 'East Portland',
      officeLocation: '64 Knutsford Boulevard, Kingston 5',
    },
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
