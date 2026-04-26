import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { tourismLeadership, tourismEntityOfficers } from '../people/tourism';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (4)                                              */
/* ------------------------------------------------------------------ */

const jtbGrant: Obligation = {
  id: 'jtb_grant',
  type: 'public_body_transfer',
  name: 'Jamaica Tourist Board Grant',
  headCode: '17000',
  allocation: 7500,
  priorYearAllocation: 7200,
  paid: 3750,
  paymentStatus: 'current',
  actuals: snap([1500, 2250, 2800, 3200, 3500, 3750]),
  priorYearActuals: pySnap(7000, W_LIN),
  details: {
    entities: [
      { name: 'Jamaica Tourist Board – Marketing', budget: 5200, transferred: 2600, status: 'partial' },
      { name: 'Jamaica Tourist Board – Operations', budget: 2300, transferred: 1150, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const tpdcoGrant: Obligation = {
  id: 'tpdco_grant',
  type: 'public_body_transfer',
  name: 'TPDCO Grant',
  headCode: '17000',
  allocation: 2200,
  priorYearAllocation: 2000,
  paid: 1100,
  paymentStatus: 'current',
  actuals: snap([440, 660, 825, 940, 1020, 1100]),
  priorYearActuals: pySnap(1920, W_LIN),
  details: {
    entities: [
      { name: 'Tourism Product Development Company', budget: 2200, transferred: 1100, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const resortBoardContributions: Obligation = {
  id: 'resort_board_contributions',
  type: 'public_body_transfer',
  name: 'Resort Board Contributions',
  headCode: '17000',
  allocation: 1000,
  priorYearAllocation: 900,
  paid: 500,
  paymentStatus: 'current',
  actuals: snap([200, 300, 370, 420, 460, 500]),
  priorYearActuals: pySnap(870, W_LIN),
  details: {
    entities: [
      { name: 'Montego Bay Resort Board', budget: 350, transferred: 175, status: 'partial' },
      { name: 'Negril Resort Board', budget: 250, transferred: 125, status: 'partial' },
      { name: 'Ocho Rios Resort Board', budget: 220, transferred: 110, status: 'partial' },
      { name: 'Port Antonio Resort Board', budget: 180, transferred: 90, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const tourismStatutory: Obligation = {
  id: 'tourism_statutory',
  type: 'statutory_transfer',
  name: 'Statutory Provisions',
  headCode: '17000',
  allocation: 500,
  priorYearAllocation: 450,
  paid: 250,
  paymentStatus: 'current',
  actuals: snap([83, 125, 167, 200, 225, 250]),
  priorYearActuals: pySnap(430, W_LIN),
  details: {
    entities: [
      { name: 'Tourism Workers Pension Fund', budget: 320, transferred: 160, status: 'partial' },
      { name: 'Other Statutory Charges', budget: 180, transferred: 90, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const allObligations: Obligation[] = [jtbGrant, tpdcoGrant, resortBoardContributions, tourismStatutory];

/* ------------------------------------------------------------------ */
/*  Operational Entities (3)                                           */
/* ------------------------------------------------------------------ */

const ministryCoreDiv: OperationalEntity = {
  id: 'tourism_core',
  name: 'Ministry Core Divisions',
  headCode: '17000',
  allocation: 2411,
  priorYearAllocation: 2176,
  spent: 1181,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 290, filledPosts: 250, vacantPosts: 40, vacancyRate: 13.8 },
  kpis: [
    { name: 'Visitor Arrivals', type: 'outcome', unit: 'M', target: 2.3, actual: 2.1, priorYearActual: 1.9 },
    { name: 'Tourism Forex Earnings', type: 'outcome', unit: 'US$B', target: 2.3, actual: 2.1, priorYearActual: 1.8 },
    { name: 'Policy Papers Delivered', type: 'output', unit: 'count', target: 12, actual: 4, priorYearActual: 10 },
    { name: 'Tourism Sector GDP Contribution', type: 'outcome', unit: '%', target: 10.5, actual: 9.8, priorYearActual: 9.2 },
  ],
  actuals: snap([192, 393, 590, 787, 984, 1181]),
  priorYearActuals: pySnap(2100, W_LIN),
};

const tourismRegulation: OperationalEntity = {
  id: 'tourism_regulation',
  name: 'Tourism Regulation & Licensing',
  headCode: '17000',
  allocation: 1200,
  priorYearAllocation: 1100,
  spent: 588,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 140, filledPosts: 120, vacantPosts: 20, vacancyRate: 14.3 },
  kpis: [
    { name: 'Licences Processed', type: 'output', unit: 'count', target: 2400, actual: 1050, priorYearActual: 2200 },
    { name: 'Compliance Inspection Rate', type: 'output', unit: '%', target: 80, actual: 62, priorYearActual: 74 },
    { name: 'Product Standards Compliance', type: 'outcome', unit: '%', target: 85, actual: 71, priorYearActual: 78 },
  ],
  actuals: snap([96, 196, 294, 392, 490, 588]),
  priorYearActuals: pySnap(1060, W_LIN),
};

const tefSupport: OperationalEntity = {
  id: 'tef_support',
  name: 'Tourism Enhancement Fund Support',
  headCode: '17000',
  allocation: 800,
  priorYearAllocation: 700,
  spent: 392,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 100, filledPosts: 80, vacantPosts: 20, vacancyRate: 20.0 },
  kpis: [
    { name: 'Enhancement Projects Approved', type: 'output', unit: 'count', target: 30, actual: 12, priorYearActual: 26 },
    { name: 'Community Tourism Initiatives', type: 'output', unit: 'count', target: 15, actual: 5, priorYearActual: 12 },
    { name: 'Resort Area Satisfaction Index', type: 'outcome', unit: '%', target: 80, actual: 74, priorYearActual: 72 },
  ],
  actuals: snap([64, 131, 196, 261, 326, 392]),
  priorYearActuals: pySnap(670, W_LIN),
  headOfficer: tourismEntityOfficers.tpdco,
};

const allEntities: OperationalEntity[] = [ministryCoreDiv, tourismRegulation, tefSupport];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                               */
/* ------------------------------------------------------------------ */

const tourismEnhancement: CapitalProject = {
  id: 'tourism_enhancement',
  code: '17000C1',
  name: 'Tourism Enhancement Projects',
  currentYearBudget: 800,
  currentYearSpent: 280,
  totalProjectCost: 2400,
  cumulativeSpend: 920,
  financialProgressPct: 38.3,
  physicalProgressPct: 40,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Montego Bay cruise port upgrades in progress. South Coast heritage trail development advancing. Ocho Rios waterfront revitalisation procurement delayed by 6 weeks.',
  milestones: [
    { name: 'Montego Bay cruise port Phase 1', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 25 },
    { name: 'South Coast heritage trail', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 20 },
    { name: 'Ocho Rios waterfront revitalisation', plannedDate: '2027-06-30', revisedDate: '2027-08-15', status: 'upcoming', weightPct: 30 },
    { name: 'Community tourism infrastructure', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 15 },
    { name: 'Evaluation & handover', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 1600, disbursed: 620 },
    { source: 'Tourism Enhancement Fund', committed: 800, disbursed: 300, nextTrancheDate: '2026-12-15', conditions: 'Quarterly progress report' },
  ],
  actuals: snap([30, 70, 120, 180, 230, 280]),
  mediumTermProjection: [800, 900, 700, 0],
};

const resortInfrastructure: CapitalProject = {
  id: 'resort_infrastructure',
  code: '17000C2',
  name: 'Resort Area Infrastructure Improvement',
  currentYearBudget: 400,
  currentYearSpent: 140,
  totalProjectCost: 1800,
  cumulativeSpend: 680,
  financialProgressPct: 37.8,
  physicalProgressPct: 35,
  startDate: '2024-10-01',
  originalEndDate: '2028-03-31',
  revisedEndDate: '2028-06-30',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Road improvements in Negril corridor complete. Drainage works in Montego Bay Hip Strip behind schedule due to contractor issues. Wastewater upgrade in Ocho Rios awaiting environmental clearance.',
  milestones: [
    { name: 'Negril corridor road improvement', plannedDate: '2026-03-31', actualDate: '2026-03-15', status: 'completed', weightPct: 20 },
    { name: 'Montego Bay Hip Strip drainage', plannedDate: '2026-12-31', revisedDate: '2027-03-31', status: 'in_progress', weightPct: 25 },
    { name: 'Ocho Rios wastewater upgrade', plannedDate: '2027-06-30', revisedDate: '2027-09-30', status: 'upcoming', weightPct: 30 },
    { name: 'South Coast access roads', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 15 },
    { name: 'Project closeout', plannedDate: '2028-03-31', revisedDate: '2028-06-30', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 1200, disbursed: 480 },
    { source: 'CDB', committed: 600, disbursed: 200, nextTrancheDate: '2027-01-01', conditions: 'Environmental compliance report' },
  ],
  actuals: snap([15, 35, 60, 90, 115, 140]),
};

const allProjects: CapitalProject[] = [tourismEnhancement, resortInfrastructure];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  jtbGrant.actuals, tpdcoGrant.actuals,
  resortBoardContributions.actuals, tourismStatutory.actuals,
);
const fixedPY = sumSnaps(
  jtbGrant.priorYearActuals, tpdcoGrant.priorYearActuals,
  resortBoardContributions.priorYearActuals, tourismStatutory.priorYearActuals,
);

const opsActuals = sumSnaps(
  ministryCoreDiv.actuals, tourismRegulation.actuals, tefSupport.actuals,
);
const opsPY = sumSnaps(
  ministryCoreDiv.priorYearActuals, tourismRegulation.priorYearActuals,
  tefSupport.priorYearActuals,
);

const capActuals = sumSnaps(
  tourismEnhancement.actuals, resortInfrastructure.actuals,
);
const capPY = pySnap(1400, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const tourismData: MinistryData = {
  overview: {
    id: 'tourism',
    name: 'Ministry of Tourism',
    shortName: 'Tourism',
    minister: tourismLeadership[0],
    totalAllocation: 16811,
    priorYearAllocation: 16026,
    totalSpent: 8181,
    recurrentTotal: 15611,
    capitalTotal: 1200,
    lastUpdated: '2026-04-20',
    actuals: snap([1300, 2700, 4100, 5500, 6800, 8181]),
    priorYearActuals: pySnap(15500, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 11200,
    priorYearAllocation: 10550,
    totalPaid: 5600,
    pctOfMinistry: 66.6,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 4411,
    priorYearAllocation: 3976,
    totalSpent: 2161,
    utilizationPct: 49.0,
    entities: allEntities,
    totalFilledPosts: 450,
    totalApprovedPosts: 530,
    vacancyRate: 15.1,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 1200,
    priorYearAllocation: 1500,
    totalSpent: 420,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: tourismLeadership,
};
