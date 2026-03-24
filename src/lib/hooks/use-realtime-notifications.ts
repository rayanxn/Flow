"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/types";

interface UseRealtimeNotificationsOptions {
  userId: string;
  workspaceId: string;
  initialCount: number;
}

export function useRealtimeNotifications({
  userId,
  initialCount,
}: UseRealtimeNotificationsOptions) {
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // Sync with server data when initialCount changes (e.g. after revalidation)
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  const handleInsert = useCallback(() => {
    // New notifications are always unread
    setUnreadCount((prev) => prev + 1);
  }, []);

  const handleUpdate = useCallback(
    (payload: { old: Tables<"notifications">; new: Tables<"notifications"> }) => {
      const wasRead = payload.old.is_read;
      const isNowRead = payload.new.is_read;

      if (!wasRead && isNowRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else if (wasRead && !isNowRead) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    []
  );

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        handleInsert as (payload: unknown) => void
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        handleUpdate as (payload: unknown) => void
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, handleInsert, handleUpdate]);

  return { unreadCount };
}
