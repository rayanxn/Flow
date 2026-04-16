import { createClient } from "@/lib/supabase/server";
import type { Tables, IssueStatus } from "@/lib/types";

export type IssueParentSummary = {
  id: string;
  issue_key: string;
  title: string;
};

export type IssueWithDetails = Tables<"issues"> & {
  assignee: { id: string; full_name: string | null; email: string; avatar_url: string | null } | null;
  project: { id: string; name: string; color: string } | null;
  labels: { id: string; name: string; color: string }[];
  parent: IssueParentSummary | null;
  sub_issues_count: number;
  sub_issues_done_count: number;
  sub_issues_story_points: number;
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Batch-fetches assignee profiles, project info, and labels for a set of issues.
 * Shared by getProjectIssues, getMyIssues, getBacklogIssues, and getSprintIssues.
 */
export async function enrichIssues(
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

  const parentIds = [
    ...new Set(issues.map((issue) => issue.parent_id).filter(Boolean)),
  ] as string[];
  const parentMap = new Map<string, IssueParentSummary>();

  if (parentIds.length > 0) {
    const { data: parents } = await supabase
      .from("issues")
      .select("id, issue_key, title")
      .in("id", parentIds);

    for (const parent of parents ?? []) {
      parentMap.set(parent.id, parent);
    }
  }

  const parentIssueIds = issues.map((issue) => issue.id);
  const { data: children } = await supabase
    .from("issues")
    .select("id, parent_id, status, story_points")
    .in("parent_id", parentIssueIds);

  const childCounts = new Map<string, number>();
  const childDoneCounts = new Map<string, number>();
  const childStoryPoints = new Map<string, number>();

  for (const child of children ?? []) {
    if (!child.parent_id) continue;
    childCounts.set(child.parent_id, (childCounts.get(child.parent_id) ?? 0) + 1);
    if (child.status === "done") {
      childDoneCounts.set(
        child.parent_id,
        (childDoneCounts.get(child.parent_id) ?? 0) + 1,
      );
    }
    childStoryPoints.set(
      child.parent_id,
      (childStoryPoints.get(child.parent_id) ?? 0) + (child.story_points ?? 0),
    );
  }

  return issues.map((issue) => ({
    ...issue,
    assignee: issue.assignee_id
      ? assigneeMap.get(issue.assignee_id) ?? null
      : null,
    project: projectMap.get(issue.project_id) ?? null,
    labels: issueLabelMap.get(issue.id) ?? [],
    parent: issue.parent_id ? parentMap.get(issue.parent_id) ?? null : null,
    sub_issues_count: childCounts.get(issue.id) ?? 0,
    sub_issues_done_count: childDoneCounts.get(issue.id) ?? 0,
    sub_issues_story_points: childStoryPoints.get(issue.id) ?? 0,
  }));
}

export async function getProjectIssues(
  projectId: string,
  filters?: {
    status?: IssueStatus[];
    priority?: number[];
    assignee_ids?: string[];
    label_ids?: string[];
  }
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("issues")
    .select("*")
    .eq("project_id", projectId);

  if (filters?.status?.length) {
    query = query.in("status", filters.status);
  }
  if (filters?.priority?.length) {
    query = query.in("priority", filters.priority);
  }
  if (filters?.assignee_ids?.length) {
    query = query.in("assignee_id", filters.assignee_ids);
  }

  query = query.order("sort_order", { ascending: true });

  const { data: issues } = await query;
  if (!issues || issues.length === 0) return [];

  const enriched = await enrichIssues(issues, supabase);

  // Filter by label if needed (post-enrichment since we need resolved labels)
  if (filters?.label_ids?.length) {
    const labelFilterSet = new Set(filters.label_ids);
    return enriched.filter((issue) =>
      issue.labels.some((l) => labelFilterSet.has(l.id)),
    );
  }

  return enriched;
}

export async function getMyIssues(
  workspaceId: string,
  userId: string
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("assignee_id", userId)
    .order("priority", { ascending: true })
    .order("sort_order", { ascending: true });

  if (!issues || issues.length === 0) return [];

  return enrichIssues(issues, supabase);
}

export async function getSubIssues(
  parentId: string
): Promise<IssueWithDetails[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("*")
    .eq("parent_id", parentId)
    .order("sort_order", { ascending: true });

  if (!issues || issues.length === 0) return [];

  return enrichIssues(issues, supabase);
}

export async function getSubIssueProgress(
  parentId: string
): Promise<{ done: number; total: number }> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("status")
    .eq("parent_id", parentId);

  const total = issues?.length ?? 0;
  const done = (issues ?? []).filter((issue) => issue.status === "done").length;

  return { done, total };
}
