import type { SeniorOfficer } from '@/lib/types';

export const agricultureLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Floyd Green, MP',
    title: 'Minister of Agriculture, Fisheries & Mining',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Franklin Witter, MP',
    title: 'State Minister, Agriculture',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Dermon Spence',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '51000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const agricultureEntityOfficers: Record<string, SeniorOfficer> = {
  rada: {
    name: 'CEO, RADA',
    title: 'Rural Agricultural Development Authority',
    role: 'head_officer',
    headCode: '51000',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
