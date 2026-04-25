import type { MinistryData, Obligation, OperationalEntity, CapitalProject } from '@/lib/types';
import { nationalSecurityLeadership, nationalSecurityEntityOfficers } from '../people/national-security';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';

/* Fixed Obligations */

const pensionContributions: Obligation = {
  id: 'ns_pensions',
  type: 'pension',
  name: 'Pension Contributions (Security Forces)',
  headCode: '26000',
  allocation: 8500,
  priorYearAllocation: 7600,
  paid: 4250,
  paymentStatus: 'current',
  actuals: snap([708, 1417, 2125, 2833, 3542, 4250]),
  priorYearActuals: pySnap(7400, W_LIN),
  details: {
    pensionerCount: 9320,
    byCategory: [
      { category: 'JCF Retirees', count: 5200 },
      { category: 'JDF Retirees', count: 2400 },
      { category: 'Correctional Officers', count: 1720 },
    ],
    arrearsOutstanding: 0,
    yoyGrowth: 11.8,
  },
};

const statutoryAllowances: Obligation = {
  id: 'statutory_allowances',
  type: 'public_body_transfer',
  name: 'Statutory Allowances & Transfers',
  headCode: '26000',
  allocation: 5200,
  priorYearAllocation: 4700,
  paid: 2600,
  paymentStatus: 'current',
  actuals: snap([433, 867, 1300, 1733, 2167, 2600]),
  priorYearActuals: pySnap(4500, W_LIN),
  details: {
    entities: [
      { name: 'JDF Operational Allowance', budget: 2800, transferred: 1400, status: 'partial' },
      { name: 'JCF Risk Allowance', budget: 1500, transferred: 750, status: 'partial' },
      { name: 'Other Statutory', budget: 900, transferred: 450, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const insurancePremiums: Obligation = {
  id: 'ns_insurance',
  type: 'health_insurance',
  name: 'Insurance Premiums',
  headCode: '26000',
  allocation: 4800,
  priorYearAllocation: 4200,
  paid: 2400,
  paymentStatus: 'current',
  actuals: snap([400, 800, 1200, 1600, 2000, 2400]),
  priorYearActuals: pySnap(4100, W_LIN),
  details: {
    components: [
      { name: 'GEASO (Security Forces)', budget: 4500, paid: 2250, status: 'current' },
      { name: 'GPASO', budget: 200, paid: 100, status: 'current' },
      { name: 'Senior Officers', budget: 100, paid: 50, status: 'current' },
    ],
  },
};

const allObligations: Obligation[] = [pensionContributions, statutoryAllowances, insurancePremiums];

/* Operational Entities */

const jcf: OperationalEntity = {
  id: 'jcf',
  name: 'Jamaica Constabulary Force',
  headCode: '26022',
  allocation: 80200,
  priorYearAllocation: 72000,
  spent: 40100,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 14000, filledPosts: 12500, vacantPosts: 1500, vacancyRate: 10.7 },
  kpis: [
    { name: 'Force Strength', type: 'output', unit: 'count', target: 14000, actual: 12500, priorYearActual: 12200 },
    { name: 'Major Crimes per 100K', type: 'outcome', unit: 'rate', target: 45, actual: 52, priorYearActual: 55 },
    { name: 'Case Clearance Rate', type: 'outcome', unit: '%', target: 55, actual: 48, priorYearActual: 45 },
    { name: 'Response Time (mins)', type: 'outcome', unit: 'mins', target: 12, actual: 15.5, priorYearActual: 16.2 },
  ],
  actuals: snap([6400, 13200, 19800, 26800, 33400, 40100]),
  priorYearActuals: pySnap(70000, W_LIN),
  headOfficer: nationalSecurityEntityOfficers.jcf,
};

const correctional: OperationalEntity = {
  id: 'correctional',
  name: 'Department of Correctional Services',
  headCode: '26024',
  allocation: 12500,
  priorYearAllocation: 11200,
  spent: 6250,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 3800, filledPosts: 3200, vacantPosts: 600, vacancyRate: 15.8 },
  kpis: [
    { name: 'Inmate Population', type: 'output', unit: 'count', target: 4000, actual: 4350, priorYearActual: 4200 },
    { name: 'Recidivism Rate', type: 'outcome', unit: '%', target: 25, actual: 32, priorYearActual: 34 },
    { name: 'Rehabilitation Programme Completion', type: 'outcome', unit: '%', target: 60, actual: 48, priorYearActual: 44 },
  ],
  actuals: snap([1000, 2080, 3120, 4160, 5200, 6250]),
  priorYearActuals: pySnap(10900, W_LIN),
  headOfficer: nationalSecurityEntityOfficers.correctional,
};

const pica: OperationalEntity = {
  id: 'pica',
  name: 'Passport, Immigration & Citizenship Agency',
  headCode: '26053',
  allocation: 5800,
  priorYearAllocation: 5100,
  spent: 2900,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 950, filledPosts: 820, vacantPosts: 130, vacancyRate: 13.7 },
  kpis: [
    { name: 'Passports Processed', type: 'output', unit: 'count', target: 300000, actual: 148000, priorYearActual: 280000 },
    { name: 'Processing Time (days)', type: 'outcome', unit: 'days', target: 10, actual: 12, priorYearActual: 14 },
  ],
  actuals: snap([464, 960, 1440, 1936, 2416, 2900]),
  priorYearActuals: pySnap(4960, W_LIN),
  headOfficer: nationalSecurityEntityOfficers.pica,
};

const forensics: OperationalEntity = {
  id: 'forensics',
  name: 'Institute of Forensic Science & Legal Medicine',
  headCode: '26057',
  allocation: 1800,
  priorYearAllocation: 1550,
  spent: 864,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 240, filledPosts: 195, vacantPosts: 45, vacancyRate: 18.8 },
  kpis: [
    { name: 'Forensic Cases Completed', type: 'output', unit: 'count', target: 6000, actual: 2800, priorYearActual: 5400 },
    { name: 'DNA Backlog', type: 'outcome', unit: 'count', target: 500, actual: 820, priorYearActual: 950 },
  ],
  actuals: snap([144, 288, 432, 576, 720, 864]),
  priorYearActuals: pySnap(1500, W_LIN),
  headOfficer: nationalSecurityEntityOfficers.forensics,
};

const moca: OperationalEntity = {
  id: 'moca',
  name: 'Major Organised Crime & Anti-Corruption Agency',
  headCode: '26059',
  allocation: 3200,
  priorYearAllocation: 2800,
  spent: 1536,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 380, filledPosts: 320, vacantPosts: 60, vacancyRate: 15.8 },
  kpis: [
    { name: 'Investigations Completed', type: 'output', unit: 'count', target: 120, actual: 52, priorYearActual: 105 },
    { name: 'Assets Recovered (J$M)', type: 'outcome', unit: 'J$M', target: 5000, actual: 2800, priorYearActual: 4200 },
    { name: 'Convictions Secured', type: 'outcome', unit: 'count', target: 30, actual: 12, priorYearActual: 25 },
  ],
  actuals: snap([256, 512, 768, 1024, 1280, 1536]),
  priorYearActuals: pySnap(2720, W_LIN),
  headOfficer: nationalSecurityEntityOfficers.moca,
};

const nsCoreMinistry: OperationalEntity = {
  id: 'ns_core',
  name: 'Core Ministry & Policy Coordination',
  headCode: '26000',
  allocation: 4800,
  priorYearAllocation: 4200,
  spent: 2304,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 520, filledPosts: 450, vacantPosts: 70, vacancyRate: 13.5 },
  kpis: [
    { name: 'Security Policy Reviews', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
    { name: 'Inter-agency Coordination Meetings', type: 'output', unit: 'count', target: 48, actual: 24, priorYearActual: 44 },
  ],
  actuals: snap([384, 768, 1152, 1536, 1920, 2304]),
  priorYearActuals: pySnap(4080, W_LIN),
};

const allEntities: OperationalEntity[] = [jcf, correctional, pica, forensics, moca, nsCoreMinistry];

/* Capital Projects */

const securityInfra: CapitalProject = {
  id: 'security_infra',
  code: '26601',
  name: 'Security Infrastructure Upgrades',
  currentYearBudget: 950,
  currentYearSpent: 237.5,
  totalProjectCost: 3800,
  cumulativeSpend: 1520,
  financialProgressPct: 40.0,
  physicalProgressPct: 38,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Police station renovations in 8 parishes progressing. New detention facility in St. Catherine under construction.',
  milestones: [
    { name: 'Design & planning', plannedDate: '2025-09-30', actualDate: '2025-09-25', status: 'completed', weightPct: 15 },
    { name: 'Phase 1 — 4 parishes', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 30 },
    { name: 'Phase 2 — 4 parishes', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 30 },
    { name: 'St. Catherine facility', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [{ source: 'GOJ', committed: 3800, disbursed: 1520 }],
  actuals: snap([15, 42, 80, 130, 180, 237.5]),
};

const securityIT: CapitalProject = {
  id: 'security_it',
  code: '26602',
  name: 'Security & Surveillance IT Systems',
  currentYearBudget: 671,
  currentYearSpent: 167.75,
  totalProjectCost: 2400,
  cumulativeSpend: 840,
  financialProgressPct: 35.0,
  physicalProgressPct: 32,
  startDate: '2025-04-01',
  originalEndDate: '2027-12-31',
  revisedEndDate: '2028-03-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'CCTV network expansion delayed by 2 months due to procurement. Body-worn camera pilot deployed to 3 divisions.',
  milestones: [
    { name: 'Requirements & procurement', plannedDate: '2025-12-31', actualDate: '2026-02-15', status: 'completed', weightPct: 20 },
    { name: 'CCTV network Phase 1', plannedDate: '2026-09-30', revisedDate: '2026-12-31', status: 'in_progress', weightPct: 30 },
    { name: 'Body-worn cameras rollout', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 30 },
    { name: 'Integration & training', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 1600, disbursed: 560 },
    { source: 'UKFCDO', committed: 800, disbursed: 280 },
  ],
  actuals: snap([10, 28, 55, 90, 130, 167.75]),
};

const allProjects: CapitalProject[] = [securityInfra, securityIT];

/* Bucket aggregates */

const fixedActuals = sumSnaps(
  pensionContributions.actuals, statutoryAllowances.actuals, insurancePremiums.actuals,
);
const fixedPY = sumSnaps(
  pensionContributions.priorYearActuals, statutoryAllowances.priorYearActuals,
  insurancePremiums.priorYearActuals,
);

const opsActuals = sumSnaps(
  jcf.actuals, correctional.actuals, pica.actuals,
  forensics.actuals, moca.actuals, nsCoreMinistry.actuals,
);
const opsPY = sumSnaps(
  jcf.priorYearActuals, correctional.priorYearActuals, pica.priorYearActuals,
  forensics.priorYearActuals, moca.priorYearActuals, nsCoreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(securityInfra.actuals, securityIT.actuals);
const capPY = pySnap(1837, W_BACK);

/* Assembly */

export const nationalSecurityData: MinistryData = {
  overview: {
    id: 'national-security',
    name: 'Ministry of National Security & Peace',
    shortName: 'National Security',
    minister: nationalSecurityLeadership[0],
    totalAllocation: 123914,
    priorYearAllocation: 154866,
    totalSpent: 61900,
    recurrentTotal: 122293,
    capitalTotal: 1621,
    actuals: snap([9900, 20400, 30700, 41300, 51600, 61900]),
    priorYearActuals: pySnap(134023, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 18500,
    priorYearAllocation: 16500,
    totalPaid: 9250,
    pctOfMinistry: 14.9,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 108300,
    priorYearAllocation: 96850,
    totalSpent: 53954,
    utilizationPct: 49.8,
    entities: allEntities,
    totalFilledPosts: 17485,
    totalApprovedPosts: 19890,
    vacancyRate: 12.1,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 1621,
    priorYearAllocation: 1837,
    totalSpent: 405.25,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: nationalSecurityLeadership,
};
