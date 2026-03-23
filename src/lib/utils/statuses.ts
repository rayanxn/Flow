import type { IssueStatus } from "@/lib/types";

export const STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; color: string; bgColor: string }
> = {
  todo: { label: "Todo", color: "#78716C", bgColor: "#F5F0EB" },
  in_progress: { label: "In Progress", color: "#D97706", bgColor: "#FFFBEB" },
  in_review: { label: "In Review", color: "#7C3AED", bgColor: "#F5F3FF" },
  done: { label: "Done", color: "#16A34A", bgColor: "#F0FDF4" },
};

export const STATUS_ORDER: IssueStatus[] = [
  "todo",
  "in_progress",
  "in_review",
  "done",
];
