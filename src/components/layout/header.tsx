"use client";

import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  userInitials: string;
}

export function Header({ userInitials }: HeaderProps) {
  return (
    <header className="flex items-center justify-end gap-3 px-6 py-4">
      {/* Search trigger */}
      <button
        type="button"
        className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-muted hover:border-border-strong transition-colors w-64"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-text-muted">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      {/* User avatar */}
      <Avatar size="sm">
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
    </header>
  );
}
