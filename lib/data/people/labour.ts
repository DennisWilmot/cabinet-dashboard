import type { SeniorOfficer } from '@/lib/types';

export const labourLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Pearnel Charles Jr., MP, JP',
    title: 'Minister of Labour & Social Security',
    role: 'minister',
    avatarUrl: '/avatars/pearnel-charles-jr.jpeg',
    profile: {
      bio: 'Minister of Labour and Social Security since 2022. Member of Parliament for Clarendon South Eastern. Attorney-at-law who previously served as Minister of Housing and Minister of Foreign Affairs.',
      constituency: 'Clarendon South Eastern',
      officeLocation: '1F North Street, Kingston',
    },
  },
  {
    name: 'Hon. Donovan Williams, MP',
    title: 'Minister of State, Labour & Social Security',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Colette Roberts Risden, CD',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '40000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const labourEntityOfficers: Record<string, SeniorOfficer> = {
  path: {
    name: 'Programme Manager, PATH',
    title: 'Programme of Advancement Through Health & Education',
    role: 'head_officer',
    headCode: '40000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
