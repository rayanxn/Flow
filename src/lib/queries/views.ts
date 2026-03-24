import { createClient } from "@/lib/supabase/server";
import type { Tables, ViewFilters } from "@/lib/types";
import { enrichIssues, type IssueWithDetails } from "./issues";

export async function getWorkspaceViews(
  workspaceId: string
): Promise<Tables<"views">[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("views")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getViewById(
  viewId: string
): Promise<Tables<"views"> | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("views")
    .select("*")
    .eq("id", viewId)
    .single();
  return data;
}

export async function getFilteredIssues(
  workspaceId: string,
  filters: ViewFilters
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("issues")
    .select("*")
    .eq("workspace_id", workspaceId);

  if (filters.status?.length) {
    query = query.in("status", filters.status);
  }
  if (filters.priority?.length) {
    query = query.in("priority", filters.priority);
  }
  if (filters.assignee_ids?.length) {
    query = query.in("assignee_id", filters.assignee_ids);
  }
  if (filters.project_ids?.length) {
    query = query.in("project_id", filters.project_ids);
  }
  if (filters.due_date_range?.from) {
    query = query.gte("due_date", filters.due_date_range.from);
  }
  if (filters.due_date_range?.to) {
    query = query.lte("due_date", filters.due_date_range.to);
  }

  query = query.order("priority", { ascending: true }).order("created_at", { ascending: false });

  const { data: issues } = await query;
  if (!issues || issues.length === 0) return [];

  const enriched = await enrichIssues(issues, supabase);

  // Post-filter by label_ids (same pattern as getProjectIssues)
  if (filters.label_ids?.length) {
    const labelFilterSet = new Set(filters.label_ids);
    return enriched.filter((issue) =>
      issue.labels.some((l) => labelFilterSet.has(l.id))
    );
  }

  return enriched;
}

export async function getFilteredIssueCount(
  workspaceId: string,
  filters: ViewFilters
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from("issues")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (filters.status?.length) {
    query = query.in("status", filters.status);
  }
  if (filters.priority?.length) {
    query = query.in("priority", filters.priority);
  }
  if (filters.assignee_ids?.length) {
    query = query.in("assignee_id", filters.assignee_ids);
  }
  if (filters.project_ids?.length) {
    query = query.in("project_id", filters.project_ids);
  }
  if (filters.due_date_range?.from) {
    query = query.gte("due_date", filters.due_date_range.from);
  }
  if (filters.due_date_range?.to) {
    query = query.lte("due_date", filters.due_date_range.to);
  }

  const { count } = await query;
  return count ?? 0;
}
