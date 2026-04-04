"use client";

import Link from "next/link";
import { CircleUser, LogOut, Menu, Search, Settings } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface HeaderProps {
  workspaceSlug: string;
  userInitials: string;
  userName: string | null;
  userEmail: string | null;
}

export function Header({
  workspaceSlug,
  userInitials,
  userName,
  userEmail,
}: HeaderProps) {
  const shell = useShell();
  const accountLabel = userName ?? userEmail ?? "Account";

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
        onClick={() => shell?.openPalette()}
        className="hidden min-w-[210px] items-center gap-2 rounded-lg border border-border bg-surface-subtle px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover sm:flex"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left text-[13px]">Search...</span>
        <kbd className="inline-flex items-center rounded-sm border border-border-strong bg-surface-kbd px-1.5 py-0.5 text-[11px] text-text-muted font-mono">
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
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="normal-case tracking-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-text">{accountLabel}</span>
              {userEmail && (
                <span className="text-xs font-normal text-text-muted">
                  {userEmail}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
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
