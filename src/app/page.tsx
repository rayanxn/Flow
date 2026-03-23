import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  // Check if user has a workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace:workspaces(slug)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (membership?.workspace) {
    const workspace = membership.workspace as { slug: string };
    redirect(`/${workspace.slug}/dashboard`);
  }

  redirect("/onboarding");
}
