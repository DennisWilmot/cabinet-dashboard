import type { NationalPulseData, NationalMetric, DisasterEvent } from '@/lib/types';

/*
 * Government-wide macro indicators sourced from PIOJ quarterly briefings,
 * STATIN releases, and official GOJ fiscal reports. Updated manually when
 * new data is published; typically quarterly for GDP/employment, annually
 * for poverty/JSLC. Will migrate to DB with the rest of the data layer.
 */

const gdpGrowth: NationalMetric = {
  id: 'gdp_growth',
  label: 'Real GDP Growth',
  category: 'macro_economic',
  value: -7.1,
  unit: 'percent',
  period: 'Oct–Dec 2025',
  trend: 'declining',
  context: 'Sharpest quarterly decline since COVID-19 (Jul–Sep 2020), driven by Hurricane Melissa',
  source: 'STATIN',
  sourceUrl: 'https://www.jamaica-gleaner.com/article/news/20260331/gdp-falls-71-cent-during-melissa-quarter-statin',
  asOf: '2026-03-31',
  history: [
    { period: 'Jan–Mar 2024', value: 1.9 },
    { period: 'Apr–Jun 2024', value: 0.1 },
    { period: 'Jul–Sep 2024', value: -3.5 },
    { period: 'Oct–Dec 2024', value: 1.2, provisional: true },
    { period: 'Jan–Mar 2025', value: 1.5, provisional: true },
    { period: 'Apr–Jun 2025', value: 0.8 },
    { period: 'Jul–Sep 2025', value: 5.1 },
    { period: 'Oct–Dec 2025', value: -7.1 },
  ],
};

const unemploymentRate: NationalMetric = {
  id: 'unemployment_rate',
  label: 'Unemployment Rate',
  category: 'social',
  value: 3.6,
  unit: 'percent',
  period: 'January 2026',
  trend: 'improving',
  context: 'Down from 3.7% in Jan 2025; near-historic lows despite Hurricane Melissa',
  source: 'STATIN Labour Force Survey',
  sourceUrl: 'https://www.facebook.com/JISVoice/posts/1441649214657374/',
  asOf: '2026-04-07',
  history: [
    { period: 'Jan 2024', value: 5.4 },
    { period: 'Jul 2025', value: 3.3 },
    { period: 'Jan 2026', value: 3.6 },
  ],
};

const povertyRate: NationalMetric = {
  id: 'poverty_rate',
  label: 'Poverty Rate',
  category: 'social',
  value: 7.8,
  unit: 'percent',
  period: '2024',
  trend: 'improving',
  context: 'Down from 19.7% in 2012; extreme (food) poverty at 2.7%, lowest since 1989',
  source: 'PIOJ / Jamaica Survey of Living Conditions',
  sourceUrl: 'https://www.pioj.gov.jm/wp-content/uploads/2025/11/DGs-QPB-30_2-Speaking-Notes_website_25.11.25.pdf',
  asOf: '2025-11-25',
  history: [
    { period: '2012', value: 19.7 },
    { period: '2013', value: 19.9 },
    { period: '2017', value: 17.1 },
    { period: '2019', value: 11.0 },
    { period: '2021', value: 16.7 },
    { period: '2022', value: 11.3 },
    { period: '2023', value: 8.2 },
    { period: '2024', value: 7.8 },
  ],
};

const fiscalBalance: NationalMetric = {
  id: 'fiscal_balance',
  label: 'Fiscal Balance',
  category: 'macro_economic',
  value: -3.5,
  unit: 'percent',
  format: '% of GDP',
  period: 'FY 2025/26 (projected)',
  trend: 'declining',
  context: 'Slipped from balanced budget target due to Hurricane Melissa reconstruction costs',
  source: 'PIOJ',
  sourceUrl: 'https://www.jamaicaobserver.com/2026/03/04/melissa-cost-climbs-1-95t-equivalent-56-7-per-cent-gdp/',
  asOf: '2026-03-03',
  history: [
    { period: 'FY 2023/24', value: 0.1 },
    { period: 'FY 2024/25', value: 0.3, provisional: true },
    { period: 'FY 2025/26', value: -3.5, provisional: true },
  ],
};

const hurricaneMelissa: DisasterEvent = {
  id: 'hurricane_melissa',
  name: 'Hurricane Melissa',
  date: '2025-10-28',
  category: 'Category 5 Hurricane',
  totalDamage: 1_952_000_000_000,
  damageUnit: 'currency_jmd',
  gdpPctImpact: 56.7,
  description: 'Strongest hurricane on record to strike Jamaica. Sustained winds of 185 mph. Total damage, losses and additional costs of J$1.952 trillion (US$12.2 billion), equivalent to 56.7% of GDP. More than four times the cost of Hurricane Gilbert (1988).',
  source: 'PIOJ / ECLAC DaLA Assessment',
  sourceUrl: 'https://www.jamaicaobserver.com/2026/03/04/melissa-cost-climbs-1-95t-equivalent-56-7-per-cent-gdp/',
  asOf: '2026-03-03',
  sectorImpacts: [
    { sector: 'Infrastructure (roads, water, electricity)', damage: 520_000_000_000, losses: 180_000_000_000 },
    { sector: 'Agriculture, Forestry & Fishing', damage: 195_000_000_000, losses: 130_000_000_000 },
    { sector: 'Tourism & Accommodation', damage: 210_000_000_000, losses: 95_000_000_000 },
    { sector: 'Housing', damage: 280_000_000_000, losses: 45_000_000_000 },
  ],
  comparison: { event: 'Hurricane Gilbert', year: 1988, cost: 484_000_000_000 },
};

export const nationalPulse: NationalPulseData = {
  metrics: [gdpGrowth, unemploymentRate, povertyRate, fiscalBalance],
  disasters: [hurricaneMelissa],
  lastUpdated: '2026-04-28',
};

export function getNationalMetrics(): NationalMetric[] {
  return nationalPulse.metrics;
}

export function getNationalMetricById(id: string): NationalMetric | undefined {
  return nationalPulse.metrics.find(m => m.id === id);
}

export function getNationalMetricsByCategory(category: NationalMetric['category']): NationalMetric[] {
  return nationalPulse.metrics.filter(m => m.category === category);
}

export function getDisasterEvents(): DisasterEvent[] {
  return nationalPulse.disasters;
}

export function getDisasterById(id: string): DisasterEvent | undefined {
  return nationalPulse.disasters.find(d => d.id === id);
}

export function filterMetricHistory(
  metric: NationalMetric,
  opts?: { periodContains?: string; after?: string; before?: string }
): NationalMetric['history'] {
  let history = metric.history;
  if (opts?.periodContains) {
    const q = opts.periodContains.toLowerCase();
    history = history.filter(h => h.period.toLowerCase().includes(q));
  }
  return history;
}
