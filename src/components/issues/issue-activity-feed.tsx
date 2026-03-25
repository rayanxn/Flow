"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRelative } from "@/lib/utils/dates";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import type { IssueStatus, IssuePriority } from "@/lib/types";

interface ActivityItem {
  id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
  actor: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
}

export function IssueActivityFeed({ issueId }: { issueId: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from("activities")
        .select("id, action, metadata, created_at, actor_id")
        .eq("entity_type", "issue")
        .eq("entity_id", issueId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (cancelled || !data || data.length === 0) {
        if (!cancelled) {
          setActivities([]);
          setLoading(false);
        }
        return;
      }

      // Batch-fetch actor profiles
      const actorIds = [...new Set(data.map((a) => a.actor_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", actorIds);

      const actorMap = new Map<string, ActivityItem["actor"]>();
      for (const p of profiles ?? []) {
        actorMap.set(p.id, p);
      }

      if (!cancelled) {
        setActivities(
          data.map((a) => ({
            id: a.id,
            action: a.action,
            metadata: (a.metadata ?? {}) as Record<string, unknown>,
            created_at: a.created_at,
            actor: actorMap.get(a.actor_id) ?? null,
          }))
        );
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [issueId]);

  if (loading) {
    return (
      <div className="text-xs text-text-muted py-4 text-center">
        Loading activity...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-xs text-text-muted py-4 text-center">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-2.5 py-2 text-xs"
        >
          {/* Actor avatar */}
          <div className="shrink-0 w-5 h-5 rounded-full bg-surface-hover flex items-center justify-center text-[10px] font-medium text-text-secondary mt-0.5">
            {activity.actor?.full_name?.[0]?.toUpperCase() ??
              activity.actor?.email?.[0]?.toUpperCase() ??
              "?"}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="font-medium text-text">
              {activity.actor?.full_name?.split(" ")[0] ??
                activity.actor?.email ??
                "Someone"}
            </span>{" "}
            <span className="text-text-secondary">
              {formatAction(activity)}
            </span>
            <div className="text-text-muted mt-0.5">
              {formatRelative(activity.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatAction(activity: ActivityItem): string {
  const { action, metadata } = activity;
  const changes = metadata.changes as Record<string, unknown> | undefined;

  if (action === "created") return "created this issue";

  if (action === "updated") {
    if (changes?.status) {
      const status = changes.status as string;
      const label = STATUS_CONFIG[status as IssueStatus]?.label ?? status;
      return `changed status to ${label}`;
    }
    if (changes?.assignee_id) {
      return "updated the assignee";
    }
    if (changes?.priority !== undefined) {
      const p = changes.priority as number;
      const label = PRIORITY_CONFIG[p as IssuePriority]?.label ?? `P${p}`;
      return `changed priority to ${label}`;
    }
    if (changes?.title) return "updated the title";
    if (changes?.description !== undefined) return "updated the description";
    if (changes?.due_date !== undefined) return "updated the due date";
    if (changes?.story_points !== undefined) return "updated story points";
    if (changes?.checklist !== undefined) return "updated the checklist";
    return "made an update";
  }

  if (action === "deleted") return "deleted this issue";

  return action;
}
