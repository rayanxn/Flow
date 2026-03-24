"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  CircleUser,
  FolderKanban,
  Filter,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { InboxBadge } from "./inbox-badge";

interface SidebarProject {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  workspaceName: string;
  workspaceSlug: string;
  projects: SidebarProject[];
  workspaceId: string;
  userId: string;
  unreadCount: number;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inbox", icon: Mail, href: "/inbox", badge: true },
  { label: "My Issues", icon: CircleUser, href: "/my-issues" },
  { label: "Projects", icon: FolderKanban, href: "/projects" },
  { label: "Views", icon: Filter, href: "/views" },
  { label: "Teams", icon: Users, href: "/teams" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

export function Sidebar({
  workspaceName,
  workspaceSlug,
  projects,
  workspaceId,
  userId,
  unreadCount,
}: SidebarProps) {
  const pathname = usePathname();
  const base = `/${workspaceSlug}`;

  function isActive(href: string) {
    const fullPath = `${base}${href}`;
    if (href === "/dashboard") {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  }

  return (
    <aside className="w-56 bg-background border-r border-[#2E2E2C]/6 flex flex-col h-screen shrink-0">
      {/* Logo & workspace */}
      <div className="px-5 py-6 pb-7">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-background text-[13px] font-semibold">F</span>
          </div>
          <div className="flex flex-col gap-px">
            <span className="text-[15px] font-semibold text-text leading-[18px]">Flowboard</span>
            <p className="text-[11px] font-mono text-text-muted opacity-30 leading-[14px]">{workspaceName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-mono transition-colors",
                active
                  ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                  : "text-text-muted opacity-45 hover:opacity-70",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <InboxBadge
                  workspaceId={workspaceId}
                  userId={userId}
                  initialCount={unreadCount}
                />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="!my-3 h-px bg-[#2E2E2C]/6" />

        {/* Projects section */}
        <div className="px-3 pt-2 pb-3">
          <span className="text-[10px] font-mono font-medium text-text-muted opacity-50 tracking-widest uppercase">
            Projects
          </span>
        </div>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`${base}/projects/${project.id}/board`}
            className={cn(
              "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-mono transition-colors",
              pathname.includes(`/projects/${project.id}`)
                ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                : "text-text-muted opacity-50 hover:opacity-70",
            )}
          >
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="truncate">{project.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom settings */}
      <div className="px-3 py-3">
        <Link
          href={`${base}/settings`}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-mono transition-colors",
            pathname.startsWith(`${base}/settings`)
              ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
              : "text-text-muted opacity-45 hover:opacity-70",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
