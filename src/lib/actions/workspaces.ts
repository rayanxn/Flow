"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Tables } from "@/lib/types";

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

  return { data };
}

export async function createWorkspaceInvite(
  workspaceId: string,
  role: "admin" | "member" = "member"
): Promise<ActionResponse<Tables<"workspace_invites">>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("workspace_invites")
    .insert({
      workspace_id: workspaceId,
      role,
      created_by: user.id,
      expires_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function finishOnboarding(workspaceSlug: string): Promise<void> {
  redirect(`/${workspaceSlug}/dashboard`);
}
