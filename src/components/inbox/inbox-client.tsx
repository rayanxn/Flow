"use client";

import { useTransition, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationList } from "./notification-list";
import { IssueDetailPanel } from "@/components/issues/issue-detail-panel";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { createClient } from "@/lib/supabase/client";
import { enrichIssuesClient } from "@/lib/queries/issues-client";
import type { NotificationWithActivity } from "@/lib/utils/activities";
import type { IssueWithDetails } from "@/lib/queries/issues";

interface InboxClientProps {
  notifications: NotificationWithActivity[];
  workspaceId: string;
  members?: { user_id: string; profile: { full_name: string | null; email: string } }[];
}

const TABS = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned", type: "assigned" as const },
] as const;

export function InboxClient({
  notifications: initialNotifications,
  workspaceId,
  members = [],
}: InboxClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();
  const [selectedIssue, setSelectedIssue] = useState<IssueWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loadingIssueId, setLoadingIssueId] = useState<string | null>(null);

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const result = await markAllNotificationsRead(workspaceId);
      if (!("error" in result)) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
      }
    });
  };

  const handleMarkedRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  const handleIssueClick = useCallback(async (issueId: string) => {
    setLoadingIssueId(issueId);
    try {
      const supabase = createClient();
      const { data: issue } = await supabase
        .from("issues")
        .select("*")
        .eq("id", issueId)
        .single();

      if (issue) {
        const enriched = await enrichIssuesClient([issue], supabase);
        if (enriched.length > 0) {
          setSelectedIssue(enriched[0]);
          setDetailOpen(true);
        }
      }
    } finally {
      setLoadingIssueId(null);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Title row: Inbox + tabs inline, mark all read on the right */}
      <div className="flex items-center justify-between pb-4">
        <Tabs defaultValue="all" className="flex-1">
          <div className="flex items-center gap-5">
            <h1 className="text-[26px] font-bold text-text leading-8">
              Inbox
            </h1>
            <TabsList className="border-b-0 bg-[#EDEAE4] rounded-lg p-0.5 gap-1">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-md px-3.5 py-1.5 text-base data-[state=active]:bg-white data-[state=active]:shadow-none border-b-0 data-[state=active]:border-b-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex-1" />
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-sm text-text-secondary hover:text-text transition-colors disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          {TABS.map((tab) => {
            const filtered =
              tab.value === "all"
                ? notifications
                : notifications.filter(
                    (n) => n.type === ("type" in tab ? tab.type : undefined)
                  );

            return (
              <TabsContent key={tab.value} value={tab.value}>
                <NotificationList
                  notifications={filtered}
                  onMarkedRead={handleMarkedRead}
                  onIssueClick={handleIssueClick}
                  loadingIssueId={loadingIssueId}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* Issue detail panel */}
      <IssueDetailPanel
        issue={selectedIssue}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        members={members}
      />
    </div>
  );
}
