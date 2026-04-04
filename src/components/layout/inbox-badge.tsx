"use client";

import { useRealtimeNotifications } from "@/lib/hooks/use-realtime-notifications";

interface InboxBadgeProps {
  workspaceId: string;
  userId: string;
  initialCount: number;
}

export function InboxBadge({
  workspaceId,
  userId,
  initialCount,
}: InboxBadgeProps) {
  const { unreadCount } = useRealtimeNotifications({
    workspaceId,
    userId,
    initialCount,
  });

  if (unreadCount === 0) return null;

  return (
    <span
      className="bg-danger-muted text-white text-[10px] font-mono font-medium rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center leading-3"
      title={`${unreadCount} unread`}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
}
