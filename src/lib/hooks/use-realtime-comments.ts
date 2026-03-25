"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CommentWithAuthor } from "@/lib/queries/comments";
import type { Tables } from "@/lib/types";

interface UseRealtimeCommentsOptions {
  issueId: string | null;
  initialComments: CommentWithAuthor[];
}

export function useRealtimeComments({
  issueId,
  initialComments,
}: UseRealtimeCommentsOptions) {
  const [comments, setComments] =
    useState<CommentWithAuthor[]>(initialComments);

  // Sync with server data when initialComments changes
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleInsert = useCallback(
    (payload: { new: Tables<"comments"> }) => {
      const row = payload.new;
      setComments((prev) => {
        if (prev.some((c) => c.id === row.id)) return prev;
        const stub: CommentWithAuthor = {
          ...row,
          author: null,
        };
        return [...prev, stub];
      });
    },
    []
  );

  const handleUpdate = useCallback(
    (payload: { new: Tables<"comments"> }) => {
      const row = payload.new;
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id !== row.id) return comment;
          return {
            ...comment,
            body: row.body,
            mentions: row.mentions,
            is_edited: row.is_edited,
            updated_at: row.updated_at,
          };
        })
      );
    },
    []
  );

  const handleDelete = useCallback(
    (payload: { old: { id: string } }) => {
      const id = payload.old.id;
      setComments((prev) => prev.filter((c) => c.id !== id));
    },
    []
  );

  useEffect(() => {
    if (!issueId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`comments:${issueId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `issue_id=eq.${issueId}`,
        },
        handleInsert as (payload: unknown) => void
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "comments",
          filter: `issue_id=eq.${issueId}`,
        },
        handleUpdate as (payload: unknown) => void
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `issue_id=eq.${issueId}`,
        },
        handleDelete as (payload: unknown) => void
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [issueId, handleInsert, handleUpdate, handleDelete]);

  return { comments, setComments };
}
