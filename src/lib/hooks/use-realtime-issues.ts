"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { Tables } from "@/lib/types";

interface UseRealtimeIssuesOptions {
  projectId: string;
  initialIssues: IssueWithDetails[];
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
        const stub: IssueWithDetails = {
          ...row,
          assignee: null,
          project: null,
          labels: [],
          parent: null,
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
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== row.id) return issue;
          // Merge scalar fields, preserve relations
          return {
            ...issue,
            ...row,
            assignee: issue.assignee,
            project: issue.project,
            labels: issue.labels,
          };
        }),
      );
    },
    [],
  );

  const handleDelete = useCallback(
    (payload: { old: { id: string } }) => {
      const id = payload.old.id;
      setIssues((prev) => prev.filter((i) => i.id !== id));
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
