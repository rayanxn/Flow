import Link from "next/link";
import type { ActivityWithActor } from "@/lib/utils/activities";
import { formatActivityAction } from "@/lib/utils/activities";
import { formatRelative } from "@/lib/utils/dates";

interface RecentActivityCardProps {
  activities: ActivityWithActor[];
  workspaceSlug: string;
}

export function RecentActivityCard({
  activities,
  workspaceSlug,
}: RecentActivityCardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text">Recent Activity</h2>
        <Link
          href={`/${workspaceSlug}/inbox`}
          className="text-[13px] font-medium text-text-secondary hover:text-text transition-colors"
        >
          Inbox &rarr;
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-[10px] border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-muted">No recent activity.</p>
        </div>
      ) : (
        <div className="rounded-[10px] overflow-clip flex flex-col gap-px bg-border">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2.5 py-3.5 px-4 bg-surface"
            >
              {/* Avatar */}
              <div className="shrink-0 size-7 rounded-[14px] bg-[#E8E4DE]" />

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-[13px] font-medium text-text leading-[17px]">
                  {formatActivityAction(activity)}
                </p>
                <p className="text-[11px] text-text-muted">
                  {activity.project_name && (
                    <span>{activity.project_name}</span>
                  )}
                  {activity.project_name && <span> · </span>}
                  <span>{formatRelative(activity.created_at)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
