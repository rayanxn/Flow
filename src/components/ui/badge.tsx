import * as React from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = {
  default: "bg-surface-hover text-text border border-border",
  priority: {
    P0: "bg-danger/10 text-danger border border-danger/20",
    P1: "bg-warning/10 text-warning border border-warning/20",
    P2: "bg-success/10 text-success border border-success/20",
    P3: "bg-surface-hover text-text-muted border border-border",
  },
  status: {
    todo: "bg-surface-hover text-text-secondary border border-border",
    in_progress: "bg-accent-light text-accent border border-accent/20",
    in_review: "bg-purple-light text-purple border border-purple/20",
    done: "bg-success-light text-success border border-success/20",
  },
} as const;

type BadgeVariant = "default" | "priority" | "status";
type PriorityLevel = keyof typeof badgeVariants.priority;
type StatusType = keyof typeof badgeVariants.status;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  priority?: PriorityLevel;
  status?: StatusType;
}

function Badge({
  className,
  variant = "default",
  priority,
  status,
  ...props
}: BadgeProps) {
  let variantClasses: string;

  if (variant === "priority" && priority) {
    variantClasses = badgeVariants.priority[priority];
  } else if (variant === "status" && status) {
    variantClasses = badgeVariants.status[status];
  } else {
    variantClasses = badgeVariants.default;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
        variantClasses,
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
