"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateProject, deleteProject, archiveProject } from "@/lib/actions/projects";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import type { Tables } from "@/lib/types";

const PROJECT_COLORS = [
  "#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
  "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6", "#F97316",
];

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
            className="w-full h-11 rounded-[10px] px-3.5 bg-white border border-[#2E2E2C14] text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
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
            className="w-full rounded-[10px] py-3 px-3.5 bg-white border border-[#2E2E2C14] text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors resize-none"
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
            className="w-full h-11 rounded-[10px] px-3.5 bg-white border border-[#2E2E2C14] text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
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
              className="rounded-lg py-2 px-4 border border-[#2E2E2C14] text-[13px] font-medium text-text hover:bg-[#F6F5F1] transition-colors"
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
              className="rounded-lg py-2 px-4 border border-[#8B404940] text-[13px] font-medium text-[#C45A3C] hover:bg-[#8B404908] transition-colors"
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
