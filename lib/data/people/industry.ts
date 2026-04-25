import type { SeniorOfficer } from '@/lib/types';

export const industryLeadership: SeniorOfficer[] = [
  {
    name: 'Senator Hon. Aubyn Hill',
    title: 'Minister of Industry, Investment & Commerce',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, MIIC',
    role: 'ps',
    headCode: '53000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const industryEntityOfficers: Record<string, SeniorOfficer> = {
  registrar: {
    name: 'Registrar of Companies',
    title: 'Office of the Registrar of Companies',
    role: 'head_officer',
    headCode: '53038',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
