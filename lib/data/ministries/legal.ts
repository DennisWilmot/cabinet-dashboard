import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_BACK, EMPTY_REVENUE } from '../helpers';
import { legalLeadership } from '../people/legal';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (1)                                              */
/* ------------------------------------------------------------------ */

const statutoryLegislative: Obligation = {
  id: 'statutory_legislative',
  type: 'statutory',
  name: 'Statutory Legislative Provisions',
  headCode: '27000',
  allocation: 480,
  priorYearAllocation: 310,
  paid: 240,
  paymentStatus: 'current',
  actuals: snap([40, 80, 120, 160, 200, 240]),
  priorYearActuals: pySnap(300, W_LIN),
  details: {
    components: [
      { name: 'Legislative Drafting Retainers', budget: 280, paid: 140, status: 'current' },
      { name: 'Constitutional Review Provisions', budget: 200, paid: 100, status: 'current' },
    ],
  },
};

const allObligations: Obligation[] = [statutoryLegislative];

/* ------------------------------------------------------------------ */
/*  Operational Entities (2)                                           */
/* ------------------------------------------------------------------ */

const legalAffairsOps: OperationalEntity = {
  id: 'legal_affairs_ops',
  name: 'Legal Affairs Operations',
  headCode: '27000',
  allocation: 850,
  priorYearAllocation: 560,
  spent: 420,
  utilizationPct: 49.4,
  staffing: { approvedPosts: 120, filledPosts: 105, vacantPosts: 15, vacancyRate: 12.5 },
  kpis: [
    { name: 'Legal Opinions Turnaround', type: 'output', unit: 'days', target: 14, actual: 22, priorYearActual: 25 },
    { name: 'FOI Requests Processed', type: 'output', unit: 'count', target: 200, actual: 90, priorYearActual: 175 },
    { name: 'Treaties & Agreements Reviewed', type: 'output', unit: 'count', target: 20, actual: 8, priorYearActual: 17 },
  ],
  actuals: snap([68, 138, 210, 280, 350, 420]),
  priorYearActuals: pySnap(540, W_LIN),
};

const legislativeDrafting: OperationalEntity = {
  id: 'legislative_drafting',
  name: 'Legislative Drafting & Review',
  headCode: '27000',
  allocation: 269,
  priorYearAllocation: 165,
  spent: 130,
  utilizationPct: 48.3,
  staffing: { approvedPosts: 45, filledPosts: 38, vacantPosts: 7, vacancyRate: 15.6 },
  kpis: [
    { name: 'Bills Drafted On Time', type: 'output', unit: '%', target: 90, actual: 72, priorYearActual: 78 },
    { name: 'Legislative Review Completion', type: 'output', unit: '%', target: 100, actual: 85, priorYearActual: 80 },
  ],
  actuals: snap([21, 43, 65, 87, 109, 130]),
  priorYearActuals: pySnap(158, W_LIN),
};

const allEntities: OperationalEntity[] = [legalAffairsOps, legislativeDrafting];

/* ------------------------------------------------------------------ */
/*  Capital Projects (1)                                               */
/* ------------------------------------------------------------------ */

const legalDatabase: CapitalProject = {
  id: 'legal_database',
  code: '27601',
  name: 'Legal Database Modernisation',
  currentYearBudget: 80,
  currentYearSpent: 30,
  totalProjectCost: 180,
  cumulativeSpend: 72,
  financialProgressPct: 40.0,
  physicalProgressPct: 35,
  startDate: '2025-10-01',
  originalEndDate: '2027-09-30',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Data migration from legacy system 40% complete. New search interface in UAT. Vendor contract amendment pending for expanded scope.',
  milestones: [
    { name: 'Legacy data audit & cleansing', plannedDate: '2026-06-30', actualDate: '2026-06-22', status: 'completed', weightPct: 25 },
    { name: 'Data migration & validation', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 35 },
    { name: 'Search interface & API', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Training & go-live', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 180, disbursed: 72 },
  ],
  actuals: snap([2, 6, 12, 18, 24, 30]),
};

const allProjects: CapitalProject[] = [legalDatabase];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = statutoryLegislative.actuals;
const fixedPY = statutoryLegislative.priorYearActuals;

const opsActuals = sumSnaps(legalAffairsOps.actuals, legislativeDrafting.actuals);
const opsPY = sumSnaps(legalAffairsOps.priorYearActuals, legislativeDrafting.priorYearActuals);

const capActuals = legalDatabase.actuals;
const capPY = pySnap(50, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const legalData: MinistryData = {
  overview: {
    id: 'legal',
    name: 'Ministry of Legal & Constitutional Affairs',
    shortName: 'Legal Affairs',
    minister: legalLeadership[0],
    totalAllocation: 1679,
    priorYearAllocation: 1085,
    totalSpent: 820,
    recurrentTotal: 1599,
    capitalTotal: 80,
    lastUpdated: '2026-02-28',
    actuals: snap([130, 270, 410, 550, 690, 820]),
    priorYearActuals: pySnap(1020, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 480,
    priorYearAllocation: 310,
    totalPaid: 240,
    pctOfMinistry: 28.6,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 1119,
    priorYearAllocation: 725,
    totalSpent: 550,
    utilizationPct: 49.2,
    entities: allEntities,
    totalFilledPosts: 143,
    totalApprovedPosts: 165,
    vacancyRate: 13.3,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 80,
    priorYearAllocation: 50,
    totalSpent: 30,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: legalLeadership,
};
