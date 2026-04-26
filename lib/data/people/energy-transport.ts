import type { SeniorOfficer } from '@/lib/types';

export const energyTransportLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Daryl Vaz, MP',
    title: 'Minister of Transport, Telecommunications & Energy',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Carol Palmer, CD, JP',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '69000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const energyTransportEntityOfficers: Record<string, SeniorOfficer> = {
  transport_authority: {
    name: 'Managing Director, TA',
    title: 'Transport Authority',
    role: 'head_officer',
    headCode: '69000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
