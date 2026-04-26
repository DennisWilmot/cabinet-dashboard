import type { SeniorOfficer } from '@/lib/types';

export const waterLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Matthew Samuda, MP',
    title: 'Minister of Water, Environment & Climate Change',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, MWECC',
    role: 'ps',
    headCode: '22000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const waterEntityOfficers: Record<string, SeniorOfficer> = {
  forestry: {
    name: 'Conservator of Forests',
    title: 'Forestry Department',
    role: 'head_officer',
    headCode: '22046',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
