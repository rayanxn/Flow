"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables, IssueStatus } from "@/lib/types";

export async function createIssue(
  formData: FormData
): Promise<ActionResponse<Tables<"issues">>> {
  const supabase = await createClient();

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

  revalidatePath("/", "layout");
  return { data: data as Tables<"issues"> };
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

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteIssue(
  issueId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  // Delete labels first
  await supabase.from("issue_labels").delete().eq("issue_id", issueId);

  const { error } = await supabase.from("issues").delete().eq("id", issueId);

  if (error) {
    return { error: error.message };
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
