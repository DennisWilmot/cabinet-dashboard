import type { SeniorOfficer } from './types';

// Tier 1 — Ministry leadership (ministry summary page)
export const mofLeadership: SeniorOfficer[] = [
  {
    name: 'Hon. Fayval Williams, MP',
    title: 'Minister of Finance & the Public Service',
    role: 'minister',
    avatarUrl: '/avatars/fayval-williams.jpeg',
  },
  {
    name: 'Hon. Zavia Mayne, MP',
    title: 'State Minister, Finance & the Public Service',
    role: 'state_minister',
    avatarUrl: '/avatars/zavia-mayne.jpg',
  },
  {
    name: 'Ms. Darlene Morrison, CD',
    title: 'Financial Secretary',
    role: 'ps',
    headCode: '20000',
    avatarUrl: '/avatars/darlene-morrison.jpg',
  },
  {
    name: 'Dian Black',
    title: 'Deputy Financial Secretary',
    role: 'deputy_ps',
    headCode: '20000',
    avatarUrl: '/avatars/dian-black.png',
  },
];

// Tier 2 — Entity heads (shown on operational programme cards)
export const entityOfficers: Record<string, SeniorOfficer> = {
  taj: {
    name: 'Ainsley Powell, CD',
    title: 'Commissioner General, TAJ',
    role: 'head_officer',
    headCode: '20056',
    avatarUrl: '/avatars/ainsley-powell.jpg',
  },
  customs: {
    name: 'Commissioner of Customs',
    title: 'Jamaica Customs Agency',
    role: 'head_officer',
    headCode: '20012',
    avatarUrl: '/avatars/placeholder.svg',
  },
  accountant_general: {
    name: 'Accountant General',
    title: 'Accountant General\u2019s Department',
    role: 'head_officer',
    headCode: '20011',
    avatarUrl: '/avatars/placeholder.svg',
  },
  pioj: {
    name: 'Dr. Wayne Henry',
    title: 'Director General, PIOJ',
    role: 'head_officer',
    headCode: '20000',
    avatarUrl: '/avatars/wayne-henry.jpg',
  },
  statin: {
    name: 'Leesha Delatie-Budair',
    title: 'Director General, STATIN',
    role: 'head_officer',
    headCode: '20000',
    avatarUrl: '/avatars/leesha-delatie-budair.jpg',
  },
  fid: {
    name: 'Director, FID',
    title: 'Financial Investigations Division',
    role: 'head_officer',
    headCode: '20060',
    avatarUrl: '/avatars/placeholder.svg',
  },
  rpd: {
    name: 'Director, RPD',
    title: 'Revenue Protection Division',
    role: 'head_officer',
    headCode: '20061',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
