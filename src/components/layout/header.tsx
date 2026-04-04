"use client";

import Link from "next/link";
import { CircleUser, LogOut, Menu, Search, Settings } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShell } from "@/components/layout/workspace-shell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { WorkspaceRole } from "@/lib/types";

interface HeaderProps {
  workspaceSlug: string;
  userInitials: string;
  userName: string | null;
  userEmail: string | null;
  userAvatarUrl: string | null;
  workspaces: {
    role: WorkspaceRole;
    workspace: { id: string; name: string; slug: string };
  }[];
}

export function Header({
  workspaceSlug,
  userInitials,
  userName,
  userEmail,
  userAvatarUrl,
  workspaces,
}: HeaderProps) {
  const shell = useShell();
  const accountLabel = userName ?? userEmail ?? "Account";
  const currentWorkspace =
    workspaces.find((entry) => entry.workspace.slug === workspaceSlug)?.workspace ?? null;
  const orderedWorkspaces = [...workspaces].sort((a, b) => {
    const aCurrent = a.workspace.slug === workspaceSlug ? 0 : 1;
    const bCurrent = b.workspace.slug === workspaceSlug ? 0 : 1;

    if (aCurrent !== bCurrent) return aCurrent - bCurrent;
    return a.workspace.name.localeCompare(b.workspace.name);
  });

  return (
    <header className="flex items-center justify-between gap-3 px-4 md:px-10 pt-6">
      {/* Hamburger menu (mobile only) */}
      <button
        type="button"
        onClick={() => shell?.toggleMobileMenu()}
        className="md:hidden p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      {/* Search trigger */}
      <button
        type="button"
        aria-label="Search..."
        onClick={() => shell?.openPalette()}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-subtle px-2.5 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover sm:min-w-[210px] sm:px-4"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden flex-1 text-left text-[13px] sm:inline">Search...</span>
        <kbd className="hidden items-center rounded-sm border border-border-strong bg-surface-kbd px-1.5 py-0.5 text-[11px] text-text-muted font-mono sm:inline-flex">
          <span className="text-[11px]">&#8984;</span>K
        </kbd>
      </button>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open account menu"
            className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
          >
            <Avatar size="sm">
              {userAvatarUrl && (
                <AvatarImage src={userAvatarUrl} alt={accountLabel} />
              )}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="normal-case tracking-normal">
            <div className="flex items-center gap-3">
              <Avatar>
                {userAvatarUrl && (
                  <AvatarImage src={userAvatarUrl} alt={accountLabel} />
                )}
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-text">
                  {accountLabel}
                </span>
                {userEmail && (
                  <span className="truncate text-xs font-normal text-text-muted">
                    {userEmail}
                  </span>
                )}
                {currentWorkspace && (
                  <span className="truncate text-xs font-normal text-text-muted">
                    {currentWorkspace.name}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <div className="max-h-64 overflow-y-auto">
            {orderedWorkspaces.map(({ role, workspace }) => {
              const isCurrent = workspace.slug === workspaceSlug;

              return (
                <DropdownMenuItem key={workspace.id} asChild>
                  <Link href={`/${workspace.slug}/dashboard`}>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm text-text">
                        {workspace.name}
                      </span>
                      <span className="truncate text-xs text-text-muted">
                        {formatWorkspaceRole(role)}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="rounded-full bg-[#EDEAE4] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-text-muted">
                        Current
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/${workspaceSlug}/settings/profile`}>
              <CircleUser className="w-4 h-4 mr-2 text-text-muted" />
              Profile settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${workspaceSlug}/settings/general`}>
              <Settings className="w-4 h-4 mr-2 text-text-muted" />
              Workspace settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-danger outline-none transition-colors hover:bg-surface-hover focus:bg-surface-hover"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function formatWorkspaceRole(role: WorkspaceRole) {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    default:
      return "Member";
  }
}
