"use client";

import { useState, useCallback, useMemo, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { CreateIssueModal } from "@/components/issues/create-issue-modal";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";

type ShellContextValue = {
  openPalette: () => void;
  openCreateIssue: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell() {
  return useContext(ShellContext);
}

interface WorkspaceShellProps {
  workspaceSlug: string;
  workspaceId: string;
  userId: string;
  projects: { id: string; name: string; color: string }[];
  members: { user_id: string; profile: { full_name: string | null; email: string } }[];
  children: React.ReactNode;
}

export function WorkspaceShell({
  workspaceSlug,
  workspaceId,
  userId,
  projects,
  members,
  children,
}: WorkspaceShellProps) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const openCreateIssue = useCallback(() => setCreateIssueOpen(true), []);

  const hotkeys = useMemo(
    () => [
      { key: "k", meta: true, handler: () => setPaletteOpen((o) => !o) },
      { key: "n", meta: true, handler: () => setCreateIssueOpen(true) },
      {
        key: ",",
        meta: true,
        handler: () => router.push(`/${workspaceSlug}/settings/general`),
      },
    ],
    [router, workspaceSlug],
  );

  useHotkeys(hotkeys);

  const ctx = useMemo(() => ({ openPalette, openCreateIssue }), [openPalette, openCreateIssue]);

  return (
    <ShellContext.Provider value={ctx}>
      {children}

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        workspaceSlug={workspaceSlug}
        workspaceId={workspaceId}
        userId={userId}
        projects={projects}
        onCreateIssue={openCreateIssue}
      />

      <CreateIssueModal
        open={createIssueOpen}
        onOpenChange={setCreateIssueOpen}
        projects={projects}
        members={members}
      />
    </ShellContext.Provider>
  );
}
