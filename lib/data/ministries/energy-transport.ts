import type { MinistryData, Obligation, OperationalEntity, CapitalProject } from '@/lib/types';
import { energyTransportLeadership, energyTransportEntityOfficers } from '../people/energy-transport';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';

/* Fixed Obligations */

const roadMaintenanceFund: Obligation = {
  id: 'road_maintenance',
  type: 'public_body_transfer',
  name: 'Road Maintenance Fund',
  headCode: '69000',
  allocation: 4500,
  priorYearAllocation: 4200,
  paid: 2250,
  paymentStatus: 'current',
  actuals: snap([750, 1500, 1688, 1875, 2063, 2250]),
  priorYearActuals: pySnap(4100, W_LIN),
  details: {
    entities: [
      { name: 'National Road Operating Company', budget: 3200, transferred: 1600, status: 'partial' },
      { name: 'Parish Road Maintenance', budget: 1300, transferred: 650, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const energySubsidy: Obligation = {
  id: 'energy_subsidy',
  type: 'public_body_transfer',
  name: 'Energy Subsidy & Transfers',
  headCode: '69000',
  allocation: 2800,
  priorYearAllocation: 3200,
  paid: 1680,
  paymentStatus: 'current',
  actuals: snap([560, 840, 1120, 1260, 1400, 1680]),
  priorYearActuals: pySnap(3100, W_LIN),
  details: {
    entities: [
      { name: 'Electricity Subsidy (Vulnerable Consumers)', budget: 1800, transferred: 1080, status: 'partial' },
      { name: 'Petrojam Transfer', budget: 600, transferred: 360, status: 'partial' },
      { name: 'PCJ Contributions', budget: 400, transferred: 240, status: 'partial' },
    ],
    utilizationPct: 60.0,
  },
};

const telecomUSF: Obligation = {
  id: 'telecom_usf',
  type: 'membership_fee',
  name: 'Telecom Universal Service Fund',
  headCode: '69000',
  allocation: 1200,
  priorYearAllocation: 1100,
  paid: 600,
  paymentStatus: 'current',
  actuals: snap([100, 200, 300, 400, 500, 600]),
  priorYearActuals: pySnap(1050, W_LIN),
  details: {
    organizations: [
      { name: 'USF Rural Broadband', budget: 800, paid: 400, status: 'partial' },
      { name: 'USF Community Access Points', budget: 400, paid: 200, status: 'partial' },
    ],
    overdueCount: 0,
  },
};

const etInsurance: Obligation = {
  id: 'et_insurance',
  type: 'health_insurance',
  name: 'Insurance Contributions',
  headCode: '69000',
  allocation: 1100,
  priorYearAllocation: 980,
  paid: 550,
  paymentStatus: 'current',
  actuals: snap([92, 183, 275, 367, 458, 550]),
  priorYearActuals: pySnap(950, W_LIN),
  details: {
    components: [
      { name: 'GEASO', budget: 1000, paid: 500, status: 'current' },
      { name: 'GPASO', budget: 60, paid: 30, status: 'current' },
      { name: 'Senior Managers', budget: 40, paid: 20, status: 'current' },
    ],
  },
};

const allObligations: Obligation[] = [roadMaintenanceFund, energySubsidy, telecomUSF, etInsurance];

/* Operational Entities */

const transportAuthority: OperationalEntity = {
  id: 'transport_authority',
  name: 'Transport Authority & Regulation',
  headCode: '69000',
  allocation: 5200,
  priorYearAllocation: 4800,
  spent: 2496,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 680, filledPosts: 580, vacantPosts: 100, vacancyRate: 14.7 },
  kpis: [
    { name: 'Licensed Operators Audited', type: 'output', unit: 'count', target: 1200, actual: 560, priorYearActual: 1100 },
    { name: 'Road Fatalities per 100K', type: 'outcome', unit: 'rate', target: 12, actual: 14.5, priorYearActual: 15.2 },
    { name: 'JUTC Fleet Availability', type: 'output', unit: '%', target: 80, actual: 68, priorYearActual: 65 },
  ],
  actuals: snap([416, 832, 1248, 1664, 2080, 2496]),
  priorYearActuals: pySnap(4650, W_LIN),
  headOfficer: energyTransportEntityOfficers.transport_authority,
};

const energyDivision: OperationalEntity = {
  id: 'energy_division',
  name: 'Energy Policy & Regulation',
  headCode: '69000',
  allocation: 3800,
  priorYearAllocation: 3500,
  spent: 1824,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 320, filledPosts: 275, vacantPosts: 45, vacancyRate: 14.1 },
  kpis: [
    { name: 'Renewable Energy Mix', type: 'outcome', unit: '%', target: 30, actual: 24, priorYearActual: 21 },
    { name: 'Energy Cost (US$/kWh)', type: 'outcome', unit: 'US$', target: 0.35, actual: 0.40, priorYearActual: 0.42 },
    { name: 'New Solar Installations', type: 'output', unit: 'count', target: 500, actual: 220, priorYearActual: 380 },
  ],
  actuals: snap([304, 608, 912, 1216, 1520, 1824]),
  priorYearActuals: pySnap(3400, W_LIN),
};

const telecomRegulation: OperationalEntity = {
  id: 'telecom_regulation',
  name: 'Telecommunications Regulation',
  headCode: '69000',
  allocation: 1500,
  priorYearAllocation: 1300,
  spent: 720,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 180, filledPosts: 155, vacantPosts: 25, vacancyRate: 13.9 },
  kpis: [
    { name: 'Broadband Penetration', type: 'outcome', unit: '%', target: 75, actual: 68, priorYearActual: 62 },
    { name: 'Spectrum Licenses Processed', type: 'output', unit: 'count', target: 120, actual: 58, priorYearActual: 110 },
  ],
  actuals: snap([120, 240, 360, 480, 600, 720]),
  priorYearActuals: pySnap(1260, W_LIN),
};

const etCore: OperationalEntity = {
  id: 'et_core',
  name: 'Core Ministry Administration',
  headCode: '69000',
  allocation: 2200,
  priorYearAllocation: 2000,
  spent: 1056,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 250, filledPosts: 215, vacantPosts: 35, vacancyRate: 14.0 },
  kpis: [
    { name: 'Policy Reviews Completed', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
    { name: 'Road Condition Index (Good %)', type: 'outcome', unit: '%', target: 70, actual: 65, priorYearActual: 62 },
  ],
  actuals: snap([176, 352, 528, 704, 880, 1056]),
  priorYearActuals: pySnap(1940, W_LIN),
};

const allEntities: OperationalEntity[] = [transportAuthority, energyDivision, telecomRegulation, etCore];

/* Capital Projects */

const roadConstruction: CapitalProject = {
  id: 'road_construction',
  code: '69601',
  name: 'Major Road Construction & Rehabilitation',
  currentYearBudget: 2400,
  currentYearSpent: 600,
  totalProjectCost: 9600,
  cumulativeSpend: 3200,
  financialProgressPct: 33.3,
  physicalProgressPct: 35,
  startDate: '2024-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Southern Coastal Highway extension progressing. Mandela Highway widening Phase 2 underway. 45km of secondary roads rehabilitated.',
  milestones: [
    { name: 'Design & environmental assessment', plannedDate: '2025-03-31', actualDate: '2025-04-10', status: 'completed', weightPct: 15 },
    { name: 'Southern Coastal Highway Phase 1', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 30 },
    { name: 'Mandela Highway widening', plannedDate: '2027-06-30', status: 'in_progress', weightPct: 30 },
    { name: 'Secondary roads programme', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 5000, disbursed: 1800 },
    { source: 'China Exim', committed: 3600, disbursed: 1000, conditions: 'Quarterly progress milestones' },
    { source: 'IDB', committed: 1000, disbursed: 400 },
  ],
  actuals: snap([40, 100, 190, 320, 460, 600]),
};

const energyInfra: CapitalProject = {
  id: 'energy_infra',
  code: '69602',
  name: 'Energy Infrastructure & Grid Modernization',
  currentYearBudget: 1200,
  currentYearSpent: 300,
  totalProjectCost: 4800,
  cumulativeSpend: 1440,
  financialProgressPct: 30.0,
  physicalProgressPct: 28,
  startDate: '2025-04-01',
  originalEndDate: '2029-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Grid modernization pilot in Kingston & St. Andrew. Smart meter deployment to 50,000 customers. LNG terminal expansion feasibility complete.',
  milestones: [
    { name: 'Grid assessment', plannedDate: '2025-12-31', actualDate: '2025-12-20', status: 'completed', weightPct: 15 },
    { name: 'Smart meter pilot', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 25 },
    { name: 'Grid upgrade Phase 1', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 35 },
    { name: 'Evaluation', plannedDate: '2029-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 2400, disbursed: 720 },
    { source: 'IDB', committed: 2400, disbursed: 720 },
  ],
  actuals: snap([20, 50, 95, 160, 230, 300]),
};

const broadband: CapitalProject = {
  id: 'broadband_expansion',
  code: '69603',
  name: 'National Broadband Expansion',
  currentYearBudget: 600,
  currentYearSpent: 120,
  totalProjectCost: 2200,
  cumulativeSpend: 660,
  financialProgressPct: 30.0,
  physicalProgressPct: 25,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  revisedEndDate: '2028-09-30',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Fibre optic backbone extension to rural parishes behind schedule. Community WiFi hotspots deployed in 80 locations.',
  milestones: [
    { name: 'Network planning', plannedDate: '2025-09-30', actualDate: '2025-10-15', status: 'completed', weightPct: 15 },
    { name: 'Backbone fibre extension', plannedDate: '2027-03-31', revisedDate: '2027-06-30', status: 'in_progress', weightPct: 40 },
    { name: 'Community WiFi rollout', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 25 },
    { name: 'Testing & handover', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 1200, disbursed: 360 },
    { source: 'World Bank', committed: 1000, disbursed: 300 },
  ],
  actuals: snap([8, 20, 38, 62, 90, 120]),
};

const allProjects: CapitalProject[] = [roadConstruction, energyInfra, broadband];

/* Bucket aggregates */

const fixedActuals = sumSnaps(
  roadMaintenanceFund.actuals, energySubsidy.actuals, telecomUSF.actuals, etInsurance.actuals,
);
const fixedPY = sumSnaps(
  roadMaintenanceFund.priorYearActuals, energySubsidy.priorYearActuals,
  telecomUSF.priorYearActuals, etInsurance.priorYearActuals,
);

const opsActuals = sumSnaps(
  transportAuthority.actuals, energyDivision.actuals,
  telecomRegulation.actuals, etCore.actuals,
);
const opsPY = sumSnaps(
  transportAuthority.priorYearActuals, energyDivision.priorYearActuals,
  telecomRegulation.priorYearActuals, etCore.priorYearActuals,
);

const capActuals = sumSnaps(
  roadConstruction.actuals, energyInfra.actuals, broadband.actuals,
);
const capPY = pySnap(4513, W_BACK);

/* Assembly */

export const energyTransportData: MinistryData = {
  overview: {
    id: 'energy-transport',
    name: 'Ministry of Energy, Transport & Telecommunications',
    shortName: 'Energy & Transport',
    minister: energyTransportLeadership[0],
    totalAllocation: 25712,
    priorYearAllocation: 29981,
    totalSpent: 12856,
    recurrentTotal: 21512,
    capitalTotal: 4200,
    actuals: snap([2057, 4228, 6340, 8565, 10700, 12856]),
    priorYearActuals: pySnap(22772, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 9600,
    priorYearAllocation: 9480,
    totalPaid: 5080,
    pctOfMinistry: 37.3,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 12700,
    priorYearAllocation: 11600,
    totalSpent: 6096,
    utilizationPct: 48.0,
    entities: allEntities,
    totalFilledPosts: 1225,
    totalApprovedPosts: 1430,
    vacancyRate: 14.3,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 4200,
    priorYearAllocation: 4513,
    totalSpent: 1020,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: energyTransportLeadership,
};
