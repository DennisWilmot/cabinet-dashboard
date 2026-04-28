export const TOOL_SCHEMAS = [
  {
    name: 'getMinistryList',
    description: 'Get a summary of all 17 ministries with allocation, spend, utilization, and status.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'getMinistryDetail',
    description: 'Get full budget breakdown for a single ministry including fixed obligations, operational, and capital data.',
    input_schema: {
      type: 'object' as const,
      properties: { slug: { type: 'string', description: 'Ministry slug e.g. "mof", "health", "education", "national-security"' } },
      required: ['slug'],
    },
  },
  {
    name: 'getMinistryProjects',
    description: 'Get capital projects for a ministry with status, spend, milestones.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Ministry slug' },
        status: { type: 'string', description: 'Filter by status: on_track, delayed, at_risk, completed, not_started' },
        riskLevel: { type: 'string', description: 'Filter by risk: low, moderate, high' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'getMinistryObligations',
    description: 'Get fixed/recurring obligations (debt, pensions, insurance, memberships, transfers) for a ministry.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Ministry slug' },
        type: { type: 'string', description: 'Filter by obligation type' },
        paymentStatus: { type: 'string', description: 'Filter: current, paid, partial, overdue, pending' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'getMinistryEntities',
    description: 'Get operational entities/departments for a ministry including KPIs, staffing, and revenue.',
    input_schema: {
      type: 'object' as const,
      properties: { slug: { type: 'string', description: 'Ministry slug' } },
      required: ['slug'],
    },
  },
  {
    name: 'getMinisterProfile',
    description: 'Get minister bio, title, constituency, office location, and leadership team.',
    input_schema: {
      type: 'object' as const,
      properties: { slug: { type: 'string', description: 'Ministry slug for this minister' } },
      required: ['slug'],
    },
  },
  {
    name: 'getMeetingList',
    description: 'List cabinet meetings with optional date/status filters.',
    input_schema: {
      type: 'object' as const,
      properties: {
        dateAfter: { type: 'string', description: 'Filter meetings after this date (YYYY-MM-DD)' },
        dateBefore: { type: 'string', description: 'Filter meetings before this date (YYYY-MM-DD)' },
        status: { type: 'string', description: 'Filter: completed, upcoming, in_progress' },
      },
      required: [],
    },
  },
  {
    name: 'getMeetingDetail',
    description: 'Get full meeting detail: attendees, action items, key decisions, minutes preview.',
    input_schema: {
      type: 'object' as const,
      properties: { id: { type: 'string', description: 'Meeting ID, format: mtg-YYYY-MM-DD' } },
      required: ['id'],
    },
  },
  {
    name: 'listActionItems',
    description: 'List action items from cabinet meetings with rich filtering: by status, ministry, meeting, assignee, overdue flag, date range.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string', description: 'Filter: pending, in_progress, completed' },
        ministrySlug: { type: 'string', description: 'Filter by ministry' },
        meetingId: { type: 'string', description: 'Filter by meeting ID' },
        assignee: { type: 'string', description: 'Search assignee name (partial match)' },
        overdue: { type: 'boolean', description: 'If true, only return overdue items' },
        dateAfter: { type: 'string', description: 'Due date after (YYYY-MM-DD)' },
        dateBefore: { type: 'string', description: 'Due date before (YYYY-MM-DD)' },
      },
      required: [],
    },
  },
  {
    name: 'listBlockers',
    description: 'List escalated blockers with filtering by status, escalation level, ministry, and creation date range.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string', description: 'Filter: open, in_progress, resolved' },
        escalationLevel: { type: 'string', description: 'Filter: pm, minister' },
        ministrySlug: { type: 'string', description: 'Filter by assigned ministry' },
        createdAfter: { type: 'string', description: 'Created after (YYYY-MM-DD)' },
        createdBefore: { type: 'string', description: 'Created before (YYYY-MM-DD)' },
      },
      required: [],
    },
  },
  {
    name: 'getMinisterOKRs',
    description: 'Get OKR objectives and key results for a minister, derived from entity KPIs.',
    input_schema: {
      type: 'object' as const,
      properties: { slug: { type: 'string', description: 'Ministry slug' } },
      required: ['slug'],
    },
  },
  {
    name: 'getMinisterAccountability',
    description: 'Get accountability metrics for a minister: attendance rate, action completion, open blockers, ministry status.',
    input_schema: {
      type: 'object' as const,
      properties: { slug: { type: 'string', description: 'Ministry slug' } },
      required: ['slug'],
    },
  },
  {
    name: 'searchAcrossMinistries',
    description: 'Fuzzy search across all ministries for projects, entities, obligations, and people by name.',
    input_schema: {
      type: 'object' as const,
      properties: { query: { type: 'string', description: 'Search query' } },
      required: ['query'],
    },
  },
  {
    name: 'aggregateSpending',
    description: 'Aggregate spending across all ministries by dimension: "ministry" (per-ministry), "bucket" (fixed/ops/capital), or "status" (on_track/at_risk/off_track).',
    input_schema: {
      type: 'object' as const,
      properties: { dimension: { type: 'string', description: 'Dimension: ministry, bucket, or status' } },
      required: ['dimension'],
    },
  },
  {
    name: 'compareMinistries',
    description: 'Side-by-side comparison of 2+ ministries across key metrics.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slugs: { type: 'array', items: { type: 'string' }, description: 'Array of ministry slugs to compare' },
        metrics: { type: 'array', items: { type: 'string' }, description: 'Metrics to compare (optional)' },
      },
      required: ['slugs'],
    },
  },
  {
    name: 'identifyAtRiskItems',
    description: 'Find all at-risk or off-track items across the system: ministries, projects, overdue actions.',
    input_schema: {
      type: 'object' as const,
      properties: { type: { type: 'string', description: 'Filter: ministries, projects, actions, or all' } },
      required: [],
    },
  },
  {
    name: 'calculateTrend',
    description: 'Get monthly spending trajectory (cumulative and monthly) for a ministry.',
    input_schema: {
      type: 'object' as const,
      properties: {
        entityType: { type: 'string', description: 'Currently supported: ministry' },
        entityId: { type: 'string', description: 'Ministry slug' },
      },
      required: ['entityType', 'entityId'],
    },
  },
  {
    name: 'getSystemStats',
    description: 'Get dashboard-level summary: total allocation, spent, overdue actions, open blockers, ministry status breakdown.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'queryData',
    description: 'Power tool for arbitrary structured queries. Supports entityTypes: action_item_comments, blockers, action_items. Supports groupBy, sortBy, limit, and custom filters.',
    input_schema: {
      type: 'object' as const,
      properties: {
        entityType: { type: 'string', description: 'Data type: action_item_comments, blockers, action_items' },
        filters: { type: 'object', description: 'Key-value filters (e.g. {"ministrySlug":"mof","status":"open"})' },
        groupBy: { type: 'string', description: 'Group results by field (e.g. "author", "assignee", "ministry", "escalationLevel")' },
        sortBy: { type: 'string', description: 'Sort by field' },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
      required: ['entityType'],
    },
  },
  {
    name: 'draftBriefing',
    description: 'Gather data needed for a PM or cabinet briefing. Returns system stats and at-risk items for Atlas to compose into a briefing.',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: { type: 'string', description: 'Briefing topic (e.g. "off-track ministries", "overdue actions")' },
        audience: { type: 'string', description: 'Audience: pm, minister, cabinet' },
      },
      required: ['topic'],
    },
  },
  {
    name: 'rankEntities',
    description: 'Rank ministries or capital projects by any metric. Returns sorted results with computed values. Use for "top 5 by spend", "worst performing", "highest allocation" questions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        entityType: { type: 'string', description: 'What to rank: "ministry" or "project"' },
        metric: { type: 'string', description: 'Sort metric. For ministry: allocation, spent, utilization, capital_allocation, capital_spent, ops_utilization, vacancy_rate, blockers, overdue_actions. For project: allocation, spent, total_cost, physical_progress, financial_progress' },
        order: { type: 'string', description: '"desc" (default, highest first) or "asc" (lowest first)' },
        limit: { type: 'number', description: 'Number of results (default 10)' },
      },
      required: ['entityType', 'metric'],
    },
  },
  {
    name: 'computeTrends',
    description: 'Compute month-over-month spending trends for a ministry. Returns monthly/cumulative spend, MoM changes, trajectory (accelerating/decelerating/steady), and prior-year comparison.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Ministry slug' },
        bucket: { type: 'string', description: 'Budget bucket: "total" (default), "fixed", "operational", or "capital"' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'forecastSpending',
    description: 'Project end-of-year spending for a ministry based on current burn rate. Answers "will they exhaust their allocation?" and "when?".',
    input_schema: {
      type: 'object' as const,
      properties: {
        slug: { type: 'string', description: 'Ministry slug' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'computeRiskScore',
    description: 'Calculate composite risk scores for ministries combining: spend deviation, project delays, blocker count, and overdue actions. Higher score = higher risk. Use for "which ministry needs the most attention?" or "worst performing" questions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        slugs: { type: 'array', items: { type: 'string' }, description: 'Ministry slugs to score (optional, defaults to all)' },
      },
      required: [],
    },
  },
  {
    name: 'crossMinistryAnalysis',
    description: 'Statistical analysis across all ministries for a given metric. Returns average, median, std deviation, min/max, outliers, and full ranked list. Use for distribution analysis and comparisons.',
    input_schema: {
      type: 'object' as const,
      properties: {
        metric: { type: 'string', description: 'Metric to analyze: utilization, vacancy_rate, allocation, capital_allocation' },
      },
      required: ['metric'],
    },
  },
];
