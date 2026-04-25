import type {
  MinistryData,
  Obligation,
  OperationalEntity,
  CapitalProject,
} from '@/lib/types';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';
import { cultureLeadership, cultureEntityOfficers } from '../people/culture';

/* ------------------------------------------------------------------ */
/*  Fixed Obligations (5)                                              */
/* ------------------------------------------------------------------ */

const jcdcGrant: Obligation = {
  id: 'jcdc_grant',
  type: 'public_body_transfer',
  name: 'Jamaica Cultural Development Commission Grant',
  headCode: '46000',
  allocation: 1400,
  priorYearAllocation: 1200,
  paid: 700,
  paymentStatus: 'current',
  actuals: snap([115, 233, 350, 467, 583, 700]),
  priorYearActuals: pySnap(1200, W_LIN),
  details: {
    entities: [
      { name: 'JCDC Operations', budget: 900, transferred: 450, status: 'partial' },
      { name: 'Festival & Competition Programmes', budget: 500, transferred: 250, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const sportsCouncilGrants: Obligation = {
  id: 'sports_council_grants',
  type: 'public_body_transfer',
  name: 'Sports Development Foundation Grants',
  headCode: '46000',
  allocation: 1000,
  priorYearAllocation: 850,
  paid: 500,
  paymentStatus: 'current',
  actuals: snap([83, 167, 250, 333, 417, 500]),
  priorYearActuals: pySnap(850, W_LIN),
  details: {
    entities: [
      { name: 'Sports Development Foundation', budget: 650, transferred: 325, status: 'partial' },
      { name: 'Institute of Sports', budget: 350, transferred: 175, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const entertainmentFund: Obligation = {
  id: 'entertainment_fund',
  type: 'public_body_transfer',
  name: 'Entertainment Industry Fund',
  headCode: '46000',
  allocation: 500,
  priorYearAllocation: 400,
  paid: 250,
  paymentStatus: 'current',
  actuals: snap([42, 83, 125, 167, 208, 250]),
  priorYearActuals: pySnap(400, W_LIN),
  details: {
    entities: [
      { name: 'Jamaica Music Fund', budget: 300, transferred: 150, status: 'partial' },
      { name: 'Film & Animation Incentive', budget: 200, transferred: 100, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const nationalGallery: Obligation = {
  id: 'national_gallery',
  type: 'public_body_transfer',
  name: 'National Gallery of Jamaica Transfer',
  headCode: '46000',
  allocation: 350,
  priorYearAllocation: 280,
  paid: 175,
  paymentStatus: 'current',
  actuals: snap([29, 58, 88, 117, 146, 175]),
  priorYearActuals: pySnap(280, W_LIN),
  details: {
    entities: [
      { name: 'National Gallery Operations', budget: 250, transferred: 125, status: 'partial' },
      { name: 'Exhibition & Acquisitions', budget: 100, transferred: 50, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const libraryService: Obligation = {
  id: 'library_service',
  type: 'public_body_transfer',
  name: 'Jamaica Library Service Grant',
  headCode: '46000',
  allocation: 250,
  priorYearAllocation: 181,
  paid: 250,
  paymentStatus: 'paid',
  actuals: snap([125, 250, 250, 250, 250, 250]),
  priorYearActuals: pySnap(181, W_FRONT),
  details: {
    entities: [
      { name: 'JLS Operations', budget: 250, transferred: 250, status: 'paid' },
    ],
    utilizationPct: 100.0,
  },
};

const allObligations: Obligation[] = [
  jcdcGrant, sportsCouncilGrants, entertainmentFund, nationalGallery, libraryService,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities (5)                                           */
/* ------------------------------------------------------------------ */

const genderBureau: OperationalEntity = {
  id: 'gender_bureau',
  name: 'Bureau of Gender Affairs',
  headCode: '46000',
  allocation: 1200,
  priorYearAllocation: 1050,
  spent: 600,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 150, filledPosts: 132, vacantPosts: 18, vacancyRate: 12.0 },
  kpis: [
    { name: 'GBV Cases Managed', type: 'output', unit: 'count', target: 2400, actual: 1450, priorYearActual: 2100 },
    { name: 'GBV Response Time', type: 'outcome', unit: 'hrs', target: 12, actual: 18, priorYearActual: 22 },
    { name: 'Gender Training Sessions', type: 'output', unit: 'count', target: 120, actual: 55, priorYearActual: 100 },
    { name: 'Shelter Bed Utilisation', type: 'outcome', unit: '%', target: 70, actual: 88, priorYearActual: 82 },
  ],
  actuals: snap([98, 198, 300, 400, 500, 600]),
  priorYearActuals: pySnap(1050, W_LIN),
};

const culturalDivisions: OperationalEntity = {
  id: 'cultural_divisions',
  name: 'Cultural Affairs & Heritage Division',
  headCode: '46000',
  allocation: 1000,
  priorYearAllocation: 850,
  spent: 490,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 130, filledPosts: 112, vacantPosts: 18, vacancyRate: 13.8 },
  kpis: [
    { name: 'Heritage Sites Maintained', type: 'output', unit: 'count', target: 45, actual: 22, priorYearActual: 40 },
    { name: 'Cultural Event Participation', type: 'outcome', unit: 'count', target: 250000, actual: 135000, priorYearActual: 220000 },
    { name: 'UNESCO Compliance Reports', type: 'output', unit: 'count', target: 6, actual: 3, priorYearActual: 5 },
  ],
  actuals: snap([80, 162, 245, 327, 408, 490]),
  priorYearActuals: pySnap(850, W_LIN),
  headOfficer: cultureEntityOfficers.jcdc,
};

const sportsDivision: OperationalEntity = {
  id: 'sports_division',
  name: 'Sports Division',
  headCode: '46000',
  allocation: 900,
  priorYearAllocation: 750,
  spent: 432,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 110, filledPosts: 95, vacantPosts: 15, vacancyRate: 13.6 },
  kpis: [
    { name: 'Athletes in Dev Programme', type: 'output', unit: 'count', target: 500, actual: 280, priorYearActual: 450 },
    { name: 'Community Sports Facilities Operational', type: 'output', unit: 'count', target: 80, actual: 52, priorYearActual: 72 },
    { name: 'International Medals Won', type: 'outcome', unit: 'count', target: 20, actual: 8, priorYearActual: 15 },
  ],
  actuals: snap([70, 142, 216, 288, 360, 432]),
  priorYearActuals: pySnap(750, W_LIN),
};

const entertainmentDivision: OperationalEntity = {
  id: 'entertainment_division',
  name: 'Entertainment & Creative Industries Division',
  headCode: '46000',
  allocation: 600,
  priorYearAllocation: 420,
  spent: 294,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 80, filledPosts: 70, vacantPosts: 10, vacancyRate: 12.5 },
  kpis: [
    { name: 'Entertainment Licences Issued', type: 'output', unit: 'count', target: 800, actual: 420, priorYearActual: 720 },
    { name: 'Creative Industry Revenue', type: 'outcome', unit: 'J$B', target: 4.5, actual: 2.0, priorYearActual: 3.8 },
    { name: 'IP Registrations Facilitated', type: 'output', unit: 'count', target: 300, actual: 110, priorYearActual: 250 },
  ],
  actuals: snap([48, 97, 147, 196, 245, 294]),
  priorYearActuals: pySnap(420, W_LIN),
};

const cultureCoreMinistry: OperationalEntity = {
  id: 'culture_core_ministry',
  name: 'Core Ministry Administration',
  headCode: '46000',
  allocation: 490,
  priorYearAllocation: 330,
  spent: 235,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 65, filledPosts: 55, vacantPosts: 10, vacancyRate: 15.4 },
  kpis: [
    { name: 'Policy Papers Delivered', type: 'output', unit: 'count', target: 8, actual: 3, priorYearActual: 7 },
    { name: 'Inter-Ministry Coordination Meetings', type: 'output', unit: 'count', target: 24, actual: 10, priorYearActual: 20 },
  ],
  actuals: snap([38, 78, 118, 157, 196, 235]),
  priorYearActuals: pySnap(330, W_LIN),
};

const allEntities: OperationalEntity[] = [
  genderBureau, culturalDivisions, sportsDivision, entertainmentDivision, cultureCoreMinistry,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects (2)                                               */
/* ------------------------------------------------------------------ */

const sportsFacilities: CapitalProject = {
  id: 'sports_facilities',
  code: '46601',
  name: 'National Sports Facilities Programme',
  currentYearBudget: 350,
  currentYearSpent: 70,
  totalProjectCost: 1500,
  cumulativeSpend: 480,
  financialProgressPct: 32.0,
  physicalProgressPct: 35,
  startDate: '2025-01-01',
  originalEndDate: '2028-12-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'Trelawny Multi-Purpose Stadium design completed. Catherine Hall upgrade on schedule. Procurement for Independence Park renovation initiated.',
  milestones: [
    { name: 'Trelawny Stadium design', plannedDate: '2025-12-31', actualDate: '2026-01-20', status: 'completed', weightPct: 15 },
    { name: 'Catherine Hall Sports Complex upgrade', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 25 },
    { name: 'Independence Park renovation', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 35 },
    { name: 'Commissioning & handover', plannedDate: '2028-12-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 1100, disbursed: 380 },
    { source: 'China Development Bank', committed: 400, disbursed: 100, nextTrancheDate: '2027-03-01', conditions: 'Trelawny Stadium groundbreaking' },
  ],
  actuals: snap([5, 12, 24, 38, 54, 70]),
  mediumTermProjection: [350, 450, 500, 200],
};

const culturalInfrastructure: CapitalProject = {
  id: 'cultural_infrastructure',
  code: '46602',
  name: 'Cultural Infrastructure Rehabilitation',
  currentYearBudget: 200,
  currentYearSpent: 40,
  totalProjectCost: 600,
  cumulativeSpend: 180,
  financialProgressPct: 30.0,
  physicalProgressPct: 28,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  revisedEndDate: '2028-06-30',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Ward Theatre restoration scope expanded. Liberty Hall upgrade completed. Emancipation Park amphitheatre works delayed by heritage review.',
  milestones: [
    { name: 'Liberty Hall upgrade', plannedDate: '2025-12-31', actualDate: '2026-02-10', status: 'completed', weightPct: 20 },
    { name: 'Ward Theatre restoration Phase 1', plannedDate: '2026-12-31', revisedDate: '2027-03-31', status: 'in_progress', weightPct: 35 },
    { name: 'Emancipation Park amphitheatre', plannedDate: '2027-06-30', revisedDate: '2027-09-30', status: 'upcoming', weightPct: 25 },
    { name: 'Final handover', plannedDate: '2028-03-31', revisedDate: '2028-06-30', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 400, disbursed: 140 },
    { source: 'UNESCO Heritage Fund', committed: 200, disbursed: 40, nextTrancheDate: '2027-01-15', conditions: 'Heritage impact assessment completion' },
  ],
  actuals: snap([3, 8, 15, 23, 32, 40]),
  mediumTermProjection: [200, 220, 180, 0],
};

const allProjects: CapitalProject[] = [sportsFacilities, culturalInfrastructure];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                  */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  jcdcGrant.actuals, sportsCouncilGrants.actuals, entertainmentFund.actuals,
  nationalGallery.actuals, libraryService.actuals,
);
const fixedPY = sumSnaps(
  jcdcGrant.priorYearActuals, sportsCouncilGrants.priorYearActuals, entertainmentFund.priorYearActuals,
  nationalGallery.priorYearActuals, libraryService.priorYearActuals,
);

const opsActuals = sumSnaps(
  genderBureau.actuals, culturalDivisions.actuals, sportsDivision.actuals,
  entertainmentDivision.actuals, cultureCoreMinistry.actuals,
);
const opsPY = sumSnaps(
  genderBureau.priorYearActuals, culturalDivisions.priorYearActuals, sportsDivision.priorYearActuals,
  entertainmentDivision.priorYearActuals, cultureCoreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(sportsFacilities.actuals, culturalInfrastructure.actuals);
const capPY = pySnap(450, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                           */
/* ------------------------------------------------------------------ */

export const cultureData: MinistryData = {
  overview: {
    id: 'culture',
    name: 'Ministry of Culture, Gender, Entertainment & Sport',
    shortName: 'Culture',
    minister: cultureLeadership[0],
    totalAllocation: 8240,
    priorYearAllocation: 6761,
    totalSpent: 3921,
    recurrentTotal: 7690,
    capitalTotal: 550,
    actuals: snap([608, 1238, 1878, 2515, 3149, 3921]),
    priorYearActuals: pySnap(5866, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 3500,
    priorYearAllocation: 2911,
    totalPaid: 1875,
    pctOfMinistry: 42.5,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 4190,
    priorYearAllocation: 3400,
    totalSpent: 2051,
    utilizationPct: 49.0,
    entities: allEntities,
    totalFilledPosts: 464,
    totalApprovedPosts: 535,
    vacancyRate: 13.3,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 550,
    priorYearAllocation: 450,
    totalSpent: 110,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: cultureLeadership,
};
