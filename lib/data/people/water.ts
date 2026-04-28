import type { SeniorOfficer } from '@/lib/types';

export const waterLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Matthew Samuda, MP',
    title: 'Minister of Water, Environment & Climate Change',
    role: 'minister',
    avatarUrl: '/avatars/matthew-samuda.jpg',
    profile: {
      bio: 'Minister without Portfolio in the Ministry of Economic Growth (Water, Environment & Climate Change) since 2020. Member of Parliament for St. Andrew North Western. Business executive and former Senator.',
      constituency: 'St. Andrew North Western',
      officeLocation: '16A Half Way Tree Road, Kingston 5',
    },
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
