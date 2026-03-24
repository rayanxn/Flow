import type { Tables } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Client-side version of enrichIssues for use in browser components.
 * Batch-fetches assignee profiles, project info, and labels for a set of issues.
 */
export async function enrichIssuesClient(
  issues: Tables<"issues">[],
  supabase: SupabaseClient
): Promise<IssueWithDetails[]> {
  if (issues.length === 0) return [];

  // Batch-fetch assignee profiles
  const assigneeIds = [
    ...new Set(issues.map((i) => i.assignee_id).filter(Boolean)),
  ] as string[];
  const assigneeMap = new Map<
    string,
    { id: string; full_name: string | null; email: string; avatar_url: string | null }
  >();

  if (assigneeIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .in("id", assigneeIds);
    for (const p of profiles ?? []) {
      assigneeMap.set(p.id, p);
    }
  }

  // Batch-fetch project info
  const projectIds = [...new Set(issues.map((i) => i.project_id))];
  const projectMap = new Map<
    string,
    { id: string; name: string; color: string }
  >();

  if (projectIds.length > 0) {
    const { data: projects } = await supabase
      .from("projects")
      .select("id, name, color")
      .in("id", projectIds);
    for (const p of projects ?? []) {
      projectMap.set(p.id, p);
    }
  }

  // Batch-fetch labels
  const issueIds = issues.map((i) => i.id);
  const { data: issueLabels } = await supabase
    .from("issue_labels")
    .select("issue_id, label_id")
    .in("issue_id", issueIds);

  const labelIds = [
    ...new Set((issueLabels ?? []).map((il) => il.label_id)),
  ];
  const labelMap = new Map<string, { id: string; name: string; color: string }>();

  if (labelIds.length > 0) {
    const { data: labels } = await supabase
      .from("labels")
      .select("id, name, color")
      .in("id", labelIds);
    for (const l of labels ?? []) {
      labelMap.set(l.id, l);
    }
  }

  const issueLabelMap = new Map<string, { id: string; name: string; color: string }[]>();
  for (const il of issueLabels ?? []) {
    if (!issueLabelMap.has(il.issue_id)) {
      issueLabelMap.set(il.issue_id, []);
    }
    const label = labelMap.get(il.label_id);
    if (label) {
      issueLabelMap.get(il.issue_id)!.push(label);
    }
  }

  return issues.map((issue) => ({
    ...issue,
    assignee: issue.assignee_id
      ? assigneeMap.get(issue.assignee_id) ?? null
      : null,
    project: projectMap.get(issue.project_id) ?? null,
    labels: issueLabelMap.get(issue.id) ?? [],
  }));
}
