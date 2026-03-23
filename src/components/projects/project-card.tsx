"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Settings, Link2, Archive, Trash2 } from "lucide-react";
import { formatRelative } from "@/lib/utils/dates";
import { STATUS_CONFIG } from "@/lib/utils/statuses";
import { archiveProject, deleteProject } from "@/lib/actions/projects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IssueStatus } from "@/lib/types";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
  color: string;
  lead: { full_name: string | null; email: string } | null;
  issueCounts: Record<IssueStatus, number>;
  totalIssues: number;
  updatedAt: string;
  workspaceSlug: string;
}

const BAR_ORDER: IssueStatus[] = ["done", "in_progress", "in_review", "todo"];

export function ProjectCard({
  id,
  name,
  description,
  color,
  lead,
  issueCounts,
  totalIssues,
  updatedAt,
  workspaceSlug,
}: ProjectCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [copied, setCopied] = useState(false);

  const leadName = lead?.full_name?.split(" ")[0] ?? lead?.email?.split("@")[0] ?? null;
  const leadInitial = lead?.full_name?.[0]?.toUpperCase() ?? lead?.email?.[0]?.toUpperCase() ?? "?";
  const projectUrl = `/${workspaceSlug}/projects/${id}/board`;

  async function handleCopyLink() {
    const fullUrl = `${window.location.origin}${projectUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleArchive() {
    setArchiving(true);
    await archiveProject(id);
    setArchiving(false);
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteProject(id);
    setDeleting(false);
    setShowDeleteDialog(false);
    router.refresh();
  }

  return (
    <>
      <a
        href={projectUrl}
        className="block bg-surface rounded-lg border border-border p-5 hover:border-border-strong transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-semibold text-text truncate">{name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lead && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-border-strong flex items-center justify-center">
                  <span className="text-[10px] font-medium text-text-secondary">
                    {leadInitial}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">{leadName}</span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-secondary transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <DropdownMenuItem
                  onSelect={() => {
                    router.push(`/${workspaceSlug}/projects/${id}/settings`);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2 text-text-muted" />
                  Edit project
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleCopyLink}>
                  <Link2 className="w-4 h-4 mr-2 text-text-muted" />
                  {copied ? "Copied!" : "Copy link"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleArchive}
                  disabled={archiving}
                >
                  <Archive className="w-4 h-4 mr-2 text-text-muted" />
                  {archiving ? "Archiving..." : "Archive"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteDialog(true)}
                  className="text-danger focus:text-danger"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Progress bar */}
        {totalIssues > 0 && (
          <div className="flex h-1.5 rounded-full overflow-hidden bg-background mb-3">
            {BAR_ORDER.map((status) => {
              const count = issueCounts[status];
              if (count === 0) return null;
              const pct = (count / totalIssues) * 100;
              return (
                <div
                  key={status}
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: STATUS_CONFIG[status].color,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>
            {totalIssues} {totalIssues === 1 ? "issue" : "issues"}
          </span>
          <span>Updated {formatRelative(updatedAt)}</span>
        </div>
      </a>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{name}</strong>? This will
              permanently remove the project and all its issues. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
