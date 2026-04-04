"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Tables } from "@/lib/types";

interface ProfileSettingsFormProps {
  profile: Tables<"profiles">;
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: profile.notify_email,
    inApp: profile.notify_in_app,
    mentions: profile.notify_mentions,
    assignments: profile.notify_assignments,
  });

  const initials =
    profile.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? profile.email.slice(0, 2).toUpperCase();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData(e.currentTarget);
      formData.set("notifyEmail", String(notifications.email));
      formData.set("notifyInApp", String(notifications.inApp));
      formData.set("notifyMentions", String(notifications.mentions));
      formData.set("notifyAssignments", String(notifications.assignments));

      const result = await updateProfile(formData);

      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        router.refresh();
      }
      setLoading(false);
    },
    [notifications, router],
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold text-text leading-7">Profile</h1>
      <p className="text-[13px] text-text-muted mt-1 leading-[18px]">
        Manage your personal information and preferences.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[13px] font-medium text-text">
              {profile.full_name ?? "No name"}
            </p>
            <p className="text-[12px] text-text-muted mt-0.5">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-[13px] font-medium text-text block">
            Display name
          </label>
          <input
            id="profile-name"
            name="fullName"
            defaultValue={profile.full_name ?? ""}
            className="h-11 w-full rounded-[10px] border border-border-input bg-surface px-3.5 text-sm font-medium text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text block">Email</label>
          <div className="flex h-11 items-center rounded-[10px] border border-border-input bg-surface-inset px-3.5 text-sm text-text opacity-60">
            {profile.email}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="border-t border-border-subtle pt-4">
          <span className="tracking-[0.08em] text-text-muted text-[10px] font-mono font-medium opacity-50 uppercase">
            Notifications
          </span>

          <div className="mt-4 space-y-0">
            <ToggleRow
              label="Email notifications"
              description="Receive email updates for important activity"
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((n) => ({ ...n, email: checked }))
              }
            />
            <ToggleRow
              label="In-app notifications"
              description="Show notifications in the sidebar inbox"
              checked={notifications.inApp}
              onCheckedChange={(checked) =>
                setNotifications((n) => ({ ...n, inApp: checked }))
              }
            />
            <ToggleRow
              label="@mention alerts"
              description="Get notified when someone mentions you"
              checked={notifications.mentions}
              onCheckedChange={(checked) =>
                setNotifications((n) => ({ ...n, mentions: checked }))
              }
            />
            <ToggleRow
              label="Issue assignments"
              description="Get notified when an issue is assigned to you"
              checked={notifications.assignments}
              onCheckedChange={(checked) =>
                setNotifications((n) => ({ ...n, assignments: checked }))
              }
            />
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-success">Profile updated.</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-3.5 last:border-b-0">
      <div>
        <p className="text-[13px] font-medium text-text">{label}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
