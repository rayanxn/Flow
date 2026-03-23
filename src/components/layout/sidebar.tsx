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

interface SidebarProject {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  workspaceName: string;
  workspaceSlug: string;
  projects: SidebarProject[];
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
    <aside className="w-56 bg-surface border-r border-border flex flex-col h-screen shrink-0">
      {/* Logo & workspace */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-surface text-sm font-bold">F</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-text">Flowboard</span>
            <p className="text-xs text-text-muted">{workspaceName}</p>
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
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-background font-medium text-text"
                  : "text-text-secondary hover:text-text hover:bg-background/50",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="!my-3 border-t border-border" />

        {/* Projects section */}
        <div className="px-3 py-2">
          <span className="text-xs text-text-muted tracking-wider uppercase font-medium">
            Projects
          </span>
        </div>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`${base}/projects/${project.id}/board`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname.includes(`/projects/${project.id}`)
                ? "bg-background font-medium text-text"
                : "text-text-secondary hover:text-text hover:bg-background/50",
            )}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="truncate">{project.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom settings */}
      <div className="px-3 py-3 border-t border-border">
        <Link
          href={`${base}/settings`}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname.startsWith(`${base}/settings`)
              ? "bg-background font-medium text-text"
              : "text-text-secondary hover:text-text hover:bg-background/50",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
