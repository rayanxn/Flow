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
  treeMode?: boolean;
}

type TreeRow = {
  issue: IssueWithDetails;
  depth: number;
  hasChildren: boolean;
};

export function IssueList({
  issues,
  showProject = true,
  onIssueClick,
  treeMode = false,
}: IssueListProps) {
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  const toggleParent = (issueId: string) => {
    setExpandedParents((prev) => ({ ...prev, [issueId]: !prev[issueId] }));
  };

  if (treeMode) {
    const issueMap = new Map(issues.map((issue) => [issue.id, issue]));
    const childMap = new Map<string, IssueWithDetails[]>();

    for (const issue of issues) {
      if (!issue.parent_id || !issueMap.has(issue.parent_id)) continue;
      const children = childMap.get(issue.parent_id) ?? [];
      children.push(issue);
      childMap.set(issue.parent_id, children);
    }

    for (const children of childMap.values()) {
      children.sort((a, b) => a.sort_order - b.sort_order);
    }

    const rows: TreeRow[] = [];
    for (const issue of issues) {
      if (issue.parent_id && issueMap.has(issue.parent_id)) continue;
      const children = childMap.get(issue.id) ?? [];
      rows.push({ issue, depth: 0, hasChildren: children.length > 0 });
      if (expandedParents[issue.id]) {
        for (const child of children) {
          rows.push({ issue: child, depth: 1, hasChildren: false });
        }
      }
    }

    return (
      <div className="space-y-4 sm:space-y-0">
        <ListHeader showProject={showProject} />
        <div className="flex flex-col gap-2 px-4 pb-1 sm:block sm:px-0 sm:pb-0">
          {rows.map(({ issue, depth, hasChildren }) => (
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
              depth={depth}
              hasChildren={hasChildren}
              expanded={expandedParents[issue.id] ?? false}
              onToggleExpand={toggleParent}
            />
          ))}
        </div>
      </div>
    );
  }

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
      <ListHeader showProject={showProject} />

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

function ListHeader({ showProject }: { showProject: boolean }) {
  return (
    <div className="hidden items-center gap-3 border-b border-border px-6 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted sm:flex">
      <div className="w-4 shrink-0" />
      <span className="w-[72px] shrink-0">ID</span>
      <span className="flex-1">Title</span>
      {showProject && <span className="w-[140px] shrink-0">Project</span>}
      <span className="w-[72px] text-center shrink-0">Priority</span>
      <span className="w-[72px] text-right shrink-0">Due</span>
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
