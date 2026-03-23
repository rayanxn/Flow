import type { IssuePriority } from "@/lib/types";

export const PRIORITY_CONFIG: Record<
  IssuePriority,
  { label: string; color: string; bgColor: string }
> = {
  0: { label: "P0", color: "#DC2626", bgColor: "#FEF2F2" },
  1: { label: "P1", color: "#D97706", bgColor: "#FFFBEB" },
  2: { label: "P2", color: "#16A34A", bgColor: "#F0FDF4" },
  3: { label: "P3", color: "#78716C", bgColor: "#F5F0EB" },
};
