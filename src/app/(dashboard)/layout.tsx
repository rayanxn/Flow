import { redirect } from "next/navigation";

import Navbar from "@/components/shared/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100/70">
      <Navbar userEmail={user.email ?? "Signed-in user"} />
      <main className="flex min-h-[calc(100vh-3rem)] flex-col">{children}</main>
    </div>
  );
}
