import type { Status, StatusResult, StaffingHealth, StaffingResult, PaymentStatus, KPI, Milestone, ProjectStatus } from './types';

export function deriveUtilizationStatus(
  actualPct: number,
  expectedPct: number
): StatusResult {
  const deviation = Math.abs(actualPct - expectedPct);
  const direction = actualPct > expectedPct ? 'above' : 'below';

  if (deviation <= 5) {
    return {
      status: 'on_track',
      tooltip: `Spending is ${deviation.toFixed(1)}pp ${direction} expected pace (${actualPct.toFixed(1)}% actual vs ${expectedPct.toFixed(1)}% expected). On track: within 5pp.`,
    };
  }
  if (deviation <= 15) {
    return {
      status: 'at_risk',
      tooltip: `Spending is ${deviation.toFixed(1)}pp ${direction} expected pace (${actualPct.toFixed(1)}% actual vs ${expectedPct.toFixed(1)}% expected). At risk: 5-15pp deviation.`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `Spending is ${deviation.toFixed(1)}pp ${direction} expected pace (${actualPct.toFixed(1)}% actual vs ${expectedPct.toFixed(1)}% expected). Off track: >15pp deviation.`,
  };
}

export function deriveObligationStatus(
  payments: { status: PaymentStatus; dueInDays?: number }[]
): StatusResult {
  const overdue = payments.filter(p => p.status === 'overdue').length;
  const partial = payments.filter(p => p.status === 'partial').length;
  const dueSoon = payments.filter(p => p.status === 'pending' && p.dueInDays !== undefined && p.dueInDays <= 14).length;
  const total = payments.length;

  if (overdue > 0) {
    return {
      status: 'off_track',
      tooltip: `${overdue} of ${total} payments overdue. Off track: any overdue payment triggers this status.`,
    };
  }
  if (partial > 0 || dueSoon > 0) {
    const reasons: string[] = [];
    if (partial > 0) reasons.push(`${partial} partial`);
    if (dueSoon > 0) reasons.push(`${dueSoon} due within 14 days`);
    return {
      status: 'at_risk',
      tooltip: `${reasons.join(', ')} out of ${total} payments. At risk: partial payments or approaching deadlines.`,
    };
  }
  const paid = payments.filter(p => p.status === 'paid' || p.status === 'current').length;
  return {
    status: 'on_track',
    tooltip: `All ${paid} scheduled payments are current. No overdue or partial payments.`,
  };
}

export function deriveKpiStatus(kpi: KPI, monthsElapsed: number): StatusResult {
  const isOutcome = kpi.type === 'outcome';
  const proRatedTarget = isOutcome ? kpi.target : kpi.target * (monthsElapsed / 12);
  const ratio = proRatedTarget > 0 ? kpi.actual / proRatedTarget : 1;

  let hasDecliningTrend = false;
  if (kpi.trend && kpi.trend.length >= 3) {
    const last3 = kpi.trend.slice(-3);
    hasDecliningTrend = last3[0] > last3[1] && last3[1] > last3[2];
  }

  let baseStatus: Status;
  if (ratio >= 0.9) baseStatus = 'on_track';
  else if (ratio >= 0.7) baseStatus = 'at_risk';
  else baseStatus = 'off_track';

  if (hasDecliningTrend && baseStatus === 'on_track') {
    baseStatus = 'at_risk';
  } else if (hasDecliningTrend && baseStatus === 'at_risk') {
    baseStatus = 'off_track';
  }

  const targetLabel = isOutcome ? 'annual target' : `pro-rated target (${monthsElapsed}/12)`;
  const trendNote = hasDecliningTrend
    ? ` Downgraded: declining 3-month trend (${kpi.trend!.slice(-3).join(' → ')}).`
    : '';

  return {
    status: baseStatus,
    tooltip: `${kpi.name}: ${kpi.actual}${kpi.unit} vs ${proRatedTarget.toFixed(1)}${kpi.unit} ${targetLabel} (${(ratio * 100).toFixed(1)}% achievement).${trendNote}`,
  };
}

export function deriveProjectStatus(project: {
  physicalProgressPct: number;
  financialProgressPct: number;
  milestones: Milestone[];
  revisedEndDate?: string;
  isContingency?: boolean;
  status?: ProjectStatus;
}): StatusResult {
  if (project.isContingency) {
    return {
      status: 'on_track',
      tooltip: 'Contingency reserve. No drawdowns triggered. Full reserve intact.',
    };
  }

  if (project.status === 'not_started') {
    return {
      status: 'on_track',
      tooltip: 'Project has not started yet. No milestones due.',
    };
  }

  const gap = project.physicalProgressPct - project.financialProgressPct;
  const now = new Date('2026-09-30');
  const delayedMilestones = project.milestones.filter(
    m => (m.status === 'delayed') ||
      (m.status === 'in_progress' && new Date(m.plannedDate) < now)
  ).length;
  const hasRevisedEnd = !!project.revisedEndDate;

  const reasons: string[] = [];

  if (gap < -20 || delayedMilestones >= 2) {
    if (gap < -20) reasons.push(`physical progress ${gap.toFixed(1)}pp behind financial`);
    if (delayedMilestones >= 2) reasons.push(`${delayedMilestones} delayed milestones`);
    return {
      status: 'off_track',
      tooltip: `Off track: ${reasons.join('; ')}. Physical: ${project.physicalProgressPct}%, Financial: ${project.financialProgressPct}%.`,
    };
  }

  if ((gap >= -20 && gap < -10) || delayedMilestones === 1 || hasRevisedEnd) {
    if (gap < -10) reasons.push(`physical progress ${Math.abs(gap).toFixed(1)}pp behind financial`);
    if (delayedMilestones === 1) reasons.push('1 delayed milestone');
    if (hasRevisedEnd) reasons.push('end date revised');
    return {
      status: 'at_risk',
      tooltip: `At risk: ${reasons.join('; ')}. Physical: ${project.physicalProgressPct}%, Financial: ${project.financialProgressPct}%.`,
    };
  }

  return {
    status: 'on_track',
    tooltip: `Physical progress (${project.physicalProgressPct}%) within 10pp of financial (${project.financialProgressPct}%). No delayed milestones. On track.`,
  };
}

export function deriveRevenueStatus(
  collected: number,
  target: number
): StatusResult {
  const ratio = target > 0 ? collected / target : 1;
  const pct = (ratio * 100).toFixed(1);

  if (ratio >= 0.98) {
    return {
      status: 'on_track',
      tooltip: `Collections at ${pct}% of target (J$${(collected / 1000).toFixed(1)}B vs J$${(target / 1000).toFixed(1)}B target). On track: >= 98%.`,
    };
  }
  if (ratio >= 0.90) {
    return {
      status: 'at_risk',
      tooltip: `Collections at ${pct}% of target (J$${(collected / 1000).toFixed(1)}B vs J$${(target / 1000).toFixed(1)}B target). At risk: 90-98%.`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `Collections at ${pct}% of target (J$${(collected / 1000).toFixed(1)}B vs J$${(target / 1000).toFixed(1)}B target). Off track: < 90%.`,
  };
}

export function deriveStaffingHealth(
  vacant: number,
  approved: number
): StaffingResult {
  const rate = approved > 0 ? (vacant / approved) * 100 : 0;

  if (rate < 10) {
    return {
      health: 'healthy',
      tooltip: `Vacancy rate ${rate.toFixed(1)}% (${vacant} vacant of ${approved} approved). Healthy: < 10%.`,
    };
  }
  if (rate <= 20) {
    return {
      health: 'concern',
      tooltip: `Vacancy rate ${rate.toFixed(1)}% (${vacant} vacant of ${approved} approved). Concern: 10-20%.`,
    };
  }
  return {
    health: 'critical',
    tooltip: `Vacancy rate ${rate.toFixed(1)}% (${vacant} vacant of ${approved} approved). Critical: > 20%.`,
  };
}

export function deriveMinistryStatus(
  bucketStatuses: Status[]
): StatusResult {
  const scores: Record<Status, number> = { on_track: 0, at_risk: 1, off_track: 2 };
  const composite = bucketStatuses.reduce((sum, s) => sum + scores[s], 0);

  const labels = bucketStatuses.map((s, i) => {
    const names = ['Fixed obligations', 'Operational', 'Capital'];
    return `${names[i]}: ${s.replace('_', ' ')} (${scores[s]})`;
  });

  if (composite <= 1) {
    return {
      status: 'on_track',
      tooltip: `${labels.join('. ')}. Composite: ${composite}. On track: <= 1.`,
    };
  }
  if (composite <= 3) {
    return {
      status: 'at_risk',
      tooltip: `${labels.join('. ')}. Composite: ${composite}. At risk: 2-3.`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `${labels.join('. ')}. Composite: ${composite}. Off track: >= 4.`,
  };
}
