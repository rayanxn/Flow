"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  IssueParentSummary,
  IssueWithDetails,
} from "@/lib/queries/issues";
import type { Tables } from "@/lib/types";

interface UseRealtimeIssuesOptions {
  projectId: string;
  initialIssues: IssueWithDetails[];
}

function toParentSummary(
  issue: Pick<IssueWithDetails, "id" | "issue_key" | "title">,
): IssueParentSummary {
  return {
    id: issue.id,
    issue_key: issue.issue_key,
    title: issue.title,
  };
}

export function useRealtimeIssues({
  projectId,
  initialIssues,
}: UseRealtimeIssuesOptions) {
  const [issues, setIssues] = useState<IssueWithDetails[]>(initialIssues);

  // Sync with server data when initialIssues changes (e.g. after revalidation)
  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const handleInsert = useCallback(
    (payload: { new: Tables<"issues"> }) => {
      const row = payload.new;
      // Only add if not already in state (avoid duplicates from optimistic add)
      setIssues((prev) => {
        if (prev.some((i) => i.id === row.id)) return prev;
        const parentIssue = row.parent_id
          ? prev.find((issue) => issue.id === row.parent_id)
          : null;
        const stub: IssueWithDetails = {
          ...row,
          assignee: null,
          project: null,
          labels: [],
          parent: parentIssue ? toParentSummary(parentIssue) : null,
          sub_issues_count: 0,
          sub_issues_done_count: 0,
          sub_issues_story_points: 0,
        };
        return [...prev, stub];
      });
    },
    [],
  );

  const handleUpdate = useCallback(
    (payload: { new: Tables<"issues"> }) => {
      const row = payload.new;
      setIssues((prev) => {
        const parentIssue = row.parent_id
          ? prev.find((issue) => issue.id === row.parent_id)
          : null;

        return prev.map((issue) => {
          if (issue.id !== row.id) return issue;

          const parent = row.parent_id
            ? parentIssue
              ? toParentSummary(parentIssue)
              : issue.parent?.id === row.parent_id
                ? issue.parent
                : null
            : null;

          return {
            ...issue,
            ...row,
            assignee: issue.assignee,
            project: issue.project,
            labels: issue.labels,
            parent,
          };
        });
      });
    },
    [],
  );

  const handleDelete = useCallback(
    (payload: { old: { id: string } }) => {
      const id = payload.old.id;
      setIssues((prev) =>
        prev
          .filter((issue) => issue.id !== id)
          .map((issue) =>
            issue.parent_id === id
              ? { ...issue, parent_id: null, parent: null }
              : issue,
          ),
      );
    },
    [],
  );

  useEffect(() => {
    // Skip realtime when no projectId (e.g. My Issues page)
    if (!projectId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`board:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "issues",
          filter: `project_id=eq.${projectId}`,
        },
        handleInsert as (payload: unknown) => void,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "issues",
          filter: `project_id=eq.${projectId}`,
        },
        handleUpdate as (payload: unknown) => void,
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "issues",
          filter: `project_id=eq.${projectId}`,
        },
        handleDelete as (payload: unknown) => void,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, handleInsert, handleUpdate, handleDelete]);

  return { issues, setIssues };
}
