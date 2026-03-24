"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateWorkspace, deleteWorkspace } from "@/lib/actions/workspaces";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import type { Tables } from "@/lib/types";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
];

const SPRINT_LENGTHS = [
  { value: 7, label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 21, label: "3 weeks" },
  { value: 28, label: "4 weeks" },
];

interface WorkspaceGeneralFormProps {
  workspace: Tables<"workspaces">;
}

export function WorkspaceGeneralForm({ workspace }: WorkspaceGeneralFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData(e.currentTarget);
      const result = await updateWorkspace(workspace.id, formData);

      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
      setLoading(false);
    },
    [workspace.id],
  );

  const handleDelete = useCallback(async () => {
    setDeleteLoading(true);
    await deleteWorkspace(workspace.id);
    setDeleteLoading(false);
  }, [workspace.id]);

  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold text-text leading-7">General</h1>
      <p className="text-[13px] text-text-muted mt-1 leading-[18px]">
        Manage your workspace settings and preferences.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Workspace Name */}
        <div className="space-y-1.5">
          <label htmlFor="ws-name" className="text-[13px] font-medium text-text block">
            Workspace name
          </label>
          <input
            id="ws-name"
            name="name"
            defaultValue={workspace.name}
            className="w-full h-11 rounded-[10px] px-3.5 bg-white border border-[#2E2E2C14] text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
          />
        </div>

        {/* Workspace URL (read-only) */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text block">
            Workspace URL
          </label>
          <div className="flex items-center h-11 rounded-[10px] px-3.5 bg-[#F6F5F1] border border-[#2E2E2C14] text-sm text-text-muted">
            flowboard.app/{workspace.slug}
          </div>
          <p className="text-[11px] text-text-muted opacity-60">
            Workspace URL cannot be changed after creation.
          </p>
        </div>

        {/* Issue Prefix */}
        <div className="space-y-1.5">
          <label htmlFor="ws-prefix" className="text-[13px] font-medium text-text block">
            Issue prefix
          </label>
          <input
            id="ws-prefix"
            name="issuePrefix"
            defaultValue={workspace.issue_prefix}
            maxLength={6}
            className="w-32 h-11 rounded-[10px] px-3.5 bg-white border border-[#2E2E2C14] text-sm font-mono font-medium text-text uppercase focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
          />
        </div>

        {/* Timezone */}
        <div className="space-y-1.5">
          <label htmlFor="ws-tz" className="text-[13px] font-medium text-text block">
            Timezone
          </label>
          <select
            id="ws-tz"
            name="timezone"
            defaultValue={workspace.timezone}
            className="w-full h-11 rounded-[10px] px-3.5 bg-white border border-[#2E2E2C14] text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        {/* Default Sprint Length */}
        <div className="space-y-1.5">
          <label htmlFor="ws-sprint" className="text-[13px] font-medium text-text block">
            Default sprint length
          </label>
          <select
            id="ws-sprint"
            name="defaultSprintLength"
            defaultValue={workspace.default_sprint_length}
            className="w-full h-11 rounded-[10px] px-3.5 bg-white border border-[#2E2E2C14] text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
          >
            {SPRINT_LENGTHS.map((sl) => (
              <option key={sl.value} value={sl.value}>{sl.label}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-green-600">Settings saved.</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg py-2.5 px-6 bg-[#2E2E2C] text-white text-[13px] font-medium hover:bg-[#1E1E1C] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-12 pt-8 border-t border-[#2E2E2C0F]">
        <span className="tracking-[0.08em] text-[#C45A3C] text-[10px] font-mono font-medium opacity-60 uppercase">
          Danger Zone
        </span>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-text">Delete workspace</p>
            <p className="text-[12px] text-text-muted mt-0.5">
              Permanently delete this workspace and all its data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-lg py-2 px-4 border border-[#8B404940] text-[13px] font-medium text-[#C45A3C] hover:bg-[#8B404908] transition-colors"
          >
            Delete workspace
          </button>
        </div>
      </div>

      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete workspace?"
        description={`This will permanently delete "${workspace.name}" and all its projects, issues, and data. This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmLabel="Delete workspace"
      />
    </div>
  );
}
