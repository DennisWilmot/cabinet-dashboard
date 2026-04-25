import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { labourLeadership, labourEntityOfficers } from '../people/labour';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (3)                                             */
/* ------------------------------------------------------------------ */

const pathTransfers: Obligation = {
  id: 'path_transfers',
  type: 'public_body_transfer',
  name: 'PATH Cash Transfers',
  headCode: '40000',
  allocation: 13000,
  priorYearAllocation: 12200,
  paid: 6500,
  paymentStatus: 'current',
  actuals: snap([1083, 2167, 3250, 4333, 5417, 6500]),
  priorYearActuals: pySnap(11900, W_LIN),
  details: {
    entities: [
      { name: 'PATH Conditional Cash Transfers', budget: 11200, transferred: 5600, status: 'current' },
      { name: 'PATH School Feeding', budget: 1200, transferred: 600, status: 'current' },
      { name: 'PATH Step-to-Work', budget: 600, transferred: 300, status: 'current' },
    ],
    utilizationPct: 50.0,
  },
};

const nisContributions: Obligation = {
  id: 'nis_contributions',
  type: 'public_body_transfer',
  name: 'NIS Employer Contributions',
  headCode: '40000',
  allocation: 1200,
  priorYearAllocation: 1100,
  paid: 600,
  paymentStatus: 'current',
  actuals: snap([100, 200, 300, 400, 500, 600]),
  priorYearActuals: pySnap(1070, W_LIN),
  details: {
    entities: [
      { name: 'National Insurance Scheme – Employer Share', budget: 1200, transferred: 600, status: 'current' },
    ],
    utilizationPct: 50.0,
  },
};

const pensionTransfers: Obligation = {
  id: 'pension_transfers',
  type: 'pension',
  name: 'Pension Transfers',
  headCode: '40000',
  allocation: 580,
  priorYearAllocation: 530,
  paid: 290,
  paymentStatus: 'current',
  actuals: snap([48, 97, 145, 193, 242, 290]),
  priorYearActuals: pySnap(515, W_LIN),
  details: {
    pensionerCount: 2340,
    byCategory: [
      { category: 'Civil Service (MLSS)', count: 1480 },
      { category: 'Former PATH Staff', count: 520 },
      { category: 'Other', count: 340 },
    ],
    arrearsOutstanding: 0,
    yoyGrowth: 9.4,
  },
};

const allObligations: Obligation[] = [pathTransfers, nisContributions, pensionTransfers];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                          */
/* ------------------------------------------------------------------ */

const pathAdmin: OperationalEntity = {
  id: 'path_admin',
  name: 'PATH Administration',
  headCode: '40000',
  allocation: 2600,
  priorYearAllocation: 2700,
  spent: 1274,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 420, filledPosts: 370, vacantPosts: 50, vacancyRate: 11.9 },
  kpis: [
    { name: 'PATH Beneficiaries Served', type: 'outcome', unit: 'count', target: 350000, actual: 348500, priorYearActual: 340000 },
    { name: 'Compliance Verification Rate', type: 'output', unit: '%', target: 95, actual: 88, priorYearActual: 85 },
    { name: 'Payment Timeliness', type: 'output', unit: '%', target: 98, actual: 96, priorYearActual: 94 },
  ],
  actuals: snap([200, 418, 630, 850, 1065, 1274]),
  priorYearActuals: pySnap(2630, W_LIN),
  headOfficer: labourEntityOfficers.path,
};

const employmentServices: OperationalEntity = {
  id: 'employment_services',
  name: 'Employment Services Bureau',
  headCode: '40000',
  allocation: 1400,
  priorYearAllocation: 1500,
  spent: 700,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 180, filledPosts: 155, vacantPosts: 25, vacancyRate: 13.9 },
  kpis: [
    { name: 'Job Placements Facilitated', type: 'output', unit: 'count', target: 12000, actual: 5200, priorYearActual: 10800 },
    { name: 'Employment Rate', type: 'outcome', unit: '%', target: 94, actual: 92.3, priorYearActual: 91.5 },
    { name: 'Training Programmes Completed', type: 'output', unit: 'count', target: 8000, actual: 3100, priorYearActual: 7200 },
  ],
  actuals: snap([108, 225, 340, 462, 580, 700]),
  priorYearActuals: pySnap(1460, W_LIN),
};

const labourRelations: OperationalEntity = {
  id: 'labour_relations',
  name: 'Labour Relations & Industrial Safety',
  headCode: '40000',
  allocation: 1100,
  priorYearAllocation: 1200,
  spent: 539,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 160, filledPosts: 138, vacantPosts: 22, vacancyRate: 13.8 },
  kpis: [
    { name: 'Disputes Resolved', type: 'output', unit: 'count', target: 600, actual: 265, priorYearActual: 540 },
    { name: 'Workplace Inspections', type: 'output', unit: 'count', target: 2400, actual: 980, priorYearActual: 2100 },
    { name: 'Resolution Turnaround', type: 'outcome', unit: 'days', target: 30, actual: 38, priorYearActual: 35 },
  ],
  actuals: snap([85, 176, 265, 358, 449, 539]),
  priorYearActuals: pySnap(1170, W_LIN),
};

const socialSecurity: OperationalEntity = {
  id: 'social_security',
  name: 'Social Security Division',
  headCode: '40000',
  allocation: 850,
  priorYearAllocation: 908,
  spent: 416,
  utilizationPct: 48.9,
  staffing: { approvedPosts: 120, filledPosts: 105, vacantPosts: 15, vacancyRate: 12.5 },
  kpis: [
    { name: 'NIS Claims Processed', type: 'output', unit: 'count', target: 45000, actual: 20100, priorYearActual: 41000 },
    { name: 'Claims Processing Time', type: 'outcome', unit: 'days', target: 14, actual: 18, priorYearActual: 20 },
  ],
  actuals: snap([66, 136, 206, 278, 348, 416]),
  priorYearActuals: pySnap(880, W_LIN),
};

const labourCore: OperationalEntity = {
  id: 'core_ministry',
  name: 'Core Ministry Administration',
  headCode: '40000',
  allocation: 551,
  priorYearAllocation: 550,
  spent: 270,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 85, filledPosts: 74, vacantPosts: 11, vacancyRate: 12.9 },
  kpis: [
    { name: 'Budget Execution Rate', type: 'output', unit: '%', target: 95, actual: 49, priorYearActual: 92 },
    { name: 'Policy Reviews Completed', type: 'output', unit: 'count', target: 8, actual: 3, priorYearActual: 7 },
  ],
  actuals: snap([42, 88, 133, 180, 225, 270]),
  priorYearActuals: pySnap(535, W_LIN),
};

const allEntities: OperationalEntity[] = [
  pathAdmin, employmentServices, labourRelations, socialSecurity, labourCore,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                              */
/* ------------------------------------------------------------------ */

const pathModernization: CapitalProject = {
  id: 'path_modernization',
  code: '40601',
  name: 'PATH Modernization Programme',
  currentYearBudget: 520,
  currentYearSpent: 78,
  totalProjectCost: 1850,
  cumulativeSpend: 420,
  financialProgressPct: 22.7,
  physicalProgressPct: 25,
  startDate: '2025-01-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Digital beneficiary management system procurement completed. Integration with NIS database in progress.',
  milestones: [
    { name: 'System requirements & procurement', plannedDate: '2025-09-30', actualDate: '2025-10-15', status: 'completed', weightPct: 20 },
    { name: 'Digital beneficiary registry', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 30 },
    { name: 'Mobile payment integration', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Full system rollout', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 1100, disbursed: 320 },
    { source: 'World Bank', committed: 750, disbursed: 100, nextTrancheDate: '2026-12-15', conditions: 'Digital registry pilot completion' },
  ],
  actuals: snap([5, 12, 22, 38, 56, 78]),
};

const employmentCentres: CapitalProject = {
  id: 'employment_centres',
  code: '40602',
  name: 'Employment Centre Upgrades',
  currentYearBudget: 240,
  currentYearSpent: 60,
  totalProjectCost: 480,
  cumulativeSpend: 195,
  financialProgressPct: 40.6,
  physicalProgressPct: 45,
  startDate: '2025-04-01',
  originalEndDate: '2027-09-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Kingston and Montego Bay centres completed. St. Ann and Mandeville renovations underway.',
  milestones: [
    { name: 'Kingston centre renovation', plannedDate: '2026-03-31', actualDate: '2026-02-28', status: 'completed', weightPct: 25 },
    { name: 'Montego Bay centre renovation', plannedDate: '2026-06-30', actualDate: '2026-06-20', status: 'completed', weightPct: 25 },
    { name: 'St. Ann & Mandeville centres', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 30 },
    { name: 'Equipment & IT setup', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 480, disbursed: 195 },
  ],
  actuals: snap([4, 10, 20, 33, 46, 60]),
};

const allProjects: CapitalProject[] = [pathModernization, employmentCentres];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                 */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  pathTransfers.actuals, nisContributions.actuals, pensionTransfers.actuals,
);
const fixedPY = sumSnaps(
  pathTransfers.priorYearActuals, nisContributions.priorYearActuals,
  pensionTransfers.priorYearActuals,
);

const opsActuals = sumSnaps(
  pathAdmin.actuals, employmentServices.actuals, labourRelations.actuals,
  socialSecurity.actuals, labourCore.actuals,
);
const opsPY = sumSnaps(
  pathAdmin.priorYearActuals, employmentServices.priorYearActuals,
  labourRelations.priorYearActuals, socialSecurity.priorYearActuals,
  labourCore.priorYearActuals,
);

const capActuals = sumSnaps(
  pathModernization.actuals, employmentCentres.actuals,
);
const capPY = pySnap(580, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                          */
/* ------------------------------------------------------------------ */

export const labourData: MinistryData = {
  overview: {
    id: 'labour',
    name: 'Ministry of Labour & Social Security',
    shortName: 'Labour',
    minister: labourLeadership[0],
    totalAllocation: 22041,
    priorYearAllocation: 21338,
    totalSpent: 10727,
    recurrentTotal: 21281,
    capitalTotal: 760,
    actuals: snap([1720, 3530, 5350, 7180, 8960, 10727]),
    priorYearActuals: pySnap(20800, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 14780,
    priorYearAllocation: 13830,
    totalPaid: 7390,
    pctOfMinistry: 67.1,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 6501,
    priorYearAllocation: 6858,
    totalSpent: 3199,
    utilizationPct: 49.2,
    entities: allEntities,
    totalFilledPosts: 842,
    totalApprovedPosts: 965,
    vacancyRate: 12.7,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 760,
    priorYearAllocation: 650,
    totalSpent: 138,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: labourLeadership,
};
