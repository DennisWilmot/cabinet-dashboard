import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { agricultureLeadership, agricultureEntityOfficers } from '../people/agriculture';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (6)                                              */
/* ------------------------------------------------------------------ */

const radaGrant: Obligation = {
  id: 'rada_grant',
  type: 'public_body_transfer',
  name: 'RADA Recurrent Grant',
  headCode: '51000',
  allocation: 2800,
  priorYearAllocation: 2400,
  paid: 1400,
  paymentStatus: 'current',
  actuals: snap([230, 465, 700, 935, 1170, 1400]),
  priorYearActuals: pySnap(2400, W_LIN),
  details: {
    entities: [
      { name: 'RADA Operations', budget: 2000, transferred: 1000, status: 'partial' },
      { name: 'RADA Extension Programmes', budget: 800, transferred: 400, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const fisheriesTransfer: Obligation = {
  id: 'fisheries_transfer',
  type: 'public_body_transfer',
  name: 'Fisheries Division Transfer',
  headCode: '51000',
  allocation: 1400,
  priorYearAllocation: 1200,
  paid: 700,
  paymentStatus: 'current',
  actuals: snap([115, 233, 350, 467, 583, 700]),
  priorYearActuals: pySnap(1200, W_LIN),
  details: {
    entities: [
      { name: 'National Fisheries Authority', budget: 900, transferred: 450, status: 'partial' },
      { name: 'Fish Sanctuaries Fund', budget: 500, transferred: 250, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const commodityBoards: Obligation = {
  id: 'commodity_boards',
  type: 'public_body_transfer',
  name: 'Commodity Board Contributions',
  headCode: '51000',
  allocation: 850,
  priorYearAllocation: 740,
  paid: 425,
  paymentStatus: 'current',
  actuals: snap([70, 142, 213, 283, 354, 425]),
  priorYearActuals: pySnap(740, W_LIN),
  details: {
    entities: [
      { name: 'Coffee Industry Board', budget: 280, transferred: 140, status: 'partial' },
      { name: 'Coconut Industry Board', budget: 220, transferred: 110, status: 'partial' },
      { name: 'Banana Board', budget: 200, transferred: 100, status: 'partial' },
      { name: 'Sugar Industry Authority', budget: 150, transferred: 75, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const agriculturalInsurance: Obligation = {
  id: 'agricultural_insurance',
  type: 'insurance',
  name: 'Agricultural Insurance Fund',
  headCode: '51000',
  allocation: 550,
  priorYearAllocation: 460,
  paid: 550,
  paymentStatus: 'paid',
  actuals: snap([275, 550, 550, 550, 550, 550]),
  priorYearActuals: pySnap(460, W_FRONT),
  details: {
    components: [
      { name: 'Crop Insurance Premium', budget: 350, paid: 350, status: 'paid' as const },
      { name: 'Livestock Insurance Premium', budget: 200, paid: 200, status: 'paid' as const },
    ],
  },
};

const jasGrant: Obligation = {
  id: 'jas_grant',
  type: 'public_body_transfer',
  name: 'Jamaica Agricultural Society Grant',
  headCode: '51000',
  allocation: 500,
  priorYearAllocation: 420,
  paid: 250,
  paymentStatus: 'current',
  actuals: snap([42, 83, 125, 167, 208, 250]),
  priorYearActuals: pySnap(420, W_LIN),
  details: {
    entities: [
      { name: 'JAS Parish Operations', budget: 350, transferred: 175, status: 'partial' },
      { name: 'JAS Farmer Support Fund', budget: 150, transferred: 75, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const nicTransfer: Obligation = {
  id: 'nic_transfer',
  type: 'public_body_transfer',
  name: 'National Irrigation Commission Transfer',
  headCode: '51000',
  allocation: 400,
  priorYearAllocation: 380,
  paid: 200,
  paymentStatus: 'current',
  actuals: snap([33, 67, 100, 133, 167, 200]),
  priorYearActuals: pySnap(380, W_LIN),
  details: {
    entities: [
      { name: 'NIC Operations', budget: 400, transferred: 200, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const allObligations: Obligation[] = [
  radaGrant, fisheriesTransfer, commodityBoards,
  agriculturalInsurance, jasGrant, nicTransfer,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                           */
/* ------------------------------------------------------------------ */

const extensionServices: OperationalEntity = {
  id: 'extension_services',
  name: 'Extension Services Division',
  headCode: '51000',
  allocation: 3500,
  priorYearAllocation: 2600,
  spent: 1715,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 520, filledPosts: 455, vacantPosts: 65, vacancyRate: 12.5 },
  kpis: [
    { name: 'Farmers Registered', type: 'output', unit: 'count', target: 45000, actual: 24500, priorYearActual: 42000 },
    { name: 'Production Index', type: 'outcome', unit: 'index', target: 110, actual: 105, priorYearActual: 101 },
    { name: 'Food Import Bill', type: 'outcome', unit: 'J$B', target: 1.0, actual: 1.2, priorYearActual: 1.35 },
    { name: 'Extension Visits Completed', type: 'output', unit: 'count', target: 12000, actual: 5200, priorYearActual: 10500 },
  ],
  actuals: snap([280, 565, 857, 1143, 1430, 1715]),
  priorYearActuals: pySnap(2600, W_LIN),
  headOfficer: agricultureEntityOfficers.rada,
};

const veterinaryServices: OperationalEntity = {
  id: 'veterinary_services',
  name: 'Veterinary Services Division',
  headCode: '51000',
  allocation: 2200,
  priorYearAllocation: 1780,
  spent: 1100,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 310, filledPosts: 268, vacantPosts: 42, vacancyRate: 13.5 },
  kpis: [
    { name: 'Animal Health Inspections', type: 'output', unit: 'count', target: 8000, actual: 4200, priorYearActual: 7500 },
    { name: 'Disease Outbreak Response Time', type: 'outcome', unit: 'hrs', target: 24, actual: 28, priorYearActual: 32 },
    { name: 'Vaccination Coverage', type: 'outcome', unit: '%', target: 85, actual: 72, priorYearActual: 68 },
  ],
  actuals: snap([180, 363, 550, 733, 917, 1100]),
  priorYearActuals: pySnap(1780, W_LIN),
};

const cropResearch: OperationalEntity = {
  id: 'crop_research',
  name: 'Crop Research & Development',
  headCode: '51000',
  allocation: 1800,
  priorYearAllocation: 1350,
  spent: 864,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 180, filledPosts: 152, vacantPosts: 28, vacancyRate: 15.6 },
  kpis: [
    { name: 'Seed Varieties Released', type: 'output', unit: 'count', target: 8, actual: 3, priorYearActual: 6 },
    { name: 'Research Papers Published', type: 'output', unit: 'count', target: 20, actual: 8, priorYearActual: 17 },
    { name: 'Trial Plots Established', type: 'output', unit: 'count', target: 50, actual: 22, priorYearActual: 45 },
  ],
  actuals: snap([140, 284, 432, 576, 720, 864]),
  priorYearActuals: pySnap(1350, W_LIN),
};

const minesGeology: OperationalEntity = {
  id: 'mines_geology',
  name: 'Mines & Geology Division',
  headCode: '51000',
  allocation: 1600,
  priorYearAllocation: 1100,
  spent: 800,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 140, filledPosts: 122, vacantPosts: 18, vacancyRate: 12.9 },
  kpis: [
    { name: 'Mining Licences Processed', type: 'output', unit: 'count', target: 200, actual: 95, priorYearActual: 180 },
    { name: 'Quarry Inspections', type: 'output', unit: 'count', target: 300, actual: 130, priorYearActual: 270 },
    { name: 'Environmental Compliance Rate', type: 'outcome', unit: '%', target: 90, actual: 82, priorYearActual: 78 },
  ],
  actuals: snap([130, 264, 400, 533, 667, 800]),
  priorYearActuals: pySnap(1100, W_LIN),
};

const agriCoreMinistry: OperationalEntity = {
  id: 'agri_core_ministry',
  name: 'Core Ministry Administration',
  headCode: '51000',
  allocation: 2084,
  priorYearAllocation: 1479,
  spent: 1001,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 200, filledPosts: 175, vacantPosts: 25, vacancyRate: 12.5 },
  kpis: [
    { name: 'Agricultural Policy Reviews', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
    { name: 'Stakeholder Consultations', type: 'output', unit: 'count', target: 24, actual: 10, priorYearActual: 20 },
  ],
  actuals: snap([163, 330, 500, 668, 835, 1001]),
  priorYearActuals: pySnap(1479, W_LIN),
};

const allEntities: OperationalEntity[] = [
  extensionServices, veterinaryServices, cropResearch, minesGeology, agriCoreMinistry,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (4)                                               */
/* ------------------------------------------------------------------ */

const irrigationInfrastructure: CapitalProject = {
  id: 'irrigation_infrastructure',
  code: '51601',
  name: 'Irrigation Infrastructure Programme',
  currentYearBudget: 2000,
  currentYearSpent: 480,
  totalProjectCost: 8500,
  cumulativeSpend: 3200,
  financialProgressPct: 37.6,
  physicalProgressPct: 40,
  startDate: '2024-04-01',
  originalEndDate: '2029-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'St. Catherine and Clarendon phases progressing. Mid-island canal rehabilitation on schedule. Pump station upgrades underway.',
  milestones: [
    { name: 'Phase 1 – St. Catherine canals', plannedDate: '2025-09-30', actualDate: '2025-10-15', status: 'completed', weightPct: 20 },
    { name: 'Phase 2 – Clarendon extension', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 25 },
    { name: 'Pump station modernisation', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Phase 3 – South coast pipeline', plannedDate: '2028-06-30', status: 'upcoming', weightPct: 20 },
    { name: 'Commissioning & handover', plannedDate: '2029-03-31', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 5500, disbursed: 2200 },
    { source: 'IDB', committed: 3000, disbursed: 1000, nextTrancheDate: '2026-12-15', conditions: 'Phase 2 progress report' },
  ],
  actuals: snap([40, 95, 170, 265, 370, 480]),
  mediumTermProjection: [2000, 2400, 2200, 1900],
};

const farmRoads: CapitalProject = {
  id: 'farm_roads',
  code: '51602',
  name: 'Farm Roads Rehabilitation Programme',
  currentYearBudget: 1200,
  currentYearSpent: 360,
  totalProjectCost: 4800,
  cumulativeSpend: 1920,
  financialProgressPct: 40.0,
  physicalProgressPct: 42,
  startDate: '2024-04-01',
  originalEndDate: '2028-03-31',
  revisedEndDate: '2028-09-30',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Portland and St. Thomas segments completed. Manchester segment delayed due to land acquisition issues.',
  milestones: [
    { name: 'Portland parish roads', plannedDate: '2025-06-30', actualDate: '2025-07-20', status: 'completed', weightPct: 25 },
    { name: 'St. Thomas parish roads', plannedDate: '2026-03-31', actualDate: '2026-04-10', status: 'completed', weightPct: 25 },
    { name: 'Manchester parish roads', plannedDate: '2026-12-31', revisedDate: '2027-03-31', status: 'in_progress', weightPct: 25 },
    { name: 'Final parishes & handover', plannedDate: '2027-12-31', revisedDate: '2028-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 3200, disbursed: 1440 },
    { source: 'CDB', committed: 1600, disbursed: 480, nextTrancheDate: '2027-01-15', conditions: 'Manchester segment completion' },
  ],
  actuals: snap([30, 70, 130, 210, 285, 360]),
  mediumTermProjection: [1200, 1400, 1200, 0],
};

const agroProcessing: CapitalProject = {
  id: 'agro_processing',
  code: '51603',
  name: 'Agro-Processing Facilities Upgrade',
  currentYearBudget: 800,
  currentYearSpent: 160,
  totalProjectCost: 2400,
  cumulativeSpend: 720,
  financialProgressPct: 30.0,
  physicalProgressPct: 28,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Design phase completed for Christiana and Bog Walk facilities. Equipment procurement initiated.',
  milestones: [
    { name: 'Facility design & engineering', plannedDate: '2026-03-31', actualDate: '2026-03-25', status: 'completed', weightPct: 20 },
    { name: 'Equipment procurement', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 30 },
    { name: 'Construction & installation', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 35 },
    { name: 'Testing & commissioning', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 1600, disbursed: 520 },
    { source: 'EU', committed: 800, disbursed: 200, nextTrancheDate: '2027-03-01', conditions: 'Construction commencement' },
  ],
  actuals: snap([12, 30, 58, 95, 130, 160]),
  mediumTermProjection: [800, 900, 700, 0],
};

const essexValley: CapitalProject = {
  id: 'essex_valley',
  code: '51604',
  name: 'Essex Valley Agricultural Station Modernisation',
  currentYearBudget: 330,
  currentYearSpent: 83,
  totalProjectCost: 680,
  cumulativeSpend: 310,
  financialProgressPct: 45.6,
  physicalProgressPct: 48,
  startDate: '2025-01-01',
  originalEndDate: '2027-06-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Greenhouse complex completed. Laboratory upgrade on schedule. Seed bank facility design finalised.',
  milestones: [
    { name: 'Greenhouse complex', plannedDate: '2025-12-31', actualDate: '2025-12-10', status: 'completed', weightPct: 30 },
    { name: 'Laboratory upgrade', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 35 },
    { name: 'Seed bank facility', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 25 },
    { name: 'Commissioning', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 680, disbursed: 310 },
  ],
  actuals: snap([8, 18, 33, 50, 67, 83]),
};

const allProjects: CapitalProject[] = [
  irrigationInfrastructure, farmRoads, agroProcessing, essexValley,
];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  radaGrant.actuals, fisheriesTransfer.actuals, commodityBoards.actuals,
  agriculturalInsurance.actuals, jasGrant.actuals, nicTransfer.actuals,
);
const fixedPY = sumSnaps(
  radaGrant.priorYearActuals, fisheriesTransfer.priorYearActuals, commodityBoards.priorYearActuals,
  agriculturalInsurance.priorYearActuals, jasGrant.priorYearActuals, nicTransfer.priorYearActuals,
);

const opsActuals = sumSnaps(
  extensionServices.actuals, veterinaryServices.actuals, cropResearch.actuals,
  minesGeology.actuals, agriCoreMinistry.actuals,
);
const opsPY = sumSnaps(
  extensionServices.priorYearActuals, veterinaryServices.priorYearActuals, cropResearch.priorYearActuals,
  minesGeology.priorYearActuals, agriCoreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(
  irrigationInfrastructure.actuals, farmRoads.actuals, agroProcessing.actuals, essexValley.actuals,
);
const capPY = pySnap(3000, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const agricultureData: MinistryData = {
  overview: {
    id: 'agriculture',
    name: 'Ministry of Agriculture, Fisheries & Mining',
    shortName: 'Agriculture',
    minister: agricultureLeadership[0],
    totalAllocation: 22014,
    priorYearAllocation: 16909,
    totalSpent: 10088,
    recurrentTotal: 17684,
    capitalTotal: 4330,
    lastUpdated: '2026-04-12',
    actuals: snap([1660, 3380, 5150, 6920, 8500, 10088]),
    priorYearActuals: pySnap(13647, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 6500,
    priorYearAllocation: 5600,
    totalPaid: 3525,
    pctOfMinistry: 29.5,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 11184,
    priorYearAllocation: 8309,
    totalSpent: 5480,
    utilizationPct: 49.0,
    entities: allEntities,
    totalFilledPosts: 1172,
    totalApprovedPosts: 1350,
    vacancyRate: 13.2,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 4330,
    priorYearAllocation: 3000,
    totalSpent: 1083,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: agricultureLeadership,
};
