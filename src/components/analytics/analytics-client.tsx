"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Tables } from "@/lib/types";

export function SprintSelector({
  sprints,
  selectedSprintId,
}: {
  sprints: Tables<"sprints">[];
  selectedSprintId: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sprintId = e.target.value;
    if (sprintId) {
      router.push(`${pathname}?tab=sprints&sprint=${sprintId}`);
    } else {
      router.push(`${pathname}?tab=sprints`);
    }
  }

  if (sprints.length === 0) return null;

  return (
    <select
      value={selectedSprintId ?? ""}
      onChange={handleChange}
      className="cursor-pointer rounded-lg border border-border-input bg-surface px-4 py-2 text-[13px] font-medium text-text transition-colors hover:border-border"
    >
      {sprints.map((sprint) => (
        <option key={sprint.id} value={sprint.id}>
          {sprint.name}
        </option>
      ))}
    </select>
  );
}
