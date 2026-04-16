"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";
import { buildAuthRedirectUrl, normalizeRedirectPath } from "@/lib/utils/redirect-path";
import {
  resolvePostAuthRedirect,
} from "@/lib/utils/auth-redirect";

export async function signUp(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nextPath = formData.get("next") as string | null;

  if (!email || !password || !fullName) {
    return { error: "All fields are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(await resolvePostAuthRedirect(nextPath));
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nextPath = formData.get("next") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(await resolvePostAuthRedirect(nextPath));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signOutTo(nextPath: string | null | undefined): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(buildAuthRedirectUrl("/login", nextPath));
}

export async function forgotPassword(
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { data: undefined };
}

export async function resetPassword(
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient();

  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function signInWithOAuth(
  provider: "google" | "github",
  nextPath?: string | null,
) {
  const supabase = await createClient();
  const redirectUrl = new URL("/callback", process.env.NEXT_PUBLIC_APP_URL);
  const safeNextPath = normalizeRedirectPath(nextPath);

  if (safeNextPath) {
    redirectUrl.searchParams.set("next", safeNextPath);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl.toString(),
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}
