import type { NationalGoal, NationalOutcome, Vision2030Indicator, IndicatorStatus } from '@/lib/types';

/*
 * Vision 2030 Jamaica — National Development Plan
 * 4 National Goals, 15 National Outcomes, 75 Indicators
 *
 * Targets from MTF 2024-2027 (Medium Term Socio-Economic Policy Framework)
 * Actuals populated where publicly available as of April 2026.
 * Indicators marked with `discontinued: true` had their source index
 * discontinued (e.g. GCI replaced by Future of Growth Report).
 *
 * Will migrate to DB; see ministr-extractioin.md for schema.
 */

export function deriveIndicatorStatus(ind: Vision2030Indicator): IndicatorStatus {
  if (ind.latestActual === null || ind.target2027 === null || typeof ind.target2027 === 'string') {
    return 'no_data';
  }
  const target = ind.target2027 as number;
  const actual = ind.latestActual;

  if (ind.direction === 'higher_is_better') {
    if (actual >= target) return 'on_track';
    if (actual >= target * 0.9) return 'at_risk';
    return 'off_track';
  } else {
    if (actual <= target) return 'on_track';
    if (actual <= target * 1.1) return 'at_risk';
    return 'off_track';
  }
}

export function getStatusTooltip(status: IndicatorStatus, ind: Vision2030Indicator): string {
  const target = ind.target2027;
  const actual = ind.latestActual;
  switch (status) {
    case 'on_track':
      return `Latest value (${actual}) meets or exceeds the 2027 target (${target})`;
    case 'at_risk':
      return `Latest value (${actual}) is within 10% of the 2027 target (${target}) but has not met it`;
    case 'off_track':
      return `Latest value (${actual}) is more than 10% away from the 2027 target (${target})`;
    case 'no_data':
      return ind.discontinued
        ? 'This indicator has been discontinued due to changes in the source index'
        : 'No recent actual data available for comparison against the 2027 target';
  }
}

const outcome1: NationalOutcome = {
  id: 1,
  name: 'A Healthy and Stable Population',
  goalId: 1,
  sdgs: [3],
  indicators: [
    { id: '1-1', name: 'Human Development Index (HDI)', unit: 'Index', direction: 'higher_is_better', baseline2007: 0.703, target2027: 0.750, target2030: 0.800, latestActual: null, latestPeriod: null, source: 'UNDP', responsibleMinistries: ['health'] },
    { id: '1-2', name: 'Life Expectancy at Birth (Total)', unit: 'Years', direction: 'higher_is_better', baseline2007: 72.7, target2027: 75.8, target2030: 76.4, latestActual: null, latestPeriod: null, source: 'STATIN', responsibleMinistries: ['health'] },
    { id: '1-3', name: 'Life Expectancy at Birth (Male)', unit: 'Years', direction: 'higher_is_better', baseline2007: 71.26, target2027: 71.0, target2030: 73.4, latestActual: null, latestPeriod: null, source: 'STATIN', responsibleMinistries: ['health'] },
    { id: '1-4', name: 'Life Expectancy at Birth (Female)', unit: 'Years', direction: 'higher_is_better', baseline2007: 77.07, target2027: 78.5, target2030: 79.4, latestActual: null, latestPeriod: null, source: 'STATIN', responsibleMinistries: ['health'] },
    { id: '1-5', name: 'Population Growth Rate', unit: '%', direction: 'lower_is_better', baseline2007: 0.3, target2027: 0.0, target2030: 0.0, latestActual: null, latestPeriod: null, source: 'STATIN', responsibleMinistries: ['health'] },
    { id: '1-6', name: 'Adolescent (10-19) Fertility Rate', unit: 'Per 1000 population', direction: 'lower_is_better', baseline2007: 79, target2027: 28.9, target2030: null, latestActual: null, latestPeriod: null, source: 'STATIN', responsibleMinistries: ['health'] },
    { id: '1-7', name: 'Health Staff/Population Ratio', unit: 'Per 1000 population', direction: 'higher_is_better', baseline2007: null, target2027: 2.5, target2030: 2.5, latestActual: null, latestPeriod: null, source: 'MOH', responsibleMinistries: ['health'] },
    { id: '1-8', name: 'Maternal Mortality Ratio', unit: 'Ratio per 100,000', direction: 'lower_is_better', baseline2007: 94.8, target2027: 82.9, target2030: 70, latestActual: null, latestPeriod: null, source: 'MOH', responsibleMinistries: ['health'] },
    { id: '1-9', name: 'Child (<5 yrs) Mortality Ratio', unit: 'Ratio per 1,000', direction: 'lower_is_better', baseline2007: 26.2, target2027: 17.0, target2030: null, latestActual: null, latestPeriod: null, source: 'MOH', responsibleMinistries: ['health'] },
    { id: '1-10', name: 'NCD Mortality Probability (30-70 yrs)', unit: '%', direction: 'lower_is_better', baseline2007: 17, target2027: 15.6, target2030: 11.4, latestActual: null, latestPeriod: null, source: 'MOH', responsibleMinistries: ['health'] },
  ],
};

const outcome2: NationalOutcome = {
  id: 2,
  name: 'World-Class Education and Training',
  goalId: 1,
  sdgs: [4, 8],
  indicators: [
    { id: '2-1', name: 'Adult Literacy Rate (15+, Total)', unit: '%', direction: 'higher_is_better', baseline2007: 86, target2027: 95.0, target2030: 98.3, latestActual: null, latestPeriod: null, source: 'STATIN/JSLC', responsibleMinistries: ['education'] },
    { id: '2-2', name: 'Adult Literacy Rate (15+, Male)', unit: '%', direction: 'higher_is_better', baseline2007: 80.5, target2027: 90.7, target2030: 98.3, latestActual: null, latestPeriod: null, source: 'STATIN/JSLC', responsibleMinistries: ['education'] },
    { id: '2-3', name: 'Adult Literacy Rate (15+, Female)', unit: '%', direction: 'higher_is_better', baseline2007: 91.1, target2027: 95.0, target2030: 98.3, latestActual: null, latestPeriod: null, source: 'STATIN/JSLC', responsibleMinistries: ['education'] },
    { id: '2-4', name: 'Grade 4 Literacy Rate (Both Sexes)', unit: '%', direction: 'higher_is_better', baseline2007: 64.6, target2027: 92.0, target2030: 96.0, latestActual: null, latestPeriod: null, source: 'MOE', responsibleMinistries: ['education'] },
    { id: '2-5', name: 'Grade 4 Literacy Rate (Male)', unit: '%', direction: 'higher_is_better', baseline2007: 53.2, target2027: 90.5, target2030: 96.0, latestActual: null, latestPeriod: null, source: 'MOE', responsibleMinistries: ['education'] },
    { id: '2-6', name: 'Grade 4 Literacy Rate (Female)', unit: '%', direction: 'higher_is_better', baseline2007: 76.6, target2027: 94.0, target2030: 96.0, latestActual: null, latestPeriod: null, source: 'MOE', responsibleMinistries: ['education'] },
  ],
};

const outcome3: NationalOutcome = {
  id: 3,
  name: 'Effective Social Protection',
  goalId: 1,
  sdgs: [1, 2, 3, 8, 10, 11],
  indicators: [
    { id: '3-1', name: 'National Poverty Rate', unit: '%', direction: 'lower_is_better', baseline2007: 9.9, target2027: '12.5-15.0', target2030: 10, latestActual: 7.8, latestPeriod: '2024', source: 'PIOJ/JSLC', responsibleMinistries: ['labour'] },
    { id: '3-2', name: 'National Food Poverty Prevalence', unit: '%', direction: 'lower_is_better', baseline2007: 2.9, target2027: '2.5-5.0', target2030: 3, latestActual: 2.7, latestPeriod: '2024', source: 'PIOJ/JSLC', responsibleMinistries: ['labour'] },
    { id: '3-3', name: 'Child Poverty Rate', unit: '%', direction: 'lower_is_better', baseline2007: 12, target2027: '15.5-18.5', target2030: 10, latestActual: null, latestPeriod: null, source: 'PIOJ/JSLC', responsibleMinistries: ['labour', 'education'] },
    { id: '3-4', name: 'Children in Quintile 1 Receiving PATH', unit: '%', direction: 'higher_is_better', baseline2007: 65.8, target2027: 90, target2030: null, latestActual: null, latestPeriod: null, source: 'MLSS', responsibleMinistries: ['labour'] },
    { id: '3-5', name: 'PATH Beneficiaries in Quintiles 1 & 2', unit: '%', direction: 'higher_is_better', baseline2007: 75, target2027: 75, target2030: null, latestActual: null, latestPeriod: null, source: 'MLSS', responsibleMinistries: ['labour'] },
  ],
};

const outcome4: NationalOutcome = {
  id: 4,
  name: 'Authentic and Transformational Culture',
  goalId: 1,
  sdgs: [11],
  indicators: [
    { id: '4-1', name: 'Use of Cultural Resources Index (TTDI)', unit: 'Index', direction: 'higher_is_better', baseline2007: 1.7, target2027: 2.2, target2030: 4.7, latestActual: null, latestPeriod: null, source: 'WEF', responsibleMinistries: ['culture'] },
  ],
};

const outcome5: NationalOutcome = {
  id: 5,
  name: 'Security and Safety',
  goalId: 2,
  sdgs: [3, 10, 16],
  indicators: [
    { id: '5-1', name: 'Category 1 Crimes per 100,000', unit: 'Per 100,000', direction: 'lower_is_better', baseline2007: 280, target2027: 137.0, target2030: 43, latestActual: null, latestPeriod: null, source: 'JCF/STATIN', responsibleMinistries: ['national-security'] },
    { id: '5-2', name: 'Murder Rate per 100,000', unit: 'Per 100,000', direction: 'lower_is_better', baseline2007: 59.5, target2027: 35, target2030: 10, latestActual: null, latestPeriod: null, source: 'JCF/STATIN', responsibleMinistries: ['national-security'] },
    { id: '5-3', name: 'Recidivism Rate', unit: '%', direction: 'lower_is_better', baseline2007: 20.9, target2027: 38, target2030: 10, latestActual: null, latestPeriod: null, source: 'DCS', responsibleMinistries: ['national-security'] },
  ],
};

const outcome6: NationalOutcome = {
  id: 6,
  name: 'Effective Governance',
  goalId: 2,
  sdgs: [5, 10, 16, 17],
  indicators: [
    { id: '6-1', name: 'Voice and Accountability Index', unit: 'Index', direction: 'higher_is_better', baseline2007: 0.64, target2027: 0.7, target2030: 1.27, latestActual: null, latestPeriod: null, source: 'World Bank WGI', responsibleMinistries: ['cabinet'] },
    { id: '6-2', name: 'Rule of Law Index', unit: 'Index', direction: 'higher_is_better', baseline2007: -0.35, target2027: 0.13, target2030: 1.41, latestActual: null, latestPeriod: null, source: 'World Bank WGI', responsibleMinistries: ['justice', 'legal'] },
    { id: '6-3', name: 'Government Effectiveness Index', unit: 'Index', direction: 'higher_is_better', baseline2007: 0.32, target2027: 0.7, target2030: 1.51, latestActual: null, latestPeriod: null, source: 'World Bank WGI', responsibleMinistries: ['cabinet', 'mof'] },
    { id: '6-4', name: 'Control of Corruption Index', unit: 'Index', direction: 'higher_is_better', baseline2007: -0.34, target2027: 0.13, target2030: 1.59, latestActual: null, latestPeriod: null, source: 'World Bank WGI', responsibleMinistries: ['cabinet'] },
    { id: '6-5', name: 'Regulatory Quality Index', unit: 'Index', direction: 'higher_is_better', baseline2007: 0.27, target2027: 0.33, target2030: 1.35, latestActual: null, latestPeriod: null, source: 'World Bank WGI', responsibleMinistries: ['cabinet', 'industry'] },
    { id: '6-6', name: 'Case Clearance Rate', unit: '%', direction: 'higher_is_better', baseline2007: 93.78, target2027: 130, target2030: 100, latestActual: null, latestPeriod: null, source: 'Judiciary', responsibleMinistries: ['justice'] },
  ],
};

const outcome7: NationalOutcome = {
  id: 7,
  name: 'A Stable Macroeconomy',
  goalId: 3,
  sdgs: [8, 10, 12, 17],
  indicators: [
    { id: '7-1', name: 'Annual Inflation Rate', unit: '%', direction: 'lower_is_better', baseline2007: 16.8, target2027: '4.0-6.0', target2030: 10.0, latestActual: null, latestPeriod: null, source: 'STATIN/BOJ', responsibleMinistries: ['mof'] },
    { id: '7-2', name: 'Debt to GDP Ratio (Fiscal Year)', unit: '%', direction: 'lower_is_better', baseline2007: 109.4, target2027: 56.0, target2030: 60.0, latestActual: null, latestPeriod: null, source: 'MOF', responsibleMinistries: ['mof'] },
    { id: '7-3', name: 'Fiscal Balance as % of GDP', unit: '%', direction: 'higher_is_better', baseline2007: -4.61, target2027: 0.0, target2030: 0.0, latestActual: -3.5, latestPeriod: 'FY 2025/26 (projected)', source: 'PIOJ', responsibleMinistries: ['mof'] },
    { id: '7-4', name: 'Nominal GDP per Capita', unit: 'US$', direction: 'higher_is_better', baseline2007: 4806, target2027: '5000-7000', target2030: 12055, latestActual: null, latestPeriod: null, source: 'STATIN/PIOJ', responsibleMinistries: ['mof'] },
    { id: '7-5', name: 'Real GDP Annual Growth Rate', unit: '%', direction: 'higher_is_better', baseline2007: 1.4, target2027: '2.0-3.5', target2030: 5.0, latestActual: -7.1, latestPeriod: 'Oct-Dec 2025', source: 'STATIN', responsibleMinistries: ['mof'], note: 'Reflects Hurricane Melissa impact' },
  ],
};

const outcome8: NationalOutcome = {
  id: 8,
  name: 'An Enabling Business Environment',
  goalId: 3,
  sdgs: [8],
  indicators: [
    { id: '8-1', name: 'Unemployment Rate', unit: '%', direction: 'lower_is_better', baseline2007: 9.3, target2027: 4.0, target2030: 4.0, latestActual: 3.6, latestPeriod: 'January 2026', source: 'STATIN LFS', responsibleMinistries: ['labour', 'mof'] },
    { id: '8-2', name: 'Labour Market Efficiency Index', unit: 'Index', direction: 'higher_is_better', baseline2007: 4.3, target2027: null, target2030: 4.75, latestActual: null, latestPeriod: null, source: 'WEF GCI', responsibleMinistries: ['labour'], discontinued: true, note: 'Discontinued with WEF Global Competitiveness Report in 2023' },
  ],
};

const outcome9: NationalOutcome = {
  id: 9,
  name: 'Strong Economic Infrastructure',
  goalId: 3,
  sdgs: [9],
  indicators: [
    { id: '9-1', name: 'Infrastructure Index', unit: 'Index (0-100)', direction: 'higher_is_better', baseline2007: 3.5, target2027: null, target2030: 68, latestActual: null, latestPeriod: null, source: 'WEF GCI', responsibleMinistries: ['economic-growth', 'energy-transport'], discontinued: true, note: 'Discontinued with WEF Global Competitiveness Report in 2023. Scoring revised from 1-7 to 0-100 in 2018.' },
  ],
};

const outcome10: NationalOutcome = {
  id: 10,
  name: 'Energy Security and Efficiency',
  goalId: 3,
  sdgs: [7],
  indicators: [
    { id: '10-1', name: 'Energy Intensity Index', unit: 'BTU per US$ GDP', direction: 'lower_is_better', baseline2007: 14587, target2027: 6000, target2030: 4422, latestActual: null, latestPeriod: null, source: 'MSETT', responsibleMinistries: ['energy-transport'] },
    { id: '10-2', name: 'Renewables in Energy Mix', unit: '%', direction: 'higher_is_better', baseline2007: 5, target2027: 20.0, target2030: 20, latestActual: null, latestPeriod: null, source: 'MSETT', responsibleMinistries: ['energy-transport'] },
    { id: '10-3', name: 'Renewables in Electricity Generation', unit: '%', direction: 'higher_is_better', baseline2007: 5.2, target2027: 50.0, target2030: 30, latestActual: null, latestPeriod: null, source: 'MSETT', responsibleMinistries: ['energy-transport'] },
  ],
};

const outcome11: NationalOutcome = {
  id: 11,
  name: 'A Technology-Enabled Society',
  goalId: 3,
  sdgs: [9],
  indicators: [
    { id: '11-1', name: 'Scientific Publications per Million', unit: 'Per million population', direction: 'higher_is_better', baseline2007: 48, target2027: 105, target2030: 105, latestActual: null, latestPeriod: null, source: 'SCImago/UNESCO', responsibleMinistries: ['education', 'energy-transport'] },
    { id: '11-2', name: 'Resident Patent Filing per Million', unit: 'Per million population', direction: 'higher_is_better', baseline2007: 2.2, target2027: 6.1, target2030: 53, latestActual: null, latestPeriod: null, source: 'JIPO', responsibleMinistries: ['industry'] },
    { id: '11-3', name: 'Global Innovation Index Rank', unit: 'Rank', direction: 'lower_is_better', baseline2007: 52, target2027: 70, target2030: null, latestActual: null, latestPeriod: null, source: 'WIPO', responsibleMinistries: ['energy-transport', 'industry'] },
  ],
};

const outcome12: NationalOutcome = {
  id: 12,
  name: 'Internationally Competitive Industry Structures',
  goalId: 3,
  sdgs: [8, 10, 12, 17],
  indicators: [
    { id: '12-1', name: 'Share of GDP based on PPPs', unit: '%', direction: 'higher_is_better', baseline2007: 0.028, target2027: 0.021, target2030: 0.032, latestActual: null, latestPeriod: null, source: 'World Bank', responsibleMinistries: ['mof', 'industry'] },
    { id: '12-2', name: 'Travel & Tourism Development Index', unit: 'Rank', direction: 'lower_is_better', baseline2007: 48, target2027: 84, target2030: 35, latestActual: null, latestPeriod: null, source: 'WEF TTDI', responsibleMinistries: ['tourism'] },
  ],
};

const outcome13: NationalOutcome = {
  id: 13,
  name: 'Sustainable Management and Use of Environmental and Natural Resources',
  goalId: 4,
  sdgs: [6, 11, 12, 14, 15],
  indicators: [
    { id: '13-1', name: 'Environmental Performance Index', unit: 'Index', direction: 'higher_is_better', baseline2007: 74.7, target2027: 60, target2030: 80, latestActual: null, latestPeriod: null, source: 'Yale/Columbia EPI', responsibleMinistries: ['water-environment'] },
  ],
};

const outcome14: NationalOutcome = {
  id: 14,
  name: 'Hazard Risk Reduction and Adaptation to Climate Change',
  goalId: 4,
  sdgs: [1, 11, 12, 13],
  indicators: [
    { id: '14-1', name: 'Hazard Damage as % of GDP', unit: '%', direction: 'lower_is_better', baseline2007: 3.4, target2027: 1, target2030: 1, latestActual: 56.7, latestPeriod: '2025 (Hurricane Melissa)', source: 'PIOJ/ECLAC DaLA', responsibleMinistries: ['opm', 'water-environment'], note: 'Hurricane Melissa caused unprecedented damage of 56.7% of GDP, far exceeding target' },
  ],
};

const outcome15: NationalOutcome = {
  id: 15,
  name: 'Sustainable Urban and Rural Development',
  goalId: 4,
  sdgs: [1, 11],
  indicators: [
    { id: '15-1', name: 'Housing Quality Index', unit: 'Index', direction: 'higher_is_better', baseline2007: 68.1, target2027: 86, target2030: 86, latestActual: null, latestPeriod: null, source: 'PIOJ/JSLC', responsibleMinistries: ['economic-growth'] },
    { id: '15-2', name: 'Households with Access to Secure Tenure', unit: '%', direction: 'higher_is_better', baseline2007: 80.5, target2027: 78.9, target2030: 95, latestActual: null, latestPeriod: null, source: 'PIOJ/JSLC', responsibleMinistries: ['economic-growth'] },
    { id: '15-3', name: 'Poverty in Rural Areas', unit: '%', direction: 'lower_is_better', baseline2007: 15.3, target2027: 15, target2030: 12, latestActual: null, latestPeriod: null, source: 'PIOJ/JSLC', responsibleMinistries: ['labour', 'economic-growth'] },
    { id: '15-4', name: 'Parishes with Sustainable Development Plans (<5 yrs)', unit: 'Number', direction: 'higher_is_better', baseline2007: 0, target2027: 14, target2030: 15, latestActual: null, latestPeriod: null, source: 'PIOJ', responsibleMinistries: ['economic-growth'] },
  ],
};

export const vision2030Goals: NationalGoal[] = [
  {
    id: 1,
    name: 'Jamaicans are Empowered to Achieve Their Fullest Potential',
    outcomes: [outcome1, outcome2, outcome3, outcome4],
  },
  {
    id: 2,
    name: 'Jamaican Society is Secure, Cohesive and Just',
    outcomes: [outcome5, outcome6],
  },
  {
    id: 3,
    name: "Jamaica's Economy is Prosperous",
    outcomes: [outcome7, outcome8, outcome9, outcome10, outcome11, outcome12],
  },
  {
    id: 4,
    name: 'Jamaica Has a Healthy Natural Environment',
    outcomes: [outcome13, outcome14, outcome15],
  },
];

export const allOutcomes: NationalOutcome[] = vision2030Goals.flatMap(g => g.outcomes);

export function getOutcomeById(id: number): NationalOutcome | undefined {
  return allOutcomes.find(o => o.id === id);
}

export function getGoalForOutcome(outcomeId: number): NationalGoal | undefined {
  return vision2030Goals.find(g => g.outcomes.some(o => o.id === outcomeId));
}

export function getOutcomeSummary(outcome: NationalOutcome) {
  const statuses = outcome.indicators.map(deriveIndicatorStatus);
  return {
    total: outcome.indicators.length,
    onTrack: statuses.filter(s => s === 'on_track').length,
    atRisk: statuses.filter(s => s === 'at_risk').length,
    offTrack: statuses.filter(s => s === 'off_track').length,
    noData: statuses.filter(s => s === 'no_data').length,
  };
}

export function getOutcomesByMinistry(ministrySlug: string): NationalOutcome[] {
  return allOutcomes.filter(o =>
    o.indicators.some(ind => ind.responsibleMinistries.includes(ministrySlug))
  );
}
