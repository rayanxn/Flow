"use client";

import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  userInitials: string;
}

export function Header({ userInitials }: HeaderProps) {
  return (
    <header className="flex items-center justify-end gap-3 px-10 pt-6">
      {/* Search trigger */}
      <button
        type="button"
        className="flex items-center gap-2 bg-[#EDEAE4] rounded-lg px-4 py-2 text-sm text-text-secondary hover:opacity-80 transition-opacity"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left text-[13px]">Search...</span>
        <kbd className="hidden sm:inline-flex items-center rounded-sm bg-[#DFDBCF] px-1.5 py-0.5 text-[11px] text-text-muted font-mono">
          <span className="text-[11px]">&#8984;</span>K
        </kbd>
      </button>

      {/* User avatar */}
      <Avatar size="sm">
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
    </header>
  );
}
