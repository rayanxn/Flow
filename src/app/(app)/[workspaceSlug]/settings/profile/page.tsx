import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/queries/profile";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (!profile) redirect("/login");

  return <ProfileSettingsForm profile={profile} />;
}
