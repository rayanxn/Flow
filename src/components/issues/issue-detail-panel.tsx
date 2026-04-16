"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Copy, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { PRIORITY_CONFIG } from "@/lib/utils/priorities";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/utils/statuses";
import { formatDate } from "@/lib/utils/dates";
import { updateIssue } from "@/lib/actions/issues";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/format";
import { TiptapEditor } from "./tiptap-editor";
import { IssueChecklist } from "./issue-checklist";
import { CommentThread } from "./comment-thread";
import { CreateIssueModal } from "./create-issue-modal";
import { ParentIssuePicker } from "./parent-issue-picker";
import type { ChecklistItem } from "./issue-checklist";
import type { IssueWithDetails } from "@/lib/queries/issues";
import { getSubIssuesClient } from "@/lib/queries/issues-client";
import type { ParentIssueSearchResult } from "@/lib/queries/search";
import type { IssuePriority, IssueStatus } from "@/lib/types";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// ─── Types ───────────────────────────────────────────────────

interface IssueDetailPanelProps {
  issue: IssueWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members?: {
    user_id: string;
    profile: { full_name: string | null; email: string };
  }[];
  sprints?: { id: string; name: string; status: string; project_id?: string }[];
  labels?: { id: string; name: string; color: string; project_id?: string }[];
  onIssueNavigate?: (issueId: string) => void;
  syncUrl?: boolean;
}

function toParentIssueValue(
  issue: IssueWithDetails | null,
): ParentIssueSearchResult | null {
  if (!issue?.parent) return null;

  return {
    id: issue.parent.id,
    issue_key: issue.parent.issue_key,
    title: issue.parent.title,
    project_id: issue.project_id,
    sprint_id: null,
  };
}

// ─── Component ───────────────────────────────────────────────

export function IssueDetailPanel({
  issue,
  open,
  onOpenChange,
  members = [],
  sprints = [],
  labels = [],
  onIssueNavigate,
  syncUrl = true,
}: IssueDetailPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Local field state ──────────────────────────────────────
  const [title, setTitle] = useState(issue?.title ?? "");
  const [description, setDescription] = useState(issue?.description ?? "");
  const [status, setStatus] = useState<IssueStatus>(
    (issue?.status as IssueStatus) ?? "todo",
  );
  const [priority, setPriority] = useState<IssuePriority>(
    (issue?.priority as IssuePriority) ?? 3,
  );
  const [assigneeId, setAssigneeId] = useState(issue?.assignee_id ?? "");
  const [dueDate, setDueDate] = useState(issue?.due_date ?? "");
  const [storyPoints, setStoryPoints] = useState(
    issue?.story_points != null ? String(issue.story_points) : "",
  );
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const raw = issue?.checklist as unknown;
    return Array.isArray(raw) ? (raw as ChecklistItem[]) : [];
  });
  const [parentIssue, setParentIssue] = useState<ParentIssueSearchResult | null>(
    toParentIssueValue(issue),
  );
  const [subIssues, setSubIssues] = useState<IssueWithDetails[]>([]);
  const [createSubIssueOpen, setCreateSubIssueOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Track current issue id to avoid stale saves
  const issueRef = useRef(issue);
  useEffect(() => {
    issueRef.current = issue;
  }, [issue]);

  useEffect(() => {
    if (!open || !issue || issue.parent_id) {
      return;
    }

    let cancelled = false;

    getSubIssuesClient(issue.id)
      .then((items) => {
        if (cancelled) return;
        setSubIssues(items);
      })
      .catch(() => {
        if (cancelled) return;
        setSubIssues([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open, issue, createSubIssueOpen]);

  // ── URL sync ───────────────────────────────────────────────
  useEffect(() => {
    if (!syncUrl) return;
    const currentParam = searchParams.get("issue");

    if (open && issue) {
      if (currentParam !== issue.issue_key) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("issue", issue.issue_key);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else if (!open && currentParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("issue");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [open, issue, syncUrl, pathname, searchParams, router]);

  // ── Save helper ────────────────────────────────────────────
  const save = useCallback(
    async (updates: Parameters<typeof updateIssue>[1]) => {
      const current = issueRef.current;
      if (!current) return { error: "Issue not found" };
      setSaving(true);
      const result = await updateIssue(current.id, updates);
      setSaving(false);
      if (result.error) {
        toast.error(result.error);
      } else {
        router.refresh();
      }
      return result;
    },
    [router]
  );

  // ── Copy permalink ─────────────────────────────────────────
  const copyPermalink = useCallback(() => {
    if (!issue) return;
    const url = `${window.location.origin}${pathname}?issue=${issue.issue_key}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied");
    });
  }, [issue, pathname]);

  // ── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isEditable =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;
      if (isEditable) return;

      if (e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        const p = (Number(e.key) - 1) as IssuePriority;
        setPriority(p);
        save({ priority: p });
        return;
      }

      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setStatus((prev) => {
          const idx = STATUS_ORDER.indexOf(prev);
          const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
          save({ status: next });
          return next;
        });
        return;
      }

      if ((e.key === "c" || e.key === "C") && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        copyPermalink();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, save, copyPermalink]);

  const hasSubIssues =
    subIssues.length > 0 || (issue?.sub_issues_count ?? 0) > 0;
  const subIssueDoneCount =
    subIssues.length > 0
      ? subIssues.filter((subIssue) => subIssue.status === "done").length
      : issue?.sub_issues_done_count ?? 0;
  const subIssueTotalCount =
    subIssues.length > 0 ? subIssues.length : issue?.sub_issues_count ?? 0;
  const subIssueStoryPoints =
    subIssues.length > 0
      ? subIssues.reduce((sum, subIssue) => sum + (subIssue.story_points ?? 0), 0)
      : issue?.sub_issues_story_points ?? 0;
  const canCreateSubIssues = Boolean(issue && !issue.parent_id && issue.project);

  async function handleParentChange(nextParent: ParentIssueSearchResult | null) {
    if (nextParent?.id === parentIssue?.id) {
      return;
    }
    if (!nextParent && !parentIssue) {
      return;
    }
    const result = await save({ parent_id: nextParent?.id ?? null });
    if (!result?.error) {
      setParentIssue(nextParent);
    }
  }

  if (!issue) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[55vw] sm:max-w-[900px] sm:min-w-[600px]"
      >
        <DialogPrimitive.Title className="sr-only">
          {issue.issue_key}: {issue.title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          Issue detail panel for {issue.issue_key}
        </DialogPrimitive.Description>

        {/* ─── Header ────────────────────────────────────── */}
        <SheetHeader onClose={() => onOpenChange(false)}>
          <span className="text-xs font-mono text-text-muted bg-surface-hover px-2 py-0.5 rounded">
            {issue.issue_key}
          </span>
          {issue.project && (
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: issue.project.color }}
              />
              {issue.project.name}
            </span>
          )}
          <div className="flex-1" />
          {/* Copy link */}
          <button
            onClick={copyPermalink}
            title="Copy link (C)"
            className="shrink-0 rounded-md p-1 text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </SheetHeader>

        {/* ─── Body ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row">
            {/* ── Left: Content ──────────────────────────── */}
            <div className="flex-1 min-w-0 px-6 py-5 space-y-6">
              {/* Title */}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (title !== issue.title && title.trim()) {
                    save({ title: title.trim() });
                  }
                }}
                className="text-xl font-semibold text-text w-full bg-transparent border-none outline-none focus:ring-0 px-0"
                placeholder="Issue title"
              />

              {/* Description — rich text */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Description
                </label>
                <TiptapEditor
                  content={description}
                  onUpdate={(html) => {
                    setDescription(html);
                    // Normalize empty editor
                    const cleaned =
                      html === "<p></p>" || html === "" ? null : html;
                    const prev = issue.description ?? null;
                    if (cleaned !== prev) {
                      save({ description: cleaned });
                    }
                  }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Checklist
                </label>
                <IssueChecklist
                  items={checklist}
                  onUpdate={(items) => {
                    setChecklist(items);
                    save({ checklist: items });
                  }}
                />
              </div>

              {canCreateSubIssues && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <label className="text-xs font-medium text-text-secondary">
                        Sub-Issues
                      </label>
                      <p className="mt-1 text-xs text-text-muted">
                        {`${subIssueDoneCount}/${subIssueTotalCount} sub-issues done`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreateSubIssueOpen(true)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text transition-colors hover:bg-surface-hover"
                    >
                      <Plus className="size-3.5" />
                      Add sub-issue
                    </button>
                  </div>

                  {subIssues.length > 0 ? (
                    <div className="space-y-2">
                      {subIssues.map((subIssue) => {
                        const statusConfig =
                          STATUS_CONFIG[subIssue.status as IssueStatus];
                        return (
                          <button
                            key={subIssue.id}
                            type="button"
                            onClick={() => onIssueNavigate?.(subIssue.id)}
                            disabled={!onIssueNavigate}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-left transition-colors",
                              onIssueNavigate
                                ? "hover:bg-surface-hover"
                                : "cursor-default",
                            )}
                          >
                            <span
                              className="size-2 shrink-0 rounded-full"
                              style={{ backgroundColor: statusConfig?.color }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[11px] font-mono text-text-muted">
                                {subIssue.issue_key}
                              </div>
                              <div className="truncate text-sm text-text">
                                {subIssue.title}
                              </div>
                            </div>
                            {subIssue.assignee && (
                              <Avatar size="sm" className="size-7 text-[10px]">
                                {subIssue.assignee.avatar_url && (
                                  <AvatarImage
                                    src={subIssue.assignee.avatar_url}
                                    alt={subIssue.assignee.full_name ?? ""}
                                  />
                                )}
                                <AvatarFallback>
                                  {getInitials(
                                    subIssue.assignee.full_name,
                                    subIssue.assignee.email,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border bg-surface px-3 py-4 text-sm text-text-muted">
                      No sub-issues yet.
                    </div>
                  )}
                </div>
              )}

              {/* Comments & Activity */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Activity
                </label>
                <CommentThread
                  issueId={issue.id}
                  workspaceId={issue.workspace_id}
                  members={members.map((m) => ({
                    user_id: m.user_id,
                    profile: {
                      id: m.user_id,
                      full_name: m.profile.full_name,
                      email: m.profile.email,
                      avatar_url: null,
                    },
                  }))}
                />
              </div>
            </div>

            {/* ── Right: Sidebar ─────────────────────────── */}
            <div className="sm:w-[240px] shrink-0 border-t sm:border-t-0 sm:border-l border-border px-5 py-5 space-y-5 bg-surface-hover/30">
              {/* Status */}
              <SidebarField label="Status" shortcut="S">
                <div className="flex flex-wrap gap-1">
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
                          "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                          status === s
                            ? "text-background"
                            : "text-text-secondary bg-surface-hover hover:bg-border"
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
              </SidebarField>

              {/* Priority */}
              <SidebarField label="Priority" shortcut="1-4">
                <div className="flex gap-1">
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
                          "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                          priority === p
                            ? "text-background"
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
              </SidebarField>

              {/* Assignee */}
              <SidebarField label="Assignee">
                <select
                  value={assigneeId}
                  onChange={(e) => {
                    setAssigneeId(e.target.value);
                    save({ assignee_id: e.target.value || null });
                  }}
                  className="flex h-8 w-full rounded-lg border border-border bg-surface px-2.5 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.profile.full_name ?? m.profile.email}
                    </option>
                  ))}
                </select>
              </SidebarField>

              {/* Due Date */}
              <SidebarField label="Due Date">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    save({ due_date: e.target.value || null });
                  }}
                  className="h-8 text-xs"
                />
              </SidebarField>

              <SidebarField label="Parent Issue">
                {parentIssue && (
                  <button
                    type="button"
                    onClick={() => onIssueNavigate?.(parentIssue.id)}
                    disabled={!onIssueNavigate}
                    className={cn(
                      "flex w-full flex-col items-start rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition-colors",
                      onIssueNavigate ? "hover:bg-surface-hover" : "cursor-default",
                    )}
                  >
                    <span className="text-[11px] font-mono text-text-muted">
                      {parentIssue.issue_key}
                    </span>
                    <span className="line-clamp-1 text-xs text-text">
                      {parentIssue.title}
                    </span>
                  </button>
                )}
                {!hasSubIssues ? (
                  <ParentIssuePicker
                    projectId={issue.project_id}
                    value={parentIssue}
                    onChange={handleParentChange}
                    excludeIssueId={issue.id}
                    placeholder="Search same-project parents..."
                  />
                ) : (
                  <p className="text-xs text-text-muted">
                    Remove this issue&apos;s sub-issues before assigning it to a parent.
                  </p>
                )}
              </SidebarField>

              {/* Story Points */}
              <SidebarField label="Story Points">
                <div className="space-y-1.5">
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
                    className="h-8 text-xs"
                  />
                  {hasSubIssues && (
                    <p className="text-[11px] text-text-muted">
                      {subIssueStoryPoints} pts from sub-issues
                    </p>
                  )}
                </div>
              </SidebarField>

              {/* Labels */}
              {issue.labels.length > 0 && (
                <SidebarField label="Labels">
                  <div className="flex flex-wrap gap-1">
                    {issue.labels.map((label) => (
                      <span
                        key={label.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-hover border border-border text-text"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </span>
                    ))}
                  </div>
                </SidebarField>
              )}

              {/* Metadata */}
              <div className="pt-3 border-t border-border space-y-1 text-[11px] text-text-muted">
                <div>Created {formatDate(issue.created_at)}</div>
                {issue.updated_at !== issue.created_at && (
                  <div>Updated {formatDate(issue.updated_at)}</div>
                )}
                {saving && (
                  <div className="text-text-secondary">Saving...</div>
                )}
              </div>

              {/* Keyboard hints */}
              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <span className="font-mono bg-surface-hover px-1 rounded">1</span>-<span className="font-mono bg-surface-hover px-1 rounded">4</span>{" "}
                  priority{" · "}
                  <span className="font-mono bg-surface-hover px-1 rounded">S</span>{" "}
                  status{" · "}
                  <span className="font-mono bg-surface-hover px-1 rounded">C</span>{" "}
                  copy link
                </p>
              </div>
            </div>
          </div>
        </div>

        {issue.project && (
          <CreateIssueModal
            open={createSubIssueOpen}
            onOpenChange={setCreateSubIssueOpen}
            defaultProjectId={issue.project_id}
            defaultParentIssue={{
              id: issue.id,
              issue_key: issue.issue_key,
              title: issue.title,
              project_id: issue.project_id,
              sprint_id: issue.sprint_id,
            }}
            projects={[issue.project]}
            members={members}
            sprints={sprints}
            labels={labels}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Sidebar field wrapper ───────────────────────────────────

function SidebarField({
  label,
  shortcut,
  children,
}: {
  label: string;
  shortcut?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wide">
          {label}
        </label>
        {shortcut && (
          <span className="text-[10px] font-mono text-text-muted bg-surface-hover px-1 rounded">
            {shortcut}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
