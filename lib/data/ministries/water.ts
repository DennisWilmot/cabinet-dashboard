import type {
  MinistryData,
  MonthlySnapshot,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { waterLeadership, waterEntityOfficers } from '../people/water';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (5)                                             */
/* ------------------------------------------------------------------ */

const nwcTransfer: Obligation = {
  id: 'nwc_transfer',
  type: 'public_body_transfer',
  name: 'National Water Commission Transfer',
  headCode: '22000',
  allocation: 980,
  priorYearAllocation: 810,
  paid: 490,
  paymentStatus: 'current',
  actuals: snap([85, 170, 260, 345, 420, 490]),
  priorYearActuals: pySnap(790, W_LIN),
  details: {
    entities: [
      { name: 'National Water Commission', budget: 980, transferred: 490, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const environmentalFund: Obligation = {
  id: 'environmental_fund',
  type: 'statutory_fund',
  name: 'National Environment Fund (Statutory)',
  headCode: '22000',
  allocation: 420,
  priorYearAllocation: 350,
  paid: 210,
  paymentStatus: 'current',
  actuals: snap([35, 70, 105, 140, 175, 210]),
  priorYearActuals: pySnap(340, W_LIN),
  details: {
    components: [
      { name: 'National Environment Trust Fund', budget: 280, paid: 140, status: 'partial' },
      { name: 'Beach Control Authority', budget: 90, paid: 45, status: 'partial' },
      { name: 'Protected Areas Trust', budget: 50, paid: 25, status: 'partial' },
    ],
  },
};

const climateFund: Obligation = {
  id: 'climate_fund',
  type: 'climate_fund',
  name: 'Climate Fund Contributions',
  headCode: '22000',
  allocation: 340,
  priorYearAllocation: 280,
  paid: 280,
  paymentStatus: 'current',
  actuals: snap([120, 200, 240, 260, 270, 280]),
  priorYearActuals: pySnap(270, W_FRONT),
  details: {
    organizations: [
      { name: 'Green Climate Fund (GCF)', budget: 180, paid: 180, status: 'paid' },
      { name: 'Adaptation Fund', budget: 95, paid: 60, status: 'partial' },
      { name: 'UNFCCC Contributions', budget: 65, paid: 40, status: 'partial' },
    ],
    overdueCount: 0,
  },
};

const waterHealthInsurance: Obligation = {
  id: 'water_health_insurance',
  type: 'health_insurance',
  name: 'Health Insurance Contributions',
  headCode: '22000',
  allocation: 152,
  priorYearAllocation: 140,
  paid: 76,
  paymentStatus: 'current',
  actuals: snap([12.7, 25.3, 38, 50.7, 63.3, 76]),
  priorYearActuals: pySnap(136, W_LIN),
  details: {
    components: [
      { name: 'GEASO', budget: 148, paid: 74, status: 'current' },
      { name: 'Senior Managers', budget: 4, paid: 2, status: 'current' },
    ],
  },
};

const forestryLevy: Obligation = {
  id: 'forestry_levy',
  type: 'statutory_levy',
  name: 'Forestry Conservation Levy',
  headCode: '22046',
  allocation: 120,
  priorYearAllocation: 100,
  paid: 60,
  paymentStatus: 'current',
  actuals: snap([10, 20, 30, 40, 50, 60]),
  priorYearActuals: pySnap(95, W_LIN),
  details: {
    components: [
      { name: 'Forest Management Fund', budget: 80, paid: 40, status: 'partial' },
      { name: 'Timber Revenue Retention', budget: 40, paid: 20, status: 'partial' },
    ],
  },
};

const allObligations: Obligation[] = [
  nwcTransfer, environmentalFund, climateFund, waterHealthInsurance, forestryLevy,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                          */
/* ------------------------------------------------------------------ */

const coreMinistry: OperationalEntity = {
  id: 'water_core',
  name: 'Core Ministry Divisions',
  headCode: '22000',
  allocation: 850,
  priorYearAllocation: 700,
  spent: 416,
  utilizationPct: 48.9,
  staffing: { approvedPosts: 380, filledPosts: 340, vacantPosts: 40, vacancyRate: 10.5 },
  kpis: [
    { name: 'Water Coverage Rate', type: 'outcome', unit: '%', target: 88, actual: 82, priorYearActual: 80 },
    { name: 'Policy Documents Completed', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
    { name: 'Public Consultations Held', type: 'output', unit: 'count', target: 24, actual: 10, priorYearActual: 20 },
  ],
  actuals: snap([67, 138, 206, 278, 347, 416]),
  priorYearActuals: pySnap(680, W_LIN),
};

const forestryDept: OperationalEntity = {
  id: 'forestry_dept',
  name: 'Forestry Department',
  headCode: '22046',
  allocation: 720,
  priorYearAllocation: 595,
  spent: 353,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 420, filledPosts: 365, vacantPosts: 55, vacancyRate: 13.1 },
  kpis: [
    { name: 'Reforestation Hectares', type: 'output', unit: 'ha', target: 500, actual: 180, priorYearActual: 420 },
    { name: 'Forest Fire Response Rate', type: 'outcome', unit: '%', target: 100, actual: 88, priorYearActual: 92 },
    { name: 'Timber Licence Processing', type: 'output', unit: 'days', target: 14, actual: 18, priorYearActual: 16 },
  ],
  actuals: snap([57, 117, 175, 235, 294, 353]),
  priorYearActuals: pySnap(580, W_LIN),
  headOfficer: waterEntityOfficers.forestry,
};

const waterResourcesAuth: OperationalEntity = {
  id: 'water_resources_auth',
  name: 'Water Resources Authority',
  headCode: '22000',
  allocation: 480,
  priorYearAllocation: 400,
  spent: 235,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 180, filledPosts: 158, vacantPosts: 22, vacancyRate: 12.2 },
  kpis: [
    { name: 'Water Quality Tests Completed', type: 'output', unit: 'count', target: 2400, actual: 1100, priorYearActual: 2200 },
    { name: 'Groundwater Monitoring Coverage', type: 'outcome', unit: '%', target: 95, actual: 87, priorYearActual: 90 },
    { name: 'Abstraction Licences Processed', type: 'output', unit: 'count', target: 300, actual: 145, priorYearActual: 270 },
  ],
  actuals: snap([38, 78, 117, 157, 196, 235]),
  priorYearActuals: pySnap(385, W_LIN),
};

const climateChangeDivision: OperationalEntity = {
  id: 'climate_change_div',
  name: 'Climate Change Division',
  headCode: '22000',
  allocation: 320,
  priorYearAllocation: 260,
  spent: 154,
  utilizationPct: 48.1,
  staffing: { approvedPosts: 120, filledPosts: 105, vacantPosts: 15, vacancyRate: 12.5 },
  kpis: [
    { name: 'Climate Adaptation Projects Reviewed', type: 'output', unit: 'count', target: 30, actual: 12, priorYearActual: 26 },
    { name: 'GHG Emissions Reporting', type: 'outcome', unit: '%', target: 100, actual: 75, priorYearActual: 85 },
    { name: 'Climate Spend as % of Budget', type: 'outcome', unit: '%', target: 8, actual: 6.2, priorYearActual: 5.8 },
  ],
  actuals: snap([25, 51, 76, 103, 129, 154]),
  priorYearActuals: pySnap(250, W_LIN),
};

const nepa: OperationalEntity = {
  id: 'nepa',
  name: 'National Environment & Planning Agency',
  headCode: '22000',
  allocation: 217,
  priorYearAllocation: 180,
  spent: 106,
  utilizationPct: 48.8,
  staffing: { approvedPosts: 100, filledPosts: 88, vacantPosts: 12, vacancyRate: 12.0 },
  kpis: [
    { name: 'Environmental Permits Processed', type: 'output', unit: 'count', target: 800, actual: 350, priorYearActual: 720 },
    { name: 'Compliance Inspections', type: 'output', unit: 'count', target: 600, actual: 220, priorYearActual: 500 },
  ],
  actuals: snap([17, 35, 53, 71, 89, 106]),
  priorYearActuals: pySnap(172, W_LIN),
};

const allEntities: OperationalEntity[] = [
  coreMinistry, forestryDept, waterResourcesAuth, climateChangeDivision, nepa,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (3)                                              */
/* ------------------------------------------------------------------ */

const ruralWaterSupply: CapitalProject = {
  id: 'rural_water_supply',
  code: '22501',
  name: 'Rural Water Supply Programme',
  currentYearBudget: 650,
  currentYearSpent: 95,
  totalProjectCost: 2800,
  cumulativeSpend: 1420,
  financialProgressPct: 50.7,
  physicalProgressPct: 48,
  startDate: '2023-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Phase 2 pipe-laying in St. Elizabeth and Manchester progressing. 14 of 32 rural schemes completed. Land acquisition for remaining sites ongoing.',
  milestones: [
    { name: 'Phase 1 — 12 parish schemes', plannedDate: '2025-03-31', actualDate: '2025-02-20', status: 'completed', weightPct: 30 },
    { name: 'Phase 2 — southern parishes', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 35 },
    { name: 'Phase 3 — northern parishes', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 25 },
    { name: 'Commissioning & handover', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 1400, disbursed: 820 },
    { source: 'IDB', committed: 1400, disbursed: 600, nextTrancheDate: '2026-12-15', conditions: 'Phase 2 progress report >40%' },
  ],
  actuals: snap([5, 14, 28, 48, 72, 95]),
};

const climateResilience: CapitalProject = {
  id: 'climate_resilience',
  code: '22502',
  name: 'Climate Resilience Infrastructure',
  currentYearBudget: 350,
  currentYearSpent: 52,
  totalProjectCost: 1200,
  cumulativeSpend: 380,
  financialProgressPct: 31.7,
  physicalProgressPct: 28,
  startDate: '2025-01-01',
  originalEndDate: '2029-03-31',
  revisedEndDate: '2029-09-30',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Flood mitigation works in Portland behind schedule due to procurement delays. GCF second tranche pending environmental assessment completion.',
  milestones: [
    { name: 'Vulnerability assessment', plannedDate: '2025-09-30', actualDate: '2025-10-15', status: 'completed', weightPct: 15 },
    { name: 'Flood mitigation — Portland & St. Thomas', plannedDate: '2027-03-31', revisedDate: '2027-06-30', status: 'in_progress', weightPct: 35 },
    { name: 'Coastal protection — south coast', plannedDate: '2028-06-30', status: 'upcoming', weightPct: 30 },
    { name: 'Monitoring systems & handover', plannedDate: '2029-03-31', revisedDate: '2029-09-30', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 480, disbursed: 180 },
    { source: 'GCF', committed: 720, disbursed: 200, nextTrancheDate: '2027-01-15', conditions: 'Environmental assessment completion' },
  ],
  actuals: snap([3, 8, 16, 27, 39, 52]),
};

const watershedMgmt: CapitalProject = {
  id: 'watershed_mgmt',
  code: '22503',
  name: 'Watershed Management Programme',
  currentYearBudget: 150,
  currentYearSpent: 21,
  totalProjectCost: 450,
  cumulativeSpend: 210,
  financialProgressPct: 46.7,
  physicalProgressPct: 52,
  startDate: '2024-04-01',
  originalEndDate: '2027-09-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Yallahs-Hope watershed restoration on track. Community engagement programme exceeding targets. Soil conservation work in Blue Mountains 60% complete.',
  milestones: [
    { name: 'Watershed baseline assessment', plannedDate: '2024-12-31', actualDate: '2024-11-30', status: 'completed', weightPct: 20 },
    { name: 'Yallahs-Hope restoration', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 35 },
    { name: 'Blue Mountain soil conservation', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 30 },
    { name: 'Evaluation & handover', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 300, disbursed: 150 },
    { source: 'EU', committed: 150, disbursed: 60, nextTrancheDate: '2026-11-01', conditions: 'Mid-term review submission' },
  ],
  actuals: snap([1, 3, 6, 10, 15, 21]),
};

const allProjects: CapitalProject[] = [
  ruralWaterSupply, climateResilience, watershedMgmt,
];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                 */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  nwcTransfer.actuals, environmentalFund.actuals, climateFund.actuals,
  waterHealthInsurance.actuals, forestryLevy.actuals,
);
const fixedPY = sumSnaps(
  nwcTransfer.priorYearActuals, environmentalFund.priorYearActuals, climateFund.priorYearActuals,
  waterHealthInsurance.priorYearActuals, forestryLevy.priorYearActuals,
);

const opsActuals = sumSnaps(
  coreMinistry.actuals, forestryDept.actuals, waterResourcesAuth.actuals,
  climateChangeDivision.actuals, nepa.actuals,
);
const opsPY = sumSnaps(
  coreMinistry.priorYearActuals, forestryDept.priorYearActuals, waterResourcesAuth.priorYearActuals,
  climateChangeDivision.priorYearActuals, nepa.priorYearActuals,
);

const capActuals = sumSnaps(
  ruralWaterSupply.actuals, climateResilience.actuals, watershedMgmt.actuals,
);
const capPY = pySnap(935, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                          */
/* ------------------------------------------------------------------ */

export const waterData: MinistryData = {
  overview: {
    id: 'water',
    name: 'Ministry of Water, Environment & Climate Change',
    shortName: 'Water & Environment',
    minister: waterLeadership[0],
    totalAllocation: 5749,
    priorYearAllocation: 4750,
    totalSpent: 2548,
    recurrentTotal: 4599,
    capitalTotal: 1150,
    lastUpdated: '2026-04-05',
    actuals: snap([410, 840, 1280, 1710, 2135, 2548]),
    priorYearActuals: pySnap(4550, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 2012,
    priorYearAllocation: 1680,
    totalPaid: 1116,
    pctOfMinistry: 35.0,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 2587,
    priorYearAllocation: 2135,
    totalSpent: 1264,
    utilizationPct: 48.9,
    entities: allEntities,
    totalFilledPosts: 1056,
    totalApprovedPosts: 1200,
    vacancyRate: 12.0,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 1150,
    priorYearAllocation: 935,
    totalSpent: 168,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: waterLeadership,
};
