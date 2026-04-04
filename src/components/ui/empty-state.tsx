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
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-border-input">
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
            className="rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover"
          >
            {actionLabel}
          </button>
          {secondaryLabel && (
            <p className="mt-3 text-xs text-text-muted">{secondaryLabel}</p>
          )}
        </>
      )}
    </div>
  );
}
