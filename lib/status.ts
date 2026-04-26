import type { Status, StatusResult, StaffingHealth, StaffingResult, PaymentStatus, KPI, Milestone, ProjectStatus } from './types';

export function deriveUtilizationStatus(
  actualPct: number,
  expectedPct: number
): StatusResult {
  const deviation = Math.abs(actualPct - expectedPct);
  const direction = actualPct > expectedPct ? 'ahead of' : 'behind';
  const actual = actualPct.toFixed(1);
  const expected = expectedPct.toFixed(1);

  if (deviation <= 5) {
    return {
      status: 'on_track',
      tooltip: `Spending is on track — ${actual}% of the budget has been used, which is close to the ${expected}% expected at this point in the year.`,
    };
  }
  if (deviation <= 15) {
    return {
      status: 'at_risk',
      tooltip: `Spending needs attention — ${actual}% of the budget has been used, but we expected about ${expected}%. That's noticeably ${direction} schedule.`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `Spending is significantly ${direction} schedule — ${actual}% used vs ${expected}% expected. This gap is large enough to require immediate review.`,
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
      tooltip: `${overdue} of ${total} payment${total > 1 ? 's are' : ' is'} overdue. These need to be settled urgently to avoid penalties or service disruption.`,
    };
  }
  if (partial > 0 || dueSoon > 0) {
    const parts: string[] = [];
    if (partial > 0) parts.push(`${partial} only partially paid`);
    if (dueSoon > 0) parts.push(`${dueSoon} due within the next two weeks`);
    return {
      status: 'at_risk',
      tooltip: `Some payments need attention: ${parts.join(' and ')}. No payments are overdue yet, but action is needed soon.`,
    };
  }
  return {
    status: 'on_track',
    tooltip: `All ${total} payments are up to date. Nothing overdue or outstanding.`,
  };
}

export function deriveKpiStatus(kpi: KPI, monthsElapsed: number): StatusResult {
  const isOutcome = kpi.type === 'outcome';
  const proRatedTarget = isOutcome ? kpi.target : kpi.target * (monthsElapsed / 12);
  const ratio = proRatedTarget > 0 ? kpi.actual / proRatedTarget : 1;
  const pct = Math.round(ratio * 100);

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

  const trendNote = hasDecliningTrend
    ? ' Performance has also been declining for the last three months in a row.'
    : '';

  if (baseStatus === 'on_track') {
    return {
      status: 'on_track',
      tooltip: `${kpi.name} is meeting its target — ${pct}% of where it should be at this point.${trendNote}`,
    };
  }
  if (baseStatus === 'at_risk') {
    return {
      status: 'at_risk',
      tooltip: `${kpi.name} is behind target — only at ${pct}% of where it should be. Needs attention to get back on track.${trendNote}`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `${kpi.name} is well below target — only ${pct}% achieved. This needs urgent intervention.${trendNote}`,
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
      tooltip: 'This is a contingency reserve. No funds have been drawn down — the full reserve is intact.',
    };
  }

  if (project.status === 'not_started') {
    return {
      status: 'on_track',
      tooltip: 'This project has not started yet. No milestones are due at this time.',
    };
  }

  const gap = project.physicalProgressPct - project.financialProgressPct;
  const now = new Date('2026-09-30');
  const delayedMilestones = project.milestones.filter(
    m => (m.status === 'delayed') ||
      (m.status === 'in_progress' && new Date(m.plannedDate) < now)
  );
  const completedMilestones = project.milestones.filter(m => m.status === 'completed');
  const hasRevisedEnd = !!project.revisedEndDate;

  if (gap < -20 || delayedMilestones.length >= 2) {
    const issues: string[] = [];
    if (gap < -20) issues.push('money has been spent but work is falling far behind');
    if (delayedMilestones.length >= 2) {
      const names = delayedMilestones.map(m => m.name).join(', ');
      issues.push(`${delayedMilestones.length} milestones are delayed (${names})`);
    }
    return {
      status: 'off_track',
      tooltip: `This project has serious issues: ${issues.join(', and ')}. Immediate review is recommended.`,
    };
  }

  if ((gap >= -20 && gap < -10) || delayedMilestones.length === 1 || hasRevisedEnd) {
    const issues: string[] = [];
    if (gap < -10) issues.push('work is somewhat behind relative to spending');
    if (delayedMilestones.length === 1) issues.push(`"${delayedMilestones[0].name}" is delayed`);
    if (hasRevisedEnd) issues.push('the completion date has been pushed back');
    return {
      status: 'at_risk',
      tooltip: `This project needs attention: ${issues.join(', ')}. Not critical yet, but worth monitoring closely.`,
    };
  }

  const mTotal = project.milestones.length;
  const mDone = completedMilestones.length;
  return {
    status: 'on_track',
    tooltip: `Project is on track — meeting all key milestones (${mDone} of ${mTotal} completed). Work and spending are well aligned.`,
  };
}

export function deriveRevenueStatus(
  collected: number,
  target: number
): StatusResult {
  const ratio = target > 0 ? collected / target : 1;
  const pct = Math.round(ratio * 100);

  if (ratio >= 0.98) {
    return {
      status: 'on_track',
      tooltip: `Revenue collection is on target — ${pct}% of the expected amount has been collected.`,
    };
  }
  if (ratio >= 0.90) {
    return {
      status: 'at_risk',
      tooltip: `Revenue is slightly below target — only ${pct}% collected so far. The shortfall may widen if not addressed.`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `Revenue collection is significantly below target — only ${pct}% collected. This shortfall needs urgent attention.`,
  };
}

export function deriveStaffingHealth(
  vacant: number,
  approved: number
): StaffingResult {
  const filled = approved - vacant;
  const rate = approved > 0 ? (vacant / approved) * 100 : 0;

  if (rate < 10) {
    return {
      health: 'healthy',
      tooltip: `Staffing is healthy — ${filled} of ${approved} positions are filled. Only ${vacant} vacant.`,
    };
  }
  if (rate <= 20) {
    return {
      health: 'concern',
      tooltip: `Staffing needs attention — ${vacant} of ${approved} positions are vacant. This could start affecting operations.`,
    };
  }
  return {
    health: 'critical',
    tooltip: `Staffing is critically low — ${vacant} of ${approved} positions are vacant. This is likely affecting service delivery.`,
  };
}

export function deriveMinistryStatus(
  bucketStatuses: Status[]
): StatusResult {
  const scores: Record<Status, number> = { on_track: 0, at_risk: 1, off_track: 2 };
  const composite = bucketStatuses.reduce((sum, s) => sum + scores[s], 0);

  const names = ['Recurring obligations', 'Operations', 'Capital projects'];
  const statusLabels: Record<Status, string> = {
    on_track: 'on track',
    at_risk: 'needs attention',
    off_track: 'has issues',
  };

  const summary = bucketStatuses.map((s, i) => `${names[i]}: ${statusLabels[s]}`);
  const summaryText = summary.join('. ');

  if (composite <= 1) {
    return {
      status: 'on_track',
      tooltip: `This ministry is performing well overall. ${summaryText}.`,
    };
  }
  if (composite <= 3) {
    return {
      status: 'at_risk',
      tooltip: `This ministry has some areas that need attention. ${summaryText}.`,
    };
  }
  return {
    status: 'off_track',
    tooltip: `This ministry has significant issues across multiple areas. ${summaryText}.`,
  };
}
