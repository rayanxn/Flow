"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createView } from "@/lib/actions/views";
import type { ViewFilters, IssueStatus, IssuePriority } from "@/lib/types";
import type { WorkspaceMember } from "@/lib/queries/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";

const STATUSES: IssueStatus[] = ["todo", "in_progress", "in_review", "done"];
const PRIORITIES: IssuePriority[] = [0, 1, 2, 3];

interface CreateViewModalProps {
  workspaceId: string;
  workspaceSlug: string;
  members?: WorkspaceMember[];
  projects?: { id: string; name: string; color: string }[];
}

export function CreateViewModal({
  workspaceId,
  workspaceSlug,
  members = [],
  projects = [],
}: CreateViewModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<IssueStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<IssuePriority[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleStatus(status: IssueStatus) {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }

  function togglePriority(priority: IssuePriority) {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  }

  function toggleAssignee(userId: string) {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  function toggleProject(projectId: string) {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  }

  function resetForm() {
    setName("");
    setDescription("");
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedAssignees([]);
    setSelectedProjects([]);
    setDueDateFrom("");
    setDueDateTo("");
    setError(null);
  }

  function handleSubmit() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError(null);
    const filters: ViewFilters = {};
    if (selectedStatuses.length > 0) filters.status = selectedStatuses;
    if (selectedPriorities.length > 0) filters.priority = selectedPriorities;
    if (selectedAssignees.length > 0) filters.assignee_ids = selectedAssignees;
    if (selectedProjects.length > 0) filters.project_ids = selectedProjects;
    if (dueDateFrom || dueDateTo) {
      filters.due_date_range = {};
      if (dueDateFrom) filters.due_date_range.from = dueDateFrom;
      if (dueDateTo) filters.due_date_range.to = dueDateTo;
    }

    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("name", name.trim());
    formData.set("description", description.trim());
    formData.set("filters", JSON.stringify(filters));

    startTransition(async () => {
      const result = await createView(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setOpen(false);
        resetForm();
        router.push(`/${workspaceSlug}/views/${result.data.id}`);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New View</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create View</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="view-name">Name</Label>
            <Input
              id="view-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High Priority Bugs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="view-description">Description</Label>
            <Input
              id="view-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: STATUS_CONFIG[status].color }}
                  />
                  {STATUS_CONFIG[status].label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedPriorities.includes(priority)}
                    onCheckedChange={() => togglePriority(priority)}
                  />
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: PRIORITY_CONFIG[priority].color }}
                  />
                  {PRIORITY_CONFIG[priority].label}
                </label>
              ))}
            </div>
          </div>

          {members.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Assignee</Label>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <label
                    key={member.user_id}
                    className="flex items-center gap-1.5 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedAssignees.includes(member.user_id)}
                      onCheckedChange={() => toggleAssignee(member.user_id)}
                    />
                    {member.profile.full_name ?? member.profile.email}
                  </label>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Project</Label>
              <div className="flex flex-wrap gap-2">
                {projects.map((project) => (
                  <label
                    key={project.id}
                    className="flex items-center gap-1.5 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                    <span
                      className="inline-block size-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Due Date Range</Label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dueDateFrom}
                onChange={(e) => setDueDateFrom(e.target.value)}
                className="flex-1"
                placeholder="From"
              />
              <span className="text-xs text-text-muted">to</span>
              <Input
                type="date"
                value={dueDateTo}
                onChange={(e) => setDueDateTo(e.target.value)}
                className="flex-1"
                placeholder="To"
              />
            </div>
          </div>

          {error && <p className="text-sm text-status-error">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Creating..." : "Create View"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
