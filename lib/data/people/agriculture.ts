import type { SeniorOfficer } from '@/lib/types';

export const agricultureLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Floyd Green, MP',
    title: 'Minister of Agriculture, Fisheries & Mining',
    role: 'minister',
    avatarUrl: '/avatars/floyd-green.jpg',
    profile: {
      bio: 'Minister of Agriculture, Fisheries and Mining since 2020. Member of Parliament for St. Elizabeth South Western. Attorney-at-law and former State Minister in the Ministry of Education.',
      constituency: 'St. Elizabeth South Western',
      officeLocation: '188 Spanish Town Road, Kingston 11',
    },
  },
  {
    name: 'Hon. Franklin Witter, MP',
    title: 'Minister of State, Agriculture, Fisheries & Mining',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mr. Dermon Spence, JP',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '51000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const agricultureEntityOfficers: Record<string, SeniorOfficer> = {
  rada: {
    name: 'CEO, RADA',
    title: 'Rural Agricultural Development Authority',
    role: 'head_officer',
    headCode: '51000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
