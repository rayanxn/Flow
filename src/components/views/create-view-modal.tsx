"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createView } from "@/lib/actions/views";
import type { ViewFilters, IssueStatus, IssuePriority } from "@/lib/types";
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

export function CreateViewModal({
  workspaceId,
  workspaceSlug,
}: {
  workspaceId: string;
  workspaceSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<IssueStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<IssuePriority[]>([]);
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

  function handleSubmit() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError(null);
    const filters: ViewFilters = {};
    if (selectedStatuses.length > 0) filters.status = selectedStatuses;
    if (selectedPriorities.length > 0) filters.priority = selectedPriorities;

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
        setName("");
        setDescription("");
        setSelectedStatuses([]);
        setSelectedPriorities([]);
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
        <div className="flex flex-col gap-4">
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
