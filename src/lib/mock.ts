import type { Tables, IssueStatus } from "@/lib/types";
import type { ProjectWithStats } from "@/lib/queries/projects";
import type { IssueWithDetails } from "@/lib/queries/issues";
import type { WorkspaceMember } from "@/lib/queries/members";

export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

export const MOCK_USER = {
  id: MOCK_USER_ID,
  email: "marcus@acme.com",
  user_metadata: { full_name: "Marcus Chen" },
} as const;

export const MOCK_WORKSPACE: Tables<"workspaces"> = {
  id: "00000000-0000-0000-0000-000000000010",
  name: "Acme Inc",
  slug: "acme-inc",
  issue_prefix: "FLO",
  issue_counter: 148,
  default_sprint_length: 14,
  timezone: "UTC",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_MEMBERSHIP: Tables<"workspace_members"> = {
  id: "00000000-0000-0000-0000-000000000020",
  workspace_id: MOCK_WORKSPACE.id,
  user_id: MOCK_USER_ID,
  role: "owner",
  primary_project_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_PROJECTS: Pick<Tables<"projects">, "id" | "name" | "color" | "is_archived">[] = [
  { id: "00000000-0000-0000-0000-000000000031", name: "API Platform", color: "#16A34A", is_archived: false },
  { id: "00000000-0000-0000-0000-000000000032", name: "Design System", color: "#7C3AED", is_archived: false },
  { id: "00000000-0000-0000-0000-000000000033", name: "Frontend v2.4", color: "#16A34A", is_archived: false },
  { id: "00000000-0000-0000-0000-000000000034", name: "Mobile App", color: "#DC2626", is_archived: false },
];

// Phase 2 mock data

const MOCK_PROFILES = {
  marcus: { id: MOCK_USER_ID, full_name: "Marcus Chen", email: "marcus@acme.com", avatar_url: null },
  elena: { id: "00000000-0000-0000-0000-000000000002", full_name: "Elena Rodriguez", email: "elena@acme.com", avatar_url: null },
  sarah: { id: "00000000-0000-0000-0000-000000000003", full_name: "Sarah Kim", email: "sarah@acme.com", avatar_url: null },
  alex: { id: "00000000-0000-0000-0000-000000000004", full_name: "Alex Turner", email: "alex@acme.com", avatar_url: null },
};

export const MOCK_MEMBERS: WorkspaceMember[] = [
  { id: "m1", user_id: MOCK_PROFILES.marcus.id, role: "owner", profile: MOCK_PROFILES.marcus },
  { id: "m2", user_id: MOCK_PROFILES.elena.id, role: "admin", profile: MOCK_PROFILES.elena },
  { id: "m3", user_id: MOCK_PROFILES.sarah.id, role: "member", profile: MOCK_PROFILES.sarah },
  { id: "m4", user_id: MOCK_PROFILES.alex.id, role: "member", profile: MOCK_PROFILES.alex },
];

export const MOCK_TEAMS: Tables<"teams">[] = [
  { id: "t1", workspace_id: MOCK_WORKSPACE.id, name: "Engineering", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "t2", workspace_id: MOCK_WORKSPACE.id, name: "Design", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "t3", workspace_id: MOCK_WORKSPACE.id, name: "Product", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export const MOCK_PROJECTS_WITH_STATS: ProjectWithStats[] = [
  {
    id: MOCK_PROJECTS[2].id,
    workspace_id: MOCK_WORKSPACE.id,
    name: "Frontend v2.4",
    description: "Main frontend app for v2.4 release. Board views, settings, and dashboard redesign.",
    color: "#16A34A",
    lead_id: MOCK_PROFILES.marcus.id,
    team_id: "t1",
    is_private: false,
    is_archived: false,
    created_at: daysAgo(30),
    updated_at: daysAgo(0),
    lead: MOCK_PROFILES.marcus,
    issue_counts: { done: 8, in_progress: 5, in_review: 3, todo: 4 },
    total_issues: 20,
  },
  {
    id: MOCK_PROJECTS[0].id,
    workspace_id: MOCK_WORKSPACE.id,
    name: "API Platform",
    description: "Core API services, authentication, and data migration endpoints.",
    color: "#16A34A",
    lead_id: MOCK_PROFILES.elena.id,
    team_id: "t1",
    is_private: false,
    is_archived: false,
    created_at: daysAgo(45),
    updated_at: daysAgo(0),
    lead: MOCK_PROFILES.elena,
    issue_counts: { done: 5, in_progress: 4, in_review: 2, todo: 3 },
    total_issues: 14,
  },
  {
    id: MOCK_PROJECTS[1].id,
    workspace_id: MOCK_WORKSPACE.id,
    name: "Design System",
    description: "Shared component library, tokens, and style guidelines for all products.",
    color: "#7C3AED",
    lead_id: MOCK_PROFILES.sarah.id,
    team_id: "t2",
    is_private: false,
    is_archived: false,
    created_at: daysAgo(60),
    updated_at: daysAgo(1),
    lead: MOCK_PROFILES.sarah,
    issue_counts: { done: 3, in_progress: 3, in_review: 1, todo: 2 },
    total_issues: 9,
  },
  {
    id: MOCK_PROJECTS[3].id,
    workspace_id: MOCK_WORKSPACE.id,
    name: "Mobile App",
    description: "Native iOS and Android app for task management on the go.",
    color: "#DC2626",
    lead_id: MOCK_PROFILES.alex.id,
    team_id: "t1",
    is_private: false,
    is_archived: false,
    created_at: daysAgo(20),
    updated_at: daysAgo(3),
    lead: MOCK_PROFILES.alex,
    issue_counts: { done: 2, in_progress: 2, in_review: 1, todo: 1 },
    total_issues: 6,
  },
];

export const MOCK_LABELS: Tables<"labels">[] = [
  { id: "l1", project_id: MOCK_PROJECTS[2].id, name: "Backend", color: "#2563EB" },
  { id: "l2", project_id: MOCK_PROJECTS[2].id, name: "Bug", color: "#DC2626" },
  { id: "l3", project_id: MOCK_PROJECTS[2].id, name: "Design", color: "#D97706" },
  { id: "l4", project_id: MOCK_PROJECTS[2].id, name: "Feature", color: "#7C3AED" },
  { id: "l5", project_id: MOCK_PROJECTS[2].id, name: "Migration", color: "#059669" },
  { id: "l6", project_id: MOCK_PROJECTS[2].id, name: "Ops", color: "#059669" },
];

export const MOCK_SPRINTS: Tables<"sprints">[] = [
  {
    id: "s1",
    workspace_id: MOCK_WORKSPACE.id,
    project_id: MOCK_PROJECTS[2].id,
    name: "Sprint 24",
    goal: "Complete board views and settings redesign",
    status: "active",
    start_date: daysAgo(7).split("T")[0],
    end_date: daysFromNow(7),
    capacity: 24,
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },
  {
    id: "s2",
    workspace_id: MOCK_WORKSPACE.id,
    project_id: MOCK_PROJECTS[2].id,
    name: "Sprint 25",
    goal: null,
    status: "planning",
    start_date: null,
    end_date: null,
    capacity: null,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
];

function mockIssue(
  overrides: Partial<IssueWithDetails> & {
    issue_number: number;
    title: string;
    project_id: string;
    status: IssueStatus;
    priority: number;
  }
): IssueWithDetails {
  const projectRef = MOCK_PROJECTS_WITH_STATS.find((p) => p.id === overrides.project_id);
  return {
    id: `issue-${overrides.issue_number}`,
    workspace_id: MOCK_WORKSPACE.id,
    project_id: overrides.project_id,
    issue_number: overrides.issue_number,
    issue_key: `FLO-${overrides.issue_number}`,
    title: overrides.title,
    description: overrides.description ?? null,
    status: overrides.status,
    priority: overrides.priority,
    assignee_id: overrides.assignee_id ?? MOCK_USER_ID,
    parent_id: overrides.parent_id ?? null,
    sprint_id: overrides.sprint_id ?? null,
    due_date: overrides.due_date ?? null,
    story_points: overrides.story_points ?? null,
    sort_order: overrides.sort_order ?? overrides.issue_number * 1000,
    created_by: MOCK_USER_ID,
    completed_at: overrides.status === "done" ? daysAgo(2) : null,
    created_at: overrides.created_at ?? daysAgo(10),
    updated_at: overrides.updated_at ?? daysAgo(0),
    assignee: overrides.assignee ?? MOCK_PROFILES.marcus,
    project: projectRef
      ? { id: projectRef.id, name: projectRef.name, color: projectRef.color }
      : null,
    labels: overrides.labels ?? [],
    parent: overrides.parent ?? null,
    sub_issues_count: overrides.sub_issues_count ?? 0,
    sub_issues_done_count: overrides.sub_issues_done_count ?? 0,
    sub_issues_story_points: overrides.sub_issues_story_points ?? 0,
    checklist: [],
  };
}

const P = MOCK_PROJECTS;

export const MOCK_MY_ISSUES: IssueWithDetails[] = [
  // In Progress
  mockIssue({
    issue_number: 139,
    title: "Migrate user settings to new API schema",
    project_id: P[0].id,
    status: "in_progress",
    priority: 0,
    due_date: daysFromNow(-2),
    sprint_id: "s1",
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l1", name: "Backend", color: "#2563EB" }, { id: "l5", name: "Migration", color: "#059669" }],
  }),
  mockIssue({
    issue_number: 141,
    title: "Implement drag-and-drop reordering for tasks",
    project_id: P[2].id,
    status: "in_progress",
    priority: 1,
    due_date: new Date().toISOString().split("T")[0],
    sprint_id: "s1",
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  mockIssue({
    issue_number: 136,
    title: "Redesign project settings panel",
    project_id: P[1].id,
    status: "in_progress",
    priority: 1,
    due_date: daysFromNow(2),
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l3", name: "Design", color: "#D97706" }],
  }),
  // Todo
  mockIssue({
    issue_number: 142,
    title: "Fix auth token refresh on expired sessions",
    project_id: P[2].id,
    status: "todo",
    priority: 0,
    due_date: daysFromNow(-1),
    sprint_id: "s1",
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l2", name: "Bug", color: "#DC2626" }],
  }),
  mockIssue({
    issue_number: 145,
    title: "Add keyboard shortcuts for board navigation",
    project_id: P[2].id,
    status: "todo",
    priority: 2,
    due_date: daysFromNow(4),
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  mockIssue({
    issue_number: 148,
    title: "Update onboarding copy for new users",
    project_id: P[2].id,
    status: "todo",
    priority: 3,
    due_date: daysFromNow(7),
    assignee: MOCK_PROFILES.marcus,
  }),
  mockIssue({
    issue_number: 138,
    title: "Set up CI pipeline for staging",
    project_id: P[2].id,
    status: "todo",
    priority: 2,
    due_date: null,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l6", name: "Ops", color: "#059669" }],
  }),
  // Done
  mockIssue({
    issue_number: 130,
    title: "Implement workspace creation flow",
    project_id: P[2].id,
    status: "done",
    priority: 0,
    assignee: MOCK_PROFILES.marcus,
  }),
  mockIssue({
    issue_number: 131,
    title: "Build sidebar navigation component",
    project_id: P[2].id,
    status: "done",
    priority: 1,
    assignee: MOCK_PROFILES.marcus,
  }),
  mockIssue({
    issue_number: 132,
    title: "Set up Supabase auth with OAuth providers",
    project_id: P[2].id,
    status: "done",
    priority: 0,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l1", name: "Backend", color: "#2563EB" }],
  }),
  mockIssue({
    issue_number: 133,
    title: "Create UI component library with Radix",
    project_id: P[1].id,
    status: "done",
    priority: 1,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l3", name: "Design", color: "#D97706" }],
  }),
  mockIssue({
    issue_number: 134,
    title: "Design onboarding wizard screens",
    project_id: P[2].id,
    status: "done",
    priority: 2,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l3", name: "Design", color: "#D97706" }],
  }),
  mockIssue({
    issue_number: 135,
    title: "Configure middleware auth guards",
    project_id: P[2].id,
    status: "done",
    priority: 1,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l1", name: "Backend", color: "#2563EB" }],
  }),
];

export const MOCK_PROJECT_ISSUES: IssueWithDetails[] = [
  // In Progress
  mockIssue({
    issue_number: 141,
    title: "Implement drag-and-drop reordering for tasks",
    project_id: P[2].id,
    status: "in_progress",
    priority: 1,
    due_date: new Date().toISOString().split("T")[0],
    sprint_id: "s1",
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  mockIssue({
    issue_number: 143,
    title: "Add real-time sync for board updates",
    project_id: P[2].id,
    status: "in_progress",
    priority: 1,
    due_date: daysFromNow(1),
    sprint_id: "s1",
    assignee: MOCK_PROFILES.elena,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }, { id: "l1", name: "Backend", color: "#2563EB" }],
  }),
  mockIssue({
    issue_number: 144,
    title: "Build issue detail modal with edit mode",
    project_id: P[2].id,
    status: "in_progress",
    priority: 2,
    due_date: daysFromNow(3),
    sprint_id: "s1",
    assignee: MOCK_PROFILES.sarah,
    labels: [{ id: "l3", name: "Design", color: "#D97706" }],
  }),
  // In Review
  mockIssue({
    issue_number: 137,
    title: "Implement project overview grid page",
    project_id: P[2].id,
    status: "in_review",
    priority: 1,
    due_date: daysFromNow(-1),
    sprint_id: "s1",
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  mockIssue({
    issue_number: 140,
    title: "Create issue list view with status grouping",
    project_id: P[2].id,
    status: "in_review",
    priority: 1,
    sprint_id: "s1",
    assignee: MOCK_PROFILES.elena,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  // Todo
  mockIssue({
    issue_number: 142,
    title: "Fix auth token refresh on expired sessions",
    project_id: P[2].id,
    status: "todo",
    priority: 0,
    due_date: daysFromNow(-1),
    sprint_id: "s1",
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l2", name: "Bug", color: "#DC2626" }],
  }),
  mockIssue({
    issue_number: 145,
    title: "Add keyboard shortcuts for board navigation",
    project_id: P[2].id,
    status: "todo",
    priority: 2,
    due_date: daysFromNow(4),
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  mockIssue({
    issue_number: 146,
    title: "Implement sprint completion flow",
    project_id: P[2].id,
    status: "todo",
    priority: 1,
    due_date: daysFromNow(5),
    assignee: MOCK_PROFILES.alex,
    labels: [{ id: "l4", name: "Feature", color: "#7C3AED" }],
  }),
  mockIssue({
    issue_number: 148,
    title: "Update onboarding copy for new users",
    project_id: P[2].id,
    status: "todo",
    priority: 3,
    due_date: daysFromNow(7),
    assignee: MOCK_PROFILES.marcus,
  }),
  // Done
  mockIssue({
    issue_number: 130,
    title: "Implement workspace creation flow",
    project_id: P[2].id,
    status: "done",
    priority: 0,
    assignee: MOCK_PROFILES.marcus,
  }),
  mockIssue({
    issue_number: 131,
    title: "Build sidebar navigation component",
    project_id: P[2].id,
    status: "done",
    priority: 1,
    assignee: MOCK_PROFILES.marcus,
  }),
  mockIssue({
    issue_number: 132,
    title: "Set up Supabase auth with OAuth providers",
    project_id: P[2].id,
    status: "done",
    priority: 0,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l1", name: "Backend", color: "#2563EB" }],
  }),
  mockIssue({
    issue_number: 134,
    title: "Design onboarding wizard screens",
    project_id: P[2].id,
    status: "done",
    priority: 2,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l3", name: "Design", color: "#D97706" }],
  }),
  mockIssue({
    issue_number: 135,
    title: "Configure middleware auth guards",
    project_id: P[2].id,
    status: "done",
    priority: 1,
    assignee: MOCK_PROFILES.marcus,
    labels: [{ id: "l1", name: "Backend", color: "#2563EB" }],
  }),
];
