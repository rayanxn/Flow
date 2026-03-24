"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables, IssueStatus } from "@/lib/types";
import {
  createActivity,
  createNotificationsForActivity,
} from "@/lib/actions/activities";

export async function createIssue(
  formData: FormData
): Promise<ActionResponse<Tables<"issues">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const workspaceId = formData.get("workspaceId") as string;
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const status = (formData.get("status") as string) || "todo";
  const priority = Number(formData.get("priority") ?? 3);
  const assigneeId = (formData.get("assigneeId") as string) || null;
  const sprintId = (formData.get("sprintId") as string) || null;
  const dueDate = (formData.get("dueDate") as string) || null;
  const storyPoints = formData.get("storyPoints")
    ? Number(formData.get("storyPoints"))
    : null;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const labelIdsRaw = formData.get("labelIds") as string;
  const labelIds = labelIdsRaw ? labelIdsRaw.split(",").filter(Boolean) : [];

  if (!workspaceId || !projectId || !title) {
    return { error: "Workspace, project, and title are required" };
  }

  const { data, error } = await supabase.rpc("create_issue", {
    p_workspace_id: workspaceId,
    p_project_id: projectId,
    p_title: title,
    p_description: description,
    p_status: status,
    p_priority: priority,
    p_assignee_id: assigneeId,
    p_sprint_id: sprintId,
    p_due_date: dueDate,
    p_story_points: storyPoints,
    p_sort_order: sortOrder,
    p_label_ids: labelIds,
  });

  if (error) {
    return { error: error.message };
  }

  const issue = data as Tables<"issues">;

  try {
    const activity = await createActivity({
      supabase,
      workspaceId,
      actorId: user.id,
      action: "created",
      entityType: "issue",
      entityId: issue.id,
      metadata: {
        title,
        issue_key: issue.issue_key,
        project_id: projectId,
        status,
        priority,
        assignee_id: assigneeId,
      },
    });

    if (assigneeId) {
      await createNotificationsForActivity({
        supabase,
        workspaceId,
        actorId: user.id,
        activityId: activity.id,
        recipientIds: [assigneeId],
        type: "assigned",
      });
    }
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data: issue };
}

export async function updateIssue(
  issueId: string,
  updates: {
    title?: string;
    description?: string | null;
    status?: IssueStatus;
    priority?: number;
    assignee_id?: string | null;
    sprint_id?: string | null;
    due_date?: string | null;
    story_points?: number | null;
    sort_order?: number;
  }
): Promise<ActionResponse<Tables<"issues">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Set completed_at when moving to done
  const updateData: Record<string, unknown> = { ...updates };
  if (updates.status === "done") {
    updateData.completed_at = new Date().toISOString();
  } else if (updates.status) {
    updateData.completed_at = null;
  }

  const { data, error } = await supabase
    .from("issues")
    .update(updateData)
    .eq("id", issueId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    const activity = await createActivity({
      supabase,
      workspaceId: data.workspace_id,
      actorId: user.id,
      action: "updated",
      entityType: "issue",
      entityId: issueId,
      metadata: {
        title: data.title,
        issue_key: data.issue_key,
        project_id: data.project_id,
        changes: updates,
      },
    });

    const recipients: string[] = [];
    let notifType: "status_change" | "assigned" = "status_change";

    if (updates.status && data.assignee_id) {
      recipients.push(data.assignee_id);
      notifType = "status_change";
    }

    if (updates.assignee_id) {
      recipients.push(updates.assignee_id);
      notifType = "assigned";
    }

    if (recipients.length > 0) {
      await createNotificationsForActivity({
        supabase,
        workspaceId: data.workspace_id,
        actorId: user.id,
        activityId: activity.id,
        recipientIds: recipients,
        type: notifType,
      });
    }
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteIssue(
  issueId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch issue metadata before deleting
  const { data: issue } = await supabase
    .from("issues")
    .select("workspace_id, project_id, title, issue_key, assignee_id")
    .eq("id", issueId)
    .single();

  // Delete labels first
  await supabase.from("issue_labels").delete().eq("issue_id", issueId);

  const { error } = await supabase.from("issues").delete().eq("id", issueId);

  if (error) {
    return { error: error.message };
  }

  if (issue) {
    try {
      const activity = await createActivity({
        supabase,
        workspaceId: issue.workspace_id,
        actorId: user.id,
        action: "deleted",
        entityType: "issue",
        entityId: issueId,
        metadata: {
          title: issue.title,
          issue_key: issue.issue_key,
          project_id: issue.project_id,
        },
      });

      if (issue.assignee_id) {
        await createNotificationsForActivity({
          supabase,
          workspaceId: issue.workspace_id,
          actorId: user.id,
          activityId: activity.id,
          recipientIds: [issue.assignee_id],
          type: "general",
        });
      }
    } catch {
      // Activity logging should not block the primary operation
    }
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function updateIssueLabels(
  issueId: string,
  labelIds: string[]
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  // Remove existing labels
  await supabase.from("issue_labels").delete().eq("issue_id", issueId);

  // Add new labels
  if (labelIds.length > 0) {
    const { error } = await supabase.from("issue_labels").insert(
      labelIds.map((labelId) => ({
        issue_id: issueId,
        label_id: labelId,
      }))
    );

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}
