import type { SeniorOfficer } from '@/lib/types';

export const educationLeadership: SeniorOfficer[] = [
  {
    name: 'Sen. Dr. the Hon. Dana Morris Dixon',
    title: 'Minister of Education, Skills, Youth and Information',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Rhoda Moy Crawford, MP',
    title: 'State Minister, Education, Skills, Youth and Information',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Dr. Kasan Troupe, JP',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '41000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const educationEntityOfficers: Record<string, SeniorOfficer> = {
  jis: {
    name: 'Celia Lindsay',
    title: 'Acting Chief Executive Officer, Jamaica Information Service',
    role: 'head_officer',
    headCode: '41010',
    avatarUrl: '/avatars/placeholder.svg',
  },
  child_protection: {
    name: 'Laurette Adams-Thomas',
    title: 'Chief Executive Officer, Child Protection and Family Services Agency',
    role: 'head_officer',
    headCode: '41051',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
