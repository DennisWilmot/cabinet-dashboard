import type { SeniorOfficer } from '@/lib/types';

export const healthLeadership: SeniorOfficer[] = [
  {
    name: 'Dr. the Hon. Christopher Tufton, CD, MP',
    title: 'Minister of Health and Wellness',
    role: 'minister',
    avatarUrl: '/avatars/christopher-tufton.jpeg',
  },
  {
    name: 'Hon. Krystal Lee, MP',
    title: 'State Minister, Health and Wellness',
    role: 'state_minister',
    avatarUrl: '/avatars/krystal-lee.jpg',
  },
  {
    name: 'Mr. Errol C. Greene, OD, JP',
    title: 'Permanent Secretary, Ministry of Health and Wellness',
    role: 'ps',
    headCode: '42000',
    avatarUrl: '/avatars/errol-greene.jpg',
  },
  {
    name: 'Dr. Jacquiline Bisasor-McKenzie, CD',
    title: 'Chief Medical Officer',
    role: 'director',
    headCode: '42000',
    avatarUrl: '/avatars/jacquiline-bisasor-mckenzie.jpg',
  },
];

export const healthEntityOfficers: Record<string, SeniorOfficer> = {
  rha: {
    name: 'Mr. Errol C. Greene, OD, JP',
    title: 'Permanent Secretary (oversight of RHAs)',
    role: 'head_officer',
    headCode: '42000',
    avatarUrl: '/avatars/errol-greene.jpg',
  },
  core_ministry: {
    name: 'Dr. Jacquiline Bisasor-McKenzie, CD',
    title: 'Chief Medical Officer',
    role: 'head_officer',
    headCode: '42000',
    avatarUrl: '/avatars/jacquiline-bisasor-mckenzie.jpg',
  },
  bellevue: {
    name: 'Administrator, Bellevue Hospital',
    title: 'Bellevue Hospital',
    role: 'head_officer',
    headCode: '42034',
    avatarUrl: '/avatars/placeholder.svg',
  },
  govt_chemist: {
    name: 'Government Chemist',
    title: 'Department of Government Chemist',
    role: 'head_officer',
    headCode: '42035',
    avatarUrl: '/avatars/placeholder.svg',
  },
  ncda: {
    name: 'Paulette Spencer-Smith',
    title: 'Executive Director, NCDA',
    role: 'head_officer',
    headCode: '42062',
    avatarUrl: '/avatars/placeholder.svg',
  },
};
