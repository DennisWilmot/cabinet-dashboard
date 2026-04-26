'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { CHART_PALETTE, CHART_COLORS } from '@/lib/chart-tokens';

const PALETTE = CHART_PALETTE;
const { axis: AXIS_COLOR, grid: GRID_COLOR, current: GREEN } = CHART_COLORS;

export function RevenueSplitBar({ data }: { data: { entity: string; amount: number; pct: number }[] }) {
  return (
    <div className="space-y-[var(--space-sm)]">
      <div className="flex h-[8px] rounded-sm overflow-hidden">
        {data.map((d, i) => (
          <div
            key={d.entity}
            className="h-full transition-all"
            style={{ width: `${d.pct}%`, backgroundColor: PALETTE[i % PALETTE.length] }}
            title={`${d.entity}: ${formatCurrency(d.amount)} (${d.pct.toFixed(1)}%)`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-[var(--space-base)] gap-y-[var(--space-xs)]">
        {data.map((d, i) => (
          <div key={d.entity} className="flex items-center gap-[6px] text-[length:var(--text-caption)] text-text-secondary">
            <span
              className="w-[8px] h-[8px] rounded-sm flex-shrink-0"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            {d.entity}: {d.pct.toFixed(1)}%
          </div>
        ))}
      </div>
    </div>
  );
}

export function FundingSplit({ data }: { data: { source: string; committed: number; disbursed: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 60 }}>
        <XAxis
          type="number"
          tick={{ fontSize: 15, fill: AXIS_COLOR }}
          tickFormatter={v => formatCurrency(v)}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="source"
          tick={{ fontSize: 15, fill: AXIS_COLOR }}
          axisLine={false}
          tickLine={false}
          width={65}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value as number), name === 'committed' ? 'Committed' : 'Disbursed']}
          contentStyle={{
            fontSize: 15,
            borderRadius: 4,
            border: `1px solid ${GRID_COLOR}`,
            fontFamily: 'var(--font-body)',
          }}
        />
        <Bar dataKey="committed" fill={GRID_COLOR} radius={[0, 2, 2, 0]} barSize={12} />
        <Bar dataKey="disbursed" fill={GREEN} radius={[0, 2, 2, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}
