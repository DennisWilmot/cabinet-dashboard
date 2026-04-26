import type {
  MinistryData,
  MonthlySnapshot,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from './types';
import { mofLeadership, entityOfficers } from './people-data';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const CY = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'] as const;
const PY = [
  '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09',
  '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03',
] as const;

function snap(cum: number[], months: readonly string[] = CY): MonthlySnapshot[] {
  return months.map((period, i) => ({
    period,
    cumulative: cum[i],
    monthly: i === 0 ? cum[0] : Math.round((cum[i] - cum[i - 1]) * 1000) / 1000,
  }));
}

function pySnap(total: number, w: number[]): MonthlySnapshot[] {
  let c = 0;
  return PY.map((period, i) => {
    let m = Math.round(total * w[i]);
    if (i === 11) m = total - c;
    c += m;
    return { period, cumulative: c, monthly: m };
  });
}

function sumSnaps(...arrays: MonthlySnapshot[][]): MonthlySnapshot[] {
  return arrays[0].map((s, i) => ({
    period: s.period,
    cumulative: Math.round(arrays.reduce((a, arr) => a + arr[i].cumulative, 0) * 100) / 100,
    monthly: Math.round(arrays.reduce((a, arr) => a + arr[i].monthly, 0) * 100) / 100,
  }));
}

// 12-month weight distributions (each sums to 1.0)
const W_LIN = [0.082, 0.083, 0.084, 0.083, 0.084, 0.082, 0.084, 0.083, 0.085, 0.083, 0.084, 0.083];
const W_DEBT = [0.12, 0.05, 0.10, 0.06, 0.03, 0.08, 0.15, 0.04, 0.12, 0.07, 0.09, 0.09];
const W_FRONT = [0.20, 0.15, 0.10, 0.08, 0.07, 0.07, 0.06, 0.06, 0.06, 0.05, 0.05, 0.05];
const W_BACK = [0.04, 0.05, 0.06, 0.07, 0.07, 0.08, 0.09, 0.10, 0.11, 0.11, 0.11, 0.11];
const W_REV = [0.075, 0.080, 0.085, 0.082, 0.084, 0.081, 0.083, 0.085, 0.087, 0.083, 0.088, 0.087];

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (7)                                             */
/* ------------------------------------------------------------------ */

const debtAmortisation: Obligation = {
  id: 'debt_amortisation',
  type: 'debt_amortisation',
  name: 'Debt Amortisation',
  headCode: '20017',
  allocation: 167590,
  priorYearAllocation: 155000,
  paid: 89246,
  paymentStatus: 'current',
  actuals: snap([22000, 27000, 45000, 53000, 57000, 89246]),
  priorYearActuals: pySnap(151000, W_DEBT),
  details: {
    domesticPaid: 52340,
    externalPaid: 36906,
    paymentsCurrent: 42,
    paymentsOverdue: 0,
    nextMajorMaturity: '2026-11-15',
    outstandingStock: 2847000,
    fourYearTrend: [167590, 254000, 339200, 141900],
  },
};

const debtInterest: Obligation = {
  id: 'debt_interest',
  type: 'debt_interest',
  name: 'Debt Interest',
  headCode: '20018',
  allocation: 210956,
  priorYearAllocation: 195000,
  paid: 109697,
  paymentStatus: 'current',
  actuals: snap([25000, 37000, 59000, 67000, 82000, 109697]),
  priorYearActuals: pySnap(190000, W_DEBT),
  details: {
    domesticPaid: 71802,
    externalPaid: 37895,
    paymentsCurrent: 42,
    paymentsOverdue: 0,
    nextMajorMaturity: '2026-11-15',
    outstandingStock: 2847000,
    weightedAvgRate: 6.8,
    fixedVsVariable: '72% fixed / 28% variable',
    fourYearTrend: [210956, 202700, 187300, 174900],
  },
};

const pensions: Obligation = {
  id: 'pensions',
  type: 'pension',
  name: 'Pensions',
  headCode: '20019',
  allocation: 50261,
  priorYearAllocation: 45300,
  paid: 24626,
  paymentStatus: 'current',
  actuals: snap([4104, 8209, 12313, 16417, 20521, 24626]),
  priorYearActuals: pySnap(44000, W_LIN),
  details: {
    pensionerCount: 48720,
    byCategory: [
      { category: 'Civil Service', count: 22400 },
      { category: 'Teachers', count: 14800 },
      { category: 'Police', count: 6200 },
      { category: 'Military', count: 3120 },
      { category: 'Other', count: 2200 },
    ],
    arrearsOutstanding: 0,
    yoyGrowth: 10.8,
  },
};

const healthInsurance: Obligation = {
  id: 'health_insurance',
  type: 'health_insurance',
  name: 'Health Insurance Contributions',
  headCode: '10451',
  allocation: 8475,
  priorYearAllocation: 7800,
  paid: 4238,
  paymentStatus: 'current',
  actuals: snap([706, 1412, 2118, 2824, 3530, 4238]),
  priorYearActuals: pySnap(7600, W_LIN),
  details: {
    components: [
      { name: 'GEASO', budget: 8399, paid: 4200, status: 'current' },
      { name: 'GPASO', budget: 42, paid: 21, status: 'current' },
      { name: 'Senior Managers', budget: 34.2, paid: 17.1, status: 'current' },
    ],
  },
};

const catastropheInsurance: Obligation = {
  id: 'catastrophe_insurance',
  type: 'catastrophe_insurance',
  name: 'Catastrophe Insurance',
  headCode: '11808',
  allocation: 4487,
  priorYearAllocation: 3900,
  paid: 4487,
  paymentStatus: 'paid',
  actuals: snap([2323, 4487, 4487, 4487, 4487, 4487]),
  priorYearActuals: pySnap(3900, W_FRONT),
  details: {
    components: [
      { name: 'CCRIF', budget: 2323, paid: 2323, status: 'paid' },
      { name: 'CAT Bond', budget: 2164, paid: 2164, status: 'paid' },
    ],
  },
};

const memberships: Obligation = {
  id: 'memberships',
  type: 'membership_fee',
  name: 'International Memberships',
  headCode: '10007',
  allocation: 2234,
  priorYearAllocation: 2050,
  paid: 1489,
  paymentStatus: 'current',
  actuals: snap([762, 762, 781, 1055, 1324, 1489]),
  priorYearActuals: pySnap(1950, W_LIN),
  details: {
    organizations: [
      { name: 'CDB', budget: 703, paid: 703, status: 'paid' },
      { name: 'IFC', budget: 757, paid: 378, status: 'partial' },
      { name: 'IDB', budget: 340, paid: 170, status: 'partial' },
      { name: 'IIC', budget: 319, paid: 160, status: 'partial' },
      { name: 'MIF IV', budget: 59, paid: 59, status: 'paid' },
      { name: 'CFTC', budget: 36, paid: 0, status: 'pending' },
      { name: 'CARTAC', budget: 15, paid: 15, status: 'paid' },
      { name: 'ECLAC', budget: 5, paid: 4, status: 'partial' },
    ],
    overdueCount: 0,
  },
};

const publicBodyTransfers: Obligation = {
  id: 'public_body_transfers',
  type: 'public_body_transfer',
  name: 'Public Body Transfers',
  headCode: '10660+10882',
  allocation: 20547,
  priorYearAllocation: 18900,
  paid: 13247,
  paymentStatus: 'current',
  actuals: snap([4500, 7095, 8870, 10189, 11489, 13247]),
  priorYearActuals: pySnap(18200, W_LIN),
  details: {
    entities: [
      { name: 'Airports Authority of Jamaica', budget: 13000, transferred: 6500, status: 'partial' },
      { name: "Students' Loan Bureau (SET)", budget: 1000, transferred: 1000, status: 'paid' },
      { name: "Students' Loan Bureau (STEM)", budget: 750, transferred: 750, status: 'paid' },
      { name: "Students' Loan Bureau (Debt Reset)", budget: 500, transferred: 500, status: 'paid' },
      { name: 'Municipal Corporations', budget: 3200, transferred: 3200, status: 'paid' },
      { name: 'NHT', budget: 1379, transferred: 689, status: 'partial' },
      { name: 'Jamaica Racing Commission', budget: 380, transferred: 380, status: 'paid' },
      { name: 'Casino Gaming Commission', budget: 250, transferred: 190, status: 'partial' },
      { name: 'Others', budget: 88, transferred: 38, status: 'partial' },
    ],
    utilizationPct: 64.5,
  },
};

const allObligations: Obligation[] = [
  debtAmortisation, debtInterest, pensions, healthInsurance,
  catastropheInsurance, memberships, publicBodyTransfers,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities (9)                                          */
/* ------------------------------------------------------------------ */

const taj: OperationalEntity = {
  id: 'taj',
  name: 'Tax Administration Jamaica',
  headCode: '20056',
  allocation: 25501,
  priorYearAllocation: 23200,
  spent: 12496,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 3600, filledPosts: 3240, vacantPosts: 360, vacancyRate: 10.0 },
  kpis: [
    { name: 'Taxpayer Compliance Rate', type: 'outcome', unit: '%', target: 78, actual: 74.2, priorYearActual: 72.0 },
    { name: 'Tax-to-GDP Ratio', type: 'outcome', unit: '%', target: 27.5, actual: 27.1, priorYearActual: 26.5 },
    { name: 'E-Filing Adoption', type: 'output', unit: '%', target: 65, actual: 62, priorYearActual: 55 },
    { name: 'Cost of Collection', type: 'outcome', unit: '%', target: 3.5, actual: 3.03, priorYearActual: 3.2 },
  ],
  actuals: snap([2010, 4130, 6180, 8360, 10400, 12496]),
  priorYearActuals: pySnap(22500, W_LIN),
  headOfficer: entityOfficers.taj,
  revenueData: {
    collected: 412000,
    target: 405000,
    variance: 7000,
    variancePct: 1.7,
    byType: [
      { type: 'Income Tax', amount: 165000 },
      { type: 'GCT', amount: 148000 },
      { type: 'SCT', amount: 52000 },
      { type: 'Stamp Duty', amount: 24000 },
      { type: 'Education Tax', amount: 16000 },
      { type: 'Other', amount: 7000 },
    ],
    actuals: snap([62000, 134000, 202000, 270000, 340000, 412000]),
  },
};

const customs: OperationalEntity = {
  id: 'customs',
  name: 'Jamaica Customs Agency',
  headCode: '20012',
  allocation: 23768,
  priorYearAllocation: 21600,
  spent: 12360,
  utilizationPct: 52.0,
  staffing: { approvedPosts: 2100, filledPosts: 1860, vacantPosts: 240, vacancyRate: 11.4 },
  kpis: [
    { name: 'GDP Contribution', type: 'outcome', unit: '%', target: 39, actual: 37.8, priorYearActual: 36.5 },
    { name: 'Cargo Clearance Time', type: 'output', unit: 'hrs', target: 4.0, actual: 4.3, priorYearActual: 4.5 },
    { name: 'Detection Rate', type: 'output', unit: '%', target: 12, actual: 13.5, priorYearActual: 11.8 },
  ],
  actuals: snap([2100, 4080, 6160, 8210, 10330, 12360]),
  priorYearActuals: pySnap(21000, W_LIN),
  headOfficer: entityOfficers.customs,
  revenueData: {
    collected: 198000,
    target: 192000,
    variance: 6000,
    variancePct: 3.1,
    byType: [
      { type: 'Import Duty', amount: 82000 },
      { type: 'GCT on Imports', amount: 72000 },
      { type: 'SCT on Imports', amount: 28000 },
      { type: 'Environmental Levy', amount: 9000 },
      { type: 'Stamp Duty', amount: 4000 },
      { type: 'Other', amount: 3000 },
    ],
    actuals: snap([31000, 63000, 96000, 129000, 163000, 198000]),
  },
};

const accountantGeneral: OperationalEntity = {
  id: 'accountant_general',
  name: 'Accountant General',
  headCode: '20011',
  allocation: 1834,
  priorYearAllocation: 1680,
  spent: 898,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 340, filledPosts: 310, vacantPosts: 30, vacancyRate: 8.8 },
  kpis: [
    { name: 'Financial Reports On Time', type: 'output', unit: '%', target: 100, actual: 92, priorYearActual: 88 },
    { name: 'Cash Management Improvement', type: 'outcome', unit: '%', target: 25, actual: 25, priorYearActual: 20 },
  ],
  actuals: snap([145, 297, 445, 600, 747, 898]),
  priorYearActuals: pySnap(1640, W_LIN),
  headOfficer: entityOfficers.accountant_general,
};

const pioj: OperationalEntity = {
  id: 'pioj',
  name: 'Planning Institute of Jamaica',
  headCode: '20000',
  allocation: 2623,
  priorYearAllocation: 2380,
  spent: 1286,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 210, filledPosts: 188, vacantPosts: 22, vacancyRate: 10.5 },
  kpis: [
    { name: 'Vision 2030 Indicators Tracked', type: 'output', unit: 'count', target: 120, actual: 108, priorYearActual: 95 },
    { name: 'Policy Advisories Delivered', type: 'output', unit: 'count', target: 18, actual: 9, priorYearActual: 16 },
  ],
  actuals: snap([208, 426, 636, 858, 1073, 1286]),
  priorYearActuals: pySnap(2310, W_LIN),
  headOfficer: entityOfficers.pioj,
};

const statin: OperationalEntity = {
  id: 'statin',
  name: 'Statistical Institute of Jamaica',
  headCode: '20000',
  allocation: 3087,
  priorYearAllocation: 2790,
  spent: 1421,
  utilizationPct: 46.0,
  staffing: { approvedPosts: 480, filledPosts: 420, vacantPosts: 60, vacancyRate: 12.5 },
  kpis: [
    { name: 'Statistical Releases Published', type: 'output', unit: 'count', target: 48, actual: 22, priorYearActual: 44 },
    { name: 'Office Relocation Progress', type: 'output', unit: '%', target: 100, actual: 35, priorYearActual: 10 },
  ],
  actuals: snap([225, 465, 695, 940, 1178, 1421]),
  priorYearActuals: pySnap(2700, W_LIN),
  headOfficer: entityOfficers.statin,
};

const ppc: OperationalEntity = {
  id: 'ppc',
  name: 'Public Procurement Commission',
  headCode: '20000',
  allocation: 550,
  priorYearAllocation: 490,
  spent: 262,
  utilizationPct: 47.6,
  staffing: { approvedPosts: 72, filledPosts: 62, vacantPosts: 10, vacancyRate: 13.9 },
  kpis: [
    { name: 'Contracts Reviewed', type: 'output', unit: 'count', target: 800, actual: 380, priorYearActual: 720 },
    { name: 'Procurement Compliance Rate', type: 'outcome', unit: '%', target: 90, actual: 86, priorYearActual: 84 },
  ],
  actuals: snap([42, 86, 129, 175, 219, 262]),
  priorYearActuals: pySnap(475, W_LIN),
};

const coreMinistry: OperationalEntity = {
  id: 'core_ministry',
  name: 'Core Ministry Divisions',
  headCode: '20000',
  allocation: 5496,
  priorYearAllocation: 4980,
  spent: 2637,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 520, filledPosts: 450, vacantPosts: 70, vacancyRate: 13.5 },
  kpis: [
    { name: 'Budget Circular Compliance', type: 'output', unit: '%', target: 100, actual: 95, priorYearActual: 92 },
    { name: 'Public Bodies Oversight Reviews', type: 'output', unit: 'count', target: 40, actual: 18, priorYearActual: 35 },
  ],
  actuals: snap([425, 870, 1305, 1760, 2200, 2637]),
  priorYearActuals: pySnap(4830, W_LIN),
};

const fid: OperationalEntity = {
  id: 'fid',
  name: 'Financial Investigations Division',
  headCode: '20060',
  allocation: 1464,
  priorYearAllocation: 1320,
  spent: 689,
  utilizationPct: 47.0,
  staffing: { approvedPosts: 220, filledPosts: 185, vacantPosts: 35, vacancyRate: 15.9 },
  kpis: [
    { name: 'Investigations Completed', type: 'output', unit: 'count', target: 60, actual: 24, priorYearActual: 52 },
    { name: 'Prosecutions Referred', type: 'output', unit: 'count', target: 15, actual: 5, priorYearActual: 12 },
    { name: 'Assets Frozen', type: 'outcome', unit: 'J$M', target: 2000, actual: 1340, priorYearActual: 1800 },
  ],
  actuals: snap([110, 228, 340, 460, 575, 689]),
  priorYearActuals: pySnap(1280, W_LIN),
  headOfficer: entityOfficers.fid,
};

const rpd: OperationalEntity = {
  id: 'rpd',
  name: 'Revenue Protection Department',
  headCode: '20061',
  allocation: 514,
  priorYearAllocation: 460,
  spent: 247,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 90, filledPosts: 78, vacantPosts: 12, vacancyRate: 13.3 },
  kpis: [
    { name: 'Revenue Recovered', type: 'outcome', unit: 'J$M', target: 2800, actual: 3200, priorYearActual: 2400 },
    { name: 'Cases Processed', type: 'output', unit: 'count', target: 240, actual: 128, priorYearActual: 210 },
    { name: 'Recovery Ratio', type: 'outcome', unit: 'x', target: 10, actual: 12.98, priorYearActual: 8.5 },
  ],
  actuals: snap([40, 82, 122, 165, 206, 247]),
  priorYearActuals: pySnap(445, W_LIN),
  headOfficer: entityOfficers.rpd,
  revenueData: {
    collected: 3200,
    target: 2800,
    variance: 400,
    variancePct: 14.3,
    byType: [{ type: 'Recovered Revenue', amount: 3200 }],
    actuals: snap([450, 970, 1500, 2040, 2600, 3200]),
  },
};

const allEntities: OperationalEntity[] = [
  taj, customs, accountantGeneral, pioj, statin, ppc, coreMinistry, fid, rpd,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (5)                                              */
/* ------------------------------------------------------------------ */

const raisUpgrade: CapitalProject = {
  id: 'rais_upgrade',
  code: '29601',
  name: 'TAJ RAIS Upgrade',
  currentYearBudget: 1089.6,
  currentYearSpent: 217.92,
  totalProjectCost: 1932.335,
  cumulativeSpend: 217.92,
  financialProgressPct: 11.3,
  physicalProgressPct: 12,
  startDate: '2026-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Procurement of GenTax Core26 license completed. Configuration phase initiated. Vendor team on-site.',
  milestones: [
    { name: 'GenTax Core26 license procurement', plannedDate: '2026-06-30', actualDate: '2026-06-15', status: 'completed', weightPct: 15 },
    { name: 'Core26 installation & configuration', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 30 },
    { name: 'CRM & queue system configuration', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 20 },
    { name: 'User acceptance testing', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 20 },
    { name: 'Training & go-live', plannedDate: '2028-02-28', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 1932.335, disbursed: 217.92 },
  ],
  actuals: snap([15, 35, 65, 107, 157, 217.92]),
};

const publicSectorTransformation: CapitalProject = {
  id: 'public_sector_transformation',
  code: '29602',
  name: 'Public Sector Transformation Programme',
  currentYearBudget: 1663.439,
  currentYearSpent: 315.053,
  totalProjectCost: 8724.169,
  cumulativeSpend: 404.301,
  financialProgressPct: 4.6,
  physicalProgressPct: 8,
  startDate: '2025-04-01',
  originalEndDate: '2030-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Institutional strengthening component progressing. IDB first disbursement received. HR module design underway.',
  milestones: [
    { name: 'Institutional assessment', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 15 },
    { name: 'HR modernisation module', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Digital service delivery platform', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 30 },
    { name: 'Change management rollout', plannedDate: '2029-06-30', status: 'upcoming', weightPct: 20 },
    { name: 'Evaluation & closure', plannedDate: '2030-03-31', status: 'upcoming', weightPct: 10 },
  ],
  funding: [
    { source: 'GOJ', committed: 5200, disbursed: 280 },
    { source: 'IDB', committed: 3524.169, disbursed: 124.301, nextTrancheDate: '2027-01-15', conditions: 'Completion of institutional assessment' },
  ],
  actuals: snap([20, 50, 95, 155, 230, 315.053]),
  mediumTermProjection: [1663.439, 2040, 2380, 2640],
};

const contingency: CapitalProject = {
  id: 'contingency',
  code: '21686',
  name: 'Contingency Provision',
  currentYearBudget: 15000,
  currentYearSpent: 0,
  totalProjectCost: 15000,
  cumulativeSpend: 0,
  financialProgressPct: 0,
  physicalProgressPct: 0,
  startDate: '2026-04-01',
  originalEndDate: '2027-03-31',
  status: 'not_started',
  riskLevel: 'low',
  narrative: 'No drawdowns triggered. Full reserve intact.',
  milestones: [],
  funding: [
    { source: 'GOJ', committed: 15000, disbursed: 0 },
  ],
  actuals: snap([0, 0, 0, 0, 0, 0]),
  isContingency: true,
  mediumTermProjection: [15000, 21600, 43800, 57900],
};

const hillsToOcean: CapitalProject = {
  id: 'hills_to_ocean',
  code: '29571',
  name: 'Hills to Ocean',
  currentYearBudget: 119.957,
  currentYearSpent: 42.385,
  totalProjectCost: 580,
  cumulativeSpend: 312,
  financialProgressPct: 53.8,
  physicalProgressPct: 58,
  startDate: '2024-01-01',
  originalEndDate: '2027-09-30',
  revisedEndDate: '2027-12-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Coastal assessment phase complete. Watershed management implementation delayed 3 months due to procurement. EU disbursement on track.',
  milestones: [
    { name: 'Coastal vulnerability assessment', plannedDate: '2025-06-30', actualDate: '2025-07-15', status: 'completed', weightPct: 25 },
    { name: 'Watershed management plan', plannedDate: '2026-06-30', actualDate: '2026-06-28', status: 'completed', weightPct: 25 },
    { name: 'Implementation phase 1', plannedDate: '2026-12-31', revisedDate: '2027-03-31', status: 'in_progress', weightPct: 30 },
    { name: 'Monitoring & evaluation', plannedDate: '2027-06-30', revisedDate: '2027-09-30', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 200, disbursed: 142 },
    { source: 'EU', committed: 380, disbursed: 170, nextTrancheDate: '2026-12-01', conditions: 'Q2 progress report submission' },
  ],
  actuals: snap([3, 7, 13, 21, 31, 42.385]),
};

const agriCoastal: CapitalProject = {
  id: 'agri_coastal_resilience',
  code: '29399',
  name: 'Agri & Coastal Resilience',
  currentYearBudget: 30,
  currentYearSpent: 8.4,
  totalProjectCost: 120,
  cumulativeSpend: 78,
  financialProgressPct: 65,
  physicalProgressPct: 62,
  startDate: '2024-06-01',
  originalEndDate: '2027-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Soil conservation works ongoing in St. Thomas. Coastal planting programme on schedule.',
  milestones: [
    { name: 'Site assessment', plannedDate: '2024-12-31', actualDate: '2024-12-20', status: 'completed', weightPct: 20 },
    { name: 'Soil conservation works', plannedDate: '2026-06-30', actualDate: '2026-06-15', status: 'completed', weightPct: 30 },
    { name: 'Coastal planting programme', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 30 },
    { name: 'Evaluation & handover', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 120, disbursed: 78 },
  ],
  actuals: snap([0.5, 1.3, 2.5, 4.3, 6.3, 8.4]),
};

const allProjects: CapitalProject[] = [
  raisUpgrade, publicSectorTransformation, contingency, hillsToOcean, agriCoastal,
];

/* ------------------------------------------------------------------ */
/*  Revenue                                                           */
/* ------------------------------------------------------------------ */

const revenueActuals = snap([93450, 197970, 299500, 401040, 505600, 613200]);
const revenuePriorYear = pySnap(1100000, W_REV);

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                 */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  debtAmortisation.actuals, debtInterest.actuals, pensions.actuals,
  healthInsurance.actuals, catastropheInsurance.actuals,
  memberships.actuals, publicBodyTransfers.actuals,
);
const fixedPY = sumSnaps(
  debtAmortisation.priorYearActuals, debtInterest.priorYearActuals, pensions.priorYearActuals,
  healthInsurance.priorYearActuals, catastropheInsurance.priorYearActuals,
  memberships.priorYearActuals, publicBodyTransfers.priorYearActuals,
);

const opsActuals = sumSnaps(
  taj.actuals, customs.actuals, accountantGeneral.actuals,
  pioj.actuals, statin.actuals, ppc.actuals,
  coreMinistry.actuals, fid.actuals, rpd.actuals,
);
const opsPY = sumSnaps(
  taj.priorYearActuals, customs.priorYearActuals, accountantGeneral.priorYearActuals,
  pioj.priorYearActuals, statin.priorYearActuals, ppc.priorYearActuals,
  coreMinistry.priorYearActuals, fid.priorYearActuals, rpd.priorYearActuals,
);

const capActuals = sumSnaps(
  raisUpgrade.actuals, publicSectorTransformation.actuals,
  contingency.actuals, hillsToOcean.actuals, agriCoastal.actuals,
);
const capPY = pySnap(2000, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                          */
/* ------------------------------------------------------------------ */

export const mofData: MinistryData = {
  overview: {
    id: 'mof',
    name: 'Ministry of Finance & the Public Service',
    shortName: 'Finance',
    minister: mofLeadership[0],
    totalAllocation: 583400,
    priorYearAllocation: 520000,
    totalSpent: 287300,
    recurrentTotal: 565500,
    capitalTotal: 17900,
    lastUpdated: '2026-04-15',
    actuals: snap([64500, 97400, 150300, 181000, 213600, 287300]),
    priorYearActuals: pySnap(508000, W_LIN),
  },

  revenue: {
    totalCollected: 613200,
    totalTarget: 599800,
    variance: 13400,
    variancePct: 2.2,
    bySplit: [
      { entity: 'TAJ', amount: 412000, pct: 67.2 },
      { entity: 'Jamaica Customs', amount: 198000, pct: 32.3 },
      { entity: 'Revenue Protection', amount: 3200, pct: 0.5 },
    ],
    actuals: revenueActuals,
    priorYearActuals: revenuePriorYear,
  },

  fixedObligations: {
    totalAllocation: 464550,
    priorYearAllocation: 427950,
    totalPaid: 247030,
    pctOfMinistry: 79.6,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 100950,
    priorYearAllocation: 75550,
    totalSpent: 32296,
    utilizationPct: 32.0,
    entities: allEntities,
    totalFilledPosts: 6793,
    totalApprovedPosts: 7632,
    vacancyRate: 11.0,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 17903,
    priorYearAllocation: 16500,
    totalSpent: 583.758,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: mofLeadership,
};
