import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types";

export async function getUserProfile(
  userId: string
): Promise<Tables<"profiles"> | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}
