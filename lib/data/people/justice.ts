import type { SeniorOfficer } from '@/lib/types';

export const justiceLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Delroy Chuck, KC, MP',
    title: 'Minister of Legal and Constitutional Affairs',
    role: 'minister',
    avatarUrl: '/avatars/delroy-chuck.png',
    profile: {
      bio: 'Minister of Justice and Legal and Constitutional Affairs since 2016. Member of Parliament for St. Andrew North Eastern. King\'s Counsel and veteran legislator with over 30 years in parliament.',
      constituency: 'St. Andrew North Eastern',
      officeLocation: '61 Constant Spring Road, Kingston 10',
    },
  },
  {
    name: 'Hon. Marisa Dalrymple-Philibert, MP',
    title: 'Minister of State, Justice and Constitutional Affairs',
    role: 'state_minister',
    avatarUrl: '/avatars/placeholder.svg',
  },
  {
    name: 'Mrs. Grace Ann Stewart McFarlane',
    title: 'Permanent Secretary',
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
    name: 'Derrick McKoy',
    title: 'Attorney General',
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
