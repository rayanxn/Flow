"use client";

import { isToday, isYesterday, isThisWeek } from "date-fns";
import type { NotificationWithActivity } from "@/lib/utils/activities";
import { NotificationRow } from "./notification-row";

interface NotificationListProps {
  notifications: NotificationWithActivity[];
  onMarkedRead?: (id: string) => void;
}

type TimeBucket = "TODAY" | "YESTERDAY" | "THIS WEEK" | "EARLIER";

function getTimeBucket(dateStr: string): TimeBucket {
  const date = new Date(dateStr);
  if (isToday(date)) return "TODAY";
  if (isYesterday(date)) return "YESTERDAY";
  if (isThisWeek(date)) return "THIS WEEK";
  return "EARLIER";
}

function groupByTimeBucket(notifications: NotificationWithActivity[]) {
  const groups = new Map<TimeBucket, NotificationWithActivity[]>();
  const order: TimeBucket[] = ["TODAY", "YESTERDAY", "THIS WEEK", "EARLIER"];

  for (const bucket of order) {
    groups.set(bucket, []);
  }

  for (const n of notifications) {
    const bucket = getTimeBucket(n.created_at);
    groups.get(bucket)!.push(n);
  }

  return order
    .filter((bucket) => groups.get(bucket)!.length > 0)
    .map((bucket) => ({ bucket, items: groups.get(bucket)! }));
}

export function NotificationList({
  notifications,
  onMarkedRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-text-muted">No notifications yet.</p>
      </div>
    );
  }

  const groups = groupByTimeBucket(notifications);

  return (
    <div>
      {groups.map(({ bucket, items }, groupIdx) => {
        const isFirst = groupIdx === 0;
        return (
          <div key={bucket}>
            <h3
              className="text-base text-text font-normal"
              style={{
                paddingTop: isFirst ? "8px" : "16px",
                paddingBottom: "6px",
              }}
            >
              {bucket}
            </h3>
            <div className="flex flex-col gap-0.5">
              {items.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  isRecent={bucket === "TODAY"}
                  onMarkedRead={onMarkedRead}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
