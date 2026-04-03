"use client";

import { useShell } from "@/components/layout/workspace-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface LayoutShellProps {
  workspaceSlug: string;
  sidebarProps: {
    workspaceName: string;
    workspaceSlug: string;
    projects: { id: string; name: string; color: string }[];
    workspaceId: string;
    userId: string;
    unreadCount: number;
  };
  userInitials: string;
  userName: string | null;
  userEmail: string | null;
  children: React.ReactNode;
}

export function LayoutShell({
  workspaceSlug,
  sidebarProps,
  userInitials,
  userName,
  userEmail,
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
          <Header
            workspaceSlug={workspaceSlug}
            userInitials={userInitials}
            userName={userName}
            userEmail={userEmail}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
