import { createClient } from "@/lib/supabase/server";
import type { IssueStatus } from "@/lib/types";

export type TimelineIssue = {
  id: string;
  issue_key: string;
  title: string;
  status: IssueStatus;
  priority: number;
  created_at: string;
  due_date: string;
  assignee: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export async function getTimelineIssues(
  projectId: string
): Promise<TimelineIssue[]> {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("issues")
    .select("id, issue_key, title, status, priority, created_at, due_date, assignee_id")
    .eq("project_id", projectId)
    .not("due_date", "is", null)
    .order("created_at", { ascending: true });

  if (!issues || issues.length === 0) return [];

  // Batch-fetch assignee profiles
  const assigneeIds = [
    ...new Set(issues.map((i) => i.assignee_id).filter(Boolean)),
  ] as string[];

  const assigneeMap = new Map<
    string,
    { id: string; full_name: string | null; avatar_url: string | null }
  >();

  if (assigneeIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", assigneeIds);
    for (const p of profiles ?? []) {
      assigneeMap.set(p.id, p);
    }
  }

  return issues.map((issue) => ({
    id: issue.id,
    issue_key: issue.issue_key,
    title: issue.title,
    status: issue.status as IssueStatus,
    priority: issue.priority,
    created_at: issue.created_at,
    due_date: issue.due_date!,
    assignee: issue.assignee_id
      ? assigneeMap.get(issue.assignee_id) ?? null
      : null,
  }));
}
