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

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={isPending || isLoading ? -1 : 0}
      aria-disabled={isPending || isLoading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex w-full cursor-pointer flex-col gap-3 rounded-xl px-4 py-3.5 text-left transition-colors sm:flex-row sm:items-start",
        isUnread
          ? "border border-primary/15 bg-primary/5 shadow-sm"
          : "border border-transparent hover:bg-background/50"
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
          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-danger ring-2 ring-[var(--color-surface)]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p
          className={cn(
            "text-sm leading-[18px]",
            isUnread
              ? "font-semibold text-text"
              : "text-text-secondary"
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
      <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:justify-end">
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin text-text-muted" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              {isUnread && (
                <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-text-secondary">
                  Unread
                </span>
              )}
              <span className="text-xs text-text-muted whitespace-nowrap">
                {formatRelative(notification.created_at)}
              </span>
            </div>
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
                className="rounded p-1 opacity-100 transition-opacity hover:bg-surface-hover sm:opacity-0 sm:group-hover:opacity-100"
                title="Mark as read"
              >
                <Check className="size-3.5 text-text-muted" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
