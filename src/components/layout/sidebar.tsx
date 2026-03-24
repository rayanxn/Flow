"use client";

import { useState, useEffect } from "react";
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
  ChevronsLeft,
  ChevronsRight,
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

const STORAGE_KEY = "flowboard-sidebar-collapsed";

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
  const [collapsed, setCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  function isActive(href: string) {
    const fullPath = `${base}${href}`;
    if (href === "/dashboard") {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  }

  return (
    <aside
      className={cn(
        "bg-background border-r border-[#2E2E2C]/6 flex flex-col h-screen shrink-0 transition-all duration-200",
        collapsed ? "w-14" : "w-56",
      )}
    >
      {/* Logo & workspace */}
      <div className={cn("py-6 pb-7", collapsed ? "px-2.5" : "px-5")}>
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-background text-[13px] font-semibold">F</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col gap-px min-w-0">
              <span className="text-[15px] font-semibold text-text leading-[18px]">Flowboard</span>
              <p className="text-[11px] font-mono text-text-muted opacity-30 leading-[14px] truncate">
                {workspaceName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-0.5", collapsed ? "px-1.5" : "px-3")}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-mono transition-colors",
                collapsed ? "justify-center px-2" : "px-3",
                active
                  ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                  : "text-text-muted opacity-55 hover:opacity-70",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.badge && (
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
        {!collapsed && (
          <div className="px-3 pt-2 pb-3">
            <span className="text-[10px] font-mono font-medium text-text-muted opacity-50 tracking-widest uppercase">
              Projects
            </span>
          </div>
        )}
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`${base}/projects/${project.id}/board`}
            title={collapsed ? project.name : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg text-[13px] font-mono transition-colors",
              collapsed ? "justify-center px-2 py-1.5" : "px-3 py-1.5",
              pathname.includes(`/projects/${project.id}`)
                ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                : "text-text-muted opacity-50 hover:opacity-70",
            )}
          >
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            {!collapsed && <span className="truncate">{project.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom: collapse toggle + settings */}
      <div className={cn("py-3", collapsed ? "px-1.5" : "px-3")}>
        <Link
          href={`${base}/settings`}
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-mono transition-colors",
            collapsed ? "justify-center px-2" : "px-3",
            pathname.startsWith(`${base}/settings`)
              ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
              : "text-text-muted opacity-55 hover:opacity-70",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            "flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-mono text-text-muted opacity-35 hover:opacity-60 transition-all w-full mt-1",
            collapsed ? "justify-center px-2" : "px-3",
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
