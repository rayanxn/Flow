"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptWorkspaceInvite } from "@/lib/actions/invites";
import { signOutTo } from "@/lib/actions/auth";

interface JoinInviteClientProps {
  code: string;
  joinPath: string;
  mismatch?: boolean;
}

export function JoinInviteClient({
  code,
  joinPath,
  mismatch = false,
}: JoinInviteClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);

    const result = await acceptWorkspaceInvite(code);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (!result.data) {
      setError("Unable to complete invite redemption.");
      setLoading(false);
      return;
    }

    router.push(`/${result.data.workspaceSlug}/dashboard`);
    router.refresh();
  }

  async function handleSwitchAccount() {
    setLoading(true);
    await signOutTo(joinPath);
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {mismatch ? (
        <button
          type="button"
          onClick={handleSwitchAccount}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Switching..." : "Sign out and switch account"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAccept}
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join workspace"}
        </button>
      )}
    </div>
  );
}
