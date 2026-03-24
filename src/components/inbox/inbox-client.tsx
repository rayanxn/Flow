"use client";

import { useTransition, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationList } from "./notification-list";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import type { NotificationWithActivity } from "@/lib/utils/activities";

interface InboxClientProps {
  notifications: NotificationWithActivity[];
  workspaceId: string;
}

const TABS = [
  { value: "all", label: "All" },
  { value: "mentions", label: "Mentions", type: "mention" as const },
  { value: "assigned", label: "Assigned", type: "assigned" as const },
  { value: "comments", label: "Comments", type: "comment" as const },
] as const;

export function InboxClient({
  notifications: initialNotifications,
  workspaceId,
}: InboxClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();

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
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
