import type { SeniorOfficer } from '@/lib/types';

export const opmLeadership: SeniorOfficer[] = [
  {
    name: 'Most Hon. Andrew Holness, ON, PC, MP',
    title: 'Prime Minister',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Ambassador Audrey Marks, MP',
    title: 'Minister w/o Portfolio – Efficiency, Innovation & Digital Transformation',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Andrew Wheatley, MP',
    title: 'Minister w/o Portfolio – Science, Technology & Special Projects',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Sen. Abka Fitz-Henley',
    title: 'Minister of State, Office of the Prime Minister',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Ambassador Rocky Meade, CD, JP, PhD',
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
