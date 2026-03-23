"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/providers/workspace-provider";
import { createIssue } from "@/lib/actions/issues";
import type { IssueStatus } from "@/lib/types";

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
  const [loading, setLoading] = useState(false);

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
    formData.set("sortOrder", String(sortOrder));

    const result = await createIssue(formData);
    setLoading(false);

    if (!result.error) {
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

  function handleBlur() {
    // Delay to allow form submit to fire first
    setTimeout(() => {
      if (!loading) onClose();
    }, 150);
  }

  return (
    <form onSubmit={handleSubmit} className="p-1">
      <div className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <input
          ref={inputRef}
          type="text"
          placeholder="Issue title..."
          className="w-full text-sm text-text bg-transparent placeholder:text-text-muted outline-none"
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={loading}
        />
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
