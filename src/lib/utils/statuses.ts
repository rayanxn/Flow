import type { IssueStatus } from "@/lib/types";

export const STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; color: string; bgColor: string }
> = {
  todo: { label: "Todo", color: "var(--color-text-secondary)", bgColor: "var(--color-surface-hover)" },
  in_progress: { label: "In Progress", color: "var(--color-accent)", bgColor: "var(--color-accent-light)" },
  in_review: { label: "In Review", color: "var(--color-purple)", bgColor: "var(--color-purple-light)" },
  done: { label: "Done", color: "var(--color-success)", bgColor: "var(--color-success-light)" },
};

export const STATUS_ORDER: IssueStatus[] = [
  "todo",
  "in_progress",
  "in_review",
  "done",
];
