import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/queries/projects";
import { ProjectTabNav } from "./project-tab-nav";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b border-border px-6 shrink-0">
        <div className="flex items-center gap-2 pt-3 pb-1">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: project.color }}
          />
          <h1 className="text-base font-semibold text-text">{project.name}</h1>
        </div>
        <ProjectTabNav
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
