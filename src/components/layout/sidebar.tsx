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
  X,
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
  mobileOpen?: boolean;
  onMobileClose?: () => void;
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

const STORAGE_KEY = "flow-sidebar-collapsed";

export function Sidebar({
  workspaceName,
  workspaceSlug,
  projects,
  workspaceId,
  userId,
  unreadCount,
  mobileOpen = false,
  onMobileClose,
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

  function handleNavClick() {
    // Auto-close mobile menu when navigating
    onMobileClose?.();
  }

  const sidebarContent = (isCollapsed: boolean, isMobile: boolean) => (
    <>
      {/* Logo & workspace */}
      <div className={cn("py-6 pb-7", isCollapsed ? "px-2.5" : "px-5")}>
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-background text-[13px] font-semibold">F</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col gap-px min-w-0 flex-1">
              <span className="text-[15px] font-semibold text-text leading-[18px]">Flow</span>
              <p className="text-[11px] font-mono text-text-muted opacity-30 leading-[14px] truncate">
                {workspaceName}
              </p>
            </div>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={onMobileClose}
              className="ml-auto p-1 rounded-md text-text-muted hover:text-text transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-0.5", isCollapsed ? "px-1.5" : "px-3")}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`${base}${item.href}`}
              title={isCollapsed ? item.label : undefined}
              onClick={isMobile ? handleNavClick : undefined}
              className={cn(
                "flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-mono transition-colors",
                isCollapsed ? "justify-center px-2" : "px-3",
                active
                  ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                  : "text-text-muted opacity-55 hover:opacity-70",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="flex-1">{item.label}</span>}
              {!isCollapsed && item.badge && (
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
        {!isCollapsed && (
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
            title={isCollapsed ? project.name : undefined}
            onClick={isMobile ? handleNavClick : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg text-[13px] font-mono transition-colors",
              isCollapsed ? "justify-center px-2 py-1.5" : "px-3 py-1.5",
              pathname.includes(`/projects/${project.id}`)
                ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                : "text-text-muted opacity-50 hover:opacity-70",
            )}
          >
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            {!isCollapsed && <span className="truncate">{project.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom: collapse toggle + settings */}
      <div className={cn("py-3", isCollapsed ? "px-1.5" : "px-3")}>
        <Link
          href={`${base}/settings`}
          title={isCollapsed ? "Settings" : undefined}
          onClick={isMobile ? handleNavClick : undefined}
          className={cn(
            "flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-mono transition-colors",
            isCollapsed ? "justify-center px-2" : "px-3",
            pathname.startsWith(`${base}/settings`)
              ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
              : "text-text-muted opacity-55 hover:opacity-70",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-mono text-text-muted opacity-35 hover:opacity-60 transition-all w-full mt-1",
              isCollapsed ? "justify-center px-2" : "px-3",
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="w-4 h-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex bg-background border-r border-[#2E2E2C]/6 flex-col h-screen shrink-0 transition-all duration-200",
          collapsed ? "w-14" : "w-56",
        )}
      >
        {sidebarContent(collapsed, false)}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          {/* Sidebar panel */}
          <aside className="relative w-56 h-full bg-background border-r border-[#2E2E2C]/6 flex flex-col">
            {sidebarContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
}
