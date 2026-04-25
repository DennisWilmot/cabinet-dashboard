import type { SeniorOfficer } from '@/lib/types';

export const justiceLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Marlene Malahoo Forte, KC, MP',
    title: 'Minister of Legal & Constitutional Affairs',
    role: 'minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Permanent Secretary',
    title: 'Permanent Secretary, Ministry of Justice',
    role: 'ps',
    headCode: '28000',
    avatarUrl: '/avatars/placeholder.svg',
  },
];

export const justiceEntityOfficers: Record<string, SeniorOfficer> = {
  judiciary: {
    name: 'Hon. Chief Justice Bryan Sykes',
    title: 'Chief Justice, Supreme Court',
    role: 'head_officer',
    headCode: '28058',
    avatarUrl: '/avatars/placeholder.svg',
  },
  dpp: {
    name: 'Director of Public Prosecutions',
    title: 'Office of the DPP',
    role: 'head_officer',
    headCode: '28025',
    avatarUrl: '/avatars/placeholder.svg',
  },
  ag: {
    name: 'Attorney General',
    title: "Attorney General's Department",
    role: 'head_officer',
    headCode: '28031',
    avatarUrl: '/avatars/placeholder.svg',
  },
  admin_general: {
    name: 'Administrator General',
    title: "Administrator General's Department",
    role: 'head_officer',
    headCode: '28030',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
