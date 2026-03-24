"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";

const projectTabs = [
  { label: "Board", href: "board", key: "1" },
  { label: "List", href: "list", key: "2" },
  { label: "Timeline", href: "timeline", key: "3" },
  { label: "Sprint Planning", href: "sprint-planning", key: "4" },
  { label: "Settings", href: "settings", key: "" },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ workspaceSlug: string; projectId: string }>();
  const router = useRouter();
  const base = `/${params.workspaceSlug}/projects/${params.projectId}`;

  // View switching: 1=Board, 2=List, 3=Timeline, 4=Sprint Planning
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
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b border-border px-6 shrink-0">
        <nav className="flex items-center gap-4" aria-label="Project views">
          {projectTabs.map((tab) => {
            const href = `${base}/${tab.href}`;
            const active = pathname.startsWith(href);
            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "pb-2.5 pt-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  active
                    ? "text-text border-primary"
                    : "text-text-secondary border-transparent hover:text-text",
                )}
              >
                {tab.label}
                {tab.key && (
                  <span className="ml-1.5 text-[10px] text-text-muted opacity-0 group-hover:opacity-50">
                    {tab.key}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
