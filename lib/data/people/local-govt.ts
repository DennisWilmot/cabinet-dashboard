import type { SeniorOfficer } from '@/lib/types';

export const localGovtLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Desmond McKenzie, CD, MP',
    title: 'Minister of Local Government and Rural Development',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Delroy Williams, MP',
    title: 'Minister of State, Local Government and Community Development',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Marsha Henry-Martin',
    title: 'Permanent Secretary',
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
