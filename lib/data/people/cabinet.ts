import type { SeniorOfficer } from '@/lib/types';

export const cabinetLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Desmond McKenzie, MP',
    title: 'Minister without Portfolio, Office of the Cabinet',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Cabinet Secretary',
    title: 'Cabinet Secretary',
    role: 'ps',
    headCode: '16000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const cabinetEntityOfficers: Record<string, SeniorOfficer> = {
  mind: {
    name: 'Executive Director, MIND',
    title: 'Management Institute for National Development',
    role: 'head_officer',
    headCode: '16049',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
