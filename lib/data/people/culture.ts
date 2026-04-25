import type { SeniorOfficer } from '@/lib/types';

export const cultureLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Olivia Grange, MP',
    title: 'Minister of Culture, Gender, Entertainment & Sport',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, MCGES',
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
