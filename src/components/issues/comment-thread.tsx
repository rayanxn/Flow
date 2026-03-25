"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  UserCheck,
  Pencil,
  Trash2,
  Plus,
  MessageSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MentionInput } from "@/components/issues/mention-input";
import { useRealtimeComments } from "@/lib/hooks/use-realtime-comments";
import { createComment, updateComment, deleteComment } from "@/lib/actions/comments";
import { renderCommentBody } from "@/lib/utils/mentions";
import { formatRelative } from "@/lib/utils/dates";
import { getInitials } from "@/lib/utils/format";
import { formatActivityAction } from "@/lib/utils/activities";
import type { CommentWithAuthor } from "@/lib/queries/comments";
import type { ActivityWithActor } from "@/lib/utils/activities";
import type { Tables } from "@/lib/types";

interface CommentThreadProps {
  issueId: string;
  workspaceId: string;
  members: {
    user_id: string;
    profile: {
      id: string;
      full_name: string | null;
      email: string;
      avatar_url: string | null;
    };
  }[];
}

type TimelineEntry =
  | { type: "comment"; data: CommentWithAuthor }
  | { type: "activity"; data: ActivityWithActor };

function getActivityIcon(activity: ActivityWithActor) {
  const meta = activity.metadata as Record<string, unknown>;
  const field = meta?.field as string | undefined;
  const changes = meta?.changes as Record<string, unknown> | undefined;

  if (activity.action === "created") return Plus;
  if (activity.action === "commented") return MessageSquare;
  if (field === "status" || changes?.status) return ArrowRight;
  if (field === "assignee" || changes?.assignee_id) return UserCheck;
  return Pencil;
}

export function CommentThread({
  issueId,
  workspaceId,
  members,
}: CommentThreadProps) {
  const [fetchedComments, setFetchedComments] = useState<CommentWithAuthor[]>([]);
  const [activities, setActivities] = useState<ActivityWithActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Get current user ID client-side
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
  }, []);

  // Fetch comments and activities client-side
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const supabase = createClient();

      const [commentsRes, activitiesRes] = await Promise.all([
        supabase
          .from("comments")
          .select("*")
          .eq("issue_id", issueId)
          .order("created_at", { ascending: true }),
        supabase
          .from("activities")
          .select("*")
          .eq("entity_type", "issue")
          .eq("entity_id", issueId)
          .order("created_at", { ascending: true }),
      ]);

      if (cancelled) return;

      // Enrich comments with author profiles
      const rawComments = (commentsRes.data ?? []) as Tables<"comments">[];
      const rawActivities = (activitiesRes.data ?? []) as Tables<"activities">[];

      // Batch fetch all needed profiles
      const profileIds = [
        ...new Set([
          ...rawComments.map((c) => c.author_id),
          ...rawActivities.map((a) => a.actor_id),
        ]),
      ];

      const profileMap = new Map<
        string,
        { id: string; full_name: string | null; email: string; avatar_url: string | null }
      >();

      if (profileIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", profileIds);
        for (const p of profiles ?? []) {
          profileMap.set(p.id, p);
        }
      }

      if (cancelled) return;

      setFetchedComments(
        rawComments.map((c) => ({
          ...c,
          author: profileMap.get(c.author_id) ?? null,
        }))
      );

      setActivities(
        rawActivities.map((a) => ({
          ...a,
          actor: profileMap.get(a.actor_id) ?? null,
          project_name: null,
        }))
      );

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [issueId]);

  // Real-time comments
  const { comments, setComments } = useRealtimeComments({
    issueId,
    initialComments: fetchedComments,
  });

  // Build interleaved timeline
  const timeline = useMemo<TimelineEntry[]>(() => {
    const entries: TimelineEntry[] = [
      // Filter out "commented" activities — they're redundant with actual comments
      ...activities
        .filter((a) => a.action !== "commented")
        .map((a) => ({ type: "activity" as const, data: a })),
      ...comments.map((c) => ({ type: "comment" as const, data: c })),
    ];
    entries.sort(
      (a, b) =>
        new Date(a.type === "comment" ? a.data.created_at : a.data.created_at).getTime() -
        new Date(b.type === "comment" ? b.data.created_at : b.data.created_at).getTime()
    );
    return entries;
  }, [activities, comments]);

  const handleCreateComment = useCallback(
    async (body: string) => {
      // Optimistic insert with current user's profile
      const currentMember = currentUserId
        ? members.find((m) => m.user_id === currentUserId)
        : null;
      const optimisticId = crypto.randomUUID();
      const optimistic: CommentWithAuthor = {
        id: optimisticId,
        workspace_id: workspaceId,
        issue_id: issueId,
        author_id: currentUserId ?? "",
        body,
        mentions: [],
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: currentMember?.profile ?? null,
      };
      setComments((prev) => [...prev, optimistic]);

      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      const result = await createComment({ issueId, workspaceId, body });
      if (result.error) {
        toast.error(result.error);
        // Remove optimistic comment on error
        setComments((prev) => prev.filter((c) => c.id !== optimisticId));
      } else {
        // Replace optimistic with real comment (realtime may also deliver it)
        setComments((prev) =>
          prev.map((c) =>
            c.id === optimisticId ? { ...optimistic, ...result.data, author: optimistic.author } : c
          )
        );
      }
    },
    [issueId, workspaceId, currentUserId, members, setComments]
  );

  const handleUpdateComment = useCallback(
    async (commentId: string, body: string) => {
      const result = await updateComment(commentId, body);
      if (result.error) {
        toast.error(result.error);
      }
      setEditingId(null);
    },
    []
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      const result = await deleteComment(commentId);
      if (result.error) {
        toast.error(result.error);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="py-4 text-center text-xs text-text-muted">
        Loading activity...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="space-y-0.5">
          {timeline.map((entry) => {
            if (entry.type === "activity") {
              const activity = entry.data;
              const Icon = getActivityIcon(activity);
              return (
                <div
                  key={`a-${activity.id}`}
                  className="flex items-center gap-2 py-1.5 text-[12px] text-text-muted"
                >
                  <Icon className="shrink-0 size-3 text-text-muted" />
                  <span className="truncate">
                    {formatActivityAction(activity)}
                  </span>
                  <span className="shrink-0 ml-auto text-[11px]">
                    {formatRelative(activity.created_at)}
                  </span>
                </div>
              );
            }

            const comment = entry.data;
            const isAuthor = currentUserId != null && comment.author_id === currentUserId;
            const authorName =
              comment.author?.full_name ??
              comment.author?.email ??
              "Unknown";

            if (editingId === comment.id) {
              return (
                <div key={`c-${comment.id}`} className="py-2">
                  <MentionInput
                    members={members}
                    initialValue={comment.body}
                    autoFocus
                    onSubmit={(body) =>
                      handleUpdateComment(comment.id, body)
                    }
                    onCancel={() => setEditingId(null)}
                    placeholder="Edit comment..."
                    submitLabel="Save"
                  />
                </div>
              );
            }

            return (
              <div
                key={`c-${comment.id}`}
                className="group flex gap-2.5 py-2.5"
              >
                <Avatar size="sm" className="shrink-0 mt-0.5">
                  <AvatarImage
                    src={comment.author?.avatar_url ?? undefined}
                    alt={authorName}
                  />
                  <AvatarFallback>
                    {getInitials(
                      comment.author?.full_name,
                      comment.author?.email
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-text">
                      {authorName}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {formatRelative(comment.created_at)}
                    </span>
                    {comment.is_edited && (
                      <span className="text-[11px] text-text-muted italic">
                        (edited)
                      </span>
                    )}
                    {isAuthor && (
                      <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setEditingId(comment.id)}
                          className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                        >
                          <Pencil className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 rounded text-text-muted hover:text-danger hover:bg-surface-hover transition-colors"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-text mt-0.5 whitespace-pre-wrap break-words">
                    {renderCommentBody(comment.body)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div ref={endRef} />

      {/* New comment input */}
      <MentionInput
        members={members}
        onSubmit={handleCreateComment}
        placeholder="Leave a comment... (@ to mention)"
      />
    </div>
  );
}
