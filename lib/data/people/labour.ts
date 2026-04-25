import type { SeniorOfficer } from '@/lib/types';

export const labourLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Karl Samuda, MP',
    title: 'Minister of Labour & Social Security',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Zavia Mayne, MP',
    title: 'State Minister, Labour',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Colette Roberts-Risden',
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
