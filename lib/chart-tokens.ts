export const CHART_COLORS = {
  current: 'oklch(56% 0.16 155)',
  prior: 'oklch(78% 0.015 90)',
  target: 'oklch(83% 0.17 85)',
  accent: 'oklch(18% 0.01 155)',
  grid: 'oklch(88% 0.012 90)',
  axis: 'oklch(45% 0.01 155)',
  green: 'oklch(56% 0.16 155)',
  greenDark: 'oklch(42% 0.12 155)',
  gold: 'oklch(83% 0.17 85)',
  goldDark: 'oklch(58% 0.13 75)',
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.current,
  CHART_COLORS.accent,
  CHART_COLORS.target,
  CHART_COLORS.greenDark,
  CHART_COLORS.goldDark,
] as const;
