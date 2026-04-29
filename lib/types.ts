export type Status = 'on_track' | 'at_risk' | 'off_track';
export type StaffingHealth = 'healthy' | 'concern' | 'critical';
export type PaymentStatus = 'current' | 'paid' | 'partial' | 'overdue' | 'pending';
export type ProjectStatus = 'on_track' | 'delayed' | 'at_risk' | 'completed' | 'not_started';
export type RiskLevel = 'low' | 'moderate' | 'high';
export type MilestoneStatus = 'completed' | 'in_progress' | 'upcoming' | 'delayed' | 'cancelled';
export type KpiType = 'output' | 'outcome';
export type OfficerRole = 'minister' | 'state_minister' | 'ps' | 'deputy_ps' | 'head_officer' | 'director';

export interface StatusResult {
  status: Status;
  tooltip: string;
}

export interface StaffingResult {
  health: StaffingHealth;
  tooltip: string;
}

export interface MonthlySnapshot {
  period: string;
  cumulative: number;
  monthly: number;
}

export interface MinisterProfile {
  bio: string;
  constituency: string;
  officeLocation: string;
}

export interface SeniorOfficer {
  name: string;
  title: string;
  headCode?: string;
  avatarUrl: string;
  role: OfficerRole;
  profile?: MinisterProfile;
}

export interface MinistryOverview {
  id: string;
  name: string;
  shortName: string;
  minister: SeniorOfficer;
  totalAllocation: number;
  priorYearAllocation: number;
  totalSpent: number;
  recurrentTotal: number;
  capitalTotal: number;
  lastUpdated: string;
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
}

export interface Obligation {
  id: string;
  type: string;
  name: string;
  headCode: string;
  allocation: number;
  priorYearAllocation: number;
  paid: number;
  paymentStatus: PaymentStatus;
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
  details: Record<string, unknown>;
}

export interface DebtObligation extends Obligation {
  details: {
    domesticPaid: number;
    externalPaid: number;
    paymentsCurrent: number;
    paymentsOverdue: number;
    nextMajorMaturity: string;
    outstandingStock: number;
    fourYearTrend: number[];
    weightedAvgRate?: number;
    fixedVsVariable?: string;
  };
}

export interface PensionObligation extends Obligation {
  details: {
    pensionerCount: number;
    byCategory: { category: string; count: number }[];
    arrearsOutstanding: number;
    yoyGrowth: number;
  };
}

export interface InsuranceObligation extends Obligation {
  details: {
    components: { name: string; budget: number; paid: number; status: PaymentStatus }[];
  };
}

export interface MembershipObligation extends Obligation {
  details: {
    organizations: { name: string; budget: number; paid: number; status: PaymentStatus }[];
    overdueCount: number;
  };
}

export interface TransferObligation extends Obligation {
  details: {
    entities: { name: string; budget: number; transferred: number; status: PaymentStatus }[];
    utilizationPct: number;
  };
}

export interface KPI {
  name: string;
  type: KpiType;
  unit: string;
  target: number;
  actual: number;
  priorYearActual?: number;
  trend?: number[];
}

export interface StaffingData {
  approvedPosts: number;
  filledPosts: number;
  vacantPosts: number;
  vacancyRate: number;
}

export interface OperationalEntity {
  id: string;
  name: string;
  headCode: string;
  allocation: number;
  priorYearAllocation: number;
  spent: number;
  utilizationPct: number;
  staffing: StaffingData;
  kpis: KPI[];
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
  headOfficer?: SeniorOfficer;
  revenueData?: {
    collected: number;
    target: number;
    variance: number;
    variancePct: number;
    byType?: { type: string; amount: number }[];
    actuals: MonthlySnapshot[];
  };
}

export interface Milestone {
  name: string;
  plannedDate: string;
  revisedDate?: string;
  actualDate?: string;
  status: MilestoneStatus;
  weightPct: number;
}

export interface FundingSource {
  source: string;
  committed: number;
  disbursed: number;
  nextTrancheDate?: string;
  conditions?: string;
}

export interface CapitalProject {
  id: string;
  code: string;
  name: string;
  currentYearBudget: number;
  currentYearSpent: number;
  totalProjectCost: number;
  cumulativeSpend: number;
  financialProgressPct: number;
  physicalProgressPct: number;
  startDate: string;
  originalEndDate: string;
  revisedEndDate?: string;
  status: ProjectStatus;
  riskLevel: RiskLevel;
  narrative: string;
  milestones: Milestone[];
  funding: FundingSource[];
  actuals: MonthlySnapshot[];
  isContingency?: boolean;
  mediumTermProjection?: number[];
}

export interface DebtServiceSummary {
  amortisationPaid: number;
  interestPaid: number;
  newBorrowing: number;
  outstandingStock: number;
}

export interface FixedObligationsData {
  totalAllocation: number;
  priorYearAllocation: number;
  totalPaid: number;
  pctOfMinistry: number;
  obligations: Obligation[];
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
  debtService?: DebtServiceSummary;
}

export interface OperationalData {
  totalAllocation: number;
  priorYearAllocation: number;
  totalSpent: number;
  utilizationPct: number;
  entities: OperationalEntity[];
  totalFilledPosts: number;
  totalApprovedPosts: number;
  vacancyRate: number;
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
}

export interface CapitalData {
  totalAllocation: number;
  priorYearAllocation: number;
  totalSpent: number;
  projects: CapitalProject[];
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
}

export interface RevenueData {
  totalCollected: number;
  totalTarget: number;
  variance: number;
  variancePct: number;
  bySplit: { entity: string; amount: number; pct: number }[];
  actuals: MonthlySnapshot[];
  priorYearActuals: MonthlySnapshot[];
}

export interface MinistryData {
  overview: MinistryOverview;
  revenue: RevenueData;
  fixedObligations: FixedObligationsData;
  operational: OperationalData;
  capital: CapitalData;
  leadership: SeniorOfficer[];
}

/* ─── National / Government-Wide Metrics ─── */

export type MetricTrend = 'improving' | 'declining' | 'stable';
export type MetricUnit = 'percent' | 'currency_jmd' | 'currency_usd' | 'ratio' | 'index' | 'rate' | 'count';
export type MetricCategory = 'macro_economic' | 'social' | 'disaster';

export interface MetricDataPoint {
  period: string;
  value: number;
  provisional?: boolean;
}

export interface NationalMetric {
  id: string;
  label: string;
  category: MetricCategory;
  value: number;
  unit: MetricUnit;
  format?: string;
  period: string;
  trend: MetricTrend;
  context?: string;
  source: string;
  sourceUrl?: string;
  asOf: string;
  history: MetricDataPoint[];
}

export interface DisasterEvent {
  id: string;
  name: string;
  date: string;
  category: string;
  totalDamage: number;
  damageUnit: MetricUnit;
  gdpPctImpact: number;
  description: string;
  source: string;
  sourceUrl?: string;
  asOf: string;
  sectorImpacts: { sector: string; damage: number; losses: number }[];
  comparison?: { event: string; year: number; cost: number };
}

export interface NationalPulseData {
  metrics: NationalMetric[];
  disasters: DisasterEvent[];
  lastUpdated: string;
}

/* ─── Vision 2030 National Outcomes ─── */

export type IndicatorStatus = 'on_track' | 'at_risk' | 'off_track' | 'no_data';
export type IndicatorDirection = 'higher_is_better' | 'lower_is_better';

export interface Vision2030Indicator {
  id: string;
  name: string;
  unit: string;
  direction: IndicatorDirection;
  baseline2007: number | null;
  target2027: number | string | null;
  target2030: number | string | null;
  latestActual: number | null;
  latestPeriod: string | null;
  source: string | null;
  responsibleMinistries: string[];
  discontinued?: boolean;
  note?: string;
}

export interface NationalOutcome {
  id: number;
  name: string;
  goalId: number;
  indicators: Vision2030Indicator[];
  sdgs: number[];
}

export interface NationalGoal {
  id: number;
  name: string;
  outcomes: NationalOutcome[];
}
