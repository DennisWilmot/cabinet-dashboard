'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/chart-tokens';

const { accent: ACCENT, grid: GRID } = CHART_COLORS;

export function TrendSparkline({ values, labels }: { values: number[]; labels?: string[] }) {
  const data = values.map((v, i) => ({
    label: labels?.[i] ?? `Year ${i + 1}`,
    value: v,
  }));

  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Tooltip
          formatter={(value) => [formatCurrency(value as number), 'Estimate']}
          contentStyle={{
            fontSize: 11,
            borderRadius: 4,
            border: `1px solid ${GRID}`,
            padding: '4px 8px',
            fontFamily: 'var(--font-body)',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={ACCENT}
          strokeWidth={1.5}
          dot={{ r: 2.5, fill: ACCENT }}
          activeDot={{ r: 3.5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
