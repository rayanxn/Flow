"use client";

import { createContext, useContext } from "react";
import type { Tables } from "@/lib/types";

type WorkspaceContextType = {
  workspace: Tables<"workspaces">;
  membership: Tables<"workspace_members">;
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
  workspace,
  membership,
  children,
}: WorkspaceContextType & { children: React.ReactNode }) {
  return (
    <WorkspaceContext.Provider value={{ workspace, membership }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
