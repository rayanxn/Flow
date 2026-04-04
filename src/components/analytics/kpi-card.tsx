export type KPICardProps = {
  label: string;
  value: string;
  delta: { text: string; isPositive: boolean } | null;
};

export function KPICard({ label, value, delta }: KPICardProps) {
  return (
    <div className="flex flex-col grow shrink basis-0 gap-1.5 rounded-xl border border-border-input bg-surface p-5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] font-bold leading-10 text-text">
          {value}
        </span>
        {delta && (
          <span
            className="text-[13px] font-medium"
            style={{ color: delta.isPositive ? "var(--color-success)" : "var(--color-danger-muted)" }}
          >
            {delta.text}
          </span>
        )}
      </div>
    </div>
  );
}
