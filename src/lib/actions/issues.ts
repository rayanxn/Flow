"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables, IssueStatus } from "@/lib/types";
import {
  createActivity,
  createNotificationsForActivity,
} from "@/lib/actions/activities";

type IssueRecord = Tables<"issues">;
type HierarchyIssueSummary = Pick<
  IssueRecord,
  | "id"
  | "workspace_id"
  | "project_id"
  | "issue_key"
  | "title"
  | "sprint_id"
  | "assignee_id"
  | "parent_id"
>;

async function validateParentIssue(
  supabase: Awaited<ReturnType<typeof createClient>>,
  {
    parentId,
    workspaceId,
    projectId,
    issueId,
  }: {
    parentId: string | null;
    workspaceId: string;
    projectId: string;
    issueId?: string;
  }
): Promise<ActionResponse<HierarchyIssueSummary | null>> {
  if (!parentId) {
    return { data: null };
  }

  if (issueId && parentId === issueId) {
    return { error: "An issue cannot be its own parent" };
  }

  const { data: parent, error: parentError } = await supabase
    .from("issues")
    .select(
      "id, workspace_id, project_id, issue_key, title, sprint_id, assignee_id, parent_id",
    )
    .eq("id", parentId)
    .maybeSingle();

  if (parentError || !parent) {
    return { error: "Parent issue not found" };
  }

  if (parent.workspace_id !== workspaceId) {
    return { error: "Parent issue must belong to the same workspace" };
  }

  if (parent.project_id !== projectId) {
    return { error: "Parent issue must belong to the same project" };
  }

  if (parent.parent_id) {
    return { error: "Sub-issues cannot be nested more than one level deep" };
  }

  if (issueId) {
    const { count, error: childCountError } = await supabase
      .from("issues")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", issueId);

    if (childCountError) {
      return { error: childCountError.message };
    }

    if ((count ?? 0) > 0) {
      return {
        error: "Parent issues must be top-level before they can be assigned to another parent",
      };
    }
  }

  return { data: parent };
}

async function createHierarchyActivities({
  supabase,
  workspaceId,
  actorId,
  projectId,
  action,
  childIssue,
  parentIssue,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  workspaceId: string;
  actorId: string;
  projectId: string;
  action: "added_sub_issue" | "removed_from_parent";
  childIssue: Pick<IssueRecord, "id" | "issue_key" | "title">;
  parentIssue: Pick<IssueRecord, "id" | "issue_key" | "title" | "assignee_id">;
}) {
  const metadata = {
    project_id: projectId,
    child_issue_id: childIssue.id,
    child_issue_key: childIssue.issue_key,
    child_title: childIssue.title,
    parent_issue_id: parentIssue.id,
    parent_issue_key: parentIssue.issue_key,
    parent_title: parentIssue.title,
  };

  const [parentActivity, childActivity] = await Promise.all([
    createActivity({
      supabase,
      workspaceId,
      actorId,
      action,
      entityType: "issue",
      entityId: parentIssue.id,
      metadata: {
        ...metadata,
        issue_key: parentIssue.issue_key,
        title: parentIssue.title,
      },
    }),
    createActivity({
      supabase,
      workspaceId,
      actorId,
      action,
      entityType: "issue",
      entityId: childIssue.id,
      metadata: {
        ...metadata,
        issue_key: childIssue.issue_key,
        title: childIssue.title,
      },
    }),
  ]);

  if (action === "added_sub_issue" && parentIssue.assignee_id) {
    await createNotificationsForActivity({
      supabase,
      workspaceId,
      actorId,
      activityId: parentActivity.id,
      recipientIds: [parentIssue.assignee_id],
      type: "general",
    });
  }

  return { parentActivity, childActivity };
}

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
  const parentId = (formData.get("parentId") as string) || null;
  const labelIdsRaw = formData.get("labelIds") as string;
  const labelIds = labelIdsRaw ? labelIdsRaw.split(",").filter(Boolean) : [];

  if (!workspaceId || !projectId || !title) {
    return { error: "Workspace, project, and title are required" };
  }

  const parentResult = await validateParentIssue(supabase, {
    parentId,
    workspaceId,
    projectId,
  });
  if (parentResult.error) {
    return { error: parentResult.error };
  }

  const resolvedParent = parentResult.data;
  const resolvedSprintId = resolvedParent
    ? resolvedParent.sprint_id ?? null
    : sprintId;

  const { data, error } = await supabase.rpc("create_issue", {
    p_workspace_id: workspaceId,
    p_project_id: projectId,
    p_title: title,
    p_description: description,
    p_status: status,
    p_priority: priority,
    p_assignee_id: assigneeId,
    p_sprint_id: resolvedSprintId,
    p_due_date: dueDate,
    p_story_points: storyPoints,
    p_sort_order: sortOrder,
    p_label_ids: labelIds,
    p_parent_id: resolvedParent?.id ?? null,
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
        parent_issue_id: resolvedParent?.id ?? null,
        parent_issue_key: resolvedParent?.issue_key ?? null,
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

    if (resolvedParent) {
      await createHierarchyActivities({
        supabase,
        workspaceId,
        actorId: user.id,
        projectId,
        action: "added_sub_issue",
        childIssue: {
          id: issue.id,
          issue_key: issue.issue_key,
          title: issue.title,
        },
        parentIssue: resolvedParent,
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
    parent_id?: string | null;
    sprint_id?: string | null;
    due_date?: string | null;
    story_points?: number | null;
    sort_order?: number;
    checklist?: { id: string; text: string; completed: boolean }[];
  }
): Promise<ActionResponse<Tables<"issues">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: currentIssue, error: currentIssueError } = await supabase
    .from("issues")
    .select(
      "id, workspace_id, project_id, issue_key, title, assignee_id, parent_id",
    )
    .eq("id", issueId)
    .single();

  if (currentIssueError || !currentIssue) {
    return { error: currentIssueError?.message ?? "Issue not found" };
  }

  let previousParent: HierarchyIssueSummary | null = null;
  if (currentIssue.parent_id) {
    const { data: parent } = await supabase
      .from("issues")
      .select(
        "id, workspace_id, project_id, issue_key, title, sprint_id, assignee_id, parent_id",
      )
      .eq("id", currentIssue.parent_id)
      .maybeSingle();
    previousParent = parent ?? null;
  }

  let nextParent: HierarchyIssueSummary | null | undefined;
  if (updates.parent_id !== undefined) {
    const parentResult = await validateParentIssue(supabase, {
      parentId: updates.parent_id,
      workspaceId: currentIssue.workspace_id,
      projectId: currentIssue.project_id,
      issueId,
    });
    if (parentResult.error) {
      return { error: parentResult.error };
    }
    nextParent = parentResult.data;
  }

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
        changes: updateData,
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

    if (updates.parent_id !== undefined && previousParent?.id !== nextParent?.id) {
      if (previousParent) {
        await createHierarchyActivities({
          supabase,
          workspaceId: data.workspace_id,
          actorId: user.id,
          projectId: data.project_id,
          action: "removed_from_parent",
          childIssue: {
            id: data.id,
            issue_key: data.issue_key,
            title: data.title,
          },
          parentIssue: previousParent,
        });
      }

      if (nextParent) {
        await createHierarchyActivities({
          supabase,
          workspaceId: data.workspace_id,
          actorId: user.id,
          projectId: data.project_id,
          action: "added_sub_issue",
          childIssue: {
            id: data.id,
            issue_key: data.issue_key,
            title: data.title,
          },
          parentIssue: nextParent,
        });
      }
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
