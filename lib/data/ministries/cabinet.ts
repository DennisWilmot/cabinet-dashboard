import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { cabinetLeadership, cabinetEntityOfficers } from '../people/cabinet';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (2)                                              */
/* ------------------------------------------------------------------ */

const mindTransfer: Obligation = {
  id: 'mind_transfer',
  type: 'public_body_transfer',
  name: 'MIND Transfer',
  headCode: '16049',
  allocation: 750,
  priorYearAllocation: 250,
  paid: 375,
  paymentStatus: 'current',
  actuals: snap([125, 188, 250, 300, 340, 375]),
  priorYearActuals: pySnap(240, W_LIN),
  details: {
    entities: [
      { name: 'Management Institute for National Development', budget: 750, transferred: 375, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const cabinetStatutory: Obligation = {
  id: 'cabinet_statutory',
  type: 'statutory_transfer',
  name: 'Statutory Provisions',
  headCode: '16000',
  allocation: 250,
  priorYearAllocation: 100,
  paid: 125,
  paymentStatus: 'current',
  actuals: snap([42, 63, 83, 100, 113, 125]),
  priorYearActuals: pySnap(95, W_LIN),
  details: {
    entities: [
      { name: 'Pension & Gratuity Provisions', budget: 160, transferred: 80, status: 'partial' },
      { name: 'Other Statutory Charges', budget: 90, transferred: 45, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const allObligations: Obligation[] = [mindTransfer, cabinetStatutory];

/* ------------------------------------------------------------------ */
/*  Operational Entities (2)                                           */
/* ------------------------------------------------------------------ */

const cabinetOffice: OperationalEntity = {
  id: 'cabinet_office',
  name: 'Cabinet Office Operations',
  headCode: '16000',
  allocation: 1127,
  priorYearAllocation: 284,
  spent: 552,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 210, filledPosts: 180, vacantPosts: 30, vacancyRate: 14.3 },
  kpis: [
    { name: 'Cabinet Submissions Processed', type: 'output', unit: 'count', target: 200, actual: 88, priorYearActual: 180 },
    { name: 'Policy Coordination Index', type: 'outcome', unit: '%', target: 85, actual: 76, priorYearActual: 72 },
    { name: 'Decision Implementation Rate', type: 'outcome', unit: '%', target: 80, actual: 68, priorYearActual: 65 },
    { name: 'Gov. Efficiency Review Completion', type: 'output', unit: '%', target: 100, actual: 42, priorYearActual: 78 },
  ],
  actuals: snap([90, 184, 275, 368, 460, 552]),
  priorYearActuals: pySnap(275, W_LIN),
};

const mindOps: OperationalEntity = {
  id: 'mind_ops',
  name: 'Management Institute for National Development',
  headCode: '16049',
  allocation: 600,
  priorYearAllocation: 150,
  spent: 294,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 140, filledPosts: 120, vacantPosts: 20, vacancyRate: 14.3 },
  kpis: [
    { name: 'Public Officers Trained', type: 'output', unit: 'count', target: 6000, actual: 2400, priorYearActual: 5200 },
    { name: 'Training Programme Satisfaction', type: 'outcome', unit: '%', target: 90, actual: 87, priorYearActual: 85 },
    { name: 'Certification Pass Rate', type: 'outcome', unit: '%', target: 80, actual: 72, priorYearActual: 76 },
  ],
  actuals: snap([48, 98, 147, 196, 245, 294]),
  priorYearActuals: pySnap(142, W_LIN),
  headOfficer: cabinetEntityOfficers.mind,
};

const allEntities: OperationalEntity[] = [cabinetOffice, mindOps];

/* ------------------------------------------------------------------ */
/*  Capital Projects (1)                                               */
/* ------------------------------------------------------------------ */

const cabinetItModernisation: CapitalProject = {
  id: 'cabinet_it_modernisation',
  code: '16000C',
  name: 'Cabinet Office IT Modernisation',
  currentYearBudget: 150,
  currentYearSpent: 45,
  totalProjectCost: 320,
  cumulativeSpend: 125,
  financialProgressPct: 39.1,
  physicalProgressPct: 42,
  startDate: '2025-07-01',
  originalEndDate: '2027-06-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'E-Cabinet platform deployment progressing. Phase 1 (document management) live. Phase 2 (decision tracking) in UAT.',
  milestones: [
    { name: 'E-Cabinet document management', plannedDate: '2026-06-30', actualDate: '2026-05-28', status: 'completed', weightPct: 30 },
    { name: 'Decision tracking module', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 35 },
    { name: 'Analytics dashboard & reporting', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 20 },
    { name: 'Training & closeout', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 15 },
  ],
  funding: [
    { source: 'GOJ', committed: 320, disbursed: 125 },
  ],
  actuals: snap([5, 12, 20, 28, 37, 45]),
};

const allProjects: CapitalProject[] = [cabinetItModernisation];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  mindTransfer.actuals, cabinetStatutory.actuals,
);
const fixedPY = sumSnaps(
  mindTransfer.priorYearActuals, cabinetStatutory.priorYearActuals,
);

const opsActuals = sumSnaps(
  cabinetOffice.actuals, mindOps.actuals,
);
const opsPY = sumSnaps(
  cabinetOffice.priorYearActuals, mindOps.priorYearActuals,
);

const capActuals = cabinetItModernisation.actuals;
const capPY = pySnap(45, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const cabinetData: MinistryData = {
  overview: {
    id: 'cabinet',
    name: 'Office of the Cabinet',
    shortName: 'Cabinet',
    minister: cabinetLeadership[0],
    totalAllocation: 2877,
    priorYearAllocation: 834,
    totalSpent: 1391,
    recurrentTotal: 2727,
    capitalTotal: 150,
    lastUpdated: '2026-03-10',
    actuals: snap([220, 460, 695, 930, 1160, 1391]),
    priorYearActuals: pySnap(800, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 1000,
    priorYearAllocation: 350,
    totalPaid: 500,
    pctOfMinistry: 34.8,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 1727,
    priorYearAllocation: 434,
    totalSpent: 846,
    utilizationPct: 49.0,
    entities: allEntities,
    totalFilledPosts: 300,
    totalApprovedPosts: 350,
    vacancyRate: 14.3,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 150,
    priorYearAllocation: 50,
    totalSpent: 45,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: cabinetLeadership,
};
