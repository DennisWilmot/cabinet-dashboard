import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_BACK, EMPTY_REVENUE } from '../helpers';
import { justiceLeadership, justiceEntityOfficers } from '../people/justice';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (3)                                              */
/* ------------------------------------------------------------------ */

const legalAidFund: Obligation = {
  id: 'legal_aid_fund',
  type: 'legal_aid',
  name: 'Legal Aid Fund',
  headCode: '28000',
  allocation: 1400,
  priorYearAllocation: 1250,
  paid: 700,
  paymentStatus: 'current',
  actuals: snap([117, 233, 350, 467, 583, 700]),
  priorYearActuals: pySnap(1200, W_LIN),
  details: {
    beneficiaries: 4200,
    casesSupported: 3150,
    averageGrantPerCase: 0.44,
    waitlistLength: 680,
  },
};

const judicialAllowances: Obligation = {
  id: 'judicial_allowances',
  type: 'judicial_allowance',
  name: 'Judicial Allowances & Benefits',
  headCode: '28058',
  allocation: 900,
  priorYearAllocation: 850,
  paid: 468,
  paymentStatus: 'current',
  actuals: snap([78, 156, 234, 312, 390, 468]),
  priorYearActuals: pySnap(820, W_LIN),
  details: {
    components: [
      { name: 'Judges Robing Allowance', budget: 320, paid: 166, status: 'current' },
      { name: 'Judicial Travel Allowance', budget: 280, paid: 146, status: 'current' },
      { name: 'Duty Allowance – Court Staff', budget: 300, paid: 156, status: 'current' },
    ],
  },
};

const judgesPension: Obligation = {
  id: 'judges_pension',
  type: 'pension',
  name: 'Judges Pension Supplement',
  headCode: '28058',
  allocation: 400,
  priorYearAllocation: 400,
  paid: 200,
  paymentStatus: 'current',
  actuals: snap([33, 67, 100, 133, 167, 200]),
  priorYearActuals: pySnap(380, W_LIN),
  details: {
    pensionerCount: 48,
    byCategory: [
      { category: 'Supreme Court Judges (Ret.)', count: 22 },
      { category: 'Appeal Court Judges (Ret.)', count: 14 },
      { category: 'Parish Court Judges (Ret.)', count: 12 },
    ],
    arrearsOutstanding: 0,
    yoyGrowth: 5.3,
  },
};

const allObligations: Obligation[] = [legalAidFund, judicialAllowances, judgesPension];

/* ------------------------------------------------------------------ */
/*  Operational Entities (6)                                           */
/* ------------------------------------------------------------------ */

const judiciary: OperationalEntity = {
  id: 'judiciary',
  name: 'The Judiciary',
  headCode: '28058',
  allocation: 12900,
  priorYearAllocation: 11800,
  spent: 6321,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 2200, filledPosts: 1980, vacantPosts: 220, vacancyRate: 10.0 },
  kpis: [
    { name: 'Case Backlog', type: 'outcome', unit: 'count', target: 10000, actual: 15000, priorYearActual: 14200 },
    { name: 'Case Clearance Rate', type: 'outcome', unit: '%', target: 85, actual: 72, priorYearActual: 68 },
    { name: 'Average Time to Disposition', type: 'output', unit: 'months', target: 12, actual: 18.5, priorYearActual: 20.1 },
    { name: 'E-Filing Adoption', type: 'output', unit: '%', target: 50, actual: 38, priorYearActual: 25 },
  ],
  actuals: snap([1010, 2060, 3110, 4180, 5260, 6321]),
  priorYearActuals: pySnap(11400, W_LIN),
  headOfficer: justiceEntityOfficers.judiciary,
};

const dpp: OperationalEntity = {
  id: 'dpp',
  name: 'Office of the Director of Public Prosecutions',
  headCode: '28025',
  allocation: 1800,
  priorYearAllocation: 1650,
  spent: 864,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 340, filledPosts: 300, vacantPosts: 40, vacancyRate: 11.8 },
  kpis: [
    { name: 'Prosecution Success Rate', type: 'outcome', unit: '%', target: 75, actual: 69, priorYearActual: 66 },
    { name: 'Cases Reviewed within SLA', type: 'output', unit: '%', target: 90, actual: 78, priorYearActual: 74 },
    { name: 'Average File Review Time', type: 'output', unit: 'days', target: 21, actual: 28, priorYearActual: 32 },
  ],
  actuals: snap([138, 284, 428, 576, 720, 864]),
  priorYearActuals: pySnap(1580, W_LIN),
  headOfficer: justiceEntityOfficers.dpp,
};

const ag: OperationalEntity = {
  id: 'ag',
  name: "Attorney General's Department",
  headCode: '28031',
  allocation: 1500,
  priorYearAllocation: 1400,
  spent: 750,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 250, filledPosts: 220, vacantPosts: 30, vacancyRate: 12.0 },
  kpis: [
    { name: 'Legal Opinions Delivered', type: 'output', unit: 'count', target: 120, actual: 55, priorYearActual: 108 },
    { name: 'Treaties & Agreements Reviewed', type: 'output', unit: 'count', target: 30, actual: 12, priorYearActual: 26 },
    { name: 'Litigation Cases Managed', type: 'output', unit: 'count', target: 200, actual: 95, priorYearActual: 185 },
  ],
  actuals: snap([120, 248, 375, 500, 625, 750]),
  priorYearActuals: pySnap(1350, W_LIN),
  headOfficer: justiceEntityOfficers.ag,
};

const adminGeneral: OperationalEntity = {
  id: 'admin_general',
  name: "Administrator General's Department",
  headCode: '28030',
  allocation: 600,
  priorYearAllocation: 550,
  spent: 294,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 120, filledPosts: 105, vacantPosts: 15, vacancyRate: 12.5 },
  kpis: [
    { name: 'Estates Administered', type: 'output', unit: 'count', target: 1200, actual: 540, priorYearActual: 1050 },
    { name: 'Estate Settlement Turnaround', type: 'output', unit: 'months', target: 18, actual: 26, priorYearActual: 28 },
  ],
  actuals: snap([47, 97, 146, 196, 245, 294]),
  priorYearActuals: pySnap(530, W_LIN),
  headOfficer: justiceEntityOfficers.admin_general,
};

const legalAffairs: OperationalEntity = {
  id: 'legal_affairs',
  name: 'Legal Affairs Division',
  headCode: '27000',
  allocation: 1200,
  priorYearAllocation: 1100,
  spent: 576,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 180, filledPosts: 158, vacantPosts: 22, vacancyRate: 12.2 },
  kpis: [
    { name: 'Legislative Amendments Drafted', type: 'output', unit: 'count', target: 24, actual: 9, priorYearActual: 20 },
    { name: 'International Legal Obligations Met', type: 'outcome', unit: '%', target: 100, actual: 88, priorYearActual: 85 },
  ],
  actuals: snap([92, 190, 285, 384, 480, 576]),
  priorYearActuals: pySnap(1060, W_LIN),
};

const justiceCoreMinistry: OperationalEntity = {
  id: 'justice_core_ministry',
  name: 'Core Ministry Divisions',
  headCode: '28000',
  allocation: 1110,
  priorYearAllocation: 1000,
  spent: 555,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 160, filledPosts: 140, vacantPosts: 20, vacancyRate: 12.5 },
  kpis: [
    { name: 'Policy Directives Issued', type: 'output', unit: 'count', target: 18, actual: 8, priorYearActual: 15 },
    { name: 'Restorative Justice Referrals', type: 'outcome', unit: 'count', target: 500, actual: 190, priorYearActual: 420 },
  ],
  actuals: snap([89, 183, 275, 370, 463, 555]),
  priorYearActuals: pySnap(960, W_LIN),
};

const allEntities: OperationalEntity[] = [
  judiciary, dpp, ag, adminGeneral, legalAffairs, justiceCoreMinistry,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                               */
/* ------------------------------------------------------------------ */

const courtDigitization: CapitalProject = {
  id: 'court_digitization',
  code: '28601',
  name: 'Court Digitization Programme',
  currentYearBudget: 55,
  currentYearSpent: 28.6,
  totalProjectCost: 240,
  cumulativeSpend: 128,
  financialProgressPct: 53.3,
  physicalProgressPct: 48,
  startDate: '2024-10-01',
  originalEndDate: '2027-09-30',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'E-filing rollout to Supreme Court complete. Parish court digitisation facing vendor delays. Case management system integration in testing.',
  milestones: [
    { name: 'Supreme Court e-filing', plannedDate: '2026-03-31', actualDate: '2026-03-10', status: 'completed', weightPct: 30 },
    { name: 'Parish court digitisation', plannedDate: '2027-03-31', revisedDate: '2027-06-30', status: 'in_progress', weightPct: 35 },
    { name: 'Case management integration', plannedDate: '2027-06-30', status: 'in_progress', weightPct: 20 },
    { name: 'Training & rollout', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 160, disbursed: 88 },
    { source: 'CIDA', committed: 80, disbursed: 40, nextTrancheDate: '2026-12-01', conditions: 'Parish court pilot completion' },
  ],
  actuals: snap([2.5, 6.0, 11.0, 17.0, 23.0, 28.6]),
};

const courtInfrastructure: CapitalProject = {
  id: 'court_infrastructure',
  code: '28602',
  name: 'Court Infrastructure Improvement',
  currentYearBudget: 33,
  currentYearSpent: 13.2,
  totalProjectCost: 95,
  cumulativeSpend: 52,
  financialProgressPct: 54.7,
  physicalProgressPct: 50,
  startDate: '2025-04-01',
  originalEndDate: '2027-03-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Kingston Parish Court renovation 60% complete. Montego Bay courthouse HVAC replacement delayed by supply-chain issues.',
  milestones: [
    { name: 'Kingston Parish Court renovation', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 45 },
    { name: 'Montego Bay HVAC replacement', plannedDate: '2026-12-31', revisedDate: '2027-03-31', status: 'delayed', weightPct: 30 },
    { name: 'Accessibility upgrades (5 courts)', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 95, disbursed: 52 },
  ],
  actuals: snap([1.0, 2.5, 4.5, 7.2, 10.2, 13.2]),
};

const allProjects: CapitalProject[] = [courtDigitization, courtInfrastructure];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  legalAidFund.actuals, judicialAllowances.actuals, judgesPension.actuals,
);
const fixedPY = sumSnaps(
  legalAidFund.priorYearActuals, judicialAllowances.priorYearActuals, judgesPension.priorYearActuals,
);

const opsActuals = sumSnaps(
  judiciary.actuals, dpp.actuals, ag.actuals,
  adminGeneral.actuals, legalAffairs.actuals, justiceCoreMinistry.actuals,
);
const opsPY = sumSnaps(
  judiciary.priorYearActuals, dpp.priorYearActuals, ag.priorYearActuals,
  adminGeneral.priorYearActuals, legalAffairs.priorYearActuals, justiceCoreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(
  courtDigitization.actuals, courtInfrastructure.actuals,
);
const capPY = pySnap(80, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const justiceData: MinistryData = {
  overview: {
    id: 'justice',
    name: 'Ministry of Justice & Constitutional Affairs',
    shortName: 'Justice',
    minister: justiceLeadership[0],
    totalAllocation: 21898,
    priorYearAllocation: 20177,
    totalSpent: 10728,
    recurrentTotal: 21810,
    capitalTotal: 88,
    actuals: snap([1720, 3550, 5400, 7200, 9000, 10728]),
    priorYearActuals: pySnap(19500, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 2700,
    priorYearAllocation: 2500,
    totalPaid: 1368,
    pctOfMinistry: 12.3,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 19110,
    priorYearAllocation: 17597,
    totalSpent: 9360,
    utilizationPct: 49.0,
    entities: allEntities,
    totalFilledPosts: 2903,
    totalApprovedPosts: 3250,
    vacancyRate: 10.7,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 88,
    priorYearAllocation: 80,
    totalSpent: 41.8,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: justiceLeadership,
};
