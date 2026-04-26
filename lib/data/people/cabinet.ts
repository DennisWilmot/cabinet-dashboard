import type { SeniorOfficer } from '@/lib/types';

export const cabinetLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Audrey Sewell, OJ, CD, JP',
    title: 'Cabinet Secretary & Head of the Public Service',
    role: 'ps',
    headCode: '16000',
    avatarUrl: '/avatars/audrey-sewell.jpg',
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
