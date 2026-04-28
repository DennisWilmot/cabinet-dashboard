import type { SeniorOfficer } from '@/lib/types';

export const cultureLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Olivia Grange, CD, MP',
    title: 'Minister of Culture, Gender, Entertainment & Sport',
    role: 'minister',
    avatarUrl: '/avatars/olivia-grange.jpg',
    profile: {
      bio: 'Minister of Culture, Gender, Entertainment and Sport since 2016. Member of Parliament for St. Catherine Central. One of Jamaica\'s longest-serving female parliamentarians with extensive arts and culture advocacy.',
      constituency: 'St. Catherine Central',
      officeLocation: '4-6 Trafalgar Road, Kingston 10',
    },
  },
  {
    name: 'Hon. Kerensia Morrison, MP',
    title: 'Minister of State, Culture, Gender, Entertainment & Sport',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mr. Denzil Thorpe',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '46000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const cultureEntityOfficers: Record<string, SeniorOfficer> = {
  jcdc: {
    name: 'Executive Director, JCDC',
    title: 'Jamaica Cultural Development Commission',
    role: 'head_officer',
    headCode: '46000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
