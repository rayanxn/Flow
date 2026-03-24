import type { Tables, IssueStatus } from "@/lib/types";
import { STATUS_CONFIG } from "@/lib/utils/statuses";

export type ActivityWithActor = Tables<"activities"> & {
  actor: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  project_name: string | null;
};

export type NotificationWithActivity = Tables<"notifications"> & {
  activity: ActivityWithActor | null;
};

export function formatActivityAction(activity: ActivityWithActor): string {
  const meta = activity.metadata as Record<string, unknown>;
  const actorName =
    activity.actor?.full_name?.split(" ")[0] ?? activity.actor?.email ?? "Someone";

  switch (activity.entity_type) {
    case "issue": {
      const issueKey = (meta.issue_key as string) ?? "";
      const title = (meta.title as string) ?? "";
      const label = issueKey ? `${issueKey}` : title;

      if (activity.action === "created") {
        return `${actorName} created ${label}`;
      }
      if (activity.action === "deleted") {
        return `${actorName} deleted ${label}`;
      }
      if (activity.action === "updated") {
        const changes = meta.changes as Record<string, unknown> | undefined;
        if (changes?.status) {
          const statusLabel =
            STATUS_CONFIG[changes.status as IssueStatus]?.label ??
            String(changes.status);
          return `${actorName} moved ${label} to ${statusLabel}`;
        }
        if (changes?.assignee_id) {
          return `${actorName} assigned ${label}`;
        }
        if (changes?.priority !== undefined) {
          return `${actorName} changed priority of ${label}`;
        }
        return `${actorName} updated ${label}`;
      }
      return `${actorName} ${activity.action} ${label}`;
    }

    case "sprint": {
      const name = (meta.name as string) ?? "Sprint";
      if (activity.action === "started") {
        return `${actorName} started ${name}`;
      }
      if (activity.action === "completed") {
        return `${actorName} completed ${name}`;
      }
      if (activity.action === "created") {
        return `${actorName} created ${name}`;
      }
      return `${actorName} ${activity.action} ${name}`;
    }

    case "project": {
      const name = (meta.name as string) ?? "project";
      if (activity.action === "created") {
        return `${actorName} created project ${name}`;
      }
      if (activity.action === "archived") {
        return `${actorName} archived project ${name}`;
      }
      if (activity.action === "deleted") {
        return `${actorName} deleted project ${name}`;
      }
      if (activity.action === "updated") {
        return `${actorName} updated project ${name}`;
      }
      return `${actorName} ${activity.action} project ${name}`;
    }

    default:
      return `${actorName} ${activity.action}`;
  }
}
