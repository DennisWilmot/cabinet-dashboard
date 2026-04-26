'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/chart-tokens';
import type { DebtServiceSummary } from '@/lib/types';

const COLORS = [CHART_COLORS.green, CHART_COLORS.gold, CHART_COLORS.accent];

export function DebtServiceDonut({ data }: { data: DebtServiceSummary }) {
  const totalServicePaid = data.amortisationPaid + data.interestPaid;
  const netPosition = totalServicePaid - data.newBorrowing;
  const isPayingDown = netPosition > 0;

  const chartData = [
    { name: 'Principal Repaid', value: data.amortisationPaid },
    { name: 'Interest Paid', value: data.interestPaid },
    { name: 'New Borrowing', value: data.newBorrowing },
  ];

  return (
    <div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                fontSize: 15,
                borderRadius: 4,
                border: `1px solid ${CHART_COLORS.grid}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-[var(--space-sm)] mt-[var(--space-md)]">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-[length:var(--text-body)]">
            <div className="flex items-center gap-[var(--space-sm)]">
              <span className="w-[10px] h-[10px] rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-text-secondary">{d.name}</span>
            </div>
            <span className="font-semibold">{formatCurrency(d.value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-[var(--space-lg)] pt-[var(--space-lg)] border-t border-border-default">
        <p className="text-[length:var(--text-body)] text-text-secondary">Net Debt Position</p>
        <p className={`text-[length:var(--text-h2)] font-bold mt-[2px] ${isPayingDown ? 'text-jm-green-dark' : 'text-status-off-track'}`}>
          {isPayingDown ? '↓' : '↑'} {formatCurrency(Math.abs(netPosition))}
        </p>
        <p className="text-[length:var(--text-body)] text-text-secondary mt-[var(--space-xs)]">
          {isPayingDown
            ? 'Debt service exceeds new borrowing — net reduction'
            : 'New borrowing exceeds debt service — net increase'}
        </p>
      </div>
    </div>
  );
}
