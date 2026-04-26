import type { SeniorOfficer } from '@/lib/types';

export const labourLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Pearnel Charles Jr., MP, JP',
    title: 'Minister of Labour & Social Security',
    role: 'minister',
    avatarUrl: '/avatars/pearnel-charles-jr.jpeg',
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
