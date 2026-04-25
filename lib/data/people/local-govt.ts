import type { SeniorOfficer } from '@/lib/types';

export const localGovtLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Desmond McKenzie, MP',
    title: 'Minister of Local Government & Community Development',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, MLGCD',
    role: 'ps',
    headCode: '72000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const localGovtEntityOfficers: Record<string, SeniorOfficer> = {
  sdc: {
    name: 'Executive Director, SDC',
    title: 'Social Development Commission',
    role: 'head_officer',
    headCode: '72000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
