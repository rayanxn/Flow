"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";

const projectTabs = [
  { label: "Board", href: "board", key: "1" },
  { label: "List", href: "list", key: "2" },
  { label: "Timeline", href: "timeline", key: "3" },
  { label: "Sprint Planning", href: "sprint-planning", key: "4" },
  { label: "Settings", href: "settings", key: "" },
];

interface ProjectTabNavProps {
  workspaceSlug: string;
  projectId: string;
}

export function ProjectTabNav({ workspaceSlug, projectId }: ProjectTabNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const base = `/${workspaceSlug}/projects/${projectId}`;

  const hotkeys = useMemo(
    () =>
      projectTabs
        .filter((t) => t.key)
        .map((tab) => ({
          key: tab.key,
          handler: () => router.push(`${base}/${tab.href}`),
        })),
    [base, router],
  );

  useHotkeys(hotkeys);

  return (
    <nav className="flex items-center gap-4" aria-label="Project views">
      {projectTabs.map((tab) => {
        const href = `${base}/${tab.href}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              "group pb-2.5 pt-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              active
                ? "text-text border-primary"
                : "text-text-secondary border-transparent hover:text-text",
            )}
          >
            {tab.label}
            {tab.key && (
              <span aria-hidden="true" className="ml-1.5 text-[10px] text-text-muted opacity-0 group-hover:opacity-50">
                {tab.key}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
