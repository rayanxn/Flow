"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { IssueRow } from "./issue-row";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/utils/statuses";
import type { IssueStatus } from "@/lib/types";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface IssueListProps {
  issues: IssueWithDetails[];
  showProject?: boolean;
  onIssueClick?: (id: string) => void;
}

export function IssueList({ issues, showProject = true, onIssueClick }: IssueListProps) {
  // Group issues by status
  const grouped = new Map<IssueStatus, IssueWithDetails[]>();
  for (const status of STATUS_ORDER) {
    grouped.set(status, []);
  }
  for (const issue of issues) {
    const group = grouped.get(issue.status as IssueStatus);
    if (group) {
      group.push(issue);
    }
  }

  // Only show groups that have issues
  const activeGroups = STATUS_ORDER.filter(
    (status) => (grouped.get(status)?.length ?? 0) > 0
  );

  return (
    <div className="space-y-4 sm:space-y-0">
      {/* Column headers */}
      <div className="hidden items-center gap-3 border-b border-border px-6 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted sm:flex">
        <div className="w-4 shrink-0" />
        <span className="w-[72px] shrink-0">ID</span>
        <span className="flex-1">Title</span>
        {showProject && <span className="w-[140px] shrink-0">Project</span>}
        <span className="w-[72px] text-center shrink-0">Priority</span>
        <span className="w-[72px] text-right shrink-0">Due</span>
      </div>

      {activeGroups.map((status) => (
        <StatusGroup
          key={status}
          status={status}
          issues={grouped.get(status) ?? []}
          showProject={showProject}
          onIssueClick={onIssueClick}
        />
      ))}
    </div>
  );
}

function StatusGroup({
  status,
  issues,
  showProject,
  onIssueClick,
}: {
  status: IssueStatus;
  issues: IssueWithDetails[];
  showProject: boolean;
  onIssueClick?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(status !== "done");
  const config = STATUS_CONFIG[status];

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 transition-colors hover:bg-surface-hover sm:rounded-none sm:px-6"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        )}
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-sm font-medium text-text">{config.label}</span>
        <span className="text-xs text-text-muted">{issues.length}</span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 px-4 pb-1 sm:block sm:px-0 sm:pb-0">
          {issues.map((issue) => (
            <IssueRow
              key={issue.id}
              id={issue.id}
              issueKey={issue.issue_key}
              title={issue.title}
              project={issue.project}
              priority={issue.priority}
              dueDate={issue.due_date}
              status={issue.status}
              showProject={showProject}
              onClick={onIssueClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
