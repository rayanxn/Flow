import { notFound } from "next/navigation";
import { getProjectById, getProjectLabels } from "@/lib/queries/projects";
import { getWorkspaceMembers } from "@/lib/queries/members";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { ProjectSettingsClient } from "@/components/settings/project-settings-client";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;

  const [project, labels, wsResult] = await Promise.all([
    getProjectById(projectId),
    getProjectLabels(projectId),
    getWorkspaceBySlug(workspaceSlug),
  ]);

  if (!project || !wsResult?.workspace) {
    notFound();
  }

  const members = await getWorkspaceMembers(wsResult.workspace.id);

  return (
    <ProjectSettingsClient
      project={project}
      labels={labels}
      members={members}
      workspaceSlug={workspaceSlug}
    />
  );
}
