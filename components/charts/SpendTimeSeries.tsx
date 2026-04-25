'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart, ReferenceLine } from 'recharts';
import { CHART_COLORS } from '@/lib/chart-tokens';
import type { MonthlySnapshot } from '@/lib/types';
import { formatCurrency, formatPeriod } from '@/lib/utils';

interface SpendTimeSeriesProps {
  currentYear: MonthlySnapshot[];
  priorYear?: MonthlySnapshot[];
  allocation: number;
  height?: number;
  compact?: boolean;
}

const { axis: AXIS_COLOR, grid: GRID_COLOR, current: GREEN, prior: PRIOR, target: GOLD } = CHART_COLORS;

export function SpendTimeSeries({
  currentYear,
  priorYear,
  allocation,
  height = 240,
  compact = false,
}: SpendTimeSeriesProps) {
  const monthsInYear = 12;
  const expectedMonthly = allocation / monthsInYear;

  const data = currentYear.map((c, i) => ({
    period: formatPeriod(c.period),
    current: c.cumulative,
    expected: expectedMonthly * (i + 1),
    prior: priorYear && priorYear[i] ? priorYear[i].cumulative : undefined,
  }));

  const todayLabel = data.length > 0 ? data[data.length - 1].period : undefined;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 5, right: 25, bottom: 5, left: compact ? 0 : 5 }}>
        {!compact && (
          <XAxis
            dataKey="period"
            tick={{ fontSize: 13, fill: AXIS_COLOR }}
            axisLine={{ stroke: GRID_COLOR }}
            tickLine={false}
          />
        )}
        {!compact && (
          <YAxis
            tick={{ fontSize: 13, fill: AXIS_COLOR }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => formatCurrency(v)}
            width={75}
          />
        )}
        <Tooltip
          formatter={(value, name) => [
            formatCurrency(value as number),
            name === 'current' ? 'FY 2026-27' : name === 'prior' ? 'FY 2025-26' : 'Expected Pace',
          ]}
          contentStyle={{
            fontSize: 14,
            borderRadius: 4,
            border: `1px solid ${GRID_COLOR}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: 'var(--font-body)',
          }}
        />
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity={0.15} />
            <stop offset="100%" stopColor={GREEN} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="current"
          stroke={GREEN}
          strokeWidth={2}
          fill="url(#greenGradient)"
          dot={false}
          activeDot={{ r: 3, fill: GREEN }}
        />
        {priorYear && (
          <Line
            type="monotone"
            dataKey="prior"
            stroke={PRIOR}
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
          />
        )}
        <Line
          type="monotone"
          dataKey="expected"
          stroke={GOLD}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
        {todayLabel && (
          <ReferenceLine
            x={todayLabel}
            stroke="oklch(50% 0.25 25)"
            strokeWidth={2}
            label={{
              value: 'Today',
              position: 'top',
              fill: 'oklch(50% 0.25 25)',
              fontSize: compact ? 10 : 13,
              fontWeight: 700,
            }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
