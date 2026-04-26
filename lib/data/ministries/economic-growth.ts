import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_BACK, EMPTY_REVENUE } from '../helpers';
import { economicGrowthLeadership, economicGrowthEntityOfficers } from '../people/economic-growth';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (3)                                              */
/* ------------------------------------------------------------------ */

const nwaTransfer: Obligation = {
  id: 'nwa_road_maintenance_transfer',
  type: 'public_body_transfer',
  name: 'Transfer to NWA (Road Maintenance)',
  headCode: '19050',
  allocation: 2800,
  priorYearAllocation: 6500,
  paid: 1456,
  paymentStatus: 'current',
  actuals: snap([280, 540, 790, 1020, 1240, 1456]),
  priorYearActuals: pySnap(6200, W_LIN),
  details: {
    entities: [
      { name: 'NWA Road Maintenance Programme', budget: 2800, transferred: 1456, status: 'partial' },
    ],
    utilizationPct: 52.0,
  },
};

const nepaTransfer: Obligation = {
  id: 'nepa_environmental_transfer',
  type: 'public_body_transfer',
  name: 'Transfer to NEPA',
  headCode: '19048',
  allocation: 1200,
  priorYearAllocation: 1100,
  paid: 600,
  paymentStatus: 'current',
  actuals: snap([100, 200, 300, 400, 500, 600]),
  priorYearActuals: pySnap(1050, W_LIN),
  details: {
    entities: [
      { name: 'NEPA Environmental Monitoring', budget: 1200, transferred: 600, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const statutoryProvisions: Obligation = {
  id: 'statutory_environmental',
  type: 'statutory',
  name: 'Statutory & Environmental Provisions',
  headCode: '19000',
  allocation: 650,
  priorYearAllocation: 600,
  paid: 362,
  paymentStatus: 'current',
  actuals: snap([65, 125, 185, 248, 308, 362]),
  priorYearActuals: pySnap(580, W_LIN),
  details: {
    entities: [
      { name: 'Environmental Trust Fund', budget: 400, transferred: 220, status: 'partial' },
      { name: 'Forestry Conservation Levy', budget: 250, transferred: 142, status: 'partial' },
    ],
    utilizationPct: 55.7,
  },
};

const allObligations: Obligation[] = [nwaTransfer, nepaTransfer, statutoryProvisions];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                           */
/* ------------------------------------------------------------------ */

const nwa: OperationalEntity = {
  id: 'nwa',
  name: 'National Works Agency',
  headCode: '19050',
  allocation: 6500,
  priorYearAllocation: 12000,
  spent: 3250,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 1450, filledPosts: 1280, vacantPosts: 170, vacancyRate: 11.7 },
  kpis: [
    { name: 'Infrastructure Project Completion Rate', type: 'outcome', unit: '%', target: 60, actual: 48, priorYearActual: 42 },
    { name: 'Road Network Condition (Good)', type: 'outcome', unit: '%', target: 55, actual: 47, priorYearActual: 44 },
    { name: 'Pothole Response Time', type: 'output', unit: 'days', target: 5, actual: 7.2, priorYearActual: 8.5 },
    { name: 'Contracts Awarded on Schedule', type: 'output', unit: '%', target: 80, actual: 62, priorYearActual: 58 },
  ],
  actuals: snap([520, 1060, 1600, 2140, 2700, 3250]),
  priorYearActuals: pySnap(11500, W_LIN),
  headOfficer: economicGrowthEntityOfficers.nwa,
};

const nla: OperationalEntity = {
  id: 'nla',
  name: 'National Land Agency',
  headCode: '19047',
  allocation: 2800,
  priorYearAllocation: 2500,
  spent: 1372,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 520, filledPosts: 460, vacantPosts: 60, vacancyRate: 11.5 },
  kpis: [
    { name: 'Title Registration Turnaround', type: 'output', unit: 'days', target: 30, actual: 42, priorYearActual: 48 },
    { name: 'Digital Records Converted', type: 'output', unit: '%', target: 45, actual: 38, priorYearActual: 28 },
    { name: 'Survey Plans Processed', type: 'output', unit: 'count', target: 3000, actual: 1380, priorYearActual: 2700 },
  ],
  actuals: snap([225, 455, 685, 920, 1148, 1372]),
  priorYearActuals: pySnap(2400, W_LIN),
  headOfficer: economicGrowthEntityOfficers.nla,
};

const nepa: OperationalEntity = {
  id: 'nepa',
  name: 'National Environment & Planning Agency',
  headCode: '19048',
  allocation: 2000,
  priorYearAllocation: 1800,
  spent: 960,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 380, filledPosts: 330, vacantPosts: 50, vacancyRate: 13.2 },
  kpis: [
    { name: 'Environmental Permits Processed', type: 'output', unit: 'count', target: 600, actual: 265, priorYearActual: 540 },
    { name: 'Beach Water Quality Compliance', type: 'outcome', unit: '%', target: 85, actual: 78, priorYearActual: 75 },
    { name: 'Protected Areas Monitored', type: 'output', unit: 'count', target: 24, actual: 10, priorYearActual: 20 },
  ],
  actuals: snap([155, 320, 480, 645, 805, 960]),
  priorYearActuals: pySnap(1720, W_LIN),
  headOfficer: economicGrowthEntityOfficers.nepa,
};

const forestry: OperationalEntity = {
  id: 'forestry',
  name: 'Forestry Department',
  headCode: '19046',
  allocation: 1200,
  priorYearAllocation: 1100,
  spent: 576,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 280, filledPosts: 235, vacantPosts: 45, vacancyRate: 16.1 },
  kpis: [
    { name: 'Hectares Reforested', type: 'output', unit: 'ha', target: 500, actual: 180, priorYearActual: 420 },
    { name: 'Forest Fire Response Time', type: 'output', unit: 'hrs', target: 2, actual: 3.1, priorYearActual: 3.8 },
    { name: 'Illegal Harvesting Incidents', type: 'outcome', unit: 'count', target: 50, actual: 38, priorYearActual: 62 },
  ],
  actuals: snap([92, 190, 285, 385, 480, 576]),
  priorYearActuals: pySnap(1060, W_LIN),
  headOfficer: economicGrowthEntityOfficers.forestry,
};

const egCoreMinistry: OperationalEntity = {
  id: 'eg_core_ministry',
  name: 'Core Ministry Divisions',
  headCode: '19000',
  allocation: 1430,
  priorYearAllocation: 1800,
  spent: 688,
  utilizationPct: 48.1,
  staffing: { approvedPosts: 240, filledPosts: 205, vacantPosts: 35, vacancyRate: 14.6 },
  kpis: [
    { name: 'Policy Papers Delivered', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
    { name: 'Stakeholder Consultations Held', type: 'output', unit: 'count', target: 24, actual: 10, priorYearActual: 20 },
  ],
  actuals: snap([115, 230, 345, 460, 575, 688]),
  priorYearActuals: pySnap(1750, W_LIN),
};

const allEntities: OperationalEntity[] = [nwa, nla, nepa, forestry, egCoreMinistry];

/* ------------------------------------------------------------------ */
/*  Capital Projects (5)                                               */
/* ------------------------------------------------------------------ */

const majorHighway: CapitalProject = {
  id: 'major_highway',
  code: '19601',
  name: 'Major Highway Infrastructure Programme',
  currentYearBudget: 15000,
  currentYearSpent: 6900,
  totalProjectCost: 52000,
  cumulativeSpend: 18400,
  financialProgressPct: 35.4,
  physicalProgressPct: 32,
  startDate: '2024-04-01',
  originalEndDate: '2029-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Main corridor works progressing. IDB tranche 3 disbursed. Land acquisition Phase 2 complete. Utility relocation causing minor delays in some sections.',
  milestones: [
    { name: 'Land acquisition Phase 1', plannedDate: '2025-03-31', actualDate: '2025-02-28', status: 'completed', weightPct: 15 },
    { name: 'Land acquisition Phase 2', plannedDate: '2026-06-30', actualDate: '2026-05-20', status: 'completed', weightPct: 10 },
    { name: 'Main corridor earthworks', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 25 },
    { name: 'Paving & drainage', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 30 },
    { name: 'Final inspection & commissioning', plannedDate: '2029-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 28000, disbursed: 10400 },
    { source: 'IDB', committed: 24000, disbursed: 8000, nextTrancheDate: '2027-01-15', conditions: 'Completion of earthworks milestone' },
  ],
  actuals: snap([600, 1500, 2800, 4200, 5600, 6900]),
};

const coastalHighway: CapitalProject = {
  id: 'coastal_highway',
  code: '19602',
  name: 'Southern Coastal Highway Improvement',
  currentYearBudget: 8000,
  currentYearSpent: 4320,
  totalProjectCost: 28500,
  cumulativeSpend: 12800,
  financialProgressPct: 44.9,
  physicalProgressPct: 40,
  startDate: '2023-10-01',
  originalEndDate: '2028-09-30',
  revisedEndDate: '2029-03-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Coastal erosion mitigation works added 6-month extension. Sections A–C complete. Section D experiencing geological challenges.',
  milestones: [
    { name: 'Sections A–C completion', plannedDate: '2026-03-31', actualDate: '2026-03-15', status: 'completed', weightPct: 30 },
    { name: 'Section D earthworks', plannedDate: '2027-03-31', revisedDate: '2027-09-30', status: 'in_progress', weightPct: 25 },
    { name: 'Coastal protection structures', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 25 },
    { name: 'Final paving & commissioning', plannedDate: '2029-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 18500, disbursed: 8800 },
    { source: 'World Bank', committed: 10000, disbursed: 4000, nextTrancheDate: '2026-12-01', conditions: 'Environmental safeguard compliance report' },
  ],
  actuals: snap([400, 1000, 1800, 2700, 3500, 4320]),
};

const bridgeRehab: CapitalProject = {
  id: 'bridge_rehabilitation',
  code: '19603',
  name: 'Bridge Replacement & Rehabilitation',
  currentYearBudget: 5000,
  currentYearSpent: 2600,
  totalProjectCost: 14200,
  cumulativeSpend: 6300,
  financialProgressPct: 44.4,
  physicalProgressPct: 42,
  startDate: '2024-10-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Flat Bridge replacement 65% complete. Rio Cobre crossing on schedule. Materials procurement running ahead of plan.',
  milestones: [
    { name: 'Design & procurement', plannedDate: '2025-06-30', actualDate: '2025-06-10', status: 'completed', weightPct: 20 },
    { name: 'Flat Bridge replacement', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 35 },
    { name: 'Rio Cobre crossing', plannedDate: '2027-09-30', status: 'in_progress', weightPct: 25 },
    { name: 'Testing & handover', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 14200, disbursed: 6300 },
  ],
  actuals: snap([250, 600, 1100, 1650, 2150, 2600]),
};

const mbPerimeterRoad: CapitalProject = {
  id: 'montego_bay_perimeter',
  code: '19604',
  name: 'Montego Bay Perimeter Road',
  currentYearBudget: 4000,
  currentYearSpent: 1880,
  totalProjectCost: 19500,
  cumulativeSpend: 4200,
  financialProgressPct: 21.5,
  physicalProgressPct: 18,
  startDate: '2025-04-01',
  originalEndDate: '2030-03-31',
  status: 'at_risk',
  riskLevel: 'high',
  narrative: 'Land acquisition disputes delaying Phase 1. Environmental clearance pending for mangrove section. Procurement for Phase 2 paused.',
  milestones: [
    { name: 'Phase 1 land acquisition', plannedDate: '2026-06-30', revisedDate: '2026-12-31', status: 'delayed', weightPct: 20 },
    { name: 'Phase 1 construction', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 30 },
    { name: 'Phase 2 construction', plannedDate: '2029-06-30', status: 'upcoming', weightPct: 35 },
    { name: 'Completion & commissioning', plannedDate: '2030-03-31', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 12000, disbursed: 2700 },
    { source: 'IDB', committed: 7500, disbursed: 1500, nextTrancheDate: '2027-06-01', conditions: 'Land acquisition completion' },
  ],
  actuals: snap([180, 420, 720, 1100, 1500, 1880]),
};

const ruralRoads: CapitalProject = {
  id: 'rural_roads',
  code: '19605',
  name: 'Rural Roads Rehabilitation Programme',
  currentYearBudget: 2552,
  currentYearSpent: 1350,
  totalProjectCost: 8400,
  cumulativeSpend: 3620,
  financialProgressPct: 43.1,
  physicalProgressPct: 45,
  startDate: '2024-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'World Bank–funded programme on schedule. 320 km of 720 km target rehabilitated. Community engagement strong in St. Thomas and Portland.',
  milestones: [
    { name: 'Phase 1 (St. Thomas & Portland)', plannedDate: '2026-03-31', actualDate: '2026-03-20', status: 'completed', weightPct: 25 },
    { name: 'Phase 2 (Manchester & Clarendon)', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 30 },
    { name: 'Phase 3 (St. Ann & Trelawny)', plannedDate: '2028-01-31', status: 'upcoming', weightPct: 30 },
    { name: 'Final evaluation', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 3400, disbursed: 1520 },
    { source: 'World Bank', committed: 5000, disbursed: 2100, nextTrancheDate: '2026-10-15', conditions: 'Phase 2 progress report' },
  ],
  actuals: snap([120, 300, 540, 800, 1080, 1350]),
};

const allProjects: CapitalProject[] = [
  majorHighway, coastalHighway, bridgeRehab, mbPerimeterRoad, ruralRoads,
];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  nwaTransfer.actuals, nepaTransfer.actuals, statutoryProvisions.actuals,
);
const fixedPY = sumSnaps(
  nwaTransfer.priorYearActuals, nepaTransfer.priorYearActuals, statutoryProvisions.priorYearActuals,
);

const opsActuals = sumSnaps(
  nwa.actuals, nla.actuals, nepa.actuals, forestry.actuals, egCoreMinistry.actuals,
);
const opsPY = sumSnaps(
  nwa.priorYearActuals, nla.priorYearActuals, nepa.priorYearActuals,
  forestry.priorYearActuals, egCoreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(
  majorHighway.actuals, coastalHighway.actuals, bridgeRehab.actuals,
  mbPerimeterRoad.actuals, ruralRoads.actuals,
);
const capPY = pySnap(30000, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const economicGrowthData: MinistryData = {
  overview: {
    id: 'economic-growth',
    name: 'Ministry of Economic Growth & Job Creation',
    shortName: 'Economic Growth',
    minister: economicGrowthLeadership[0],
    totalAllocation: 53132,
    priorYearAllocation: 65538,
    totalSpent: 26314,
    recurrentTotal: 18580,
    capitalTotal: 34552,
    lastUpdated: '2026-04-18',
    actuals: snap([4200, 8600, 13100, 17500, 22000, 26314]),
    priorYearActuals: pySnap(63000, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 4650,
    priorYearAllocation: 8200,
    totalPaid: 2418,
    pctOfMinistry: 8.8,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 13930,
    priorYearAllocation: 27338,
    totalSpent: 6846,
    utilizationPct: 49.1,
    entities: allEntities,
    totalFilledPosts: 2510,
    totalApprovedPosts: 2870,
    vacancyRate: 12.5,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 34552,
    priorYearAllocation: 30000,
    totalSpent: 17050,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: economicGrowthLeadership,
};
