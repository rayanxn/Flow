"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createLabel, updateLabel, deleteLabel } from "@/lib/actions/labels";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import type { Tables } from "@/lib/types";

const LABEL_COLORS = [
  "#DC2626", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
  "#EC4899", "#6366F1", "#059669", "#D97706", "#7C3AED",
];

interface ProjectLabelsEditorProps {
  projectId: string;
  initialLabels: Tables<"labels">[];
}

export function ProjectLabelsEditor({
  projectId,
  initialLabels,
}: ProjectLabelsEditorProps) {
  const router = useRouter();
  const [labels, setLabels] = useState(initialLabels);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(LABEL_COLORS[0]);
  const [addLoading, setAddLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [deletingLabel, setDeletingLabel] = useState<Tables<"labels"> | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    if (!newName.trim()) return;
    setAddLoading(true);
    setError(null);

    const result = await createLabel(projectId, newName, newColor);
    if ("error" in result && result.error) {
      setError(result.error);
    } else if ("data" in result && result.data) {
      setLabels((prev) => [...prev, result.data]);
      setNewName("");
      setNewColor(LABEL_COLORS[0]);
    }
    setAddLoading(false);
  }, [projectId, newName, newColor]);

  const handleStartEdit = useCallback((label: Tables<"labels">) => {
    setEditingId(label.id);
    setEditName(label.name);
    setEditColor(label.color);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId || !editName.trim()) return;

    const result = await updateLabel(editingId, { name: editName, color: editColor });
    if ("data" in result && result.data) {
      setLabels((prev) =>
        prev.map((l) => (l.id === editingId ? result.data : l)),
      );
    }
    setEditingId(null);
  }, [editingId, editName, editColor]);

  const handleDelete = useCallback(async () => {
    if (!deletingLabel) return;
    setDeleteLoading(true);
    await deleteLabel(deletingLabel.id);
    setLabels((prev) => prev.filter((l) => l.id !== deletingLabel.id));
    setDeleteLoading(false);
    setDeletingLabel(null);
  }, [deletingLabel]);

  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold text-text leading-7">Labels</h1>
      <p className="text-[13px] text-text-muted mt-1 leading-[18px]">
        Manage labels for categorizing issues in this project.
      </p>

      {/* Add label */}
      <div className="mt-8 flex items-center gap-3">
        <div className="flex items-center gap-2">
          {LABEL_COLORS.slice(0, 6).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setNewColor(color)}
              className={`size-5 rounded-full transition-all ${newColor === color ? "ring-2 ring-offset-1 ring-primary" : "hover:scale-110"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Label name..."
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-9 flex-1 rounded-lg border border-border-input bg-surface px-3 text-sm text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={addLoading || !newName.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {addLoading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {/* Label list */}
      <div className="mt-6 space-y-1">
        {labels.map((label) => (
          <div
            key={label.id}
            className="group flex items-center gap-3 rounded-lg py-2.5 px-3 transition-colors hover:bg-surface-hover"
          >
            {editingId === label.id ? (
              <>
                <div className="flex items-center gap-1.5">
                  {LABEL_COLORS.slice(0, 6).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditColor(color)}
                      className={`size-4 rounded-full transition-all ${editColor === color ? "ring-2 ring-offset-1 ring-primary" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  autoFocus
                  className="h-8 flex-1 rounded-md border border-border-input bg-surface px-2 text-sm text-text focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="text-[12px] font-medium text-text hover:text-primary transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-[12px] text-text-muted hover:text-text transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="flex-1 text-[13px] font-medium text-text">
                  {label.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleStartEdit(label)}
                  className="text-[12px] text-text-muted hover:text-text transition-colors opacity-40 group-hover:opacity-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingLabel(label)}
                  className="text-text-muted opacity-40 transition-opacity group-hover:opacity-100 hover:text-danger"
                >
                  <X className="size-3.5" />
                </button>
              </>
            )}
          </div>
        ))}

        {labels.length === 0 && (
          <p className="py-8 text-center text-[13px] text-text-muted">
            No labels yet. Add one above.
          </p>
        )}
      </div>

      <DeleteConfirmationModal
        open={!!deletingLabel}
        onOpenChange={(open) => !open && setDeletingLabel(null)}
        title="Delete label?"
        description={`"${deletingLabel?.name}" will be removed from all issues that use it.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmLabel="Delete label"
      />
    </div>
  );
}
