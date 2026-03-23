"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSprint } from "@/lib/actions/sprints";
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

interface CreateSprintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  workspaceId: string;
}

export function CreateSprintModal({
  open,
  onOpenChange,
  projectId,
  workspaceId,
}: CreateSprintModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set("workspaceId", workspaceId);
      formData.set("projectId", projectId);

      const result = await createSprint(formData);

      if ("error" in result && result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      onOpenChange(false);
      router.refresh();
    },
    [workspaceId, projectId, onOpenChange, router],
  );

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>New Sprint</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Sprint Name */}
            <div className="space-y-1.5">
              <Label htmlFor="sprint-name">Sprint Name</Label>
              <Input
                id="sprint-name"
                name="name"
                placeholder="e.g. Sprint 25"
                required
                autoFocus
              />
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sprint-start-date">Start Date</Label>
                <Input
                  id="sprint-start-date"
                  name="startDate"
                  type="date"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sprint-end-date">End Date</Label>
                <Input
                  id="sprint-end-date"
                  name="endDate"
                  type="date"
                />
              </div>
            </div>

            {/* Capacity & Sprint Goal */}
            <div className="space-y-1.5">
              <Label htmlFor="sprint-capacity">Capacity (story points)</Label>
              <Input
                id="sprint-capacity"
                name="capacity"
                type="number"
                min={0}
                placeholder="e.g. 24"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sprint-goal">Sprint Goal</Label>
              <textarea
                id="sprint-goal"
                name="goal"
                placeholder="What does this sprint aim to accomplish?"
                rows={3}
                className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors resize-none"
              />
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Sprint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
