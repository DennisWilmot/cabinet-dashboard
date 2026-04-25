import type { SeniorOfficer } from '@/lib/types';

export const economicGrowthLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Everald Warmington, MP',
    title: 'Minister of Economic Growth & Infrastructure',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Pearnel Charles Jr., MP',
    title: 'State Minister, Economic Growth',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Audrey Sewell',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '19000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const economicGrowthEntityOfficers: Record<string, SeniorOfficer> = {
  nwa: {
    name: 'E.G. Hunter',
    title: 'CEO, National Works Agency',
    role: 'head_officer',
    headCode: '19050',
    avatarUrl: '/avatars/placeholder.svg',
  },
  nla: {
    name: 'Elizabeth Dwyer',
    title: 'CEO, National Land Agency',
    role: 'head_officer',
    headCode: '19047',
    avatarUrl: '/avatars/placeholder.svg',
  },
  nepa: {
    name: 'CEO, NEPA',
    title: 'National Environment & Planning Agency',
    role: 'head_officer',
    headCode: '19048',
    avatarUrl: '/avatars/placeholder.svg',
  },
  forestry: {
    name: 'Conservator of Forests',
    title: 'Forestry Department',
    role: 'head_officer',
    headCode: '19046',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
