"use client";

import { useState, useCallback } from "react";
import { MyFocusCard } from "./my-focus-card";
import { RecentActivityCard } from "./recent-activity-card";
import { IssueDetailModal } from "@/components/issues/issue-detail-modal";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { ActivityWithActor } from "@/lib/utils/activities";

interface DashboardContentProps {
  issues: IssueWithDetails[];
  activities: ActivityWithActor[];
  activityIssueMap: Record<string, IssueWithDetails>;
  members: { user_id: string; profile: { id: string; full_name: string | null; email: string; avatar_url: string | null } }[];
  workspaceSlug: string;
}

export function DashboardContent({
  issues,
  activities,
  activityIssueMap,
  members,
  workspaceSlug,
}: DashboardContentProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleIssueClick = useCallback(
    (id: string) => {
      const issue = issues.find((i) => i.id === id) ?? activityIssueMap[id] ?? null;
      if (issue) {
        setSelectedIssue(issue);
        setDetailOpen(true);
      }
    },
    [issues, activityIssueMap]
  );

  return (
    <>
      <div className="flex flex-1 gap-6 px-4 md:px-10 pt-6 pb-8">
        <div className="flex flex-col" style={{ flexGrow: 1.6, flexBasis: 0 }}>
          <MyFocusCard
            issues={issues}
            workspaceSlug={workspaceSlug}
            onIssueClick={handleIssueClick}
          />
        </div>
        <div className="flex flex-col flex-1" style={{ flexBasis: 0 }}>
          <RecentActivityCard
            activities={activities}
            workspaceSlug={workspaceSlug}
            onIssueClick={handleIssueClick}
          />
        </div>
      </div>
      <IssueDetailModal
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        members={members}
      />
    </>
  );
}
