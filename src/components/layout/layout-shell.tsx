"use client";

import { useShell } from "@/components/layout/workspace-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface LayoutShellProps {
  sidebarProps: {
    workspaceName: string;
    workspaceSlug: string;
    projects: { id: string; name: string; color: string }[];
    workspaceId: string;
    userId: string;
    unreadCount: number;
  };
  userInitials: string;
  children: React.ReactNode;
}

export function LayoutShell({
  sidebarProps,
  userInitials,
  children,
}: LayoutShellProps) {
  const shell = useShell();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        {...sidebarProps}
        mobileOpen={shell?.mobileMenuOpen ?? false}
        onMobileClose={() => shell?.closeMobileMenu()}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background">
          <Header userInitials={userInitials} />
          {children}
        </main>
      </div>
    </div>
  );
}
