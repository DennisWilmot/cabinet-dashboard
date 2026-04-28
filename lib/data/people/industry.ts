import type { SeniorOfficer } from '@/lib/types';

export const industryLeadership: SeniorOfficer[] = [
  {
    name: 'Senator Hon. Aubyn Hill',
    title: 'Minister of Industry, Investment & Commerce',
    role: 'minister',
    avatarUrl: '/avatars/aubyn-hill.jpg',
    profile: {
      bio: 'Minister of Industry, Investment and Commerce since 2020. Senator and experienced private sector executive who served as Chairman of the Economic Growth Council before entering cabinet.',
      constituency: 'Senator (Appointed)',
      officeLocation: '4 St. Lucia Avenue, Kingston 5',
    },
  },
  {
    name: 'Hon. Delano Seiveright, MP',
    title: 'Minister of State, Industry, Investment & Commerce',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Sancia Bennett Templer',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '53000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const industryEntityOfficers: Record<string, SeniorOfficer> = {
  registrar: {
    name: 'Registrar of Companies',
    title: 'Office of the Registrar of Companies',
    role: 'head_officer',
    headCode: '53038',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
