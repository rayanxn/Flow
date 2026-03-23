export type { Database, Tables, InsertTables, UpdateTables, Json } from "./database";

export type IssueStatus = "todo" | "in_progress" | "in_review" | "done";
export type IssuePriority = 0 | 1 | 2 | 3;
export type WorkspaceRole = "owner" | "admin" | "member";
export type MemberRole = "admin" | "member";
export type SprintStatus = "planning" | "active" | "completed";
export type NotificationType = "mention" | "assigned" | "comment" | "status_change" | "general";

export type ActionResponse<T = void> =
  | { data: T; error?: never }
  | { error: string; data?: never };

export interface ViewFilters {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  assignee_ids?: string[];
  project_ids?: string[];
  label_ids?: string[];
  due_date_range?: {
    from?: string;
    to?: string;
  };
}
