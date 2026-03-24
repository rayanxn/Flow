"use client";

import { useTransition } from "react";
import type { NotificationWithActivity } from "@/lib/utils/activities";
import { formatActivityAction } from "@/lib/utils/activities";
import { formatRelative } from "@/lib/utils/dates";
import { markNotificationRead } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils/cn";

interface NotificationRowProps {
  notification: NotificationWithActivity;
  isRecent?: boolean;
  onMarkedRead?: (id: string) => void;
  onIssueClick?: (issueId: string) => void;
}

export function NotificationRow({
  notification,
  isRecent,
  onMarkedRead,
  onIssueClick,
}: NotificationRowProps) {
  const [isPending, startTransition] = useTransition();

  const activity = notification.activity;
  const isUnread = !notification.is_read;

  const actionText = activity
    ? formatActivityAction(activity)
    : "Activity unavailable";

  function handleClick() {
    if (isPending) return;

    // Mark as read if unread
    if (isUnread) {
      startTransition(async () => {
        await markNotificationRead(notification.id);
        onMarkedRead?.(notification.id);
      });
    }

    // Open issue detail if this notification is about an issue
    if (activity?.entity_type === "issue" && activity.entity_id && onIssueClick) {
      onIssueClick(activity.entity_id);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "w-full flex items-start gap-3 py-3.5 px-4 text-left transition-colors",
        isRecent && isUnread
          ? "bg-[#2E2E2C0A] border-l-[3px] border-l-primary rounded-r-lg"
          : "rounded-lg hover:bg-background/50"
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 rounded-full bg-[#C4C0B8] size-8" />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p
          className={cn(
            "text-sm leading-[18px]",
            isRecent && isUnread
              ? "font-semibold text-text"
              : "text-[#7A756C]"
          )}
        >
          {actionText}
        </p>
        {activity?.project_name && (
          <p className="text-xs text-text-secondary">
            {activity.project_name}
          </p>
        )}
      </div>

      {/* Timestamp */}
      <span className="shrink-0 text-xs text-text-muted whitespace-nowrap">
        {formatRelative(notification.created_at)}
      </span>
    </button>
  );
}
