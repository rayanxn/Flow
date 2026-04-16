import { createClient } from "@/lib/supabase/server";
import { normalizeRedirectPath } from "@/lib/utils/redirect-path";

export async function getDefaultSignedInPath() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "/login";
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace:workspaces(slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const workspace = membership?.workspace as { slug: string } | null | undefined;
  if (workspace?.slug) {
    return `/${workspace.slug}/dashboard`;
  }

  return "/onboarding";
}

export async function resolvePostAuthRedirect(nextPath: string | null | undefined) {
  const safeNextPath = normalizeRedirectPath(nextPath);
  if (safeNextPath) {
    return safeNextPath;
  }

  return getDefaultSignedInPath();
}
