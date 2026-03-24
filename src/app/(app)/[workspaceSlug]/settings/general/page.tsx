import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/lib/queries/workspaces";
import { WorkspaceGeneralForm } from "@/components/settings/workspace-general-form";

export default async function WorkspaceGeneralPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const result = await getWorkspaceBySlug(workspaceSlug);

  if (!result?.workspace) {
    notFound();
  }

  return <WorkspaceGeneralForm workspace={result.workspace} />;
}
