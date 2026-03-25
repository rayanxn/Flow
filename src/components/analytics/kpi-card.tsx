export type KPICardProps = {
  label: string;
  value: string;
  delta: { text: string; isPositive: boolean } | null;
};

export function KPICard({ label, value, delta }: KPICardProps) {
  return (
    <div className="flex flex-col grow shrink basis-0 rounded-xl gap-1.5 bg-white border border-border/50 p-5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] font-bold leading-10 text-text">
          {value}
        </span>
        {delta && (
          <span
            className="text-[13px] font-medium"
            style={{ color: delta.isPositive ? "#4A7A5C" : "#8B4049" }}
          >
            {delta.text}
          </span>
        )}
      </div>
    </div>
  );
}
