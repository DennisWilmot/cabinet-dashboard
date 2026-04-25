import type {
  MinistryData,
  MonthlySnapshot,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { foreignAffairsLeadership, foreignAffairsEntityOfficers } from '../people/foreign-affairs';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (4)                                             */
/* ------------------------------------------------------------------ */

const intlMemberships: Obligation = {
  id: 'fa_intl_memberships',
  type: 'membership_fee',
  name: 'International Organisation Membership Fees',
  headCode: '30000',
  allocation: 1850,
  priorYearAllocation: 1550,
  paid: 1480,
  paymentStatus: 'current',
  actuals: snap([620, 920, 1100, 1250, 1380, 1480]),
  priorYearActuals: pySnap(1500, W_FRONT),
  details: {
    organizations: [
      { name: 'United Nations (Regular)', budget: 520, paid: 520, status: 'paid' },
      { name: 'CARICOM Secretariat', budget: 285, paid: 285, status: 'paid' },
      { name: 'Organisation of American States', budget: 210, paid: 210, status: 'paid' },
      { name: 'Commonwealth Secretariat', budget: 175, paid: 175, status: 'paid' },
      { name: 'WTO', budget: 145, paid: 120, status: 'partial' },
      { name: 'ACS (Assoc. of Caribbean States)', budget: 95, paid: 65, status: 'partial' },
      { name: 'International Seabed Authority', budget: 80, paid: 50, status: 'partial' },
      { name: 'IAEA', budget: 72, paid: 55, status: 'partial' },
      { name: 'ICC (Int\'l Criminal Court)', budget: 68, paid: 0, status: 'pending' },
      { name: 'Other multilateral bodies', budget: 200, paid: 0, status: 'pending' },
    ],
    overdueCount: 0,
  },
};

const embassyLeases: Obligation = {
  id: 'embassy_leases',
  type: 'lease_obligation',
  name: 'Embassy & Mission Lease Obligations',
  headCode: '30000',
  allocation: 1200,
  priorYearAllocation: 1020,
  paid: 600,
  paymentStatus: 'current',
  actuals: snap([100, 200, 300, 400, 500, 600]),
  priorYearActuals: pySnap(990, W_LIN),
  details: {
    components: [
      { name: 'Washington DC (Embassy + Consulate)', budget: 210, paid: 105, status: 'current' },
      { name: 'London (High Commission)', budget: 185, paid: 92, status: 'current' },
      { name: 'Ottawa (High Commission)', budget: 125, paid: 63, status: 'current' },
      { name: 'New York (UN Mission)', budget: 165, paid: 83, status: 'current' },
      { name: 'Miami (Consulate General)', budget: 95, paid: 48, status: 'current' },
      { name: 'Tokyo (Embassy)', budget: 80, paid: 40, status: 'current' },
      { name: 'Brussels (Embassy to EU)', budget: 75, paid: 38, status: 'current' },
      { name: 'Other missions (15)', budget: 265, paid: 131, status: 'current' },
    ],
  },
};

const diplomaticAllowances: Obligation = {
  id: 'diplomatic_allowances',
  type: 'allowance',
  name: 'Diplomatic Allowances & Immunities',
  headCode: '30000',
  allocation: 650,
  priorYearAllocation: 550,
  paid: 325,
  paymentStatus: 'current',
  actuals: snap([54, 108, 163, 217, 271, 325]),
  priorYearActuals: pySnap(535, W_LIN),
  details: {
    components: [
      { name: 'Foreign Service Allowances', budget: 380, paid: 190, status: 'current' },
      { name: 'Housing & Utilities (Overseas)', budget: 165, paid: 83, status: 'current' },
      { name: 'Education Allowances (Dependents)', budget: 68, paid: 34, status: 'current' },
      { name: 'Hardship & Security Allowances', budget: 37, paid: 18, status: 'current' },
    ],
  },
};

const caricomContributions: Obligation = {
  id: 'caricom_commonwealth',
  type: 'membership_fee',
  name: 'CARICOM & Commonwealth Programme Contributions',
  headCode: '30000',
  allocation: 328,
  priorYearAllocation: 280,
  paid: 240,
  paymentStatus: 'current',
  actuals: snap([95, 160, 195, 215, 230, 240]),
  priorYearActuals: pySnap(265, W_FRONT),
  details: {
    organizations: [
      { name: 'CARICOM Development Fund', budget: 120, paid: 120, status: 'paid' },
      { name: 'CSME Implementation', budget: 85, paid: 60, status: 'partial' },
      { name: 'Commonwealth Foundation', budget: 58, paid: 30, status: 'partial' },
      { name: 'Caribbean Court of Justice', budget: 65, paid: 30, status: 'partial' },
    ],
    overdueCount: 0,
  },
};

const allObligations: Obligation[] = [
  intlMemberships, embassyLeases, diplomaticAllowances, caricomContributions,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities (6)                                          */
/* ------------------------------------------------------------------ */

const coreForeignService: OperationalEntity = {
  id: 'fa_core',
  name: 'Core Foreign Service Divisions',
  headCode: '30000',
  allocation: 1450,
  priorYearAllocation: 1250,
  spent: 710,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 650, filledPosts: 590, vacantPosts: 60, vacancyRate: 9.2 },
  kpis: [
    { name: 'Diplomatic Notes Processed', type: 'output', unit: 'count', target: 2000, actual: 950, priorYearActual: 1800 },
    { name: 'Policy Briefs Delivered', type: 'output', unit: 'count', target: 60, actual: 26, priorYearActual: 52 },
    { name: 'Staff Rotation Cycle Compliance', type: 'outcome', unit: '%', target: 95, actual: 88, priorYearActual: 91 },
  ],
  actuals: snap([115, 236, 353, 474, 593, 710]),
  priorYearActuals: pySnap(1210, W_LIN),
};

const bilateralRelations: OperationalEntity = {
  id: 'bilateral_relations',
  name: 'Bilateral Relations Division',
  headCode: '30000',
  allocation: 980,
  priorYearAllocation: 830,
  spent: 480,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 480, filledPosts: 432, vacantPosts: 48, vacancyRate: 10.0 },
  kpis: [
    { name: 'Bilateral Agreements Signed', type: 'output', unit: 'count', target: 12, actual: 4, priorYearActual: 10 },
    { name: 'Trade Missions Facilitated', type: 'output', unit: 'count', target: 20, actual: 7, priorYearActual: 16 },
    { name: 'High-Level Visits Coordinated', type: 'output', unit: 'count', target: 30, actual: 14, priorYearActual: 26 },
  ],
  actuals: snap([78, 160, 239, 320, 400, 480]),
  priorYearActuals: pySnap(805, W_LIN),
};

const multilateralAffairs: OperationalEntity = {
  id: 'multilateral_affairs',
  name: 'Multilateral Affairs Division',
  headCode: '30000',
  allocation: 720,
  priorYearAllocation: 610,
  spent: 353,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 520, filledPosts: 462, vacantPosts: 58, vacancyRate: 11.2 },
  kpis: [
    { name: 'UN/OAS Resolutions Participated', type: 'output', unit: 'count', target: 85, actual: 38, priorYearActual: 78 },
    { name: 'Jamaica Candidatures Supported', type: 'outcome', unit: 'count', target: 8, actual: 2, priorYearActual: 6 },
    { name: 'Int\'l Conference Delegations', type: 'output', unit: 'count', target: 40, actual: 18, priorYearActual: 35 },
  ],
  actuals: snap([57, 117, 175, 235, 294, 353]),
  priorYearActuals: pySnap(590, W_LIN),
};

const protocolConsular: OperationalEntity = {
  id: 'protocol_consular',
  name: 'Protocol & Consular Services',
  headCode: '30000',
  allocation: 650,
  priorYearAllocation: 550,
  spent: 319,
  utilizationPct: 49.1,
  staffing: { approvedPosts: 420, filledPosts: 382, vacantPosts: 38, vacancyRate: 9.0 },
  kpis: [
    { name: 'Consular Cases Processed', type: 'output', unit: 'count', target: 45000, actual: 18500, priorYearActual: 40000 },
    { name: 'Passport Turnaround Time', type: 'output', unit: 'days', target: 10, actual: 14, priorYearActual: 12 },
    { name: 'Diplomatic Events Coordinated', type: 'output', unit: 'count', target: 120, actual: 55, priorYearActual: 105 },
  ],
  actuals: snap([52, 106, 159, 213, 266, 319]),
  priorYearActuals: pySnap(530, W_LIN),
};

const tradePromotion: OperationalEntity = {
  id: 'trade_promotion',
  name: 'Trade Promotion Division',
  headCode: '30000',
  allocation: 480,
  priorYearAllocation: 400,
  spent: 230,
  utilizationPct: 47.9,
  staffing: { approvedPosts: 380, filledPosts: 338, vacantPosts: 42, vacancyRate: 11.1 },
  kpis: [
    { name: 'Trade Enquiries Facilitated', type: 'output', unit: 'count', target: 3000, actual: 1350, priorYearActual: 2700 },
    { name: 'Export Market Diversification', type: 'outcome', unit: 'markets', target: 15, actual: 5, priorYearActual: 12 },
    { name: 'Trade Agreement Negotiations', type: 'output', unit: 'count', target: 6, actual: 2, priorYearActual: 5 },
  ],
  actuals: snap([36, 74, 113, 153, 192, 230]),
  priorYearActuals: pySnap(385, W_LIN),
};

const diasporaAffairs: OperationalEntity = {
  id: 'diaspora_affairs',
  name: 'Diaspora Affairs',
  headCode: '30000',
  allocation: 375,
  priorYearAllocation: 315,
  spent: 181,
  utilizationPct: 48.3,
  staffing: { approvedPosts: 350, filledPosts: 316, vacantPosts: 34, vacancyRate: 9.7 },
  kpis: [
    { name: 'Diaspora Engagement Events', type: 'output', unit: 'count', target: 40, actual: 14, priorYearActual: 35 },
    { name: 'Remittance Facilitation Cases', type: 'output', unit: 'count', target: 5000, actual: 2200, priorYearActual: 4500 },
    { name: 'Diaspora Direct Investment Leads', type: 'outcome', unit: 'J$M', target: 850, actual: 310, priorYearActual: 720 },
  ],
  actuals: snap([29, 60, 90, 121, 151, 181]),
  priorYearActuals: pySnap(300, W_LIN),
};

const allEntities: OperationalEntity[] = [
  coreForeignService, bilateralRelations, multilateralAffairs,
  protocolConsular, tradePromotion, diasporaAffairs,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                              */
/* ------------------------------------------------------------------ */

const embassyUpgrades: CapitalProject = {
  id: 'embassy_upgrades',
  code: '30501',
  name: 'Embassy & Mission Upgrades Programme',
  currentYearBudget: 195,
  currentYearSpent: 29,
  totalProjectCost: 580,
  cumulativeSpend: 165,
  financialProgressPct: 28.4,
  physicalProgressPct: 25,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  revisedEndDate: '2028-06-30',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'London High Commission renovation underway. Ottawa security upgrade procurement delayed 2 months. Washington DC HVAC replacement completed ahead of schedule.',
  milestones: [
    { name: 'Washington DC — HVAC & security', plannedDate: '2026-03-31', actualDate: '2026-02-28', status: 'completed', weightPct: 20 },
    { name: 'London — full renovation', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 35 },
    { name: 'Ottawa — security upgrade', plannedDate: '2027-06-30', revisedDate: '2027-08-31', status: 'in_progress', weightPct: 25 },
    { name: 'New York & Miami — fit-out', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 580, disbursed: 165 },
  ],
  actuals: snap([2, 5, 10, 16, 23, 29]),
};

const itModernization: CapitalProject = {
  id: 'fa_it_modernization',
  code: '30502',
  name: 'IT & Secure Communications Modernization',
  currentYearBudget: 73,
  currentYearSpent: 11,
  totalProjectCost: 200,
  cumulativeSpend: 85,
  financialProgressPct: 42.5,
  physicalProgressPct: 40,
  startDate: '2025-01-01',
  originalEndDate: '2027-06-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Secure comms upgrade completed for 8 of 22 missions. Cloud-based consular management system pilot in Kingston showing positive results.',
  milestones: [
    { name: 'Secure comms — Phase 1 (8 missions)', plannedDate: '2026-03-31', actualDate: '2026-03-15', status: 'completed', weightPct: 30 },
    { name: 'Consular system pilot', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 25 },
    { name: 'Secure comms — Phase 2 (14 missions)', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 30 },
    { name: 'Full rollout & training', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 200, disbursed: 85 },
  ],
  actuals: snap([0.5, 1.5, 3, 5.5, 8, 11]),
};

const allProjects: CapitalProject[] = [
  embassyUpgrades, itModernization,
];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                 */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  intlMemberships.actuals, embassyLeases.actuals,
  diplomaticAllowances.actuals, caricomContributions.actuals,
);
const fixedPY = sumSnaps(
  intlMemberships.priorYearActuals, embassyLeases.priorYearActuals,
  diplomaticAllowances.priorYearActuals, caricomContributions.priorYearActuals,
);

const opsActuals = sumSnaps(
  coreForeignService.actuals, bilateralRelations.actuals, multilateralAffairs.actuals,
  protocolConsular.actuals, tradePromotion.actuals, diasporaAffairs.actuals,
);
const opsPY = sumSnaps(
  coreForeignService.priorYearActuals, bilateralRelations.priorYearActuals, multilateralAffairs.priorYearActuals,
  protocolConsular.priorYearActuals, tradePromotion.priorYearActuals, diasporaAffairs.priorYearActuals,
);

const capActuals = sumSnaps(
  embassyUpgrades.actuals, itModernization.actuals,
);
const capPY = pySnap(225, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                          */
/* ------------------------------------------------------------------ */

export const foreignAffairsData: MinistryData = {
  overview: {
    id: 'foreign-affairs',
    name: 'Ministry of Foreign Affairs & Foreign Trade',
    shortName: 'Foreign Affairs',
    minister: foreignAffairsLeadership[0],
    totalAllocation: 8951,
    priorYearAllocation: 7580,
    totalSpent: 4958,
    recurrentTotal: 8683,
    capitalTotal: 268,
    actuals: snap([820, 1650, 2490, 3320, 4140, 4958]),
    priorYearActuals: pySnap(7200, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 4028,
    priorYearAllocation: 3400,
    totalPaid: 2645,
    pctOfMinistry: 45.0,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 4655,
    priorYearAllocation: 3955,
    totalSpent: 2273,
    utilizationPct: 48.8,
    entities: allEntities,
    totalFilledPosts: 2520,
    totalApprovedPosts: 2800,
    vacancyRate: 10.0,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 268,
    priorYearAllocation: 225,
    totalSpent: 40,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: foreignAffairsLeadership,
};
