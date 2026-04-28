import { ministryRegistry, ministryOrder, getMinistryData } from '@/lib/data';
import { mockMeetings, getAllActionItems, getActionItemsByMinistry, getMinisterAttendanceRate, allMinisters } from '@/lib/meetings/data';
import { mockBlockers } from '@/lib/blockers/data';
import { deriveUtilizationStatus, deriveMinistryStatus } from '@/lib/status';
import type { MinistryData, CapitalProject, OperationalEntity, Obligation } from '@/lib/types';
import type { ActionItem, CabinetMeeting } from '@/lib/meetings/types';
import type { Blocker } from '@/lib/blockers/types';

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

function utilPct(m: MinistryData): number {
  return m.overview.totalAllocation > 0
    ? Math.round((m.overview.totalSpent / m.overview.totalAllocation) * 100)
    : 0;
}

function ministryStatus(m: MinistryData): string {
  const fPaid = m.fixedObligations.totalPaid;
  const fAlloc = m.fixedObligations.totalAllocation;
  const fStatus = deriveUtilizationStatus(fAlloc > 0 ? (fPaid / fAlloc) * 100 : 0, 75).status;
  const oStatus = deriveUtilizationStatus(m.operational.utilizationPct, 75).status;
  const cSpent = m.capital.totalSpent;
  const cAlloc = m.capital.totalAllocation;
  const cStatus = deriveUtilizationStatus(cAlloc > 0 ? (cSpent / cAlloc) * 100 : 0, 75).status;
  return deriveMinistryStatus([fStatus, oStatus, cStatus]).status;
}

export const toolExecutors: Record<string, (params: Record<string, unknown>) => unknown> = {

  getMinistryList: () => {
    return ministryOrder.map(slug => {
      const m = ministryRegistry[slug];
      return {
        slug,
        name: m.overview.name,
        shortName: m.overview.shortName,
        minister: m.overview.minister.name,
        totalAllocation: fmt(m.overview.totalAllocation),
        totalSpent: fmt(m.overview.totalSpent),
        utilizationPct: utilPct(m) + '%',
        status: ministryStatus(m),
      };
    });
  },

  getMinistryDetail: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found. Available: ${ministryOrder.join(', ')}` };
    return {
      slug,
      name: m.overview.name,
      minister: m.overview.minister.name,
      totalAllocation: fmt(m.overview.totalAllocation),
      priorYearAllocation: fmt(m.overview.priorYearAllocation),
      totalSpent: fmt(m.overview.totalSpent),
      utilizationPct: utilPct(m) + '%',
      status: ministryStatus(m),
      fixedObligations: {
        allocation: fmt(m.fixedObligations.totalAllocation),
        paid: fmt(m.fixedObligations.totalPaid),
        count: m.fixedObligations.obligations.length,
        pctOfMinistry: m.fixedObligations.pctOfMinistry + '%',
      },
      operational: {
        allocation: fmt(m.operational.totalAllocation),
        spent: fmt(m.operational.totalSpent),
        utilizationPct: m.operational.utilizationPct + '%',
        entityCount: m.operational.entities.length,
        filledPosts: m.operational.totalFilledPosts,
        approvedPosts: m.operational.totalApprovedPosts,
        vacancyRate: m.operational.vacancyRate + '%',
      },
      capital: {
        allocation: fmt(m.capital.totalAllocation),
        spent: fmt(m.capital.totalSpent),
        projectCount: m.capital.projects.length,
      },
      revenue: m.revenue.totalTarget > 0 ? {
        collected: fmt(m.revenue.totalCollected),
        target: fmt(m.revenue.totalTarget),
        variance: fmt(m.revenue.variance),
        variancePct: m.revenue.variancePct + '%',
      } : null,
      leadership: m.leadership.map(l => ({ name: l.name, title: l.title, role: l.role })),
    };
  },

  getMinistryProjects: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found` };
    let projects = m.capital.projects;
    if (params.status) projects = projects.filter((p: CapitalProject) => p.status === params.status);
    if (params.riskLevel) projects = projects.filter((p: CapitalProject) => p.riskLevel === params.riskLevel);
    return projects.map((p: CapitalProject) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      budget: fmt(p.currentYearBudget),
      spent: fmt(p.currentYearSpent),
      totalCost: fmt(p.totalProjectCost),
      financialProgress: p.financialProgressPct + '%',
      physicalProgress: p.physicalProgressPct + '%',
      status: p.status,
      riskLevel: p.riskLevel,
      startDate: p.startDate,
      originalEnd: p.originalEndDate,
      revisedEnd: p.revisedEndDate || 'N/A',
      milestoneCount: p.milestones.length,
      completedMilestones: p.milestones.filter(ms => ms.status === 'completed').length,
      delayedMilestones: p.milestones.filter(ms => ms.status === 'delayed').length,
    }));
  },

  getMinistryObligations: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found` };
    let obligations = m.fixedObligations.obligations;
    if (params.type) obligations = obligations.filter((o: Obligation) => o.type === params.type);
    if (params.paymentStatus) obligations = obligations.filter((o: Obligation) => o.paymentStatus === params.paymentStatus);
    return obligations.map((o: Obligation) => ({
      id: o.id,
      type: o.type,
      name: o.name,
      headCode: o.headCode,
      allocation: fmt(o.allocation),
      paid: fmt(o.paid),
      paymentStatus: o.paymentStatus,
    }));
  },

  getMinistryEntities: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found` };
    return m.operational.entities.map((e: OperationalEntity) => ({
      id: e.id,
      name: e.name,
      headCode: e.headCode,
      allocation: fmt(e.allocation),
      spent: fmt(e.spent),
      utilizationPct: e.utilizationPct + '%',
      staffing: {
        approved: e.staffing.approvedPosts,
        filled: e.staffing.filledPosts,
        vacant: e.staffing.vacantPosts,
        vacancyRate: e.staffing.vacancyRate + '%',
      },
      kpis: e.kpis.map(k => ({
        name: k.name,
        type: k.type,
        target: k.target,
        actual: k.actual,
        unit: k.unit,
        progressPct: k.target > 0 ? Math.round((k.actual / k.target) * 100) + '%' : 'N/A',
      })),
      revenue: e.revenueData ? {
        collected: fmt(e.revenueData.collected),
        target: fmt(e.revenueData.target),
      } : null,
    }));
  },

  getMinisterProfile: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Minister for "${slug}" not found` };
    const minister = m.overview.minister;
    const profile = minister.profile;
    return {
      name: minister.name,
      title: minister.title,
      ministry: m.overview.name,
      slug,
      bio: profile?.bio || 'No bio available',
      constituency: profile?.constituency || 'N/A',
      officeLocation: profile?.officeLocation || 'N/A',
      avatarUrl: minister.avatarUrl,
      leadership: m.leadership.map(l => ({ name: l.name, title: l.title, role: l.role })),
    };
  },

  getMeetingList: (params) => {
    let meetings = [...mockMeetings];
    if (params.dateAfter) meetings = meetings.filter(m => m.date >= (params.dateAfter as string));
    if (params.dateBefore) meetings = meetings.filter(m => m.date <= (params.dateBefore as string));
    if (params.status) meetings = meetings.filter(m => m.status === params.status);
    return meetings.map(m => ({
      id: m.id,
      date: m.date,
      title: m.title,
      status: m.status,
      attendeeCount: m.attendees.length,
      actionItemCount: m.actionItems?.length || 0,
      decisionCount: m.keyDecisions?.length || 0,
      hasMinutes: !!m.minutes,
      transcriptStatus: m.transcriptStatus,
    }));
  },

  getMeetingDetail: (params) => {
    const id = params.id as string;
    const meeting = mockMeetings.find(m => m.id === id);
    if (!meeting) return { error: `Meeting "${id}" not found. Format: mtg-YYYY-MM-DD` };
    return {
      id: meeting.id,
      date: meeting.date,
      title: meeting.title,
      status: meeting.status,
      attendees: meeting.attendees.map(a => ({ name: a.name, ministry: a.title, slug: a.ministrySlug })),
      actionItems: meeting.actionItems?.map(ai => ({
        id: ai.id, description: ai.description, assignee: ai.assignee,
        ministry: ai.ministrySlug, dueDate: ai.dueDate, status: ai.status,
      })) || [],
      keyDecisions: meeting.keyDecisions?.map(kd => ({
        id: kd.id, decision: kd.decision, proposedBy: kd.proposedBy, category: kd.category,
      })) || [],
      hasMinutes: !!meeting.minutes,
      minutesPreview: meeting.minutes?.slice(0, 500) || null,
    };
  },

  listActionItems: (params) => {
    let items = getAllActionItems();
    if (params.status) items = items.filter(i => i.status === params.status);
    if (params.ministrySlug) items = items.filter(i => i.ministrySlug === params.ministrySlug);
    if (params.meetingId) items = items.filter(i => i.meetingId === params.meetingId);
    if (params.assignee) items = items.filter(i => i.assignee.toLowerCase().includes((params.assignee as string).toLowerCase()));
    if (params.overdue) {
      const today = new Date().toISOString().slice(0, 10);
      items = items.filter(i => i.status !== 'completed' && i.dueDate < today);
    }
    if (params.dateAfter) items = items.filter(i => i.dueDate >= (params.dateAfter as string));
    if (params.dateBefore) items = items.filter(i => i.dueDate <= (params.dateBefore as string));
    return items.map(i => ({
      id: i.id, description: i.description, assignee: i.assignee,
      ministry: i.ministrySlug, meetingId: i.meetingId, meetingDate: i.meetingDate,
      dueDate: i.dueDate, status: i.status,
      isOverdue: i.status !== 'completed' && i.dueDate < new Date().toISOString().slice(0, 10),
    }));
  },

  listBlockers: (params) => {
    let blockers = [...mockBlockers];
    if (params.status) blockers = blockers.filter(b => b.status === params.status);
    if (params.escalationLevel) blockers = blockers.filter(b => b.escalationLevel === params.escalationLevel);
    if (params.ministrySlug) blockers = blockers.filter(b => b.assignedMinistrySlug === params.ministrySlug);
    if (params.createdAfter) blockers = blockers.filter(b => b.createdDate >= (params.createdAfter as string));
    if (params.createdBefore) blockers = blockers.filter(b => b.createdDate <= (params.createdBefore as string));
    return blockers.map(b => ({
      id: b.id, title: b.title, description: b.description,
      escalationLevel: b.escalationLevel, assignedTo: b.assignedTo,
      ministry: b.assignedMinistrySlug, status: b.status,
      createdDate: b.createdDate, ageDays: Math.floor((Date.now() - new Date(b.createdDate + 'T00:00:00').getTime()) / 86400000),
      linkedName: b.linkedName || null,
      commentCount: b.activity.filter(a => a.type === 'comment').length,
      lastActivity: b.activity.length > 0 ? b.activity[b.activity.length - 1].timestamp : null,
    }));
  },

  getMinisterOKRs: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found` };
    const okrs = m.operational.entities.flatMap((e: OperationalEntity) => {
      const outcomes = e.kpis.filter(k => k.type === 'outcome');
      if (outcomes.length === 0) return [];
      return [{
        objective: `${e.name}: improve ${outcomes[0].name}`,
        keyResults: e.kpis.slice(0, 3).map(k => ({
          title: k.name,
          target: k.target,
          actual: k.actual,
          unit: k.unit,
          progressPct: k.target > 0 ? Math.round((k.actual / k.target) * 100) : 0,
        })),
      }];
    });
    return okrs.length > 0 ? okrs : [{ message: 'No OKRs derived for this ministry. OKR data will be available when set by the PM\'s Office.' }];
  },

  getMinisterAccountability: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found` };
    const attendance = getMinisterAttendanceRate(slug);
    const actions = getActionItemsByMinistry(slug);
    const completed = actions.filter(a => a.status === 'completed').length;
    const overdue = actions.filter(a => a.status !== 'completed' && a.dueDate < new Date().toISOString().slice(0, 10)).length;
    const blockers = mockBlockers.filter(b => b.assignedMinistrySlug === slug && b.status !== 'resolved');
    return {
      minister: m.overview.minister.name,
      ministry: m.overview.name,
      attendance: { attended: attendance.attended, total: attendance.total, pct: attendance.pct + '%' },
      actionItems: { total: actions.length, completed, overdue, completionRate: actions.length > 0 ? Math.round((completed / actions.length) * 100) + '%' : 'N/A' },
      openBlockers: blockers.length,
      pmLevelBlockers: blockers.filter(b => b.escalationLevel === 'pm').length,
      ministryStatus: ministryStatus(m),
    };
  },

  searchAcrossMinistries: (params) => {
    const query = (params.query as string).toLowerCase();
    const results: Array<{ type: string; ministry: string; name: string; detail: string }> = [];
    for (const slug of ministryOrder) {
      const m = ministryRegistry[slug];
      if (m.overview.name.toLowerCase().includes(query) || m.overview.minister.name.toLowerCase().includes(query)) {
        results.push({ type: 'ministry', ministry: slug, name: m.overview.name, detail: `Minister: ${m.overview.minister.name}` });
      }
      for (const p of m.capital.projects) {
        if (p.name.toLowerCase().includes(query)) {
          results.push({ type: 'project', ministry: slug, name: p.name, detail: `Status: ${p.status}, Budget: ${fmt(p.currentYearBudget)}` });
        }
      }
      for (const e of m.operational.entities) {
        if (e.name.toLowerCase().includes(query)) {
          results.push({ type: 'entity', ministry: slug, name: e.name, detail: `Allocation: ${fmt(e.allocation)}` });
        }
      }
      for (const o of m.fixedObligations.obligations) {
        if (o.name.toLowerCase().includes(query)) {
          results.push({ type: 'obligation', ministry: slug, name: o.name, detail: `Type: ${o.type}, Allocation: ${fmt(o.allocation)}` });
        }
      }
      for (const l of m.leadership) {
        if (l.name.toLowerCase().includes(query)) {
          results.push({ type: 'person', ministry: slug, name: l.name, detail: l.title });
        }
      }
    }
    return results.slice(0, 20);
  },

  aggregateSpending: (params) => {
    const dimension = params.dimension as string;
    if (dimension === 'ministry') {
      return ministryOrder.map(slug => {
        const m = ministryRegistry[slug];
        return { name: m.overview.shortName, allocation: fmt(m.overview.totalAllocation), spent: fmt(m.overview.totalSpent), utilization: utilPct(m) + '%' };
      }).sort((a, b) => parseFloat(b.allocation.replace(/[$BM]/g, '')) - parseFloat(a.allocation.replace(/[$BM]/g, '')));
    }
    if (dimension === 'bucket') {
      let fixedTotal = 0, opsTotal = 0, capTotal = 0;
      let fixedSpent = 0, opsSpent = 0, capSpent = 0;
      for (const slug of ministryOrder) {
        const m = ministryRegistry[slug];
        fixedTotal += m.fixedObligations.totalAllocation; fixedSpent += m.fixedObligations.totalPaid;
        opsTotal += m.operational.totalAllocation; opsSpent += m.operational.totalSpent;
        capTotal += m.capital.totalAllocation; capSpent += m.capital.totalSpent;
      }
      return [
        { bucket: 'Fixed Obligations', allocation: fmt(fixedTotal), spent: fmt(fixedSpent) },
        { bucket: 'Operational', allocation: fmt(opsTotal), spent: fmt(opsSpent) },
        { bucket: 'Capital', allocation: fmt(capTotal), spent: fmt(capSpent) },
      ];
    }
    if (dimension === 'status') {
      const byStatus: Record<string, { count: number; totalAlloc: number }> = { on_track: { count: 0, totalAlloc: 0 }, at_risk: { count: 0, totalAlloc: 0 }, off_track: { count: 0, totalAlloc: 0 } };
      for (const slug of ministryOrder) {
        const m = ministryRegistry[slug];
        const s = ministryStatus(m);
        byStatus[s].count++;
        byStatus[s].totalAlloc += m.overview.totalAllocation;
      }
      return Object.entries(byStatus).map(([status, data]) => ({ status, count: data.count, totalAllocation: fmt(data.totalAlloc) }));
    }
    return { error: 'Invalid dimension. Use: ministry, bucket, or status' };
  },

  compareMinistries: (params) => {
    const slugs = params.slugs as string[];
    if (!slugs || slugs.length < 2) return { error: 'Provide at least 2 ministry slugs to compare' };
    return slugs.map(slug => {
      const m = getMinistryData(slug);
      if (!m) return { slug, error: 'not found' };
      return {
        slug,
        name: m.overview.shortName,
        allocation: fmt(m.overview.totalAllocation),
        spent: fmt(m.overview.totalSpent),
        utilization: utilPct(m) + '%',
        status: ministryStatus(m),
        projects: m.capital.projects.length,
        entities: m.operational.entities.length,
        vacancyRate: m.operational.vacancyRate + '%',
        openBlockers: mockBlockers.filter(b => b.assignedMinistrySlug === slug && b.status !== 'resolved').length,
      };
    });
  },

  identifyAtRiskItems: (params) => {
    const type = (params.type as string) || 'all';
    const results: Record<string, unknown[]> = {};
    if (type === 'all' || type === 'ministries') {
      results.ministries = ministryOrder
        .map(slug => ({ slug, name: ministryRegistry[slug].overview.shortName, status: ministryStatus(ministryRegistry[slug]) }))
        .filter(m => m.status !== 'on_track');
    }
    if (type === 'all' || type === 'projects') {
      const atRisk: unknown[] = [];
      for (const slug of ministryOrder) {
        for (const p of ministryRegistry[slug].capital.projects) {
          if (p.status === 'delayed' || p.status === 'at_risk') {
            atRisk.push({ ministry: slug, name: p.name, status: p.status, risk: p.riskLevel, budget: fmt(p.currentYearBudget) });
          }
        }
      }
      results.projects = atRisk;
    }
    if (type === 'all' || type === 'actions') {
      const today = new Date().toISOString().slice(0, 10);
      results.overdueActions = getAllActionItems().filter(a => a.status !== 'completed' && a.dueDate < today)
        .map(a => ({ id: a.id, description: a.description, assignee: a.assignee, dueDate: a.dueDate, daysOverdue: Math.floor((Date.now() - new Date(a.dueDate + 'T00:00:00').getTime()) / 86400000) }));
    }
    return results;
  },

  calculateTrend: (params) => {
    const entityType = params.entityType as string;
    const entityId = params.entityId as string;
    if (entityType === 'ministry') {
      const m = getMinistryData(entityId);
      if (!m) return { error: `Ministry "${entityId}" not found` };
      return { entity: m.overview.shortName, type: 'ministry', snapshots: m.overview.actuals.map(s => ({ period: s.period, monthly: fmt(s.monthly), cumulative: fmt(s.cumulative) })) };
    }
    return { error: 'Supported entityTypes: ministry' };
  },

  getSystemStats: () => {
    let totalAlloc = 0, totalSpent = 0;
    const statusCounts = { on_track: 0, at_risk: 0, off_track: 0 };
    for (const slug of ministryOrder) {
      const m = ministryRegistry[slug];
      totalAlloc += m.overview.totalAllocation;
      totalSpent += m.overview.totalSpent;
      statusCounts[ministryStatus(m) as keyof typeof statusCounts]++;
    }
    const today = new Date().toISOString().slice(0, 10);
    const allActions = getAllActionItems();
    const overdueActions = allActions.filter(a => a.status !== 'completed' && a.dueDate < today);
    const openBlockers = mockBlockers.filter(b => b.status !== 'resolved');
    return {
      ministryCount: ministryOrder.length,
      totalAllocation: fmt(totalAlloc),
      totalSpent: fmt(totalSpent),
      overallUtilization: totalAlloc > 0 ? Math.round((totalSpent / totalAlloc) * 100) + '%' : '0%',
      statusBreakdown: statusCounts,
      totalActionItems: allActions.length,
      overdueActionItems: overdueActions.length,
      openBlockers: openBlockers.length,
      pmLevelBlockers: openBlockers.filter(b => b.escalationLevel === 'pm').length,
      totalMeetings: mockMeetings.length,
      completedMeetings: mockMeetings.filter(m => m.status === 'completed').length,
    };
  },

  queryData: (params) => {
    const entityType = params.entityType as string;
    const filters = (params.filters || {}) as Record<string, unknown>;
    const groupBy = params.groupBy as string | undefined;
    const sortBy = params.sortBy as string | undefined;
    const limit = (params.limit as number) || 50;

    if (entityType === 'action_item_comments') {
      const allItems = getAllActionItems();
      let commentData: Array<{ author: string; actionId: string; ministry: string }> = [];
      for (const meeting of mockMeetings) {
        if (!meeting.actionItems) continue;
        for (const ai of meeting.actionItems) {
          commentData.push({ author: ai.assignee, actionId: ai.id, ministry: ai.ministrySlug });
        }
      }
      if (filters.ministrySlug) commentData = commentData.filter(c => c.ministry === filters.ministrySlug);
      if (groupBy === 'author') {
        const grouped: Record<string, number> = {};
        for (const c of commentData) {
          grouped[c.author] = (grouped[c.author] || 0) + 1;
        }
        return Object.entries(grouped)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([author, count]) => ({ author, count }));
      }
      return commentData.slice(0, limit);
    }

    if (entityType === 'blockers') {
      let data = mockBlockers.map(b => ({
        ...b, ageDays: Math.floor((Date.now() - new Date(b.createdDate + 'T00:00:00').getTime()) / 86400000),
        commentCount: b.activity.filter(a => a.type === 'comment').length,
      }));
      if (filters.createdAfter) data = data.filter(b => b.createdDate >= (filters.createdAfter as string));
      if (filters.createdBefore) data = data.filter(b => b.createdDate <= (filters.createdBefore as string));
      if (filters.status) data = data.filter(b => b.status === filters.status);
      if (groupBy === 'escalationLevel') {
        const grouped: Record<string, number> = {};
        for (const b of data) grouped[b.escalationLevel] = (grouped[b.escalationLevel] || 0) + 1;
        return Object.entries(grouped).map(([level, count]) => ({ level, count }));
      }
      if (sortBy) data.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortBy];
        const bVal = (b as Record<string, unknown>)[sortBy];
        if (typeof aVal === 'number' && typeof bVal === 'number') return bVal - aVal;
        return String(bVal).localeCompare(String(aVal));
      });
      return data.slice(0, limit).map(b => ({
        id: b.id, title: b.title, status: b.status, escalationLevel: b.escalationLevel,
        assignedTo: b.assignedTo, createdDate: b.createdDate, ageDays: b.ageDays, commentCount: b.commentCount,
      }));
    }

    if (entityType === 'action_items') {
      let data = getAllActionItems().map(a => ({
        ...a, isOverdue: a.status !== 'completed' && a.dueDate < new Date().toISOString().slice(0, 10),
      }));
      if (filters.ministrySlug) data = data.filter(a => a.ministrySlug === filters.ministrySlug);
      if (filters.status) data = data.filter(a => a.status === filters.status);
      if (groupBy === 'assignee') {
        const grouped: Record<string, number> = {};
        for (const a of data) grouped[a.assignee] = (grouped[a.assignee] || 0) + 1;
        return Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([assignee, count]) => ({ assignee, count }));
      }
      if (groupBy === 'ministry') {
        const grouped: Record<string, number> = {};
        for (const a of data) grouped[a.ministrySlug] = (grouped[a.ministrySlug] || 0) + 1;
        return Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([ministry, count]) => ({ ministry, count }));
      }
      return data.slice(0, limit);
    }

    return { error: `Unknown entityType: "${entityType}". Available: action_item_comments, blockers, action_items` };
  },

  draftBriefing: (params) => {
    const topic = params.topic as string;
    return {
      note: 'This tool provides structured data for briefing composition. Atlas should use the returned data to compose a briefing in its response blocks.',
      topic,
      audience: params.audience || 'pm',
      systemStats: toolExecutors.getSystemStats({}),
      atRiskItems: toolExecutors.identifyAtRiskItems({ type: 'all' }),
    };
  },

  rankEntities: (params) => {
    const entityType = (params.entityType as string) || 'ministry';
    const metric = (params.metric as string) || 'allocation';
    const order = (params.order as string) || 'desc';
    const limit = (params.limit as number) || 10;

    if (entityType === 'ministry') {
      const rows = ministryOrder.map(slug => {
        const m = ministryRegistry[slug];
        const alloc = m.overview.totalAllocation;
        const spent = m.overview.totalSpent;
        const util = alloc > 0 ? (spent / alloc) * 100 : 0;
        const capAlloc = m.capital.totalAllocation;
        const capSpent = m.capital.totalSpent;
        const opsUtil = m.operational.utilizationPct;
        const vacRate = m.operational.vacancyRate;
        const blockerCount = mockBlockers.filter(b => b.assignedMinistrySlug === slug && b.status !== 'resolved').length;
        const actions = getActionItemsByMinistry(slug);
        const overdue = actions.filter(a => a.status !== 'completed' && a.dueDate < new Date().toISOString().slice(0, 10)).length;

        let sortVal = alloc;
        if (metric === 'spent') sortVal = spent;
        else if (metric === 'utilization') sortVal = util;
        else if (metric === 'capital_allocation') sortVal = capAlloc;
        else if (metric === 'capital_spent') sortVal = capSpent;
        else if (metric === 'ops_utilization') sortVal = opsUtil;
        else if (metric === 'vacancy_rate') sortVal = vacRate;
        else if (metric === 'blockers') sortVal = blockerCount;
        else if (metric === 'overdue_actions') sortVal = overdue;

        return {
          slug,
          name: m.overview.shortName,
          fullName: m.overview.name,
          allocation: alloc,
          allocationFmt: fmt(alloc),
          spent: spent,
          spentFmt: fmt(spent),
          utilizationPct: Math.round(util * 10) / 10,
          capitalAllocation: capAlloc,
          capitalSpent: capSpent,
          opsUtilizationPct: opsUtil,
          vacancyRate: vacRate,
          openBlockers: blockerCount,
          overdueActions: overdue,
          status: ministryStatus(m),
          _sortVal: sortVal,
        };
      });

      rows.sort((a, b) => order === 'asc' ? a._sortVal - b._sortVal : b._sortVal - a._sortVal);
      return {
        metric,
        order,
        results: rows.slice(0, limit).map(({ _sortVal, ...r }, i) => ({ rank: i + 1, ...r })),
        total: rows.length,
      };
    }

    if (entityType === 'project') {
      const allProjects: Array<{ ministry: string; ministryName: string; project: CapitalProject; sortVal: number }> = [];
      for (const slug of ministryOrder) {
        const m = ministryRegistry[slug];
        for (const p of m.capital.projects) {
          let sortVal = p.currentYearBudget;
          if (metric === 'spent') sortVal = p.currentYearSpent;
          else if (metric === 'total_cost') sortVal = p.totalProjectCost;
          else if (metric === 'physical_progress') sortVal = p.physicalProgressPct;
          else if (metric === 'financial_progress') sortVal = p.financialProgressPct;
          allProjects.push({ ministry: slug, ministryName: m.overview.shortName, project: p, sortVal });
        }
      }
      allProjects.sort((a, b) => order === 'asc' ? a.sortVal - b.sortVal : b.sortVal - a.sortVal);
      return {
        metric,
        order,
        results: allProjects.slice(0, limit).map((r, i) => ({
          rank: i + 1,
          ministry: r.ministry,
          ministryName: r.ministryName,
          name: r.project.name,
          budget: r.project.currentYearBudget,
          budgetFmt: fmt(r.project.currentYearBudget),
          spent: r.project.currentYearSpent,
          spentFmt: fmt(r.project.currentYearSpent),
          totalCost: r.project.totalProjectCost,
          totalCostFmt: fmt(r.project.totalProjectCost),
          physicalProgress: r.project.physicalProgressPct,
          financialProgress: r.project.financialProgressPct,
          status: r.project.status,
          riskLevel: r.project.riskLevel,
        })),
        total: allProjects.length,
      };
    }

    return { error: 'Supported entityTypes: ministry, project' };
  },

  computeTrends: (params) => {
    const slug = params.slug as string;
    const bucket = (params.bucket as string) || 'total';
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found. Available: ${ministryOrder.join(', ')}` };

    let actuals: { period: string; cumulative: number; monthly: number }[] = [];
    let pyActuals: { period: string; cumulative: number; monthly: number }[] = [];
    let allocation = 0;

    if (bucket === 'total') {
      actuals = m.overview.actuals;
      pyActuals = m.overview.priorYearActuals;
      allocation = m.overview.totalAllocation;
    } else if (bucket === 'fixed') {
      actuals = m.fixedObligations.actuals;
      pyActuals = m.fixedObligations.priorYearActuals;
      allocation = m.fixedObligations.totalAllocation;
    } else if (bucket === 'operational') {
      actuals = m.operational.actuals;
      pyActuals = m.operational.priorYearActuals;
      allocation = m.operational.totalAllocation;
    } else if (bucket === 'capital') {
      actuals = m.capital.actuals;
      pyActuals = m.capital.priorYearActuals;
      allocation = m.capital.totalAllocation;
    }

    const monthlyChanges = actuals.map((s, i) => {
      const prev = i > 0 ? actuals[i - 1].monthly : 0;
      const change = prev > 0 ? ((s.monthly - prev) / prev) * 100 : 0;
      return { period: s.period, monthly: s.monthly, monthlyFmt: fmt(s.monthly), cumulative: s.cumulative, cumulativeFmt: fmt(s.cumulative), momChangePct: Math.round(change * 10) / 10 };
    });

    const latestCum = actuals.length > 0 ? actuals[actuals.length - 1].cumulative : 0;
    const utilizationSoFar = allocation > 0 ? Math.round((latestCum / allocation) * 1000) / 10 : 0;

    const avgMonthly = actuals.length > 0 ? actuals.reduce((s, a) => s + a.monthly, 0) / actuals.length : 0;
    const isAccelerating = actuals.length >= 3 && actuals[actuals.length - 1].monthly > actuals[actuals.length - 2].monthly && actuals[actuals.length - 2].monthly > actuals[actuals.length - 3].monthly;
    const isDecelerating = actuals.length >= 3 && actuals[actuals.length - 1].monthly < actuals[actuals.length - 2].monthly && actuals[actuals.length - 2].monthly < actuals[actuals.length - 3].monthly;

    return {
      ministry: m.overview.shortName,
      bucket,
      allocation: allocation,
      allocationFmt: fmt(allocation),
      utilizationSoFar: utilizationSoFar + '%',
      avgMonthlySpend: fmt(Math.round(avgMonthly)),
      trajectory: isAccelerating ? 'accelerating' : isDecelerating ? 'decelerating' : 'steady',
      months: monthlyChanges,
      priorYearComparison: {
        totalPY: pyActuals.length > 0 ? pyActuals[pyActuals.length - 1].cumulative : 0,
        totalPYFmt: pyActuals.length > 0 ? fmt(pyActuals[pyActuals.length - 1].cumulative) : 'N/A',
        yoyChangePct: pyActuals.length > 0 && pyActuals[pyActuals.length - 1].cumulative > 0
          ? Math.round(((latestCum - pyActuals[pyActuals.length - 1].cumulative) / pyActuals[pyActuals.length - 1].cumulative) * 1000) / 10 + '%'
          : 'N/A (new ministry/entity)',
      },
    };
  },

  forecastSpending: (params) => {
    const slug = params.slug as string;
    const m = getMinistryData(slug);
    if (!m) return { error: `Ministry "${slug}" not found` };

    const actuals = m.overview.actuals;
    const allocation = m.overview.totalAllocation;
    const totalSpent = m.overview.totalSpent;
    const monthsElapsed = actuals.length;
    const remainingMonths = 12 - monthsElapsed;

    if (monthsElapsed === 0) return { error: 'No spending data available yet' };

    const avgMonthly = totalSpent / monthsElapsed;
    const projected = totalSpent + (avgMonthly * remainingMonths);
    const projectedUtil = allocation > 0 ? Math.round((projected / allocation) * 1000) / 10 : 0;
    const willExhaust = projected >= allocation;
    const monthsToExhaust = avgMonthly > 0 ? Math.ceil((allocation - totalSpent) / avgMonthly) : Infinity;
    const exhaustDate = monthsToExhaust <= remainingMonths && monthsToExhaust < Infinity
      ? (() => { const d = new Date(); d.setMonth(d.getMonth() + monthsToExhaust); return d.toISOString().slice(0, 7); })()
      : null;

    const recentAvg = actuals.length >= 3
      ? (actuals[actuals.length - 1].monthly + actuals[actuals.length - 2].monthly + actuals[actuals.length - 3].monthly) / 3
      : avgMonthly;
    const projectedRecent = totalSpent + (recentAvg * remainingMonths);

    const buckets = [
      { name: 'Fixed Obligations', alloc: m.fixedObligations.totalAllocation, spent: m.fixedObligations.totalPaid },
      { name: 'Operational', alloc: m.operational.totalAllocation, spent: m.operational.totalSpent },
      { name: 'Capital', alloc: m.capital.totalAllocation, spent: m.capital.totalSpent },
    ].map(b => ({
      ...b,
      allocFmt: fmt(b.alloc),
      spentFmt: fmt(b.spent),
      utilPct: b.alloc > 0 ? Math.round((b.spent / b.alloc) * 1000) / 10 : 0,
      projectedEOY: b.alloc > 0 ? fmt(Math.round(b.spent + (b.spent / monthsElapsed) * remainingMonths)) : 'N/A',
    }));

    return {
      ministry: m.overview.shortName,
      fullName: m.overview.name,
      allocation: allocation,
      allocationFmt: fmt(allocation),
      spent: totalSpent,
      spentFmt: fmt(totalSpent),
      monthsElapsed,
      remainingMonths,
      avgMonthlySpend: fmt(Math.round(avgMonthly)),
      recentAvgMonthlySpend: fmt(Math.round(recentAvg)),
      projectedEOYSpend: fmt(Math.round(projected)),
      projectedEOYUtilization: projectedUtil + '%',
      projectedRecentTrend: fmt(Math.round(projectedRecent)),
      willExhaustAllocation: willExhaust,
      monthsUntilExhaustion: monthsToExhaust === Infinity ? 'N/A' : monthsToExhaust,
      exhaustionDate: exhaustDate,
      bucketBreakdown: buckets,
    };
  },

  computeRiskScore: (params) => {
    const slugs = params.slugs as string[] | undefined;
    const targetSlugs = slugs && slugs.length > 0 ? slugs : ministryOrder;

    const results = targetSlugs.map(slug => {
      const m = getMinistryData(slug);
      if (!m) return { slug, error: 'not found' };

      const alloc = m.overview.totalAllocation;
      const spent = m.overview.totalSpent;
      const util = alloc > 0 ? (spent / alloc) * 100 : 0;
      const monthsElapsed = m.overview.actuals.length;
      const expectedUtil = monthsElapsed > 0 ? (monthsElapsed / 12) * 100 : 0;

      const spendDeviation = Math.abs(util - expectedUtil);
      const spendScore = spendDeviation > 20 ? 30 : spendDeviation > 10 ? 20 : spendDeviation > 5 ? 10 : 0;

      const delayedProjects = m.capital.projects.filter(p => p.status === 'delayed' || p.status === 'at_risk').length;
      const totalProjects = m.capital.projects.length;
      const projectScore = totalProjects > 0 ? Math.round((delayedProjects / totalProjects) * 30) : 0;

      const ministryBlockers = mockBlockers.filter(b => b.assignedMinistrySlug === slug && b.status !== 'resolved');
      const pmBlockers = ministryBlockers.filter(b => b.escalationLevel === 'pm').length;
      const blockerScore = Math.min(pmBlockers * 10 + (ministryBlockers.length - pmBlockers) * 5, 20);

      const actions = getActionItemsByMinistry(slug);
      const overdue = actions.filter(a => a.status !== 'completed' && a.dueDate < new Date().toISOString().slice(0, 10)).length;
      const actionScore = Math.min(overdue * 5, 20);

      const totalScore = spendScore + projectScore + blockerScore + actionScore;
      const riskLevel = totalScore >= 50 ? 'high' : totalScore >= 25 ? 'moderate' : 'low';

      return {
        slug,
        name: m.overview.shortName,
        fullName: m.overview.name,
        compositeScore: totalScore,
        riskLevel,
        breakdown: {
          spendDeviation: { score: spendScore, detail: `Utilization ${Math.round(util)}% vs expected ${Math.round(expectedUtil)}%` },
          projectRisk: { score: projectScore, detail: `${delayedProjects}/${totalProjects} projects delayed or at risk` },
          blockers: { score: blockerScore, detail: `${ministryBlockers.length} open (${pmBlockers} PM-level)` },
          overdueActions: { score: actionScore, detail: `${overdue} overdue action items` },
        },
      };
    });

    results.sort((a, b) => ('compositeScore' in a && 'compositeScore' in b) ? (b as { compositeScore: number }).compositeScore - (a as { compositeScore: number }).compositeScore : 0);
    return { results, scoringMethodology: 'Composite of: spend deviation (0-30), project delays (0-30), blockers (0-20), overdue actions (0-20). Max score: 100.' };
  },

  crossMinistryAnalysis: (params) => {
    const metric = (params.metric as string) || 'utilization';
    const allData = ministryOrder.map(slug => {
      const m = ministryRegistry[slug];
      const alloc = m.overview.totalAllocation;
      const spent = m.overview.totalSpent;
      return {
        slug,
        name: m.overview.shortName,
        allocation: alloc,
        spent,
        utilization: alloc > 0 ? Math.round((spent / alloc) * 1000) / 10 : 0,
        capitalAllocation: m.capital.totalAllocation,
        capitalSpent: m.capital.totalSpent,
        opsUtilization: m.operational.utilizationPct,
        vacancyRate: m.operational.vacancyRate,
        projectCount: m.capital.projects.length,
        delayedProjects: m.capital.projects.filter(p => p.status === 'delayed' || p.status === 'at_risk').length,
        openBlockers: mockBlockers.filter(b => b.assignedMinistrySlug === slug && b.status !== 'resolved').length,
      };
    });

    const values = allData.map(d => {
      if (metric === 'utilization') return d.utilization;
      if (metric === 'vacancy_rate') return d.vacancyRate;
      if (metric === 'allocation') return d.allocation;
      if (metric === 'capital_allocation') return d.capitalAllocation;
      return d.utilization;
    });

    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
    const stdDev = Math.sqrt(values.reduce((s, v) => s + (v - avg) ** 2, 0) / values.length);

    const outliers = allData.filter((d, i) => Math.abs(values[i] - avg) > stdDev * 1.5).map(d => ({
      name: d.name,
      slug: d.slug,
      value: values[allData.indexOf(d)],
      direction: values[allData.indexOf(d)] > avg ? 'above' : 'below',
    }));

    return {
      metric,
      summary: {
        average: Math.round(avg * 10) / 10,
        median: Math.round(median * 10) / 10,
        stdDev: Math.round(stdDev * 10) / 10,
        min: Math.round(Math.min(...values) * 10) / 10,
        max: Math.round(Math.max(...values) * 10) / 10,
      },
      outliers,
      all: allData.map((d, i) => ({ name: d.name, slug: d.slug, value: Math.round(values[i] * 10) / 10 }))
        .sort((a, b) => b.value - a.value),
    };
  },
};
