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
      router.push(`${pathname}?sprint=${sprintId}`);
    } else {
      router.push(pathname);
    }
  }

  if (sprints.length === 0) return null;

  return (
    <select
      value={selectedSprintId ?? ""}
      onChange={handleChange}
      className="rounded-lg py-2 px-4 text-[13px] font-medium text-text bg-white border border-border/50 cursor-pointer hover:border-border transition-colors"
    >
      {sprints.map((sprint) => (
        <option key={sprint.id} value={sprint.id}>
          {sprint.name}
        </option>
      ))}
    </select>
  );
}
