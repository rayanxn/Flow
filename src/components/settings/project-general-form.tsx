"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateProject, deleteProject, archiveProject } from "@/lib/actions/projects";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import type { Tables } from "@/lib/types";
import { PROJECT_COLORS } from "@/lib/constants/colors";

type Member = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

interface ProjectGeneralFormProps {
  project: Tables<"projects">;
  members: Member[];
  workspaceSlug: string;
}

export function ProjectGeneralForm({
  project,
  members,
  workspaceSlug,
}: ProjectGeneralFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedColor, setSelectedColor] = useState(project.color);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData(e.currentTarget);
      formData.set("color", selectedColor);

      const result = await updateProject(project.id, formData);

      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        router.refresh();
      }
      setLoading(false);
    },
    [project.id, selectedColor, router],
  );

  const handleDelete = useCallback(async () => {
    setDeleteLoading(true);
    await deleteProject(project.id);
    setDeleteLoading(false);
    router.push(`/${workspaceSlug}/projects`);
  }, [project.id, router, workspaceSlug]);

  const handleArchive = useCallback(async () => {
    await archiveProject(project.id);
    router.push(`/${workspaceSlug}/projects`);
  }, [project.id, router, workspaceSlug]);

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2">
        <span
          className="rounded-full size-2.5 shrink-0"
          style={{ backgroundColor: selectedColor }}
        />
        <h1 className="text-[22px] font-semibold text-text leading-7">General</h1>
      </div>
      <p className="text-[13px] text-text-muted mt-1 leading-[18px]">
        Configure project settings and details.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="proj-name" className="text-[13px] font-medium text-text block">
            Project name
          </label>
          <input
            id="proj-name"
            name="name"
            defaultValue={project.name}
            required
            className="h-11 w-full rounded-[10px] border border-border-input bg-surface px-3.5 text-sm font-medium text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="proj-desc" className="text-[13px] font-medium text-text block">
            Description
          </label>
          <textarea
            id="proj-desc"
            name="description"
            defaultValue={project.description ?? ""}
            rows={3}
            className="w-full resize-none rounded-[10px] border border-border-input bg-surface py-3 px-3.5 text-sm text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Project Lead */}
        <div className="space-y-1.5">
          <label htmlFor="proj-lead" className="text-[13px] font-medium text-text block">
            Project lead
          </label>
          <select
            id="proj-lead"
            name="leadId"
            defaultValue={project.lead_id ?? ""}
            className="h-11 w-full rounded-[10px] border border-border-input bg-surface px-3.5 text-sm font-medium text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/10"
          >
            <option value="">No lead</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.profile.full_name ?? m.profile.email}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text block">Color</label>
          <div className="flex items-center gap-2">
            {PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`size-7 rounded-full transition-all ${selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : "hover:scale-110"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-success">Settings saved.</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-12 border-t border-border-subtle pt-8">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-danger opacity-60">
          Danger Zone
        </span>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-text">Archive project</p>
              <p className="text-[12px] text-text-muted mt-0.5">
                Hide this project from the sidebar and views.
              </p>
            </div>
            <button
              type="button"
              onClick={handleArchive}
              className="rounded-lg border border-border-input px-4 py-2 text-[13px] font-medium text-text transition-colors hover:bg-surface-hover"
            >
              Archive
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-text">Delete project</p>
              <p className="text-[12px] text-text-muted mt-0.5">
                Permanently delete this project and all its issues.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg border border-danger-muted/40 px-4 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger-muted/8"
            >
              Delete project
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`This will permanently delete "${project.name}" and all its issues, sprints, and labels. This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmLabel="Delete project"
      />
    </div>
  );
}
