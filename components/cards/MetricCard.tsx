export function MetricCard({
  label,
  value,
  subtext,
  children,
}: {
  label: string;
  value: string;
  subtext?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[length:var(--text-caption)] text-text-secondary font-medium mb-[var(--space-xs)]">{label}</p>
      <p className="text-[length:var(--text-h1)] font-bold text-text-primary tracking-tight">{value}</p>
      {subtext && <p className="text-[length:var(--text-caption)] text-text-secondary mt-[var(--space-xs)]">{subtext}</p>}
      {children && <div className="mt-[var(--space-md)]">{children}</div>}
    </div>
  );
}
