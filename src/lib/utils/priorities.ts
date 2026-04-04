import type { IssuePriority } from "@/lib/types";

export const PRIORITY_CONFIG: Record<
  IssuePriority,
  { label: string; color: string; bgColor: string }
> = {
  0: { label: "P0", color: "var(--color-danger)", bgColor: "var(--color-danger-light)" },
  1: { label: "P1", color: "var(--color-warning)", bgColor: "var(--color-warning-light)" },
  2: { label: "P2", color: "var(--color-success)", bgColor: "var(--color-success-light)" },
  3: { label: "P3", color: "var(--color-text-secondary)", bgColor: "var(--color-surface-hover)" },
};
