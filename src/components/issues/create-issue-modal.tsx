"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useWorkspace } from "@/providers/workspace-provider";
import { createIssue } from "@/lib/actions/issues";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/utils/statuses";
import type { IssuePriority, IssueStatus } from "@/lib/types";

interface CreateIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectId?: string;
  defaultAssigneeId?: string;
  defaultStatus?: IssueStatus;
  projects?: { id: string; name: string; color: string }[];
  members?: { user_id: string; profile: { full_name: string | null; email: string } }[];
  sprints?: { id: string; name: string; status: string; project_id?: string }[];
  labels?: { id: string; name: string; color: string; project_id?: string }[];
  initialSortOrder?: number;
}

export function CreateIssueModal({
  open,
  onOpenChange,
  defaultProjectId,
  defaultAssigneeId,
  defaultStatus,
  projects = [],
  members = [],
  sprints = [],
  labels = [],
  initialSortOrder = 1000,
}: CreateIssueModalProps) {
  const router = useRouter();
  const { workspace } = useWorkspace();
  const [priority, setPriority] = useState<IssuePriority>(3);
  const [status, setStatus] = useState<IssueStatus>(defaultStatus ?? "todo");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(defaultProjectId ?? "");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; projectId?: string }>({});
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);

      // Custom validation
      const title = (formData.get("title") as string)?.trim();
      const projectId = formData.get("projectId") as string;
      const errors: { title?: string; projectId?: string } = {};
      if (!title) errors.title = "Title is required";
      if (!projectId) errors.projectId = "Please select a project";
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});

      setLoading(true);
      setError(null);
      formData.set("workspaceId", workspace.id);
      formData.set("priority", String(priority));
      formData.set("status", status);
      formData.set("labelIds", selectedLabels.join(","));
      formData.set("sortOrder", String(initialSortOrder));

      const result = await createIssue(formData);

      if ("error" in result && result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      onOpenChange(false);
      setPriority(3);
      setStatus(defaultStatus ?? "todo");
      setSelectedLabels([]);
      if ("data" in result && result.data) {
        toast.success(`Issue ${result.data.issue_key} created`);
      }
      router.refresh();
    },
    [workspace.id, priority, status, selectedLabels, defaultStatus, onOpenChange, router],
  );

  // Reset state on open
  useEffect(() => {
    if (open) {
      setPriority(3);
      setStatus(defaultStatus ?? "todo");
      setSelectedProjectId(defaultProjectId ?? "");
      setSelectedLabels([]);
      setError(null);
      setFieldErrors({});
      setShowLabelPicker(false);
    }
  }, [open]);

  function toggleLabel(labelId: string) {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  }

  function removeLabel(labelId: string) {
    setSelectedLabels((prev) => prev.filter((id) => id !== labelId));
  }

  const activeSprints = sprints.filter((s) => {
    const statusOk = s.status === "active" || s.status === "planning";
    const projectOk =
      !selectedProjectId || !s.project_id || s.project_id === selectedProjectId;
    return statusOk && projectOk;
  });

  const filteredLabels = labels.filter((l) => {
    return !selectedProjectId || !l.project_id || l.project_id === selectedProjectId;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>New Issue</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="issue-title">Title</Label>
              <Input
                id="issue-title"
                name="title"
                placeholder="Enter issue title..."
                autoFocus
                onChange={() => fieldErrors.title && setFieldErrors((prev) => ({ ...prev, title: undefined }))}
              />
              {fieldErrors.title && (
                <p className="text-sm text-danger">{fieldErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="issue-description">Description</Label>
              <textarea
                id="issue-description"
                name="description"
                placeholder="Add a description..."
                rows={3}
                className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors resize-none"
              />
            </div>

            {/* Assignee & Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="issue-assignee">Assignee</Label>
                <select
                  id="issue-assignee"
                  name="assigneeId"
                  className="flex h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
                  defaultValue={defaultAssigneeId ?? ""}
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.profile.full_name ?? m.profile.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Priority</Label>
                <div className="flex items-center gap-1">
                  {([0, 1, 2, 3] as IssuePriority[]).map((p) => {
                    const config = PRIORITY_CONFIG[p];
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                          priority === p
                            ? "text-white"
                            : "text-text-secondary bg-surface-hover hover:bg-border",
                        )}
                        style={
                          priority === p
                            ? { backgroundColor: config.color }
                            : undefined
                        }
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex items-center gap-1">
                {STATUS_ORDER.map((s) => {
                  const config = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                        status === s
                          ? "text-white"
                          : "text-text-secondary bg-surface-hover hover:bg-border",
                      )}
                      style={
                        status === s
                          ? { backgroundColor: config.color }
                          : undefined
                      }
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project & Sprint row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="issue-project">Project</Label>
                <select
                  id="issue-project"
                  name="projectId"
                  className="flex h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setSelectedLabels([]);
                    if (fieldErrors.projectId) setFieldErrors((prev) => ({ ...prev, projectId: undefined }));
                  }}
                >
                  <option value="" disabled>
                    Select project
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.projectId && (
                  <p className="text-sm text-danger">{fieldErrors.projectId}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issue-sprint">Sprint</Label>
                <select
                  id="issue-sprint"
                  name="sprintId"
                  className="flex h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
                  defaultValue=""
                >
                  <option value="">No sprint</option>
                  {activeSprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Story Points row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="issue-due-date">Due Date</Label>
                <Input
                  id="issue-due-date"
                  name="dueDate"
                  type="date"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issue-story-points">Story Points</Label>
                <Input
                  id="issue-story-points"
                  name="storyPoints"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-1.5">
              <Label>Labels</Label>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedLabels.map((labelId) => {
                  const label = filteredLabels.find((l) => l.id === labelId);
                  if (!label) return null;
                  return (
                    <span
                      key={labelId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface-hover border border-border text-text"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      {label.name}
                      <button
                        type="button"
                        onClick={() => removeLabel(labelId)}
                        className="ml-0.5 hover:text-danger transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLabelPicker(!showLabelPicker)}
                    className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                  >
                    + Add label
                  </button>
                  {showLabelPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                      {filteredLabels
                        .filter((l) => !selectedLabels.includes(l.id))
                        .map((label) => (
                          <button
                            key={label.id}
                            type="button"
                            onClick={() => {
                              toggleLabel(label.id);
                              setShowLabelPicker(false);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 w-full text-left text-sm hover:bg-surface-hover transition-colors"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: label.color }}
                            />
                            {label.name}
                          </button>
                        ))}
                      {filteredLabels.filter((l) => !selectedLabels.includes(l.id))
                        .length === 0 && (
                        <p className="px-3 py-1.5 text-xs text-text-muted">
                          No more labels
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Issue"}
              </Button>
              <span className="text-xs text-text-muted hidden sm:inline">
                <kbd className="px-1 py-0.5 rounded border border-border bg-surface-hover text-[10px]">
                  ⌘↵
                </kbd>{" "}
                to create
              </span>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
