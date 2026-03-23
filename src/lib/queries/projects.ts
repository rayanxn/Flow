import { createClient } from "@/lib/supabase/server";
import type { Tables, IssueStatus } from "@/lib/types";

export type ProjectWithStats = Tables<"projects"> & {
  lead: { id: string; full_name: string | null; email: string } | null;
  issue_counts: Record<IssueStatus, number>;
  total_issues: number;
};

export async function getProjectsWithStats(
  workspaceId: string
): Promise<ProjectWithStats[]> {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("is_archived", false)
    .order("name");

  if (!projects || projects.length === 0) return [];

  // Get lead profiles
  const leadIds = [
    ...new Set(projects.map((p) => p.lead_id).filter(Boolean)),
  ] as string[];
  const leadMap = new Map<
    string,
    { id: string; full_name: string | null; email: string }
  >();

  if (leadIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", leadIds);

    for (const p of profiles ?? []) {
      leadMap.set(p.id, p);
    }
  }

  // Get issue counts grouped by project and status
  const { data: issues } = await supabase
    .from("issues")
    .select("project_id, status")
    .eq("workspace_id", workspaceId);

  const countsByProject = new Map<string, Record<IssueStatus, number>>();
  for (const issue of issues ?? []) {
    if (!countsByProject.has(issue.project_id)) {
      countsByProject.set(issue.project_id, {
        todo: 0,
        in_progress: 0,
        in_review: 0,
        done: 0,
      });
    }
    countsByProject.get(issue.project_id)![issue.status as IssueStatus]++;
  }

  return projects.map((p) => {
    const counts = countsByProject.get(p.id) ?? {
      todo: 0,
      in_progress: 0,
      in_review: 0,
      done: 0,
    };
    return {
      ...p,
      lead: p.lead_id ? leadMap.get(p.lead_id) ?? null : null,
      issue_counts: counts,
      total_issues: Object.values(counts).reduce((a, b) => a + b, 0),
    };
  });
}

export async function getProjectById(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
  return data;
}

export async function getProjectLabels(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("labels")
    .select("*")
    .eq("project_id", projectId)
    .order("name");
  return data ?? [];
}

export async function getProjectSprints(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sprints")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
