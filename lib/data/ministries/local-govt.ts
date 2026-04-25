import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_BACK, EMPTY_REVENUE } from '../helpers';
import { localGovtLeadership, localGovtEntityOfficers } from '../people/local-govt';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (3)                                             */
/* ------------------------------------------------------------------ */

const municipalGrants: Obligation = {
  id: 'municipal_grants',
  type: 'public_body_transfer',
  name: 'Municipal Corporation Grants',
  headCode: '72000',
  allocation: 15000,
  priorYearAllocation: 12500,
  paid: 7650,
  paymentStatus: 'current',
  actuals: snap([2500, 3800, 5100, 6100, 6900, 7650]),
  priorYearActuals: pySnap(12100, W_LIN),
  details: {
    entities: [
      { name: 'Kingston & St. Andrew MC', budget: 3200, transferred: 1632, status: 'current' },
      { name: 'St. James MC', budget: 1800, transferred: 918, status: 'current' },
      { name: 'St. Catherine MC', budget: 1600, transferred: 816, status: 'current' },
      { name: 'Manchester MC', budget: 1200, transferred: 612, status: 'current' },
      { name: 'Clarendon MC', budget: 1100, transferred: 561, status: 'current' },
      { name: 'St. Ann MC', budget: 1050, transferred: 536, status: 'current' },
      { name: 'Westmoreland MC', budget: 900, transferred: 459, status: 'current' },
      { name: 'Portland MC', budget: 750, transferred: 383, status: 'current' },
      { name: 'Trelawny MC', budget: 700, transferred: 357, status: 'current' },
      { name: 'St. Thomas MC', budget: 680, transferred: 347, status: 'current' },
      { name: 'Hanover MC', budget: 550, transferred: 281, status: 'current' },
      { name: 'St. Elizabeth MC', budget: 520, transferred: 265, status: 'current' },
      { name: 'St. Mary MC', budget: 500, transferred: 255, status: 'current' },
      { name: 'Other Grants', budget: 450, transferred: 228, status: 'current' },
    ],
    utilizationPct: 51.0,
  },
};

const parochialRevenue: Obligation = {
  id: 'parochial_revenue',
  type: 'public_body_transfer',
  name: 'Parochial Revenue Fund',
  headCode: '72000',
  allocation: 2600,
  priorYearAllocation: 2200,
  paid: 1300,
  paymentStatus: 'current',
  actuals: snap([433, 867, 1083, 1127, 1213, 1300]),
  priorYearActuals: pySnap(2130, W_LIN),
  details: {
    entities: [
      { name: 'Parochial Revenue Fund', budget: 2600, transferred: 1300, status: 'current' },
    ],
    utilizationPct: 50.0,
  },
};

const poorRelief: Obligation = {
  id: 'poor_relief',
  type: 'public_body_transfer',
  name: 'Poor Relief & Social Assistance',
  headCode: '72000',
  allocation: 585,
  priorYearAllocation: 500,
  paid: 293,
  paymentStatus: 'current',
  actuals: snap([49, 98, 146, 195, 244, 293]),
  priorYearActuals: pySnap(485, W_LIN),
  details: {
    entities: [
      { name: 'Indoor Poor Relief', budget: 350, transferred: 175, status: 'current' },
      { name: 'Outdoor Poor Relief', budget: 235, transferred: 118, status: 'current' },
    ],
    utilizationPct: 50.1,
  },
};

const allObligations: Obligation[] = [municipalGrants, parochialRevenue, poorRelief];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                          */
/* ------------------------------------------------------------------ */

const sdc: OperationalEntity = {
  id: 'sdc',
  name: 'Social Development Commission',
  headCode: '72000',
  allocation: 3200,
  priorYearAllocation: 2400,
  spent: 1568,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 480, filledPosts: 415, vacantPosts: 65, vacancyRate: 13.5 },
  kpis: [
    { name: 'Community Projects Delivered', type: 'output', unit: 'count', target: 200, actual: 85, priorYearActual: 180 },
    { name: 'Beneficiary Satisfaction', type: 'outcome', unit: '%', target: 80, actual: 76, priorYearActual: 73 },
    { name: 'Community Groups Supported', type: 'output', unit: 'count', target: 1500, actual: 720, priorYearActual: 1380 },
  ],
  actuals: snap([248, 512, 775, 1046, 1310, 1568]),
  priorYearActuals: pySnap(2320, W_LIN),
  headOfficer: localGovtEntityOfficers.sdc,
};

const communityDev: OperationalEntity = {
  id: 'community_dev',
  name: 'Community Development Programme',
  headCode: '72000',
  allocation: 2400,
  priorYearAllocation: 1800,
  spent: 1200,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 320, filledPosts: 278, vacantPosts: 42, vacancyRate: 13.1 },
  kpis: [
    { name: 'Programmes Implemented', type: 'output', unit: 'count', target: 120, actual: 52, priorYearActual: 105 },
    { name: 'Participation Rate', type: 'outcome', unit: '%', target: 60, actual: 48, priorYearActual: 52 },
    { name: 'Rural Community Coverage', type: 'outcome', unit: '%', target: 75, actual: 68, priorYearActual: 62 },
  ],
  actuals: snap([190, 392, 594, 802, 1004, 1200]),
  priorYearActuals: pySnap(1740, W_LIN),
};

const localGovtAdmin: OperationalEntity = {
  id: 'local_govt_admin',
  name: 'Local Government Administration',
  headCode: '72000',
  allocation: 2100,
  priorYearAllocation: 1500,
  spent: 1029,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 280, filledPosts: 248, vacantPosts: 32, vacancyRate: 11.4 },
  kpis: [
    { name: 'Municipal Compliance Rate', type: 'outcome', unit: '%', target: 95, actual: 82, priorYearActual: 80 },
    { name: 'Financial Report Timeliness', type: 'output', unit: '%', target: 100, actual: 86, priorYearActual: 78 },
  ],
  actuals: snap([163, 336, 510, 688, 861, 1029]),
  priorYearActuals: pySnap(1450, W_LIN),
};

const parishCouncil: OperationalEntity = {
  id: 'parish_council',
  name: 'Parish Council Oversight',
  headCode: '72000',
  allocation: 1200,
  priorYearAllocation: 750,
  spent: 588,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 160, filledPosts: 140, vacantPosts: 20, vacancyRate: 12.5 },
  kpis: [
    { name: 'Parish Service Delivery Index', type: 'outcome', unit: '%', target: 80, actual: 62, priorYearActual: 58, trend: [52, 55, 58, 62] },
    { name: 'Infrastructure Projects Completed', type: 'output', unit: 'count', target: 45, actual: 12, priorYearActual: 38 },
  ],
  actuals: snap([93, 192, 291, 393, 492, 588]),
  priorYearActuals: pySnap(725, W_LIN),
};

const localGovtCore: OperationalEntity = {
  id: 'core_ministry',
  name: 'Core Ministry Administration',
  headCode: '72000',
  allocation: 892,
  priorYearAllocation: 441,
  spent: 437,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 110, filledPosts: 96, vacantPosts: 14, vacancyRate: 12.7 },
  kpis: [
    { name: 'Policy Reviews Completed', type: 'output', unit: 'count', target: 6, actual: 2, priorYearActual: 5 },
    { name: 'Intergovernmental Coordination Score', type: 'outcome', unit: '%', target: 85, actual: 78, priorYearActual: 75 },
  ],
  actuals: snap([69, 143, 216, 292, 365, 437]),
  priorYearActuals: pySnap(427, W_LIN),
};

const allEntities: OperationalEntity[] = [
  sdc, communityDev, localGovtAdmin, parishCouncil, localGovtCore,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                              */
/* ------------------------------------------------------------------ */

const parishInfrastructure: CapitalProject = {
  id: 'parish_infrastructure',
  code: '72601',
  name: 'Parish Infrastructure Programme',
  currentYearBudget: 1600,
  currentYearSpent: 240,
  totalProjectCost: 5200,
  cumulativeSpend: 1800,
  financialProgressPct: 34.6,
  physicalProgressPct: 38,
  startDate: '2024-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Phase 2 parish road and water works on schedule. Kingston and St. Catherine lots substantially complete. Western parishes entering procurement.',
  milestones: [
    { name: 'Phase 1 – KSA & St. Catherine', plannedDate: '2025-12-31', actualDate: '2026-01-15', status: 'completed', weightPct: 25 },
    { name: 'Phase 2 – Clarendon & Manchester', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 25 },
    { name: 'Phase 3 – Western parishes', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 30 },
    { name: 'Final inspection & handover', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 3800, disbursed: 1500 },
    { source: 'CDB', committed: 1400, disbursed: 300, nextTrancheDate: '2027-01-15', conditions: 'Phase 2 completion report' },
  ],
  actuals: snap([15, 38, 72, 120, 178, 240]),
};

const communityFacilities: CapitalProject = {
  id: 'community_facilities',
  code: '72602',
  name: 'Community Facilities Development',
  currentYearBudget: 800,
  currentYearSpent: 96,
  totalProjectCost: 1600,
  cumulativeSpend: 520,
  financialProgressPct: 32.5,
  physicalProgressPct: 28,
  startDate: '2024-10-01',
  originalEndDate: '2027-06-30',
  revisedEndDate: '2027-12-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Community centre construction in Portland and St. Thomas behind schedule due to contractor delays. Market rehabilitation in Montego Bay progressing.',
  milestones: [
    { name: 'Site selection & design', plannedDate: '2025-06-30', actualDate: '2025-07-20', status: 'completed', weightPct: 15 },
    { name: 'Portland & St. Thomas community centres', plannedDate: '2026-09-30', revisedDate: '2027-03-31', status: 'in_progress', weightPct: 35 },
    { name: 'Market rehabilitation – MoBay & Mandeville', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 30 },
    { name: 'Commissioning & handover', plannedDate: '2027-06-30', revisedDate: '2027-12-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 1200, disbursed: 420 },
    { source: 'CDB', committed: 400, disbursed: 100, nextTrancheDate: '2026-12-01', conditions: 'Quarterly progress report' },
  ],
  actuals: snap([6, 16, 30, 50, 72, 96]),
};

const allProjects: CapitalProject[] = [parishInfrastructure, communityFacilities];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                 */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  municipalGrants.actuals, parochialRevenue.actuals, poorRelief.actuals,
);
const fixedPY = sumSnaps(
  municipalGrants.priorYearActuals, parochialRevenue.priorYearActuals,
  poorRelief.priorYearActuals,
);

const opsActuals = sumSnaps(
  sdc.actuals, communityDev.actuals, localGovtAdmin.actuals,
  parishCouncil.actuals, localGovtCore.actuals,
);
const opsPY = sumSnaps(
  sdc.priorYearActuals, communityDev.priorYearActuals,
  localGovtAdmin.priorYearActuals, parishCouncil.priorYearActuals,
  localGovtCore.priorYearActuals,
);

const capActuals = sumSnaps(
  parishInfrastructure.actuals, communityFacilities.actuals,
);
const capPY = pySnap(1600, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                          */
/* ------------------------------------------------------------------ */

export const localGovtData: MinistryData = {
  overview: {
    id: 'local-govt',
    name: 'Ministry of Local Government & Community Development',
    shortName: 'Local Govt',
    minister: localGovtLeadership[0],
    totalAllocation: 30377,
    priorYearAllocation: 23891,
    totalSpent: 14401,
    recurrentTotal: 27977,
    capitalTotal: 2400,
    actuals: snap([2300, 4730, 7200, 9650, 12050, 14401]),
    priorYearActuals: pySnap(23200, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 18185,
    priorYearAllocation: 15200,
    totalPaid: 9243,
    pctOfMinistry: 59.9,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 9792,
    priorYearAllocation: 6891,
    totalSpent: 4822,
    utilizationPct: 49.2,
    entities: allEntities,
    totalFilledPosts: 1177,
    totalApprovedPosts: 1350,
    vacancyRate: 12.8,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 2400,
    priorYearAllocation: 1800,
    totalSpent: 336,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: localGovtLeadership,
};
