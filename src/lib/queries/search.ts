import { createClient } from "@/lib/supabase/client";

export type SearchResult = {
  id: string;
  issue_key: string;
  title: string;
  status: string;
  project: { id: string; name: string; color: string } | null;
};

export async function searchIssuesClient(
  workspaceId: string,
  query: string,
  limit = 5
): Promise<SearchResult[]> {
  const supabase = createClient();

  const trimmed = query.trim();
  if (!trimmed) return [];

  const { data: issues } = await supabase
    .from("issues")
    .select("id, issue_key, title, status, project_id")
    .eq("workspace_id", workspaceId)
    .or(`title.ilike.%${trimmed}%,issue_key.ilike.%${trimmed}%`)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (!issues || issues.length === 0) return [];

  // Batch-fetch projects
  const projectIds = [...new Set(issues.map((i) => i.project_id))];
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, color")
    .in("id", projectIds);

  const projectMap = new Map<string, { id: string; name: string; color: string }>();
  for (const p of projects ?? []) {
    projectMap.set(p.id, p);
  }

  return issues.map((issue) => ({
    id: issue.id,
    issue_key: issue.issue_key,
    title: issue.title,
    status: issue.status,
    project: projectMap.get(issue.project_id) ?? null,
  }));
}

export async function getRecentIssuesClient(
  workspaceId: string,
  userId: string,
  limit = 5
): Promise<SearchResult[]> {
  const supabase = createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("id, issue_key, title, status, project_id")
    .eq("workspace_id", workspaceId)
    .or(`assignee_id.eq.${userId},created_by.eq.${userId}`)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (!issues || issues.length === 0) return [];

  const projectIds = [...new Set(issues.map((i) => i.project_id))];
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, color")
    .in("id", projectIds);

  const projectMap = new Map<string, { id: string; name: string; color: string }>();
  for (const p of projects ?? []) {
    projectMap.set(p.id, p);
  }

  return issues.map((issue) => ({
    id: issue.id,
    issue_key: issue.issue_key,
    title: issue.title,
    status: issue.status,
    project: projectMap.get(issue.project_id) ?? null,
  }));
}
