import type { SeniorOfficer } from '@/lib/types';

export const opmLeadership: SeniorOfficer[] = [
  {
    name: 'Most Hon. Andrew Holness, ON, MP',
    title: 'Prime Minister',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Floyd Green, MP',
    title: 'Minister without Portfolio, OPM',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Ambassador Douglas Saunders',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '15000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const opmEntityOfficers: Record<string, SeniorOfficer> = {
  jis: {
    name: 'Donna-Marie Rowe',
    title: 'CEO, Jamaica Information Service',
    role: 'head_officer',
    headCode: '15010',
    avatarUrl: '/avatars/placeholder.svg',
  },
  post_telecom: {
    name: 'Postmaster General',
    title: 'Post and Telecommunications Department',
    role: 'head_officer',
    headCode: '15039',
    avatarUrl: '/avatars/placeholder.svg',
  },
  nira: {
    name: 'Director, NIRA',
    title: 'National Identification & Registration Authority',
    role: 'head_officer',
    headCode: '15063',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
