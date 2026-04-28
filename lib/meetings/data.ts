import type { CabinetMeeting, MeetingAttendee, ActionItem } from './types';
import { ministryRegistry, ministryOrder } from '@/lib/data';

const MEET_LINK = '#'; // Replace with real Google Meet link

export const allMinisters: MeetingAttendee[] = ministryOrder.map(slug => {
  const d = ministryRegistry[slug];
  return {
    name: d.overview.minister.name,
    title: d.overview.shortName,
    avatarUrl: d.overview.minister.avatarUrl,
    ministrySlug: slug,
  };
});

function pickAttendees(seed: number, count: number): MeetingAttendee[] {
  const shuffled = [...allMinisters];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

const fullyPopulatedMeeting: CabinetMeeting = {
  id: 'mtg-2026-04-20',
  date: '2026-04-20',
  title: 'Weekly Cabinet Meeting',
  meetLink: MEET_LINK,
  status: 'completed',
  transcriptStatus: 'uploaded',
  attendees: pickAttendees(420, 15),
  actionItems: [
    {
      id: 'ai-1',
      description: 'Submit revised Q3 expenditure projections for the Education sector, reflecting the new teacher recruitment timeline.',
      assignee: 'Hon. Fayval Williams',
      ministrySlug: 'education',
      dueDate: '2026-05-05',
      status: 'in_progress',
    },
    {
      id: 'ai-2',
      description: 'Prepare a status brief on the Southern Coastal Highway project delays and present options for contractor remediation.',
      assignee: 'Hon. Audrey Sewell, OJ, CD, JP',
      ministrySlug: 'energy-transport',
      dueDate: '2026-04-28',
      status: 'completed',
    },
    {
      id: 'ai-3',
      description: 'Circulate the draft National Digital ID policy framework to all ministers for comment before the next sitting.',
      assignee: 'Most Hon. Andrew Holness, ON, PC, MP',
      ministrySlug: 'opm',
      dueDate: '2026-04-27',
      status: 'pending',
    },
    {
      id: 'ai-4',
      description: 'Convene an inter-ministerial working group on hospital equipment procurement and report findings within two weeks.',
      assignee: 'Hon. Dr. Christopher Tufton',
      ministrySlug: 'health',
      dueDate: '2026-05-04',
      status: 'in_progress',
    },
    {
      id: 'ai-5',
      description: 'Finalize the revised MOU with the IMF on fiscal consolidation targets and share with the Cabinet Office.',
      assignee: 'Dr. the Hon. Nigel Clarke',
      ministrySlug: 'mof',
      dueDate: '2026-05-10',
      status: 'pending',
    },
    {
      id: 'ai-6',
      description: 'Submit tourism marketing ROI analysis for the winter 2025-26 season to inform next year\'s budget allocation.',
      assignee: 'Hon. Edmund Bartlett',
      ministrySlug: 'tourism',
      dueDate: '2026-05-15',
      status: 'pending',
    },
  ],
  keyDecisions: [
    {
      id: 'kd-1',
      decision: 'Approved the supplementary budget allocation of $2.4B for emergency road repairs in Portland and St. Thomas following the March flooding.',
      proposedBy: 'Dr. the Hon. Nigel Clarke',
      category: 'Fiscal',
    },
    {
      id: 'kd-2',
      decision: 'Endorsed the National Digital Transformation Strategy 2026–2030 for public consultation, with a 45-day comment period.',
      proposedBy: 'Most Hon. Andrew Holness, ON, PC, MP',
      category: 'Policy',
    },
    {
      id: 'kd-3',
      decision: 'Directed the Ministry of Health to fast-track procurement of dialysis equipment for Cornwall Regional Hospital under emergency provisions.',
      proposedBy: 'Hon. Dr. Christopher Tufton',
      category: 'Health',
    },
    {
      id: 'kd-4',
      decision: 'Agreed to extend the HOPE Programme youth employment initiative by 18 months, with an additional $800M in funding from the Consolidated Fund.',
      proposedBy: 'Hon. Floyd Green',
      category: 'Social',
    },
    {
      id: 'kd-5',
      decision: 'Approved renegotiation of the Southern Coastal Highway contract terms to address cost overruns and timeline slippage.',
      proposedBy: 'Hon. Audrey Sewell, OJ, CD, JP',
      category: 'Infrastructure',
    },
  ],
  minutes: `## Opening Remarks

The Most Honourable Prime Minister called the meeting to order at 10:03 AM. Fifteen of seventeen ministers were present. Apologies were received from the Minister of Agriculture and the Minister of Foreign Affairs, both on overseas engagements.

The PM opened by noting the need to maintain fiscal discipline as the government enters the second half of the fiscal year, particularly given revenue performance tracking slightly below projections.

## Budget Execution Review

The Minister of Finance presented the mid-year budget execution summary. Key points:

- **Overall utilization** stands at 48.7% against a 50% benchmark, which is broadly on track.
- **Education** spending is 3 percentage points behind schedule due to delays in the teacher recruitment programme. The Ministry committed to submitting revised Q3 projections.
- **Health** capital expenditure is ahead of schedule at 54%, largely driven by accelerated hospital equipment procurement.
- **National Security** recurrent spending is within tolerance but the vacancy rate remains elevated at 11.2%.

Cabinet noted the report and requested that all ministries with utilization below 45% submit corrective action plans within two weeks.

## Infrastructure Update

The Minister of Energy & Transport reported on the Southern Coastal Highway:

- The project is 4 months behind the revised schedule.
- Cost overruns have reached 12% of the original contract value.
- The primary contractor has cited supply chain disruptions and labour shortages.

Cabinet directed the Minister to present remediation options at the next sitting, including the possibility of contract renegotiation.

## Digital Transformation

The Prime Minister tabled the draft National Digital Transformation Strategy 2026–2030, covering:

- National Digital ID rollout timeline
- Public service digitisation targets
- Cybersecurity framework
- Digital literacy programmes

Cabinet endorsed the strategy for a 45-day public consultation period. The National Digital ID policy framework is to be circulated to all ministers before the next cabinet meeting.

## Health Sector

The Minister of Health raised the critical shortage of dialysis equipment at Cornwall Regional Hospital. Cabinet approved emergency procurement under the Government Procurement Act provisions, bypassing the standard tender process given the urgency.

An inter-ministerial working group was convened to review hospital equipment procurement practices more broadly.

## Youth Employment

The Minister of Economic Growth presented the HOPE Programme evaluation, showing:

- 12,400 youth placed in employment over the past 12 months
- 68% retention rate at the 6-month mark
- Programme cost per placement: $64,500

Cabinet agreed to extend the programme by 18 months with additional funding of $800M.

## Any Other Business

No items were raised under AOB.

## Closing

The Prime Minister summarised the key action items and decisions. The next cabinet meeting was confirmed for Monday, April 27, 2026. The meeting adjourned at 12:47 PM.`,
  rawTranscript: `[10:03 AM] PM Holness: Good morning, colleagues. Let us come to order. We have a full agenda today. I note that Minister Pearnel Charles Jr. and Senator Kamina Johnson Smith send their apologies — both are on overseas engagements.

[10:05 AM] PM Holness: I want to open by stressing the importance of fiscal discipline as we enter the second half of the year. Revenue is tracking slightly below projections and we need to be deliberate about how we manage expenditure.

[10:08 AM] Min. Clarke: Thank you, Prime Minister. I'll share the mid-year execution summary. Overall utilization stands at 48.7% against our 50% benchmark. This is broadly on track, but there are pockets of concern.

[10:10 AM] Min. Clarke: Education is 3 points behind schedule — largely due to the teacher recruitment delays. Health capital is actually ahead at 54%, driven by the hospital equipment push. National Security recurrent is within range but vacancies remain elevated at 11.2%.

[10:14 AM] PM Holness: Minister Williams, can your team submit revised Q3 projections by early May?

[10:15 AM] Min. Williams: Yes, Prime Minister. We're already working with the Planning Institute on the revised teacher intake schedule. We'll have numbers by May 5th.

[10:17 AM] PM Holness: Good. I'd like all ministries under 45% utilization to submit corrective action plans within two weeks. Let's not wait for year-end to flag problems.

[10:20 AM] Min. Sewell: On the Southern Coastal Highway — I must be candid. We're four months behind the revised schedule and cost overruns have reached 12%. The contractor is citing supply chain disruptions and labour shortages.

[10:23 AM] PM Holness: This is deeply concerning. Minister Sewell, I need you to present remediation options at the next sitting. Include the possibility of contract renegotiation. We cannot continue on this trajectory.

[10:25 AM] Min. Sewell: Understood, Prime Minister. I'll have a comprehensive brief ready by next Monday.

[10:28 AM] PM Holness: Turning to digital transformation. You have all received the draft National Digital Transformation Strategy. I want to highlight four pillars: the Digital ID rollout, public service digitisation, cybersecurity, and digital literacy.

[10:32 AM] PM Holness: I'm proposing we endorse this for a 45-day public consultation. I'll also circulate the Digital ID policy framework separately before our next sitting.

[10:33 AM] Min. Clarke: Supported.

[10:33 AM] Min. Tufton: Supported.

[10:34 AM] PM Holness: Good, that's endorsed. Minister Tufton, you had an urgent matter?

[10:35 AM] Min. Tufton: Yes, Prime Minister. Cornwall Regional is down to two functioning dialysis machines out of eight. We have patients being turned away. I'm requesting emergency procurement authorization under the GPA provisions.

[10:37 AM] PM Holness: How quickly can we move on this?

[10:38 AM] Min. Tufton: If approved today, we can have machines delivered within three weeks through our existing supplier framework.

[10:39 AM] PM Holness: Approved. But I also want a broader review of how we're managing hospital equipment procurement. Minister Tufton, please convene a working group with Finance and Local Government. Report back in two weeks.

[10:42 AM] Min. Green: Prime Minister, the HOPE Programme evaluation is complete. We placed 12,400 young people in the last 12 months with a 68% retention rate at six months. Cost per placement is $64,500.

[10:45 AM] PM Holness: Those are encouraging numbers. What's the recommendation?

[10:46 AM] Min. Green: We're requesting an 18-month extension with an additional $800 million from the Consolidated Fund.

[10:47 AM] Min. Clarke: Finance has reviewed this. The numbers work within our fiscal framework. We support the extension.

[10:48 AM] PM Holness: Then we're agreed. The HOPE Programme is extended. Any other business? ... No? Good.

[10:49 AM] PM Holness: To summarise — we have action items for Education on Q3 projections, Transport on the highway remediation, Health on the procurement working group, OPM on the Digital ID framework, Finance on the IMF MOU, and Tourism on the marketing ROI analysis. Next meeting is Monday the 27th. We're adjourned. Thank you, colleagues.

[12:47 PM] — Meeting adjourned.`,
};

const meetingDates = [
  '2026-03-02', '2026-03-09', '2026-03-16', '2026-03-23', '2026-03-30',
  '2026-04-06', '2026-04-13', '2026-04-20', '2026-04-27',
];

const pastMeetingActions: Record<string, ActionItem[]> = {
  '2026-03-02': [
    { id: 'ai-m1-1', description: 'Present revised revenue projections for Q1 incorporating January tax intake figures.', assignee: 'Hon. Fayval Williams, MP', ministrySlug: 'mof', dueDate: '2026-03-16', status: 'completed' },
    { id: 'ai-m1-2', description: 'Submit report on school infrastructure repairs needed across the southern parishes after tropical storm damage.', assignee: 'Sen. Dr. the Hon. Dana Morris Dixon', ministrySlug: 'education', dueDate: '2026-03-20', status: 'completed' },
    { id: 'ai-m1-3', description: 'Circulate updated parish council funding allocation formula for the new fiscal year.', assignee: 'Hon. Desmond McKenzie, CD, MP', ministrySlug: 'local-govt', dueDate: '2026-03-16', status: 'completed' },
  ],
  '2026-03-09': [
    { id: 'ai-m2-1', description: 'Provide status update on NWA road rehabilitation programme and contractor performance metrics.', assignee: 'Most Hon. Andrew Holness, ON, PC, MP', ministrySlug: 'economic-growth', dueDate: '2026-03-23', status: 'completed' },
    { id: 'ai-m2-2', description: 'Submit proposed amendments to the Occupational Safety and Health Act for Cabinet review.', assignee: 'Hon. Pearnel Charles Jr., MP, JP', ministrySlug: 'labour', dueDate: '2026-03-30', status: 'completed' },
    { id: 'ai-m2-3', description: 'Present preliminary winter tourism season performance data and visitor satisfaction scores.', assignee: 'Hon. Edmund Bartlett, OJ, CD, MP', ministrySlug: 'tourism', dueDate: '2026-03-23', status: 'completed' },
  ],
  '2026-03-16': [
    { id: 'ai-m3-1', description: 'Brief Cabinet on the status of the National Digital ID pilot programme in St. Catherine.', assignee: 'Most Hon. Andrew Holness, ON, PC, MP', ministrySlug: 'opm', dueDate: '2026-03-30', status: 'completed' },
    { id: 'ai-m3-2', description: 'Submit updated proposal for the agricultural insurance scheme to cover small farmers against climate events.', assignee: 'Hon. Floyd Green, MP', ministrySlug: 'agriculture', dueDate: '2026-04-06', status: 'completed' },
    { id: 'ai-m3-3', description: 'Prepare analysis of Jamaica\'s voting record at the UN General Assembly and upcoming resolutions.', assignee: 'Senator Hon. Kamina Johnson Smith', ministrySlug: 'foreign-affairs', dueDate: '2026-04-06', status: 'completed' },
  ],
  '2026-03-23': [
    { id: 'ai-m4-1', description: 'Present options for accelerating the water supply improvement programme in rural St. Elizabeth and Manchester.', assignee: 'Hon. Matthew Samuda, MP', ministrySlug: 'water', dueDate: '2026-04-06', status: 'completed' },
    { id: 'ai-m4-2', description: 'Submit cost-benefit analysis for the proposed special economic zone in Vernamfield.', assignee: 'Senator Hon. Aubyn Hill', ministrySlug: 'industry', dueDate: '2026-04-13', status: 'completed' },
    { id: 'ai-m4-3', description: 'Review and report on JCF recruitment targets and the impact of the 2025 salary adjustment on retention.', assignee: 'Hon. Dr. Horace Chang, OJ, CD, MP', ministrySlug: 'national-security', dueDate: '2026-04-06', status: 'completed' },
  ],
  '2026-03-30': [
    { id: 'ai-m5-1', description: 'Present preparations and budget for Jamaica\'s 65th independence celebrations and cultural programme.', assignee: 'Hon. Olivia Grange, CD, MP', ministrySlug: 'culture', dueDate: '2026-04-20', status: 'completed' },
    { id: 'ai-m5-2', description: 'Submit reform recommendations for the legal aid system to improve access to justice in rural parishes.', assignee: 'Hon. Delroy Chuck, KC, MP', ministrySlug: 'justice', dueDate: '2026-04-20', status: 'in_progress' },
    { id: 'ai-m5-3', description: 'Provide update on the rollout of the electric vehicle charging station network and energy diversification targets.', assignee: 'Hon. Daryl Vaz, MP', ministrySlug: 'energy-transport', dueDate: '2026-04-13', status: 'completed' },
  ],
  '2026-04-06': [
    { id: 'ai-m6-1', description: 'Present progress report on the public sector digital transformation roadmap and e-government services.', assignee: 'Hon. Ambassador Audrey Marks, MP', ministrySlug: 'opm', dueDate: '2026-04-20', status: 'in_progress' },
    { id: 'ai-m6-2', description: 'Submit updated maternal mortality reduction strategy with quarterly milestones for each RHA.', assignee: 'Dr. the Hon. Christopher Tufton, CD, MP', ministrySlug: 'health', dueDate: '2026-04-27', status: 'in_progress' },
    { id: 'ai-m6-3', description: 'Present the National Works Agency quarterly infrastructure spend report and project pipeline.', assignee: 'Most Hon. Andrew Holness, ON, PC, MP', ministrySlug: 'economic-growth', dueDate: '2026-04-20', status: 'completed' },
  ],
  '2026-04-13': [
    { id: 'ai-m7-1', description: 'Submit proposal for expanded PATH benefits to cover displaced agricultural workers affected by drought.', assignee: 'Hon. Pearnel Charles Jr., MP, JP', ministrySlug: 'labour', dueDate: '2026-04-27', status: 'pending' },
    { id: 'ai-m7-2', description: 'Report on public service vacancy rates by ministry and proposed recruitment acceleration plan.', assignee: 'Hon. Fayval Williams, MP', ministrySlug: 'mof', dueDate: '2026-04-27', status: 'in_progress' },
    { id: 'ai-m7-3', description: 'Present feasibility study on establishing a national film commission under the creative industries strategy.', assignee: 'Hon. Olivia Grange, CD, MP', ministrySlug: 'culture', dueDate: '2026-05-04', status: 'pending' },
  ],
};

const today = new Date().toISOString().split('T')[0];

export const mockMeetings: CabinetMeeting[] = meetingDates.map((date, i) => {
  if (date === '2026-04-20') return fullyPopulatedMeeting;

  const status: CabinetMeeting['status'] =
    date < today ? 'completed' : date === today ? 'in_progress' : 'upcoming';

  return {
    id: `mtg-${date}`,
    date,
    title: 'Weekly Cabinet Meeting',
    meetLink: MEET_LINK,
    status,
    transcriptStatus: 'not_uploaded' as const,
    attendees: pickAttendees(i * 100 + 7, 13 + (i % 4)),
    actionItems: pastMeetingActions[date],
  };
});

export function getMeeting(id: string): CabinetMeeting | undefined {
  return mockMeetings.find(m => m.id === id);
}

export function getMinisterAttendanceRate(slug: string): { attended: number; total: number; pct: number } {
  let attended = 0;
  let total = 0;
  for (const meeting of mockMeetings) {
    if (meeting.status === 'upcoming') continue;
    total++;
    if (meeting.attendees.some(a => a.ministrySlug === slug)) attended++;
  }
  return { attended, total, pct: total > 0 ? Math.round((attended / total) * 100) : 0 };
}

export function getActionItemsByMinistry(slug: string): (ActionItem & { meetingId: string; meetingDate: string })[] {
  const items: (ActionItem & { meetingId: string; meetingDate: string })[] = [];
  for (const meeting of mockMeetings) {
    if (!meeting.actionItems) continue;
    for (const item of meeting.actionItems) {
      if (item.ministrySlug === slug) {
        items.push({ ...item, meetingId: meeting.id, meetingDate: meeting.date });
      }
    }
  }
  return items.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
}
