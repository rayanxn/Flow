"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";
import {
  createActivity,
  createNotificationsForActivity,
} from "@/lib/actions/activities";
import { parseMentions } from "@/lib/utils/mentions";

export async function createComment({
  issueId,
  workspaceId,
  body,
}: {
  issueId: string;
  workspaceId: string;
  body: string;
}): Promise<ActionResponse<Tables<"comments">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Comment body is required" };

  const mentions = parseMentions(trimmed);

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      workspace_id: workspaceId,
      issue_id: issueId,
      author_id: user.id,
      body: trimmed,
      mentions,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  try {
    // Fetch issue metadata for activity/notification context
    const { data: issue } = await supabase
      .from("issues")
      .select("title, issue_key, project_id, assignee_id, created_by")
      .eq("id", issueId)
      .single();

    const activity = await createActivity({
      supabase,
      workspaceId,
      actorId: user.id,
      action: "commented",
      entityType: "issue",
      entityId: issueId,
      metadata: {
        title: issue?.title,
        issue_key: issue?.issue_key,
        project_id: issue?.project_id,
        comment_id: comment.id,
        comment_preview: trimmed.slice(0, 100),
      },
    });

    // Notify assignee + issue creator
    const commentRecipients: string[] = [];
    if (issue?.assignee_id) commentRecipients.push(issue.assignee_id);
    if (issue?.created_by) commentRecipients.push(issue.created_by);

    if (commentRecipients.length > 0) {
      await createNotificationsForActivity({
        supabase,
        workspaceId,
        actorId: user.id,
        activityId: activity.id,
        recipientIds: commentRecipients,
        type: "comment",
      });
    }

    // Notify mentioned users separately
    if (mentions.length > 0) {
      await createNotificationsForActivity({
        supabase,
        workspaceId,
        actorId: user.id,
        activityId: activity.id,
        recipientIds: mentions,
        type: "mention",
      });
    }
  } catch {
    // Activity/notification logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data: comment };
}

export async function updateComment(
  commentId: string,
  body: string
): Promise<ActionResponse<Tables<"comments">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Comment body is required" };

  const mentions = parseMentions(trimmed);

  const { data, error } = await supabase
    .from("comments")
    .update({
      body: trimmed,
      mentions,
      is_edited: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("author_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteComment(
  commentId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { data: undefined };
}
