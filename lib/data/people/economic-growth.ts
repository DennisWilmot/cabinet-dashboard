import type { SeniorOfficer } from '@/lib/types';

export const economicGrowthLeadership: SeniorOfficer[] = [
  {
    name: 'Most Hon. Andrew Holness, ON, PC, MP',
    title: 'Prime Minister & Minister of Economic Growth and Infrastructure Development',
    role: 'minister',
    avatarUrl: '/avatars/andrew-holness.jpg',
    profile: {
      bio: 'Prime Minister of Jamaica since 2016, concurrently holding the Economic Growth and Infrastructure Development portfolio. Member of Parliament for St. Andrew West Central.',
      constituency: 'St. Andrew West Central',
      officeLocation: '1 Devon Road, Kingston 10',
    },
  },
  {
    name: 'Hon. Robert Montague, MP',
    title: 'Minister w/o Portfolio – Land Titling & Settlements',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Robert Morgan, MP',
    title: 'Minister w/o Portfolio – Works',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Arlene Williams',
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
