"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspace } from "@/providers/workspace-provider";
import { createIssue } from "@/lib/actions/issues";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { cn } from "@/lib/utils/cn";
import type { IssueStatus, IssuePriority } from "@/lib/types";

interface BoardQuickAddProps {
  projectId: string;
  status: IssueStatus;
  sortOrder: number;
  onClose: () => void;
  onCreated: () => void;
}

export function BoardQuickAdd({
  projectId,
  status,
  sortOrder,
  onClose,
  onCreated,
}: BoardQuickAddProps) {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState<IssuePriority>(3);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = inputRef.current?.value.trim();
    if (!title) {
      onClose();
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.set("workspaceId", workspace.id);
    formData.set("projectId", projectId);
    formData.set("title", title);
    formData.set("status", status);
    formData.set("priority", String(priority));
    formData.set("sortOrder", String(sortOrder));

    const result = await createIssue(formData);
    setLoading(false);

    if (!result.error && "data" in result && result.data) {
      toast.success(`Issue ${result.data.issue_key} created`);
      onCreated();
      router.refresh();
    }
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  function handleBlur(e: React.FocusEvent) {
    // Don't close if focus moved to another element within the form
    if (formRef.current?.contains(e.relatedTarget as Node)) return;
    setTimeout(() => {
      if (!loading) onClose();
    }, 150);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onBlur={handleBlur} className="p-1">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <input
          ref={inputRef}
          type="text"
          placeholder="Issue title..."
          className="w-full text-sm text-text bg-transparent placeholder:text-text-muted outline-none"
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <div className="flex items-center gap-1 mt-2">
          {([0, 1, 2, 3] as IssuePriority[]).map((p) => {
            const config = PRIORITY_CONFIG[p];
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors",
                  priority === p
                    ? "text-background"
                    : "text-text-muted bg-surface-hover hover:bg-border",
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
        <div className="flex items-center justify-end mt-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-xs font-medium text-primary bg-surface-hover px-2 py-1 rounded border border-border hover:bg-border transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}
