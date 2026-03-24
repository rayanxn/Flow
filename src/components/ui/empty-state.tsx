import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="size-16 rounded-full bg-[#2E2E2C14] flex items-center justify-center mb-5">
        <Icon className="size-7 text-text-muted opacity-20" />
      </div>
      <h3 className="text-[17px] font-semibold text-text mb-1">{title}</h3>
      <p className="text-[13px] leading-[18px] text-text-muted mb-5 text-center max-w-xs">
        {description}
      </p>
      {actionLabel && onAction && (
        <>
          <button
            onClick={onAction}
            className="rounded-lg py-2.5 px-6 bg-[#2E2E2C] text-white text-[13px] font-medium hover:bg-[#1E1E1C] transition-colors"
          >
            {actionLabel}
          </button>
          {secondaryLabel && (
            <p className="text-xs text-[#6B6B60] mt-3">{secondaryLabel}</p>
          )}
        </>
      )}
    </div>
  );
}
