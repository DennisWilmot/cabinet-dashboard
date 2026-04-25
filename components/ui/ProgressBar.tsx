export function ProgressBar({
  value,
  max = 100,
  color = 'green',
  height = 'md',
}: {
  value: number;
  max?: number;
  color?: 'green' | 'gold' | 'red' | 'gray';
  height?: 'sm' | 'md' | 'lg';
}) {
  const pct = Math.min((value / max) * 100, 100);
  const colorMap = {
    green: 'bg-jm-green',
    gold: 'bg-gold',
    red: 'bg-status-off-track',
    gray: 'bg-chart-prior',
  };
  const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' };

  return (
    <div className={`w-full bg-border-default/30 rounded-sm overflow-hidden ${heightMap[height]}`}>
      <div
        className={`${colorMap[color]} ${heightMap[height]} rounded-sm transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
