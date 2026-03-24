"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ProjectGeneralForm } from "./project-general-form";
import { ProjectLabelsEditor } from "./project-labels-editor";
import type { Tables } from "@/lib/types";

type Member = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

interface ProjectSettingsClientProps {
  project: Tables<"projects">;
  labels: Tables<"labels">[];
  members: Member[];
  workspaceSlug: string;
}

const tabs = ["General", "Labels"] as const;
type Tab = (typeof tabs)[number];

export function ProjectSettingsClient({
  project,
  labels,
  members,
  workspaceSlug,
}: ProjectSettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("General");

  return (
    <div className="flex h-full">
      {/* Settings sub-nav */}
      <nav className="w-44 shrink-0 py-6 px-4 border-r border-[#2E2E2C]/6">
        <span className="text-[10px] font-mono font-medium text-text-muted opacity-40 tracking-[0.08em] uppercase">
          Project
        </span>
        <div className="mt-4 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "block w-full text-left py-2 px-3 rounded-lg text-[13px] font-mono transition-colors",
                activeTab === tab
                  ? "border-l-2 border-l-primary rounded-l-none font-medium text-text"
                  : "text-text-muted opacity-40 hover:opacity-70",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-8 px-12">
        {activeTab === "General" && (
          <ProjectGeneralForm
            project={project}
            members={members}
            workspaceSlug={workspaceSlug}
          />
        )}
        {activeTab === "Labels" && (
          <ProjectLabelsEditor
            projectId={project.id}
            initialLabels={labels}
          />
        )}
      </div>
    </div>
  );
}
