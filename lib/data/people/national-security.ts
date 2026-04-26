import type { SeniorOfficer } from '@/lib/types';

export const nationalSecurityLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Dr. Horace Chang, OJ, CD, MP',
    title: 'Deputy PM & Minister of National Security and Peace',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Hon. Juliet Cuthbert-Flynn, MP',
    title: 'Minister of State, National Security and Peace',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Ambassador Alison Stone Roofe',
    title: 'Permanent Secretary',
    role: 'ps',
    headCode: '26000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const nationalSecurityEntityOfficers: Record<string, SeniorOfficer> = {
  jcf: {
    name: 'Dr. Kevin Blake, CD, JP',
    title: 'Commissioner of Police',
    role: 'head_officer',
    headCode: '26022',
    avatarUrl: '/avatars/placeholder.svg',
  },
  corrections: {
    name: 'Commissioner of Corrections',
    title: 'Department of Correctional Services',
    role: 'head_officer',
    headCode: '26024',
    avatarUrl: '/avatars/placeholder.svg',
  },
  pica: {
    name: 'CEO, PICA',
    title: 'Passport, Immigration & Citizenship Agency',
    role: 'head_officer',
    headCode: '26053',
    avatarUrl: '/avatars/placeholder.svg',
  },
  forensics: {
    name: 'Director, IFSLM',
    title: 'Institute of Forensic Science & Legal Medicine',
    role: 'head_officer',
    headCode: '26057',
    avatarUrl: '/avatars/placeholder.svg',
  },
  moca: {
    name: 'Director General, MOCA',
    title: 'Major Organised Crime & Anti-Corruption Agency',
    role: 'head_officer',
    headCode: '26059',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
