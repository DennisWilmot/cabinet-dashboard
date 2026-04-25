import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { industryLeadership, industryEntityOfficers } from '../people/industry';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (5)                                              */
/* ------------------------------------------------------------------ */

const jamproGrant: Obligation = {
  id: 'jampro_grant',
  type: 'public_body_transfer',
  name: 'JAMPRO Recurrent Grant',
  headCode: '53000',
  allocation: 1800,
  priorYearAllocation: 1550,
  paid: 900,
  paymentStatus: 'current',
  actuals: snap([150, 300, 450, 600, 750, 900]),
  priorYearActuals: pySnap(1550, W_LIN),
  details: {
    entities: [
      { name: 'JAMPRO Operations', budget: 1200, transferred: 600, status: 'partial' },
      { name: 'JAMPRO Investment Promotion', budget: 600, transferred: 300, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const bsjGrant: Obligation = {
  id: 'bsj_grant',
  type: 'public_body_transfer',
  name: 'Bureau of Standards Jamaica Grant',
  headCode: '53000',
  allocation: 1200,
  priorYearAllocation: 1050,
  paid: 600,
  paymentStatus: 'current',
  actuals: snap([100, 200, 300, 400, 500, 600]),
  priorYearActuals: pySnap(1050, W_LIN),
  details: {
    entities: [
      { name: 'BSJ Laboratory Operations', budget: 750, transferred: 375, status: 'partial' },
      { name: 'BSJ Standards Development', budget: 450, transferred: 225, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const competitionCommission: Obligation = {
  id: 'competition_commission',
  type: 'public_body_transfer',
  name: 'Fair Trading Commission',
  headCode: '53000',
  allocation: 600,
  priorYearAllocation: 500,
  paid: 300,
  paymentStatus: 'current',
  actuals: snap([50, 100, 150, 200, 250, 300]),
  priorYearActuals: pySnap(500, W_LIN),
  details: {
    entities: [
      { name: 'FTC Operations', budget: 600, transferred: 300, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const tradeBoardTransfer: Obligation = {
  id: 'trade_board_transfer',
  type: 'public_body_transfer',
  name: 'Trade Board Transfer',
  headCode: '53000',
  allocation: 400,
  priorYearAllocation: 270,
  paid: 200,
  paymentStatus: 'current',
  actuals: snap([33, 67, 100, 133, 167, 200]),
  priorYearActuals: pySnap(270, W_LIN),
  details: {
    entities: [
      { name: 'Trade Board Ltd', budget: 400, transferred: 200, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const consumerAffairs: Obligation = {
  id: 'consumer_affairs',
  type: 'public_body_transfer',
  name: 'Consumer Affairs Commission Grant',
  headCode: '53000',
  allocation: 200,
  priorYearAllocation: 139,
  paid: 200,
  paymentStatus: 'paid',
  actuals: snap([100, 200, 200, 200, 200, 200]),
  priorYearActuals: pySnap(139, W_FRONT),
  details: {
    entities: [
      { name: 'CAC Operations', budget: 200, transferred: 200, status: 'paid' },
    ],
    utilizationPct: 100.0,
  },
};

const allObligations: Obligation[] = [
  jamproGrant, bsjGrant, competitionCommission, tradeBoardTransfer, consumerAffairs,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                           */
/* ------------------------------------------------------------------ */

const companiesOffice: OperationalEntity = {
  id: 'companies_office',
  name: 'Office of the Registrar of Companies',
  headCode: '53038',
  allocation: 1200,
  priorYearAllocation: 1050,
  spent: 600,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 180, filledPosts: 158, vacantPosts: 22, vacancyRate: 12.2 },
  kpis: [
    { name: 'Business Registrations Processed', type: 'output', unit: 'count', target: 12000, actual: 6400, priorYearActual: 11000 },
    { name: 'Registration Processing Time', type: 'outcome', unit: 'days', target: 5, actual: 7, priorYearActual: 8 },
    { name: 'Online Filing Adoption', type: 'output', unit: '%', target: 75, actual: 68, priorYearActual: 60 },
  ],
  actuals: snap([98, 198, 300, 400, 500, 600]),
  priorYearActuals: pySnap(1050, W_LIN),
  headOfficer: industryEntityOfficers.registrar,
};

const tradeDivisions: OperationalEntity = {
  id: 'trade_divisions',
  name: 'Trade & Commerce Divisions',
  headCode: '53000',
  allocation: 1000,
  priorYearAllocation: 850,
  spent: 490,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 120, filledPosts: 104, vacantPosts: 16, vacancyRate: 13.3 },
  kpis: [
    { name: 'Trade Agreements Monitored', type: 'output', unit: 'count', target: 24, actual: 11, priorYearActual: 22 },
    { name: 'FTA Utilisation Rate', type: 'outcome', unit: '%', target: 55, actual: 42, priorYearActual: 38 },
    { name: 'Export Facilitation Certificates', type: 'output', unit: 'count', target: 3000, actual: 1620, priorYearActual: 2800 },
  ],
  actuals: snap([80, 162, 245, 327, 408, 490]),
  priorYearActuals: pySnap(850, W_LIN),
};

const standardsBureau: OperationalEntity = {
  id: 'standards_bureau',
  name: 'Standards & Certification Division',
  headCode: '53000',
  allocation: 800,
  priorYearAllocation: 680,
  spent: 392,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 100, filledPosts: 88, vacantPosts: 12, vacancyRate: 12.0 },
  kpis: [
    { name: 'Product Certifications Issued', type: 'output', unit: 'count', target: 600, actual: 280, priorYearActual: 540 },
    { name: 'Certification Turnaround', type: 'outcome', unit: 'days', target: 15, actual: 22, priorYearActual: 25 },
    { name: 'Standards Published', type: 'output', unit: 'count', target: 30, actual: 14, priorYearActual: 26 },
  ],
  actuals: snap([64, 130, 196, 262, 327, 392]),
  priorYearActuals: pySnap(680, W_LIN),
};

const commerceInvestment: OperationalEntity = {
  id: 'commerce_investment',
  name: 'Commerce & Investment Division',
  headCode: '53000',
  allocation: 769,
  priorYearAllocation: 520,
  spent: 377,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 95, filledPosts: 82, vacantPosts: 13, vacancyRate: 13.7 },
  kpis: [
    { name: 'FDI Attracted', type: 'outcome', unit: 'US$M', target: 800, actual: 350, priorYearActual: 680 },
    { name: 'Investment Proposals Reviewed', type: 'output', unit: 'count', target: 120, actual: 52, priorYearActual: 105 },
    { name: 'SEZ Investor Onboarding', type: 'output', unit: 'count', target: 25, actual: 9, priorYearActual: 18 },
  ],
  actuals: snap([62, 125, 189, 252, 314, 377]),
  priorYearActuals: pySnap(520, W_LIN),
};

const industryCoreMinistry: OperationalEntity = {
  id: 'industry_core_ministry',
  name: 'Core Ministry Administration',
  headCode: '53000',
  allocation: 600,
  priorYearAllocation: 400,
  spent: 288,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 80, filledPosts: 68, vacantPosts: 12, vacancyRate: 15.0 },
  kpis: [
    { name: 'Policy Papers Completed', type: 'output', unit: 'count', target: 10, actual: 4, priorYearActual: 8 },
    { name: 'Stakeholder Engagements', type: 'output', unit: 'count', target: 20, actual: 8, priorYearActual: 17 },
  ],
  actuals: snap([47, 95, 144, 192, 240, 288]),
  priorYearActuals: pySnap(400, W_LIN),
};

const allEntities: OperationalEntity[] = [
  companiesOffice, tradeDivisions, standardsBureau, commerceInvestment, industryCoreMinistry,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                               */
/* ------------------------------------------------------------------ */

const tradeFacilitation: CapitalProject = {
  id: 'trade_facilitation',
  code: '53601',
  name: 'National Trade Facilitation Platform',
  currentYearBudget: 400,
  currentYearSpent: 80,
  totalProjectCost: 1200,
  cumulativeSpend: 380,
  financialProgressPct: 31.7,
  physicalProgressPct: 35,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Single-window trade system design completed. API integrations with Jamaica Customs underway. Stakeholder testing Q3.',
  milestones: [
    { name: 'System architecture & design', plannedDate: '2025-12-31', actualDate: '2026-01-15', status: 'completed', weightPct: 20 },
    { name: 'Core platform development', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 35 },
    { name: 'Agency integrations', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'UAT & go-live', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 800, disbursed: 280 },
    { source: 'IDB', committed: 400, disbursed: 100, nextTrancheDate: '2027-01-15', conditions: 'Platform development milestone' },
  ],
  actuals: snap([6, 15, 28, 45, 62, 80]),
  mediumTermProjection: [400, 450, 350, 0],
};

const sezDevelopment: CapitalProject = {
  id: 'sez_development',
  code: '53602',
  name: 'Special Economic Zone Development',
  currentYearBudget: 250,
  currentYearSpent: 50,
  totalProjectCost: 950,
  cumulativeSpend: 260,
  financialProgressPct: 27.4,
  physicalProgressPct: 25,
  startDate: '2025-01-01',
  originalEndDate: '2028-06-30',
  revisedEndDate: '2028-12-31',
  status: 'at_risk',
  riskLevel: 'high',
  narrative: 'Caymanas SEZ infrastructure planning ongoing. Environmental impact assessment delayed pending NEPA review. Investor interest strong but approvals lagging.',
  milestones: [
    { name: 'Feasibility & EIA', plannedDate: '2025-12-31', revisedDate: '2026-06-30', status: 'delayed', weightPct: 20 },
    { name: 'Infrastructure design', plannedDate: '2026-09-30', revisedDate: '2027-03-31', status: 'in_progress', weightPct: 25 },
    { name: 'Phase 1 construction', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 35 },
    { name: 'Investor onboarding', plannedDate: '2028-06-30', revisedDate: '2028-12-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 600, disbursed: 180 },
    { source: 'CDB', committed: 350, disbursed: 80, nextTrancheDate: '2027-06-01', conditions: 'EIA approval and Phase 1 commencement' },
  ],
  actuals: snap([4, 10, 18, 28, 39, 50]),
  mediumTermProjection: [250, 350, 350, 0],
};

const allProjects: CapitalProject[] = [tradeFacilitation, sezDevelopment];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  jamproGrant.actuals, bsjGrant.actuals, competitionCommission.actuals,
  tradeBoardTransfer.actuals, consumerAffairs.actuals,
);
const fixedPY = sumSnaps(
  jamproGrant.priorYearActuals, bsjGrant.priorYearActuals, competitionCommission.priorYearActuals,
  tradeBoardTransfer.priorYearActuals, consumerAffairs.priorYearActuals,
);

const opsActuals = sumSnaps(
  companiesOffice.actuals, tradeDivisions.actuals, standardsBureau.actuals,
  commerceInvestment.actuals, industryCoreMinistry.actuals,
);
const opsPY = sumSnaps(
  companiesOffice.priorYearActuals, tradeDivisions.priorYearActuals, standardsBureau.priorYearActuals,
  commerceInvestment.priorYearActuals, industryCoreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(tradeFacilitation.actuals, sezDevelopment.actuals);
const capPY = pySnap(500, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const industryData: MinistryData = {
  overview: {
    id: 'industry',
    name: 'Ministry of Industry, Investment & Commerce',
    shortName: 'Industry',
    minister: industryLeadership[0],
    totalAllocation: 9219,
    priorYearAllocation: 7509,
    totalSpent: 4377,
    recurrentTotal: 8569,
    capitalTotal: 650,
    actuals: snap([694, 1402, 2120, 2839, 3557, 4377]),
    priorYearActuals: pySnap(6049, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 4200,
    priorYearAllocation: 3509,
    totalPaid: 2200,
    pctOfMinistry: 45.6,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 4369,
    priorYearAllocation: 3500,
    totalSpent: 2147,
    utilizationPct: 49.2,
    entities: allEntities,
    totalFilledPosts: 500,
    totalApprovedPosts: 575,
    vacancyRate: 13.0,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 650,
    priorYearAllocation: 500,
    totalSpent: 130,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: industryLeadership,
};
