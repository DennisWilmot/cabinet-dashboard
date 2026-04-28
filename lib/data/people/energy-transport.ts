import type { SeniorOfficer } from '@/lib/types';

export const energyTransportLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Daryl Vaz, MP',
    title: 'Minister of Transport, Telecommunications & Energy',
    role: 'minister',
    avatarUrl: '/avatars/daryl-vaz.jpeg',
    profile: {
      bio: 'Minister of Science, Energy, Telecommunications and Transport since 2022. Member of Parliament for Portland Western. Businessman and veteran parliamentarian who has served in multiple ministerial roles.',
      constituency: 'Portland Western',
      officeLocation: 'PCJ Building, 36 Trafalgar Road, Kingston 10',
    },
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
