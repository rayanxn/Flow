import Link from "next/link";
import { Plus, ArrowRight, UserCheck, Pencil, Trash2, Zap } from "lucide-react";
import type { ActivityWithActor } from "@/lib/utils/activities";
import { formatActivityAction } from "@/lib/utils/activities";
import { formatRelative } from "@/lib/utils/dates";

function getActorInitials(
  actor: { full_name: string | null; email: string } | null,
): string {
  if (!actor) return "?";
  if (actor.full_name) {
    return actor.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return actor.email.slice(0, 2).toUpperCase();
}

function getActivityIcon(activity: ActivityWithActor) {
  if (activity.action === "created") return Plus;
  if (activity.action === "deleted") return Trash2;
  if (activity.action === "updated") {
    const meta = activity.metadata as Record<string, unknown>;
    const changes = meta?.changes as Record<string, unknown> | undefined;
    if (changes?.status) return ArrowRight;
    if (changes?.assignee_id) return UserCheck;
    return Pencil;
  }
  return Zap;
}

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
              <div className="shrink-0 size-7 rounded-[14px] bg-[#E8E4DE] flex items-center justify-center text-[10px] font-medium text-text-secondary">
                {getActorInitials(activity.actor)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-start gap-1.5">
                  {(() => {
                    const Icon = getActivityIcon(activity);
                    return <Icon className="shrink-0 size-3.5 text-text-muted mt-[1px]" />;
                  })()}
                  <p className="text-[13px] font-medium text-text leading-[17px]">
                    {formatActivityAction(activity)}
                  </p>
                </div>
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
