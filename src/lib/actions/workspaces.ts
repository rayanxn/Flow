"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";
import { createActivity } from "@/lib/actions/activities";
import { createWorkspaceLinkInvite } from "@/lib/actions/invites";

export async function createWorkspace(
  formData: FormData
): Promise<ActionResponse<Tables<"workspaces">>> {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const teamSize = formData.get("teamSize") as string | null;

  if (!name || !slug) {
    return { error: "Workspace name and URL are required" };
  }

  const slugPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  if (slug.length < 3 || !slugPattern.test(slug)) {
    return {
      error:
        "URL must be at least 3 characters, lowercase letters, numbers, and hyphens only",
    };
  }

  const { data, error } = await supabase.rpc("create_workspace", {
    p_name: name,
    p_slug: slug,
    p_team_size: teamSize,
  });

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return { error: "This workspace URL is already taken" };
    }
    return { error: error.message };
  }

  return { data: data as Tables<"workspaces"> };
}

export async function createProject(
  formData: FormData
): Promise<ActionResponse<Tables<"projects">>> {
  const supabase = await createClient();

  const workspaceId = formData.get("workspaceId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const color = formData.get("color") as string | null;
  const teamId = formData.get("teamId") as string | null;
  const leadId = formData.get("leadId") as string | null;
  const isPrivate = formData.get("isPrivate") === "true";

  if (!workspaceId || !name) {
    return { error: "Project name is required" };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      workspace_id: workspaceId,
      name,
      description: description || null,
      color: color || "#6B7280",
      team_id: teamId || null,
      lead_id: leadId || null,
      is_private: isPrivate,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Create default labels
  const defaultLabels = [
    { name: "Bug", color: "#DC2626" },
    { name: "Feature", color: "#7C3AED" },
    { name: "Design", color: "#D97706" },
    { name: "Backend", color: "#2563EB" },
    { name: "Ops", color: "#059669" },
    { name: "Blocked", color: "#DC2626" },
  ];

  await supabase.from("labels").insert(
    defaultLabels.map((label) => ({
      project_id: data.id,
      ...label,
    }))
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: membership } = await supabase
        .from("workspace_members")
        .select("id, primary_project_id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership && !membership.primary_project_id) {
        await supabase
          .from("workspace_members")
          .update({ primary_project_id: data.id })
          .eq("id", membership.id);
      }

      await createActivity({
        supabase,
        workspaceId,
        actorId: user.id,
        action: "created",
        entityType: "project",
        entityId: data.id,
        metadata: { name, project_id: data.id },
      });
    }
  } catch {
    // Activity logging should not block the primary operation
  }

  return { data };
}

export async function createWorkspaceInvite(
  workspaceId: string,
  role: "admin" | "member" = "member"
): Promise<ActionResponse<Tables<"workspace_invites">>> {
  if (role === "admin") {
    return { error: "Admin invites must be created as targeted email invites" };
  }

  const result = await createWorkspaceLinkInvite(workspaceId);
  if (result.error) {
    return result;
  }

  if (!result.data) {
    return { error: "Unable to create invite link" };
  }

  return { data: result.data.invite };
}

export async function updateWorkspace(
  workspaceId: string,
  formData: FormData
): Promise<ActionResponse<Tables<"workspaces">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updates: Record<string, unknown> = {};

  const name = formData.get("name") as string | null;
  const timezone = formData.get("timezone") as string | null;
  const defaultSprintLength = formData.get("defaultSprintLength") as string | null;
  const issuePrefix = formData.get("issuePrefix") as string | null;

  if (name) updates.name = name;
  if (timezone) updates.timezone = timezone;
  if (defaultSprintLength) updates.default_sprint_length = Number(defaultSprintLength);
  if (issuePrefix) updates.issue_prefix = issuePrefix.toUpperCase();

  const { data, error } = await supabase
    .from("workspaces")
    .update(updates)
    .eq("id", workspaceId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  try {
    await createActivity({
      supabase,
      workspaceId,
      actorId: user.id,
      action: "updated",
      entityType: "workspace",
      entityId: workspaceId,
      metadata: { name: data.name, changes: updates },
    });
  } catch {
    // Activity logging should not block the primary operation
  }

  revalidatePath("/", "layout");
  return { data };
}

export async function deleteWorkspace(
  workspaceId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify caller is owner
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.role !== "owner") {
    return { error: "Only the workspace owner can delete the workspace" };
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function updateMemberRole(
  memberId: string,
  role: "admin" | "member"
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch the target member to get workspace_id
  const { data: targetMember } = await supabase
    .from("workspace_members")
    .select("workspace_id, user_id, role")
    .eq("id", memberId)
    .single();

  if (!targetMember) return { error: "Member not found" };

  if (targetMember.role === "owner") {
    return { error: "Cannot change the owner's role" };
  }

  // Verify caller is owner or admin
  const { data: callerMembership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", targetMember.workspace_id)
    .eq("user_id", user.id)
    .single();

  if (!callerMembership || callerMembership.role === "member") {
    return { error: "Only owners and admins can change roles" };
  }

  const { error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("id", memberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function removeMember(
  memberId: string
): Promise<ActionResponse<void>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Fetch the target member
  const { data: targetMember } = await supabase
    .from("workspace_members")
    .select("workspace_id, user_id, role")
    .eq("id", memberId)
    .single();

  if (!targetMember) return { error: "Member not found" };

  if (targetMember.role === "owner") {
    return { error: "Cannot remove the workspace owner" };
  }

  // Verify caller is owner/admin or self-removing
  const isSelf = targetMember.user_id === user.id;
  if (!isSelf) {
    const { data: callerMembership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", targetMember.workspace_id)
      .eq("user_id", user.id)
      .single();

    if (!callerMembership || callerMembership.role === "member") {
      return { error: "Only owners and admins can remove members" };
    }
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function finishOnboarding(
  workspaceSlug: string,
  projectId?: string,
): Promise<void> {
  if (projectId) {
    redirect(`/${workspaceSlug}/projects/${projectId}/board`);
  }

  redirect(`/${workspaceSlug}/dashboard`);
}
