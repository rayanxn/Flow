export type KPICardProps = {
  label: string;
  value: string;
  delta: { text: string; isPositive: boolean } | null;
};

export function KPICard({ label, value, delta }: KPICardProps) {
  return (
    <div className="flex min-w-0 grow shrink basis-0 flex-col gap-1.5 rounded-xl border border-border-input bg-surface p-4 sm:p-5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-[28px] font-bold leading-9 text-text sm:text-[32px] sm:leading-10">
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
