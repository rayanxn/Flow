import { createClient } from "@/lib/supabase/server";
import { enrichIssues, type IssueWithDetails } from "./issues";

export async function getBacklogIssues(
  projectId: string,
  excludeSprintId?: string
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("issues")
    .select("*")
    .eq("project_id", projectId);

  if (excludeSprintId) {
    // Show all issues NOT in the selected sprint (including unassigned and other sprints)
    query = query.or(`sprint_id.is.null,sprint_id.neq.${excludeSprintId}`);
  } else {
    query = query.is("sprint_id", null);
  }

  const { data: issues } = await query.order("sort_order", { ascending: true });

  if (!issues || issues.length === 0) return [];

  return enrichIssues(issues, supabase);
}

export async function getSprintIssues(
  sprintId: string
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .eq("sprint_id", sprintId)
    .order("sort_order", { ascending: true });

  if (!issues || issues.length === 0) return [];

  return enrichIssues(issues, supabase);
}
