"use client";

import { useTransition } from "react";
import type { NotificationWithActivity } from "@/lib/utils/activities";
import { formatActivityAction } from "@/lib/utils/activities";
import { formatRelative } from "@/lib/utils/dates";
import { markNotificationRead } from "@/lib/actions/notifications";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/format";

interface NotificationRowProps {
  notification: NotificationWithActivity;
  onMarkedRead?: (id: string) => void;
  onIssueClick?: (issueId: string) => void;
  isLoading?: boolean;
}

export function NotificationRow({
  notification,
  onMarkedRead,
  onIssueClick,
  isLoading,
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
      disabled={isPending || isLoading}
      className={cn(
        "group w-full flex items-start gap-3 py-3.5 px-4 text-left transition-colors",
        isUnread
          ? "bg-[#2E2E2C0A] border-l-[3px] border-l-primary rounded-r-lg"
          : "rounded-lg hover:bg-background/50"
      )}
    >
      {/* Avatar + unread dot */}
      <div className="relative shrink-0">
        <Avatar size="sm" className="size-8">
          <AvatarFallback>
            {getInitials(activity?.actor?.full_name, activity?.actor?.email)}
          </AvatarFallback>
        </Avatar>
        {isUnread && (
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#8B4049] ring-2 ring-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p
          className={cn(
            "text-sm leading-[18px]",
            isUnread
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

      {/* Timestamp + mark-as-read / loading spinner */}
      <div className="shrink-0 flex items-center gap-2">
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin text-text-muted" />
        ) : (
          <>
            <span className="text-xs text-text-muted whitespace-nowrap">
              {formatRelative(notification.created_at)}
            </span>
            {isUnread && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPending) return;
                  startTransition(async () => {
                    await markNotificationRead(notification.id);
                    onMarkedRead?.(notification.id);
                  });
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-surface-hover"
                title="Mark as read"
              >
                <Check className="size-3.5 text-text-muted" />
              </button>
            )}
          </>
        )}
      </div>
    </button>
  );
}
