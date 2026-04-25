import type { MinistryData, Obligation, OperationalEntity, CapitalProject } from '@/lib/types';
import { educationLeadership, educationEntityOfficers } from '../people/education';
import { snap, pySnap, sumSnaps, W_LIN, W_FRONT, W_BACK, EMPTY_REVENUE } from '../helpers';

/* ------------------------------------------------------------------ */
/*  School-calendar weighting — higher during terms, lower Jul-Aug    */
/* ------------------------------------------------------------------ */

const W_SCHOOL = [0.09, 0.09, 0.07, 0.06, 0.06, 0.09, 0.09, 0.08, 0.09, 0.09, 0.09, 0.10];

/* ------------------------------------------------------------------ */
/*  Fixed Obligations  (7)                                            */
/*  Total CY: 57 323  |  Total PY: 36 074                            */
/* ------------------------------------------------------------------ */

const universityGrants: Obligation = {
  id: 'university_grants',
  type: 'public_body_transfer',
  name: 'University & Tertiary Grants',
  headCode: '41000',
  allocation: 19719,
  priorYearAllocation: 17006,
  paid: 9860,
  paymentStatus: 'current',
  actuals: snap([3290, 5580, 6580, 7880, 8880, 9860]),
  priorYearActuals: pySnap(17006, W_LIN),
  details: {
    entities: [
      { name: 'University of the West Indies', budget: 13725, transferred: 6863, status: 'partial' },
      { name: 'University of Technology', budget: 3840, transferred: 1920, status: 'partial' },
      { name: 'Caribbean Maritime University', budget: 2154, transferred: 1077, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const schoolFeeding: Obligation = {
  id: 'school_feeding',
  type: 'grant_payment',
  name: 'School Feeding & Nutrition Programme',
  headCode: '41000',
  allocation: 9908,
  priorYearAllocation: 9361,
  paid: 5198,
  paymentStatus: 'current',
  actuals: snap([990, 1650, 2640, 3510, 4290, 5198]),
  priorYearActuals: pySnap(9361, W_SCHOOL),
  details: {
    entities: [
      { name: 'PATH Beneficiary Meals', budget: 6906, transferred: 3453, status: 'partial' },
      { name: 'Nutrition Products Ltd (NPL)', budget: 1493, transferred: 896, status: 'partial' },
      { name: 'School Feeding Cash Grants', budget: 129, transferred: 129, status: 'paid' },
      { name: 'PATH Transportation Support', budget: 380, transferred: 190, status: 'partial' },
      { name: 'NPL Operations', budget: 1000, transferred: 530, status: 'partial' },
    ],
    utilizationPct: 52.5,
  },
};

const hurricaneMelissa: Obligation = {
  id: 'hurricane_melissa',
  type: 'grant_payment',
  name: 'Hurricane Melissa School Relief',
  headCode: '41000',
  allocation: 18000,
  priorYearAllocation: 0,
  paid: 4500,
  paymentStatus: 'partial',
  actuals: snap([500, 1200, 2000, 2800, 3600, 4500]),
  priorYearActuals: pySnap(0, W_LIN),
  details: {
    entities: [
      { name: 'School Refurbishment (Phase 1)', budget: 10000, transferred: 3000, status: 'partial' },
      { name: 'Regional Office Repairs', budget: 3000, transferred: 900, status: 'partial' },
      { name: 'Emergency Supplies & Equipment', budget: 5000, transferred: 600, status: 'partial' },
    ],
    utilizationPct: 25.0,
  },
};

const scholarshipsAndExams: Obligation = {
  id: 'scholarships_exams',
  type: 'grant_payment',
  name: 'Scholarships, Exam Fees & Memberships',
  headCode: '41000',
  allocation: 6025,
  priorYearAllocation: 5600,
  paid: 3013,
  paymentStatus: 'current',
  actuals: snap([502, 1004, 1506, 2009, 2511, 3013]),
  priorYearActuals: pySnap(5600, W_SCHOOL),
  details: {
    entities: [
      { name: 'Secondary Tuition Grants', budget: 3783, transferred: 1892, status: 'partial' },
      { name: 'CSEC/CAPE/CVQ Examination Fees', budget: 1361, transferred: 681, status: 'partial' },
      { name: 'Teacher Education Scholarships', budget: 636, transferred: 318, status: 'partial' },
      { name: 'CXC Contribution (OEC)', budget: 150, transferred: 75, status: 'partial' },
      { name: 'Boarding Grants & Other', budget: 64, transferred: 32, status: 'partial' },
      { name: 'International Memberships', budget: 31, transferred: 15, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const earlyChildhoodSubsidies: Obligation = {
  id: 'early_childhood_subsidies',
  type: 'grant_payment',
  name: 'Early Childhood & Basic School Subsidies',
  headCode: '41000',
  allocation: 1260,
  priorYearAllocation: 1200,
  paid: 630,
  paymentStatus: 'current',
  actuals: snap([210, 420, 525, 540, 580, 630]),
  priorYearActuals: pySnap(1200, W_SCHOOL),
  details: {
    entities: [
      { name: 'Basic School Practitioner Subsidies', budget: 940, transferred: 470, status: 'partial' },
      { name: 'Basic School Maintenance Grants', budget: 200, transferred: 100, status: 'partial' },
      { name: 'Resource Centre Grants', budget: 100, transferred: 50, status: 'partial' },
      { name: "Children's Services Grants", budget: 20, transferred: 10, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const textbookProcurement: Obligation = {
  id: 'textbook_procurement',
  type: 'procurement_contract',
  name: 'Textbook & Educational Materials',
  headCode: '41000',
  allocation: 1000,
  priorYearAllocation: 982,
  paid: 1000,
  paymentStatus: 'paid',
  actuals: snap([500, 1000, 1000, 1000, 1000, 1000]),
  priorYearActuals: pySnap(982, W_FRONT),
  details: {
    components: [
      { name: 'Primary Textbooks', budget: 550, paid: 550, status: 'paid' },
      { name: 'Secondary Textbooks', budget: 300, paid: 300, status: 'paid' },
      { name: 'Printing Rights & NSC Materials', budget: 150, paid: 150, status: 'paid' },
    ],
  },
};

const skillsTraining: Obligation = {
  id: 'skills_training',
  type: 'grant_payment',
  name: 'Skills Training & Youth Programmes',
  headCode: '41000',
  allocation: 1411,
  priorYearAllocation: 1925,
  paid: 706,
  paymentStatus: 'current',
  actuals: snap([118, 235, 353, 471, 588, 706]),
  priorYearActuals: pySnap(1925, W_LIN),
  details: {
    entities: [
      { name: 'HEART/NSTA Trust Activities', budget: 595, transferred: 298, status: 'partial' },
      { name: 'HOPE/LEGS/LIFT Programmes', budget: 570, transferred: 285, status: 'partial' },
      { name: 'Teacher In-Service Training', budget: 217, transferred: 109, status: 'partial' },
      { name: 'Youth Clubs & Societies', budget: 29, transferred: 14, status: 'partial' },
    ],
    utilizationPct: 50.0,
  },
};

const allObligations: Obligation[] = [
  universityGrants, schoolFeeding, hurricaneMelissa, scholarshipsAndExams,
  earlyChildhoodSubsidies, textbookProcurement, skillsTraining,
];

/* ------------------------------------------------------------------ */
/*  Operational Entities  (9)                                         */
/*  Total CY: 160 894  |  Total PY: 148 451                          */
/* ------------------------------------------------------------------ */

const primaryEducation: OperationalEntity = {
  id: 'primary_education',
  name: 'Primary Education Division',
  headCode: '41000',
  allocation: 55805,
  priorYearAllocation: 52900,
  spent: 27903,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 18500, filledPosts: 17200, vacantPosts: 1300, vacancyRate: 7.0 },
  kpis: [
    { name: 'PEP Mastery Rate', type: 'outcome', unit: '%', target: 65, actual: 58.2, priorYearActual: 55.0 },
    { name: 'Attendance Rate', type: 'output', unit: '%', target: 92, actual: 89.5, priorYearActual: 88.0 },
    { name: 'Teacher-Student Ratio (Primary)', type: 'output', unit: 'ratio', target: 25, actual: 27, priorYearActual: 28 },
    { name: 'Schools Meeting Infrastructure Standards', type: 'output', unit: '%', target: 80, actual: 72, priorYearActual: 68 },
  ],
  actuals: snap([4650, 9300, 13960, 18600, 23260, 27903]),
  priorYearActuals: pySnap(51000, W_SCHOOL),
};

const secondaryEducation: OperationalEntity = {
  id: 'secondary_education',
  name: 'Secondary Education Division',
  headCode: '41000',
  allocation: 59170,
  priorYearAllocation: 54800,
  spent: 29290,
  utilizationPct: 49.5,
  staffing: { approvedPosts: 16800, filledPosts: 15600, vacantPosts: 1200, vacancyRate: 7.1 },
  kpis: [
    { name: 'CSEC 5-Subject Pass Rate', type: 'outcome', unit: '%', target: 52, actual: 48.3, priorYearActual: 46.1 },
    { name: 'CAPE Completion Rate', type: 'outcome', unit: '%', target: 85, actual: 82.1, priorYearActual: 80.5 },
    { name: 'ICT Integration (schools with broadband)', type: 'output', unit: '%', target: 80, actual: 65, priorYearActual: 52 },
    { name: 'STEM Academy Enrollment', type: 'output', unit: 'count', target: 5000, actual: 4200, priorYearActual: 3800 },
  ],
  actuals: snap([4930, 9850, 14700, 19520, 24350, 29290]),
  priorYearActuals: pySnap(53000, W_SCHOOL),
};

const prePrimaryEducation: OperationalEntity = {
  id: 'pre_primary',
  name: 'Pre-Primary & Early Childhood Education',
  headCode: '41000',
  allocation: 7294,
  priorYearAllocation: 6200,
  spent: 3647,
  utilizationPct: 50.0,
  staffing: { approvedPosts: 4200, filledPosts: 3850, vacantPosts: 350, vacancyRate: 8.3 },
  kpis: [
    { name: 'ECC-Registered Institutions', type: 'output', unit: 'count', target: 2800, actual: 2650, priorYearActual: 2580 },
    { name: 'Grade 1 Readiness Rate', type: 'outcome', unit: '%', target: 80, actual: 74.5, priorYearActual: 72.0 },
    { name: 'Practitioner Certification Rate', type: 'output', unit: '%', target: 70, actual: 63, priorYearActual: 58 },
  ],
  actuals: snap([610, 1215, 1830, 2430, 3040, 3647]),
  priorYearActuals: pySnap(6000, W_SCHOOL),
};

const tertiaryEducation: OperationalEntity = {
  id: 'tertiary_education',
  name: 'Tertiary Education (Operations)',
  headCode: '41000',
  allocation: 14358,
  priorYearAllocation: 13800,
  spent: 7036,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 5200, filledPosts: 4680, vacantPosts: 520, vacancyRate: 10.0 },
  kpis: [
    { name: 'Tertiary Enrollment', type: 'output', unit: 'count', target: 75000, actual: 72500, priorYearActual: 70200 },
    { name: 'Teacher College Graduation Rate', type: 'outcome', unit: '%', target: 88, actual: 85.2, priorYearActual: 83.0 },
    { name: 'NCTVET Certifications Issued', type: 'output', unit: 'count', target: 12000, actual: 5400, priorYearActual: 10800 },
  ],
  actuals: snap([1165, 2345, 3510, 4690, 5860, 7036]),
  priorYearActuals: pySnap(13500, W_LIN),
};

const coreMinistry: OperationalEntity = {
  id: 'edu_core',
  name: 'Core Ministry & Administration',
  headCode: '41000',
  allocation: 4248,
  priorYearAllocation: 3600,
  spent: 2039,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 620, filledPosts: 540, vacantPosts: 80, vacancyRate: 12.9 },
  kpis: [
    { name: 'Budget Execution Rate', type: 'output', unit: '%', target: 95, actual: 88, priorYearActual: 85 },
    { name: 'Policy Reviews Completed', type: 'output', unit: 'count', target: 12, actual: 5, priorYearActual: 10 },
  ],
  actuals: snap([340, 690, 1020, 1360, 1700, 2039]),
  priorYearActuals: pySnap(3500, W_LIN),
};

const regionalEducation: OperationalEntity = {
  id: 'regional_education',
  name: 'Regional Education Services',
  headCode: '41000',
  allocation: 6368,
  priorYearAllocation: 4800,
  spent: 3120,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 2100, filledPosts: 1890, vacantPosts: 210, vacancyRate: 10.0 },
  kpis: [
    { name: 'School Inspections Completed', type: 'output', unit: 'count', target: 400, actual: 185, priorYearActual: 370 },
    { name: 'Teacher Professional Dev Sessions', type: 'output', unit: 'count', target: 200, actual: 92, priorYearActual: 180 },
    { name: 'Guidance Counsellor Coverage', type: 'output', unit: '%', target: 85, actual: 78, priorYearActual: 75 },
  ],
  actuals: snap([510, 1040, 1560, 2080, 2600, 3120]),
  priorYearActuals: pySnap(4600, W_LIN),
};

const supportServices: OperationalEntity = {
  id: 'support_services',
  name: 'Special Needs, Curriculum & Libraries',
  headCode: '41000',
  allocation: 6773,
  priorYearAllocation: 5800,
  spent: 3250,
  utilizationPct: 48.0,
  staffing: { approvedPosts: 3400, filledPosts: 3060, vacantPosts: 340, vacancyRate: 10.0 },
  kpis: [
    { name: 'NSC Implementation (schools)', type: 'output', unit: '%', target: 100, actual: 92, priorYearActual: 85 },
    { name: 'Special Needs Schools Meeting Standards', type: 'output', unit: '%', target: 75, actual: 68, priorYearActual: 65 },
    { name: 'Public Library Visits (monthly avg)', type: 'output', unit: 'count', target: 85000, actual: 78000, priorYearActual: 72000 },
  ],
  actuals: snap([540, 1085, 1630, 2170, 2710, 3250]),
  priorYearActuals: pySnap(5600, W_LIN),
};

const jis: OperationalEntity = {
  id: 'jis',
  name: 'Jamaica Information Service',
  headCode: '41010',
  allocation: 1550,
  priorYearAllocation: 1458,
  spent: 759,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 320, filledPosts: 280, vacantPosts: 40, vacancyRate: 12.5 },
  kpis: [
    { name: 'Media Outputs (stories/month)', type: 'output', unit: 'count', target: 600, actual: 580, priorYearActual: 520 },
    { name: 'Digital Reach (unique visitors/month)', type: 'output', unit: 'count', target: 500000, actual: 465000, priorYearActual: 410000 },
    { name: 'Parish Coverage Score', type: 'output', unit: '%', target: 100, actual: 86, priorYearActual: 80 },
  ],
  actuals: snap([126, 253, 379, 506, 632, 759]),
  priorYearActuals: pySnap(1400, W_LIN),
  headOfficer: educationEntityOfficers.jis,
};

const cpfsa: OperationalEntity = {
  id: 'cpfsa',
  name: 'Child Protection & Family Services Agency',
  headCode: '41051',
  allocation: 5328,
  priorYearAllocation: 5093,
  spent: 2611,
  utilizationPct: 49.0,
  staffing: { approvedPosts: 600, filledPosts: 520, vacantPosts: 80, vacancyRate: 13.3 },
  kpis: [
    { name: 'Children in State Care', type: 'output', unit: 'count', target: 4400, actual: 4406, priorYearActual: 4350 },
    { name: 'Family-Based Placements', type: 'outcome', unit: '%', target: 65, actual: 61, priorYearActual: 57 },
    { name: 'Case Resolution Time (days)', type: 'outcome', unit: 'days', target: 90, actual: 112, priorYearActual: 120 },
    { name: 'Foster Parent Recruitment', type: 'output', unit: 'count', target: 1100, actual: 1014, priorYearActual: 950 },
  ],
  actuals: snap([435, 870, 1310, 1740, 2175, 2611]),
  priorYearActuals: pySnap(4950, W_LIN),
  headOfficer: educationEntityOfficers.child_protection,
};

const allEntities: OperationalEntity[] = [
  primaryEducation, secondaryEducation, prePrimaryEducation,
  tertiaryEducation, coreMinistry, regionalEducation,
  supportServices, jis, cpfsa,
];

/* ------------------------------------------------------------------ */
/*  Capital Projects  (4)                                             */
/*  Total CY: 3 408  |  PY: 4 243                                    */
/* ------------------------------------------------------------------ */

const educationTransformation: CapitalProject = {
  id: 'education_transformation',
  code: '20778',
  name: 'Education Transformation Programme',
  currentYearBudget: 410.155,
  currentYearSpent: 164.062,
  totalProjectCost: 11326.546,
  cumulativeSpend: 10942.809,
  financialProgressPct: 96.6,
  physicalProgressPct: 94,
  startDate: '2015-04-01',
  originalEndDate: '2022-03-31',
  revisedEndDate: '2027-03-31',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'Final phase of Mt. St. Joseph High expansion. Auditorium and canteen construction underway. Close-out expected March 2027.',
  milestones: [
    { name: 'Phase 1-4 classroom blocks', plannedDate: '2021-03-31', actualDate: '2021-03-15', status: 'completed', weightPct: 60 },
    { name: 'Phase 5 third/fourth form blocks', plannedDate: '2024-03-31', actualDate: '2025-09-30', status: 'completed', weightPct: 20 },
    { name: 'Auditorium & canteen construction', plannedDate: '2027-01-31', status: 'in_progress', weightPct: 15 },
    { name: 'Project close-out', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 5 },
  ],
  funding: [{ source: 'GOJ', committed: 11326.546, disbursed: 10942.809 }],
  actuals: snap([20, 45, 78, 110, 140, 164.062]),
  mediumTermProjection: [410.155, 0, 0, 0],
};

const primarySecondaryInfra: CapitalProject = {
  id: 'primary_secondary_infra',
  code: '29566',
  name: 'Primary & Secondary Infrastructure Programme',
  currentYearBudget: 1493.234,
  currentYearSpent: 448.0,
  totalProjectCost: 5830,
  cumulativeSpend: 3025.527,
  financialProgressPct: 51.9,
  physicalProgressPct: 48,
  startDate: '2020-04-01',
  originalEndDate: '2025-03-31',
  revisedEndDate: '2028-03-31',
  status: 'delayed',
  riskLevel: 'moderate',
  narrative: 'Multi-school expansion and security fencing programme. Hurricane damage to 3 sites caused procurement delays. Construction activities at 11 schools being mobilized.',
  milestones: [
    { name: 'Electrical upgrading at 13 schools', plannedDate: '2025-03-31', actualDate: '2025-06-30', status: 'completed', weightPct: 20 },
    { name: 'Security fencing Phase 1', plannedDate: '2025-09-30', actualDate: '2025-12-15', status: 'completed', weightPct: 15 },
    { name: 'School expansions Phase 1 (6 schools)', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 30 },
    { name: 'School expansions Phase 2 (5 schools)', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Security fencing Phase 2 & close-out', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 10 },
  ],
  funding: [{ source: 'GOJ', committed: 5830, disbursed: 3025.527 }],
  actuals: snap([40, 95, 165, 250, 345, 448]),
  mediumTermProjection: [1493.234, 850, 0, 0],
};

const educationSystemTransformation: CapitalProject = {
  id: 'education_system_transformation',
  code: '29575',
  name: 'Education System Transformation Programme (Phase II)',
  currentYearBudget: 857,
  currentYearSpent: 171.4,
  totalProjectCost: 3552,
  cumulativeSpend: 546.443,
  financialProgressPct: 15.4,
  physicalProgressPct: 12,
  startDate: '2022-04-01',
  originalEndDate: '2030-03-31',
  status: 'on_track',
  riskLevel: 'moderate',
  narrative: 'STEAM education policy drafted. Land acquisition for Bernard Lodge STEAM school completed. Science lab rehabilitation planning underway across multiple schools.',
  milestones: [
    { name: 'STEAM Education Policy draft', plannedDate: '2026-06-30', actualDate: '2026-05-15', status: 'completed', weightPct: 10 },
    { name: 'Land acquisition (3 sites)', plannedDate: '2026-09-30', status: 'in_progress', weightPct: 15 },
    { name: 'Bernard Lodge STEAM school construction', plannedDate: '2028-03-31', status: 'upcoming', weightPct: 35 },
    { name: 'ICT strategy & dormitory standards', plannedDate: '2027-03-31', status: 'upcoming', weightPct: 15 },
    { name: 'Science lab rehabilitation (multiple sites)', plannedDate: '2029-03-31', status: 'upcoming', weightPct: 25 },
  ],
  funding: [{ source: 'GOJ', committed: 3552, disbursed: 546.443 }],
  actuals: snap([15, 35, 60, 95, 135, 171.4]),
  mediumTermProjection: [857, 1365, 1490.573, 221.384],
};

const jamaicaEducationProject: CapitalProject = {
  id: 'jamaica_education_project',
  code: '29589',
  name: 'Jamaica Education Project (JEP)',
  currentYearBudget: 647.371,
  currentYearSpent: 129.474,
  totalProjectCost: 4653.504,
  cumulativeSpend: 312.128,
  financialProgressPct: 6.7,
  physicalProgressPct: 8,
  startDate: '2023-11-01',
  originalEndDate: '2029-11-30',
  status: 'on_track',
  riskLevel: 'low',
  narrative: 'World Bank-funded project to improve teaching practices and learning conditions. 236 teachers trained. EMIS stakeholder training completed (931 participants). Science equipment procurement underway for 180 secondary schools.',
  milestones: [
    { name: 'Teacher training Phase 1 (236 teachers)', plannedDate: '2026-03-31', actualDate: '2025-12-20', status: 'completed', weightPct: 15 },
    { name: 'EMIS stakeholder training (931 trained)', plannedDate: '2026-06-30', actualDate: '2026-04-30', status: 'completed', weightPct: 10 },
    { name: 'Science equipment procurement (180 schools)', plannedDate: '2027-03-31', status: 'in_progress', weightPct: 20 },
    { name: 'STEAM school design-build mobilization', plannedDate: '2027-06-30', status: 'upcoming', weightPct: 25 },
    { name: 'Early warning system & evaluation', plannedDate: '2029-06-30', status: 'upcoming', weightPct: 30 },
  ],
  funding: [
    { source: 'IBRD', committed: 4653.504, disbursed: 312.128, nextTrancheDate: '2027-01-15', conditions: 'Completion of science equipment procurement for first 60 schools' },
  ],
  actuals: snap([10, 25, 48, 76, 105, 129.474]),
  mediumTermProjection: [647.371, 1518.498, 1161.825, 320.297],
};

const allProjects: CapitalProject[] = [
  educationTransformation, primarySecondaryInfra,
  educationSystemTransformation, jamaicaEducationProject,
];

/* ------------------------------------------------------------------ */
/*  Bucket Aggregates                                                 */
/* ------------------------------------------------------------------ */

const fixedActuals = sumSnaps(
  universityGrants.actuals, schoolFeeding.actuals, hurricaneMelissa.actuals,
  scholarshipsAndExams.actuals, earlyChildhoodSubsidies.actuals,
  textbookProcurement.actuals, skillsTraining.actuals,
);
const fixedPY = sumSnaps(
  universityGrants.priorYearActuals, schoolFeeding.priorYearActuals,
  hurricaneMelissa.priorYearActuals, scholarshipsAndExams.priorYearActuals,
  earlyChildhoodSubsidies.priorYearActuals, textbookProcurement.priorYearActuals,
  skillsTraining.priorYearActuals,
);

const opsActuals = sumSnaps(
  primaryEducation.actuals, secondaryEducation.actuals,
  prePrimaryEducation.actuals, tertiaryEducation.actuals,
  coreMinistry.actuals, regionalEducation.actuals,
  supportServices.actuals, jis.actuals, cpfsa.actuals,
);
const opsPY = sumSnaps(
  primaryEducation.priorYearActuals, secondaryEducation.priorYearActuals,
  prePrimaryEducation.priorYearActuals, tertiaryEducation.priorYearActuals,
  coreMinistry.priorYearActuals, regionalEducation.priorYearActuals,
  supportServices.priorYearActuals, jis.priorYearActuals, cpfsa.priorYearActuals,
);

const capActuals = sumSnaps(
  educationTransformation.actuals, primarySecondaryInfra.actuals,
  educationSystemTransformation.actuals, jamaicaEducationProject.actuals,
);
const capPY = pySnap(4243, W_BACK);

/* ------------------------------------------------------------------ */
/*  Assembly                                                          */
/* ------------------------------------------------------------------ */

export const educationData: MinistryData = {
  overview: {
    id: 'education',
    name: 'Ministry of Education, Skills, Youth and Information',
    shortName: 'Education',
    minister: educationLeadership[0],
    totalAllocation: 221625,
    priorYearAllocation: 188768,
    totalSpent: 109600,
    recurrentTotal: 218217,
    capitalTotal: 3408,
    actuals: snap([18200, 36500, 55100, 73400, 91600, 109600]),
    priorYearActuals: pySnap(183000, W_SCHOOL),
  },

  revenue: EMPTY_REVENUE,

  fixedObligations: {
    totalAllocation: 57323,
    priorYearAllocation: 36074,
    totalPaid: 25907,
    pctOfMinistry: 25.9,
    obligations: allObligations,
    actuals: fixedActuals,
    priorYearActuals: fixedPY,
  },

  operational: {
    totalAllocation: 160894,
    priorYearAllocation: 148451,
    totalSpent: 79655,
    utilizationPct: 49.5,
    entities: allEntities,
    totalFilledPosts: 47620,
    totalApprovedPosts: 51740,
    vacancyRate: 8.0,
    actuals: opsActuals,
    priorYearActuals: opsPY,
  },

  capital: {
    totalAllocation: 3408,
    priorYearAllocation: 4243,
    totalSpent: 912.936,
    projects: allProjects,
    actuals: capActuals,
    priorYearActuals: capPY,
  },

  leadership: educationLeadership,
};
