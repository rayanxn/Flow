"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { completeSprint } from "@/lib/actions/sprints";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/types";

interface CompleteSprintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprint: Tables<"sprints">;
  totalIssues: number;
  doneIssues: number;
  incompleteIssues: number;
}

export function CompleteSprintModal({
  open,
  onOpenChange,
  sprint,
  totalIssues,
  doneIssues,
  incompleteIssues,
}: CompleteSprintModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await completeSprint(sprint.id);

    if ("error" in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    onOpenChange(false);
    router.refresh();
  }, [sprint.id, onOpenChange, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Complete {sprint.name}</DialogTitle>
          <DialogDescription>
            {doneIssues} of {totalIssues} issue{totalIssues !== 1 ? "s" : ""} completed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {incompleteIssues > 0 ? (
            <p className="text-sm text-text-secondary">
              {incompleteIssues} incomplete issue{incompleteIssues !== 1 ? "s" : ""} will
              be moved to the backlog.
            </p>
          ) : (
            <p className="text-sm text-success">All issues completed!</p>
          )}

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={loading}>
            {loading ? "Completing..." : "Complete Sprint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
