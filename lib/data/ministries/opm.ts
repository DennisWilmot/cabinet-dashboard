import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { opmLeadership, opmEntityOfficers } from '../people/opm';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (4)                                              */
/* ------------------------------------------------------------------ */

const jisGrant: Obligation = {
  id: 'jis_agency_grant',
  type: 'public_body_transfer',
  name: 'JIS Agency Grant',
  headCode: '15010',
  allocation: 1600,
  priorYearAllocation: 1400,
  paid: 800,
  paymentStatus: 'current',
  actuals: snap([280, 400, 520, 640, 720, 800]),
  priorYearActuals: pySnap(1350, W_LIN),
  details: {
    entities: [
      { name: 'Jamaica Information Service', budget: 1600, transferred: 800, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const postTelecomGrant: Obligation = {
  id: 'post_telecom_grant',
  type: 'public_body_transfer',
  name: 'Post & Telecommunications Transfer',
  headCode: '15039',
  allocation: 3200,
  priorYearAllocation: 2800,
  paid: 1600,
  paymentStatus: 'current',
  actuals: snap([530, 800, 1070, 1280, 1440, 1600]),
  priorYearActuals: pySnap(2700, W_LIN),
  details: {
    entities: [
      { name: 'Post & Telecommunications Dept', budget: 3200, transferred: 1600, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const niraTransfer: Obligation = {
  id: 'nira_transfer',
  type: 'public_body_transfer',
  name: 'NIRA Establishment Transfer',
  headCode: '15063',
  allocation: 27800,
  priorYearAllocation: 0,
  paid: 13624,
  paymentStatus: 'current',
  actuals: snap([4600, 7200, 9500, 11200, 12400, 13624]),
  priorYearActuals: pySnap(0, W_FRONT),
  details: {
    entities: [
      { name: 'National Identification & Registration Authority', budget: 27800, transferred: 13624, status: 'partial' },
    ],
    utilizationPct: 49.0,
  },
};

const opmStatutory: Obligation = {
  id: 'opm_statutory',
  type: 'statutory_transfer',
  name: 'Statutory Provisions',
  headCode: '15000',
  allocation: 1400,
  priorYearAllocation: 1200,
  paid: 700,
  paymentStatus: 'current',
  actuals: snap([230, 350, 470, 560, 630, 700]),
  priorYearActuals: pySnap(1150, W_LIN),
  details: {
    entities: [
      { name: 'Pension & Gratuity Provisions', budget: 900, transferred: 450, status: 'partial' },
      { name: 'Other Statutory Charges', budget: 500, transferred: 250, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const allObligations: Obligation[] = [jisGrant, postTelecomGrant, niraTransfer, opmStatutory];

/* ------------------------------------------------------------------ */
/*  Operational Entities (4)                                           */
/* ------------------------------------------------------------------ */

const pmOffice: OperationalEntity = {
  id: 'pm_office',
  name: "Prime Minister's Office Divisions",
  headCode: '15000',
  allocation: 5400,
  priorYearAllocation: 4800,
  spent: 2646,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 480, filledPosts: 420, vacantPosts: 60, vacancyRate: 12.5 },
  kpis: [
    { name: 'Portfolio Delivery Rate', type: 'outcome', unit: '%', target: 70, actual: 63, priorYearActual: 58 },
    { name: 'Cabinet Papers Processed', type: 'output', unit: 'count', target: 120, actual: 52, priorYearActual: 105 },
    { name: 'Inter-Agency Coordination Score', type: 'outcome', unit: '%', target: 85, actual: 78, priorYearActual: 75 },
  ],
  actuals: snap([430, 880, 1320, 1760, 2200, 2646]),
  priorYearActuals: pySnap(4650, W_LIN),
};

const jis: OperationalEntity = {
  id: 'jis',
  name: 'Jamaica Information Service',
  headCode: '15010',
  allocation: 3000,
  priorYearAllocation: 2700,
  spent: 1470,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 320, filledPosts: 280, vacantPosts: 40, vacancyRate: 12.5 },
  kpis: [
    { name: 'Media Releases Published', type: 'output', unit: 'count', target: 240, actual: 105, priorYearActual: 220 },
    { name: 'Public Awareness Reach', type: 'outcome', unit: '%', target: 60, actual: 48, priorYearActual: 52 },
    { name: 'Digital Platform Engagement', type: 'output', unit: 'K visits', target: 500, actual: 310, priorYearActual: 420 },
  ],
  actuals: snap([240, 490, 735, 980, 1225, 1470]),
  priorYearActuals: pySnap(2600, W_LIN),
  headOfficer: opmEntityOfficers.jis,
};

const postTelecom: OperationalEntity = {
  id: 'post_telecom',
  name: 'Post & Telecommunications Department',
  headCode: '15039',
  allocation: 6400,
  priorYearAllocation: 5800,
  spent: 3136,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 420, filledPosts: 380, vacantPosts: 40, vacancyRate: 9.5 },
  kpis: [
    { name: 'Mail Delivery Timeliness', type: 'output', unit: '%', target: 90, actual: 82, priorYearActual: 85 },
    { name: 'Post Office Modernisation', type: 'output', unit: '%', target: 50, actual: 32, priorYearActual: 18 },
    { name: 'Spectrum Licence Revenue', type: 'outcome', unit: 'J$M', target: 800, actual: 420, priorYearActual: 680 },
  ],
  actuals: snap([510, 1045, 1565, 2090, 2610, 3136]),
  priorYearActuals: pySnap(5600, W_LIN),
  headOfficer: opmEntityOfficers.post_telecom,
};

const niraOps: OperationalEntity = {
  id: 'nira_ops',
  name: 'National Identification & Registration Authority',
  headCode: '15063',
  allocation: 21200,
  priorYearAllocation: 0,
  spent: 10388,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 600, filledPosts: 450, vacantPosts: 150, vacancyRate: 25.0 },
  kpis: [
    { name: 'National ID Cards Issued', type: 'output', unit: 'K', target: 500, actual: 145, priorYearActual: 0, trend: [0, 0, 18, 42, 78, 145] },
    { name: 'Registration Centres Operational', type: 'output', unit: 'count', target: 50, actual: 28, priorYearActual: 0 },
    { name: 'Biometric Enrolment Rate', type: 'outcome', unit: '%', target: 40, actual: 18, priorYearActual: 0 },
  ],
  actuals: snap([1680, 3450, 5170, 6900, 8650, 10388]),
  priorYearActuals: pySnap(0, W_FRONT),
  headOfficer: opmEntityOfficers.nira,
};

const allEntities: OperationalEntity[] = [pmOffice, jis, postTelecom, niraOps];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                               */
/* ------------------------------------------------------------------ */

const niraIdInfrastructure: CapitalProject = {
  id: 'nira_id_infrastructure',
  code: '15063C',
  name: 'National ID System Infrastructure',
  currentYearBudget: 2900,
  currentYearSpent: 1160,
  totalProjectCost: 12500,
  cumulativeSpend: 1160,
  financialProgressPct: 9.3,
  physicalProgressPct: 12,
  startDate: '2026-04-01',
  originalEndDate: '2029-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Data centre procurement complete. Biometric hardware deployment to parish offices underway. Vendor integration behind schedule by 4 weeks.',
  milestones: [
    { name: 'Data centre & hosting procurement', plannedDate: '2026-07-31', actualDate: '2026-07-20', status: 'completed', weightPct: 15 },
    { name: 'Biometric hardware deployment', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 25 },
    { name: 'Software platform integration', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 30 },
    { name: 'Island-wide rollout', plannedDate: '2028-09-30', status: 'upcoming', weightPct: 20 },
    { name: 'Evaluation & steady state', plannedDate: '2029-03-31', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 8500, disbursed: 860 },
    { source: 'IDB', committed: 4000, disbursed: 300, nextTrancheDate: '2027-01-15', conditions: 'Completion of biometric deployment to 25 parishes' },
  ],
  actuals: snap([120, 280, 480, 720, 940, 1160]),
  mediumTermProjection: [2900, 3800, 4200, 1600],
};

const opmItModernisation: CapitalProject = {
  id: 'opm_it_modernisation',
  code: '15000C',
  name: 'OPM IT Modernisation',
  currentYearBudget: 729,
  currentYearSpent: 218.7,
  totalProjectCost: 1450,
  cumulativeSpend: 410,
  financialProgressPct: 28.3,
  physicalProgressPct: 30,
  startDate: '2025-10-01',
  originalEndDate: '2027-09-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Network upgrade phase complete. Cloud migration for core systems in progress. Staff training on new platforms scheduled for Q3.',
  milestones: [
    { name: 'Network infrastructure upgrade', plannedDate: '2026-06-30', actualDate: '2026-06-10', status: 'completed', weightPct: 25 },
    { name: 'Cloud migration', plannedDate: '2027-01-31', status: 'in_progress', weightPct: 35 },
    { name: 'Staff training & change management', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Project closeout', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 1450, disbursed: 410 },
  ],
  actuals: snap([20, 50, 90, 140, 180, 218.7]),
};

const allProjects: CapitalProject[] = [niraIdInfrastructure, opmItModernisation];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  jisGrant.actuals, postTelecomGrant.actuals,
  niraTransfer.actuals, opmStatutory.actuals,
);
const fixedPY = sumSnaps(
  jisGrant.priorYearActuals, postTelecomGrant.priorYearActuals,
  niraTransfer.priorYearActuals, opmStatutory.priorYearActuals,
);

const opsActuals = sumSnaps(
  pmOffice.actuals, jis.actuals,
  postTelecom.actuals, niraOps.actuals,
);
const opsPY = sumSnaps(
  pmOffice.priorYearActuals, jis.priorYearActuals,
  postTelecom.priorYearActuals, niraOps.priorYearActuals,
);

const capActuals = sumSnaps(
  niraIdInfrastructure.actuals, opmItModernisation.actuals,
);
const capPY = pySnap(900, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const opmData: MinistryData = {
  overview: {
    id: 'opm',
    name: 'Office of the Prime Minister',
    shortName: 'OPM',
    minister: opmLeadership[0],
    totalAllocation: 73629,
    priorYearAllocation: 19664,
    totalSpent: 35743,
    recurrentTotal: 70000,
    capitalTotal: 3629,
    actuals: snap([5800, 11900, 17900, 23800, 29800, 35743]),
    priorYearActuals: pySnap(19000, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 34000,
    priorYearAllocation: 5400,
    totalPaid: 16724,
    pctOfMinistry: 46.2,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 36000,
    priorYearAllocation: 13300,
    totalSpent: 17640,
    utilizationPct: 49.0,
    entities: allEntities,
    totalFilledPosts: 1530,
    totalApprovedPosts: 1820,
    vacancyRate: 15.9,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 3629,
    priorYearAllocation: 964,
    totalSpent: 1378.7,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: opmLeadership,
};
