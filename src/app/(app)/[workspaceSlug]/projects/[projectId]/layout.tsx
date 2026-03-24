"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const projectTabs = [
  { label: "Board", href: "board" },
  { label: "List", href: "list" },
  { label: "Timeline", href: "timeline" },
  { label: "Sprint Planning", href: "sprint-planning" },
  { label: "Settings", href: "settings" },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams<{ workspaceSlug: string; projectId: string }>();
  const base = `/${params.workspaceSlug}/projects/${params.projectId}`;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b border-border px-6 shrink-0">
        <nav className="flex items-center gap-4">
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
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
