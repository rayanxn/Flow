"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/utils/statuses";
import { formatDate } from "@/lib/utils/dates";
import { updateIssue } from "@/lib/actions/issues";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { IssuePriority, IssueStatus } from "@/lib/types";

interface IssueDetailModalProps {
  issue: IssueWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members?: { user_id: string; profile: { full_name: string | null; email: string } }[];
}

export function IssueDetailModal({
  issue,
  open,
  onOpenChange,
  members = [],
}: IssueDetailModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueStatus>("todo");
  const [priority, setPriority] = useState<IssuePriority>(3);
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [storyPoints, setStoryPoints] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Sync state when issue changes
  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description ?? "");
      setStatus(issue.status as IssueStatus);
      setPriority(issue.priority as IssuePriority);
      setAssigneeId(issue.assignee_id ?? "");
      setDueDate(issue.due_date ?? "");
      setStoryPoints(issue.story_points != null ? String(issue.story_points) : "");
    }
  }, [issue]);

  const save = useCallback(
    async (updates: Parameters<typeof updateIssue>[1]) => {
      if (!issue) return;
      setSaving(true);
      const result = await updateIssue(issue.id, updates);
      setSaving(false);
      if (result.error) {
        toast.error(result.error);
      } else {
        router.refresh();
      }
    },
    [issue, router]
  );

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted bg-surface-hover px-2 py-0.5 rounded">
              {issue.issue_key}
            </span>
            {issue.project && (
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: issue.project.color }}
                />
                {issue.project.name}
              </span>
            )}
          </div>
          <DialogTitle className="sr-only">{issue.issue_key}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title !== issue.title && title.trim()) {
                save({ title: title.trim() });
              }
            }}
            className="text-lg font-semibold text-text w-full bg-transparent border-none outline-none focus:ring-0 px-0"
            placeholder="Issue title"
          />

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary">Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                const newDesc = description.trim() || null;
                if (newDesc !== (issue.description ?? null)) {
                  save({ description: newDesc });
                }
              }}
              placeholder="Add a description..."
              rows={3}
              className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-text-secondary">Status</Label>
            <div className="flex items-center gap-1">
              {STATUS_ORDER.map((s) => {
                const config = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatus(s);
                      save({ status: s });
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      status === s
                        ? "text-white"
                        : "text-text-secondary bg-surface-hover hover:bg-border"
                    )}
                    style={
                      status === s ? { backgroundColor: config.color } : undefined
                    }
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority & Assignee row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-text-secondary">Priority</Label>
              <div className="flex items-center gap-1">
                {([0, 1, 2, 3] as IssuePriority[]).map((p) => {
                  const config = PRIORITY_CONFIG[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPriority(p);
                        save({ priority: p });
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                        priority === p
                          ? "text-white"
                          : "text-text-secondary bg-surface-hover hover:bg-border"
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

            <div className="space-y-1.5">
              <Label className="text-text-secondary">Assignee</Label>
              <select
                value={assigneeId}
                onChange={(e) => {
                  setAssigneeId(e.target.value);
                  save({ assignee_id: e.target.value || null });
                }}
                className="flex h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile.full_name ?? m.profile.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Story Points row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-text-secondary">Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  save({ due_date: e.target.value || null });
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-text-secondary">Story Points</Label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                onBlur={() => {
                  const pts = storyPoints ? Number(storyPoints) : null;
                  if (pts !== issue.story_points) {
                    save({ story_points: pts });
                  }
                }}
              />
            </div>
          </div>

          {/* Labels */}
          {issue.labels.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-text-secondary">Labels</Label>
              <div className="flex flex-wrap gap-1.5">
                {issue.labels.map((label) => (
                  <span
                    key={label.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface-hover border border-border text-text"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer metadata */}
          <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-text-muted">
            <span>Created {formatDate(issue.created_at)}</span>
            {saving && <span className="text-text-secondary">Saving...</span>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
