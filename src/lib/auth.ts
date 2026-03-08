import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

function getUserMetadataValue(user: User, key: "avatar_url" | "full_name" | "name") {
  const value = user.user_metadata[key];

  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

async function ensureUserProfile(supabase: SupabaseClient<Database>, user: User) {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (profile) {
    return;
  }

  if (!user.email) {
    throw new Error("Your account is missing an email address.");
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    full_name: getUserMetadataValue(user, "full_name") ?? getUserMetadataValue(user, "name"),
    avatar_url: getUserMetadataValue(user, "avatar_url"),
  });

  if (insertError) {
    if (insertError.code === "42501") {
      throw new Error(
        "Your account profile is missing. Apply the latest Supabase migrations, then sign in again."
      );
    }

    throw new Error(insertError.message);
  }
}

export async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("You must be signed in to manage boards.");
  }

  await ensureUserProfile(supabase, user);

  return { supabase, user };
}
