import type { MinistryData, Obligation, OperationalEntity, CapitalProject } from '@/lib/types';
import { healthLeadership, healthEntityOfficers } from '../people/health';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';

/* Fixed Obligations */

const nhfTransfer: Obligation = {
  id: 'nhf_transfer',
  type: 'public_body_transfer',
  name: 'National Health Fund Transfer',
  headCode: '42000',
  allocation: 18000,
  priorYearAllocation: 15200,
  paid: 10800,
  paymentStatus: 'current',
  actuals: snap([3000, 6000, 7500, 9000, 9900, 10800]),
  priorYearActuals: pySnap(14800, W_LIN),
  details: {
    entities: [
      { name: 'NHF Drug Programme', budget: 12000, transferred: 7200, status: 'partial' },
      { name: 'NHF Benefits', budget: 6000, transferred: 3600, status: 'partial' },
    ],
    utilizationPct: 60.0,
  },
};

const hospitalGrants: Obligation = {
  id: 'hospital_grants',
  type: 'public_body_transfer',
  name: 'Hospital Authority Grants',
  headCode: '42000',
  allocation: 32000,
  priorYearAllocation: 27000,
  paid: 19200,
  paymentStatus: 'current',
  actuals: snap([5333, 10667, 13333, 16000, 17600, 19200]),
  priorYearActuals: pySnap(26300, W_LIN),
  details: {
    entities: [
      { name: 'South East Regional Health Authority', budget: 10500, transferred: 6300, status: 'partial' },
      { name: 'Western Regional Health Authority', budget: 8500, transferred: 5100, status: 'partial' },
      { name: 'North East Regional Health Authority', budget: 7000, transferred: 4200, status: 'partial' },
      { name: 'Southern Regional Health Authority', budget: 6000, transferred: 3600, status: 'partial' },
    ],
    utilizationPct: 60.0,
  },
};

const drugProcurement: Obligation = {
  id: 'drug_procurement',
  type: 'public_body_transfer',
  name: 'Drug & Medical Supplies Procurement',
  headCode: '42000',
  allocation: 22000,
  priorYearAllocation: 18500,
  paid: 15400,
  paymentStatus: 'current',
  actuals: snap([5500, 8800, 11000, 13200, 14300, 15400]),
  priorYearActuals: pySnap(18000, W_FRONT),
  details: {
    entities: [
      { name: 'Essential Medicines', budget: 14000, transferred: 9800, status: 'partial' },
      { name: 'Vaccines & Biologicals', budget: 5000, transferred: 3500, status: 'partial' },
      { name: 'Medical Equipment Consumables', budget: 3000, transferred: 2100, status: 'partial' },
    ],
    utilizationPct: 70.0,
  },
};

const healthInsurance: Obligation = {
  id: 'health_insurance_contrib',
  type: 'health_insurance',
  name: 'Health Insurance Contributions',
  headCode: '42000',
  allocation: 6500,
  priorYearAllocation: 5800,
  paid: 3250,
  paymentStatus: 'current',
  actuals: snap([542, 1083, 1625, 2167, 2708, 3250]),
  priorYearActuals: pySnap(5600, W_LIN),
  details: {
    components: [
      { name: 'GEASO (Health Workers)', budget: 6200, paid: 3100, status: 'current' },
      { name: 'GPASO', budget: 200, paid: 100, status: 'current' },
      { name: 'Senior Managers', budget: 100, paid: 50, status: 'current' },
    ],
  },
};

const allObligations: Obligation[] = [nhfTransfer, hospitalGrants, drugProcurement, healthInsurance];

/* Operational Entities */

const publicHealth: OperationalEntity = {
  id: 'public_health',
  name: 'Public Health & Primary Care',
  headCode: '42000',
  allocation: 48000,
  priorYearAllocation: 41000,
  spent: 24000,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 8500, filledPosts: 7225, vacantPosts: 1275, vacancyRate: 15.0 },
  kpis: [
    { name: 'Essential Drug Availability', type: 'outcome', unit: '%', target: 85, actual: 78, priorYearActual: 75 },
    { name: 'Outpatient Visits (monthly avg)', type: 'output', unit: 'K', target: 450, actual: 420, priorYearActual: 410 },
    { name: 'Immunization Coverage', type: 'outcome', unit: '%', target: 95, actual: 91, priorYearActual: 89 },
    { name: 'Maternal Mortality Rate', type: 'outcome', unit: 'per 100K', target: 80, actual: 88, priorYearActual: 92 },
  ],
  actuals: snap([3840, 7920, 11880, 16080, 20040, 24000]),
  priorYearActuals: pySnap(39800, W_LIN),
};

const diseaseSurveillance: OperationalEntity = {
  id: 'disease_surveillance',
  name: 'Disease Surveillance & Prevention',
  headCode: '42000',
  allocation: 15000,
  priorYearAllocation: 12800,
  spent: 7200,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 1200, filledPosts: 1020, vacantPosts: 180, vacancyRate: 15.0 },
  kpis: [
    { name: 'Disease Notifications Processed', type: 'output', unit: 'count', target: 24000, actual: 11800, priorYearActual: 22000 },
    { name: 'Vector Control Coverage', type: 'outcome', unit: '%', target: 80, actual: 72, priorYearActual: 68 },
  ],
  actuals: snap([1200, 2400, 3600, 4800, 6000, 7200]),
  priorYearActuals: pySnap(12400, W_LIN),
};

const bellevue: OperationalEntity = {
  id: 'bellevue',
  name: 'Bellevue Hospital',
  headCode: '42034',
  allocation: 4200,
  priorYearAllocation: 3600,
  spent: 2100,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 680, filledPosts: 580, vacantPosts: 100, vacancyRate: 14.7 },
  kpis: [
    { name: 'Bed Occupancy Rate', type: 'output', unit: '%', target: 85, actual: 92, priorYearActual: 88 },
    { name: 'Patient Discharge Rate', type: 'outcome', unit: '%', target: 40, actual: 35, priorYearActual: 33 },
  ],
  actuals: snap([350, 700, 1050, 1400, 1750, 2100]),
  priorYearActuals: pySnap(3500, W_LIN),
  headOfficer: healthEntityOfficers.bellevue,
};

const govtChemist: OperationalEntity = {
  id: 'govt_chemist',
  name: 'Government Chemist',
  headCode: '42035',
  allocation: 850,
  priorYearAllocation: 740,
  spent: 408,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 120, filledPosts: 105, vacantPosts: 15, vacancyRate: 12.5 },
  kpis: [
    { name: 'Samples Analyzed', type: 'output', unit: 'count', target: 18000, actual: 8600, priorYearActual: 16500 },
    { name: 'Turnaround Time (days)', type: 'outcome', unit: 'days', target: 5, actual: 6.2, priorYearActual: 7.0 },
  ],
  actuals: snap([68, 136, 204, 272, 340, 408]),
  priorYearActuals: pySnap(720, W_LIN),
  headOfficer: healthEntityOfficers.govt_chemist,
};

const ncda: OperationalEntity = {
  id: 'ncda',
  name: 'National Council on Drug Abuse',
  headCode: '42062',
  allocation: 620,
  priorYearAllocation: 540,
  spent: 298,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 85, filledPosts: 72, vacantPosts: 13, vacancyRate: 15.3 },
  kpis: [
    { name: 'Rehabilitation Admissions', type: 'output', unit: 'count', target: 3500, actual: 1680, priorYearActual: 3200 },
    { name: 'Public Awareness Campaigns', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
  ],
  actuals: snap([50, 99, 149, 199, 248, 298]),
  priorYearActuals: pySnap(525, W_LIN),
  headOfficer: healthEntityOfficers.ncda,
};

const coreMinistry: OperationalEntity = {
  id: 'health_core',
  name: 'Core Ministry Administration',
  headCode: '42000',
  allocation: 5200,
  priorYearAllocation: 4500,
  spent: 2496,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 650, filledPosts: 565, vacantPosts: 85, vacancyRate: 13.1 },
  kpis: [
    { name: 'Health Facility Inspections', type: 'output', unit: 'count', target: 480, actual: 228, priorYearActual: 440 },
    { name: 'Policy Circulars Issued', type: 'output', unit: 'count', target: 18, actual: 9, priorYearActual: 16 },
  ],
  actuals: snap([416, 832, 1248, 1664, 2080, 2496]),
  priorYearActuals: pySnap(4370, W_LIN),
};

const allEntities: OperationalEntity[] = [
  publicHealth, diseaseSurveillance, bellevue, govtChemist, ncda, coreMinistry,
];

/* Capital Projects */

const hospitalConstruction: CapitalProject = {
  id: 'hospital_construction',
  code: '42601',
  name: 'Hospital Construction & Upgrades',
  currentYearBudget: 8500,
  currentYearSpent: 2125,
  totalProjectCost: 35000,
  cumulativeSpend: 12500,
  financialProgressPct: 35.7,
  physicalProgressPct: 32,
  startDate: '2024-04-01',
  originalEndDate: '2029-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'New Cornwall Regional Hospital expansion progressing. Spanish Town Hospital wing redesign complete. Equipment procurement for 3 parish hospitals underway.',
  milestones: [
    { name: 'Architectural design (all sites)', plannedDate: '2025-06-30', actualDate: '2025-07-10', status: 'completed', weightPct: 15 },
    { name: 'Cornwall Regional expansion', plannedDate: '2027-12-31', status: 'in_progress', weightPct: 35 },
    { name: 'Spanish Town Hospital wing', plannedDate: '2027-06-30', status: 'in_progress', weightPct: 25 },
    { name: 'Parish hospital equipment', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [
    { source: 'GOJ', committed: 20000, disbursed: 8500 },
    { source: 'IDB', committed: 10000, disbursed: 2500, nextTrancheDate: '2027-01-15', conditions: 'Phase 1 completion report' },
    { source: 'EU', committed: 5000, disbursed: 1500 },
  ],
  actuals: snap([150, 380, 700, 1150, 1620, 2125]),
};

const healthIT: CapitalProject = {
  id: 'health_it',
  code: '42602',
  name: 'Health Information Systems',
  currentYearBudget: 4500,
  currentYearSpent: 1125,
  totalProjectCost: 12000,
  cumulativeSpend: 3800,
  financialProgressPct: 31.7,
  physicalProgressPct: 35,
  startDate: '2025-04-01',
  originalEndDate: '2028-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Electronic Health Records system pilot in 25 health centres. Lab information system deployed to 4 regional hospitals.',
  milestones: [
    { name: 'System architecture', plannedDate: '2025-12-31', actualDate: '2025-12-15', status: 'completed', weightPct: 15 },
    { name: 'EHR pilot deployment', plannedDate: '2026-12-31', status: 'in_progress', weightPct: 30 },
    { name: 'Island-wide rollout', plannedDate: '2027-09-30', status: 'upcoming', weightPct: 35 },
    { name: 'Training & handover', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 7000, disbursed: 2300 },
    { source: 'World Bank', committed: 5000, disbursed: 1500 },
  ],
  actuals: snap([75, 190, 350, 580, 840, 1125]),
};

const equipmentProcurement: CapitalProject = {
  id: 'equipment_procurement',
  code: '42603',
  name: 'Medical Equipment Procurement',
  currentYearBudget: 3352,
  currentYearSpent: 1006,
  totalProjectCost: 8000,
  cumulativeSpend: 3200,
  financialProgressPct: 40.0,
  physicalProgressPct: 38,
  startDate: '2025-04-01',
  originalEndDate: '2027-12-31',
  revisedEndDate: '2028-03-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'CT scanner procurement delayed due to international supply chain issues. Dialysis units delivered to 3 hospitals. MRI installation at KPH complete.',
  milestones: [
    { name: 'Equipment needs assessment', plannedDate: '2025-09-30', actualDate: '2025-09-28', status: 'completed', weightPct: 15 },
    { name: 'Critical equipment delivery', plannedDate: '2026-09-30', revisedDate: '2026-12-31', status: 'in_progress', weightPct: 35 },
    { name: 'Installation & commissioning', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 30 },
    { name: 'Training & warranty setup', plannedDate: '2027-12-31', status: 'upcoming', weightPct: 20 },
  ],
  funding: [
    { source: 'GOJ', committed: 5500, disbursed: 2200 },
    { source: 'Japan (JICA)', committed: 2500, disbursed: 1000 },
  ],
  actuals: snap([60, 155, 300, 510, 750, 1006]),
};

const allProjects: CapitalProject[] = [hospitalConstruction, healthIT, equipmentProcurement];

/* Bucket aggregates */

const fixedActuals = sumSnaps(
  nhfTransfer.actuals, hospitalGrants.actuals, drugProcurement.actuals, healthInsurance.actuals,
);
const fixedPY = sumSnaps(
  nhfTransfer.priorYearActuals, hospitalGrants.priorYearActuals,
  drugProcurement.priorYearActuals, healthInsurance.priorYearActuals,
);

const opsActuals = sumSnaps(
  publicHealth.actuals, diseaseSurveillance.actuals, bellevue.actuals,
  govtChemist.actuals, ncda.actuals, coreMinistry.actuals,
);
const opsPY = sumSnaps(
  publicHealth.priorYearActuals, diseaseSurveillance.priorYearActuals, bellevue.priorYearActuals,
  govtChemist.priorYearActuals, ncda.priorYearActuals, coreMinistry.priorYearActuals,
);

const capActuals = sumSnaps(
  hospitalConstruction.actuals, healthIT.actuals, equipmentProcurement.actuals,
);
const capPY = pySnap(10183, W_BACK);

/* Assembly */

export const healthData: MinistryData = {
  overview: {
    id: 'health',
    name: 'Ministry of Health & Wellness',
    shortName: 'Health',
    minister: healthLeadership[0],
    totalAllocation: 189053,
    priorYearAllocation: 155643,
    totalSpent: 94500,
    recurrentTotal: 172701,
    capitalTotal: 16352,
    lastUpdated: '2026-04-19',
    actuals: snap([15100, 31200, 46800, 63100, 78800, 94500]),
    priorYearActuals: pySnap(130858, W_LIN),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 78500,
    priorYearAllocation: 66500,
    totalPaid: 48650,
    pctOfMinistry: 41.5,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 73870,
    priorYearAllocation: 63180,
    totalSpent: 36502,
    utilizationPct: 49.4,
    entities: allEntities,
    totalFilledPosts: 9567,
    totalApprovedPosts: 11235,
    vacancyRate: 14.8,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 16352,
    priorYearAllocation: 10183,
    totalSpent: 4256,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: healthLeadership,
};
