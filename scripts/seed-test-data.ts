#!/usr/bin/env npx tsx

/**
 * Seed realistic test data into the pw-workspace for Playwright testing.
 *
 * Usage:
 *   npx tsx scripts/seed-test-data.ts          # seed (skips if already seeded)
 *   npx tsx scripts/seed-test-data.ts --force   # clear + re-seed
 *
 * Prerequisites:
 *   - Supabase running (local or remote) with .env.local configured
 *   - Auth setup completed: npx playwright test tests/auth.setup.ts --project=setup
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WORKSPACE_SLUG = "pw-workspace";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

function dateOnly(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Team member definitions (matching the Paper designs)
// ---------------------------------------------------------------------------

const MEMBERS: Record<string, { email: string; full_name: string }> = {
  elena:  { email: "elena@test.flowboard.dev",  full_name: "Elena Vasquez" },
  marcus: { email: "marcus@test.flowboard.dev", full_name: "Marcus Chen" },
  james:  { email: "james@test.flowboard.dev",  full_name: "James Park" },
  alex:   { email: "alex@test.flowboard.dev",   full_name: "Alex Rivera" },
  sarah:  { email: "sarah@test.flowboard.dev",  full_name: "Sarah Kim" },
  tom:    { email: "tom@test.flowboard.dev",     full_name: "Tom Andersen" },
  mia:    { email: "mia@test.flowboard.dev",     full_name: "Mia Torres" },
  lina:   { email: "lina@test.flowboard.dev",    full_name: "Lina Moreau" },
  david:  { email: "david@test.flowboard.dev",   full_name: "David Okonkwo" },
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding test data for pw-workspace...\n");

  // 1 — Find workspace
  const { data: workspace } = await admin
    .from("workspaces")
    .select("*")
    .eq("slug", WORKSPACE_SLUG)
    .single();

  if (!workspace) {
    console.error(
      "Workspace 'pw-workspace' not found.\n" +
        "Run auth setup first: npx playwright test tests/auth.setup.ts --project=setup"
    );
    process.exit(1);
  }

  // 2 — Already seeded?
  const { count } = await admin
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspace.id);

  if (count && count > 0) {
    if (!process.argv.includes("--force")) {
      console.log(
        "Already seeded (%d projects). Pass --force to re-seed.",
        count
      );
      return;
    }
    console.log("--force: clearing existing data...\n");
    await clearWorkspaceData(workspace.id);
  }

  // 3 — Find owner (Playwright Bot)
  const { data: ownerRow } = await admin
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", workspace.id)
    .eq("role", "owner")
    .single();
  const ownerId = ownerRow!.user_id;

  // 4 — Create / find team member users
  const userIds = await ensureUsers();
  console.log("  users: %d", Object.keys(userIds).length);

  // 5 — Workspace memberships
  await admin.from("workspace_members").upsert(
    Object.values(userIds).map((uid) => ({
      workspace_id: workspace.id,
      user_id: uid,
      role: "member",
    })),
    { onConflict: "workspace_id,user_id", ignoreDuplicates: true }
  );
  console.log("  workspace members");

  // 6 — Teams
  const teams = await createTeams(workspace.id, userIds, ownerId);
  console.log("  teams: %d", Object.keys(teams).length);

  // 7 — Projects
  const projects = await createProjects(workspace.id, userIds, teams);
  console.log("  projects: %d", Object.keys(projects).length);

  // 8 — Labels (6 defaults per project)
  const labels = await createLabels(projects);
  console.log("  labels");

  // 9 — Sprint
  const sprint = await createSprint(workspace.id, projects.frontendV2);
  console.log("  sprint: %s", sprint.name);

  // 10 — Issues
  const issues = await createIssues(
    workspace,
    projects,
    userIds,
    ownerId,
    sprint,
    labels
  );
  console.log("  issues: %d", issues.length);

  // 11 — Activities + notifications
  await createActivities(workspace.id, userIds, ownerId, issues, projects);
  console.log("  activities + notifications");

  console.log("\nDone — workspace seeded with test data.\n");
}

// ---------------------------------------------------------------------------
// Clear (for --force)
// ---------------------------------------------------------------------------

async function clearWorkspaceData(workspaceId: string) {
  // Cascade handles join tables (issue_labels, team_members, etc.)
  await admin.from("notifications").delete().eq("workspace_id", workspaceId);
  await admin.from("activities").delete().eq("workspace_id", workspaceId);
  await admin.from("issues").delete().eq("workspace_id", workspaceId);
  await admin.from("sprints").delete().eq("workspace_id", workspaceId);
  await admin.from("projects").delete().eq("workspace_id", workspaceId);
  await admin.from("teams").delete().eq("workspace_id", workspaceId);
  await admin
    .from("workspaces")
    .update({ issue_counter: 0 })
    .eq("id", workspaceId);
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

async function ensureUsers(): Promise<Record<string, string>> {
  const { data } = await admin.auth.admin.listUsers();
  const existing = data?.users ?? [];
  const ids: Record<string, string> = {};

  for (const [key, m] of Object.entries(MEMBERS)) {
    const found = existing.find((u) => u.email === m.email);
    if (found) {
      ids[key] = found.id;
    } else {
      const { data: created, error } = await admin.auth.admin.createUser({
        email: m.email,
        password: "seedTest!2026",
        email_confirm: true,
        user_metadata: { full_name: m.full_name },
      });
      if (error) throw error;
      ids[key] = created.user.id;
    }
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

async function createTeams(
  workspaceId: string,
  userIds: Record<string, string>,
  ownerId: string
) {
  const { data: teams } = await admin
    .from("teams")
    .insert([
      { workspace_id: workspaceId, name: "Engineering" },
      { workspace_id: workspaceId, name: "Design" },
      { workspace_id: workspaceId, name: "Product" },
    ])
    .select();

  const [eng, design, product] = teams!;

  await admin.from("team_members").insert([
    { team_id: eng.id, user_id: ownerId },
    { team_id: eng.id, user_id: userIds.elena },
    { team_id: eng.id, user_id: userIds.marcus },
    { team_id: eng.id, user_id: userIds.james },
    { team_id: eng.id, user_id: userIds.alex },
    { team_id: design.id, user_id: userIds.sarah },
    { team_id: design.id, user_id: userIds.tom },
    { team_id: design.id, user_id: userIds.mia },
    { team_id: product.id, user_id: userIds.lina },
    { team_id: product.id, user_id: userIds.david },
  ]);

  return { engineering: eng, design, product };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

async function createProjects(
  workspaceId: string,
  userIds: Record<string, string>,
  teams: Record<string, any>
) {
  const { data: projects } = await admin
    .from("projects")
    .insert([
      {
        workspace_id: workspaceId,
        name: "Frontend v2.4",
        description:
          "Main frontend app for v2.4 release. Board views, settings, and dashboard redesign.",
        color: "#3B82F6",
        lead_id: userIds.elena,
        team_id: teams.engineering.id,
      },
      {
        workspace_id: workspaceId,
        name: "API Platform",
        description:
          "Core API services, authentication, and data migration endpoints.",
        color: "#10B981",
        lead_id: userIds.marcus,
        team_id: teams.engineering.id,
      },
      {
        workspace_id: workspaceId,
        name: "Design System",
        description:
          "Shared component library, tokens, and style guidelines.",
        color: "#8B5CF6",
        lead_id: userIds.sarah,
        team_id: teams.design.id,
      },
      {
        workspace_id: workspaceId,
        name: "Mobile App",
        description:
          "Native iOS and Android app for task management on the go.",
        color: "#F97316",
        lead_id: userIds.alex,
        team_id: teams.engineering.id,
      },
    ])
    .select();

  return {
    frontendV2: projects![0],
    apiPlatform: projects![1],
    designSystem: projects![2],
    mobileApp: projects![3],
  };
}

// ---------------------------------------------------------------------------
// Labels (same defaults the app creates via createProject action)
// ---------------------------------------------------------------------------

async function createLabels(projects: Record<string, any>) {
  const defaults = [
    { name: "Bug", color: "#EF4444" },
    { name: "Feature", color: "#3B82F6" },
    { name: "Improvement", color: "#8B5CF6" },
    { name: "Documentation", color: "#10B981" },
    { name: "Backend", color: "#F59E0B" },
    { name: "Frontend", color: "#EC4899" },
  ];

  const rows = Object.values(projects).flatMap((p: any) =>
    defaults.map((l) => ({ project_id: p.id, ...l }))
  );

  const { data: labels } = await admin.from("labels").insert(rows).select();

  // Index by project_id → label name
  const map: Record<string, Record<string, any>> = {};
  for (const l of labels!) {
    (map[l.project_id] ??= {})[l.name] = l;
  }
  return map;
}

// ---------------------------------------------------------------------------
// Sprint
// ---------------------------------------------------------------------------

async function createSprint(workspaceId: string, project: any) {
  const { data: sprint } = await admin
    .from("sprints")
    .insert({
      workspace_id: workspaceId,
      project_id: project.id,
      name: "Sprint 24",
      goal: "Ship dashboard redesign and fix critical auth issues",
      status: "active",
      start_date: dateOnly(-11),
      end_date: dateOnly(3),
      capacity: 40,
    })
    .select()
    .single();
  return sprint!;
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

async function createIssues(
  workspace: any,
  projects: Record<string, any>,
  userIds: Record<string, string>,
  ownerId: string,
  sprint: any,
  labels: Record<string, Record<string, any>>
) {
  const fe = projects.frontendV2;
  const api = projects.apiPlatform;
  const ds = projects.designSystem;
  const mob = projects.mobileApp;

  let n = workspace.issue_counter; // continue from current counter
  const issue = (overrides: any) => {
    n++;
    return {
      workspace_id: workspace.id,
      issue_number: n,
      issue_key: `${workspace.issue_prefix}-${n}`,
      sort_order: n * 1000,
      created_at: daysAgo(14), // "created at sprint planning"
      ...overrides,
    };
  };

  const rows = [
    // ── Frontend v2.4 ──────────────────────────────────────────────────
    issue({
      project_id: fe.id,
      title: "Dashboard redesign",
      description:
        "Complete overhaul of the dashboard layout with new sprint overview widget.",
      status: "done",
      priority: 1,
      assignee_id: userIds.alex,
      sprint_id: sprint.id,
      created_by: userIds.elena,
      completed_at: daysAgo(2),
      story_points: 8,
    }),
    issue({
      project_id: fe.id,
      title: "Fix date picker timezone bug",
      description:
        "Date picker shows wrong date for users in negative UTC offsets.",
      status: "done",
      priority: 1,
      assignee_id: userIds.elena,
      sprint_id: sprint.id,
      created_by: userIds.alex,
      completed_at: daysAgo(5),
      story_points: 3,
    }),
    issue({
      project_id: fe.id,
      title: "Redesign onboarding flow",
      description: "Simplify the 3-step onboarding to reduce drop-off rate.",
      status: "in_progress",
      priority: 1,
      assignee_id: ownerId,
      sprint_id: sprint.id,
      created_by: userIds.sarah,
      story_points: 5,
      due_date: dateOnly(2),
    }),
    issue({
      project_id: fe.id,
      title: "Implement drag-and-drop reordering",
      description:
        "Add drag-and-drop support for reordering issues within board columns.",
      status: "in_progress",
      priority: 1,
      assignee_id: userIds.alex,
      sprint_id: sprint.id,
      created_by: userIds.elena,
      story_points: 5,
      due_date: dateOnly(0),
    }),
    issue({
      project_id: fe.id,
      title: "Add keyboard shortcuts for board navigation",
      description: "j/k to move between issues, Enter to open, Esc to close.",
      status: "todo",
      priority: 2,
      assignee_id: userIds.alex,
      sprint_id: sprint.id,
      created_by: userIds.elena,
      story_points: 3,
      due_date: dateOnly(5),
    }),
    issue({
      project_id: fe.id,
      title: "Fix sidebar collapse bug",
      description:
        "Sidebar doesn't remember collapsed state after page refresh.",
      status: "todo",
      priority: 2,
      assignee_id: userIds.elena,
      created_by: userIds.alex,
      story_points: 2,
    }),
    issue({
      project_id: fe.id,
      title: "Redesign project settings panel",
      description:
        "Modernize the settings UI to match the new design system.",
      status: "in_review",
      priority: 1,
      assignee_id: userIds.elena,
      sprint_id: sprint.id,
      created_by: userIds.sarah,
      story_points: 5,
      due_date: dateOnly(1),
    }),
    issue({
      project_id: fe.id,
      title: "Fix auth token refresh on expired sessions",
      description:
        "Users are being logged out when their JWT expires mid-session.",
      status: "in_progress",
      priority: 0,
      assignee_id: ownerId,
      sprint_id: sprint.id,
      created_by: userIds.marcus,
      story_points: 3,
      due_date: dateOnly(-1),
    }),

    // ── API Platform ───────────────────────────────────────────────────
    issue({
      project_id: api.id,
      title: "Migrate user settings to new API schema",
      description:
        "Move user preferences from the legacy settings table to the new API v2 schema.",
      status: "in_progress",
      priority: 0,
      assignee_id: userIds.marcus,
      created_by: userIds.lina,
      story_points: 8,
      due_date: dateOnly(2),
    }),
    issue({
      project_id: api.id,
      title: "Set up CI pipeline for staging",
      description:
        "Configure GitHub Actions for automated deploys to staging environment.",
      status: "done",
      priority: 2,
      assignee_id: userIds.james,
      created_by: userIds.james,
      completed_at: daysAgo(1),
      story_points: 3,
    }),
    issue({
      project_id: api.id,
      title: "API rate limiting middleware",
      description:
        "Implement token-bucket rate limiting for all public API endpoints.",
      status: "todo",
      priority: 1,
      assignee_id: ownerId,
      created_by: userIds.marcus,
      story_points: 5,
    }),
    issue({
      project_id: api.id,
      title: "Write API docs for v2",
      description:
        "Document all new endpoints, auth flows, and webhook payloads.",
      status: "todo",
      priority: 2,
      assignee_id: userIds.marcus,
      created_by: userIds.lina,
      story_points: 5,
    }),
    issue({
      project_id: api.id,
      title: "Fix webhook retry logic",
      description:
        "Webhooks are not retrying on 5xx responses from consumer endpoints.",
      status: "in_review",
      priority: 1,
      assignee_id: userIds.james,
      created_by: userIds.marcus,
      story_points: 3,
    }),
    issue({
      project_id: api.id,
      title: "Implement sprint completion flow",
      description:
        "When a sprint completes, move incomplete issues to backlog or next sprint.",
      status: "todo",
      priority: 2,
      assignee_id: userIds.lina,
      created_by: userIds.lina,
      story_points: 5,
      due_date: dateOnly(7),
    }),

    // ── Design System ──────────────────────────────────────────────────
    issue({
      project_id: ds.id,
      title: "Update component tokens",
      description: "Align design tokens with the latest brand guidelines.",
      status: "in_progress",
      priority: 1,
      assignee_id: userIds.sarah,
      created_by: userIds.sarah,
      story_points: 5,
    }),
    issue({
      project_id: ds.id,
      title: "Create icon set for navigation",
      description:
        "Design and export a consistent set of 24px navigation icons.",
      status: "done",
      priority: 2,
      assignee_id: userIds.tom,
      created_by: userIds.sarah,
      completed_at: daysAgo(3),
      story_points: 3,
    }),
    issue({
      project_id: ds.id,
      title: "Design empty states",
      description:
        "Create illustrations and copy for all empty state screens.",
      status: "todo",
      priority: 2,
      assignee_id: userIds.tom,
      created_by: userIds.sarah,
      story_points: 3,
    }),
    issue({
      project_id: ds.id,
      title: "Audit color contrast",
      description:
        "Run WCAG 2.1 AA compliance check on all text/background combinations.",
      status: "todo",
      priority: 3,
      assignee_id: userIds.mia,
      created_by: userIds.sarah,
      story_points: 2,
    }),

    // ── Mobile App ─────────────────────────────────────────────────────
    issue({
      project_id: mob.id,
      title: "Set up React Native project",
      description:
        "Initialize the React Native project with Expo, configure navigation.",
      status: "done",
      priority: 1,
      assignee_id: userIds.alex,
      created_by: userIds.alex,
      completed_at: daysAgo(7),
      story_points: 5,
    }),
    issue({
      project_id: mob.id,
      title: "Design mobile navigation",
      description:
        "Create tab bar and navigation patterns for the mobile app.",
      status: "in_progress",
      priority: 2,
      assignee_id: userIds.sarah,
      created_by: userIds.alex,
      story_points: 3,
    }),
  ];

  const { data: issues, error } = await admin
    .from("issues")
    .insert(rows)
    .select();
  if (error) throw error;

  // Update workspace counter
  await admin
    .from("workspaces")
    .update({ issue_counter: n })
    .eq("id", workspace.id);

  // Attach labels to some issues
  const fl = labels[fe.id];
  const al = labels[api.id];
  const dl = labels[ds.id];

  await admin.from("issue_labels").insert([
    { issue_id: issues![0].id, label_id: fl.Feature.id },
    { issue_id: issues![0].id, label_id: fl.Frontend.id },
    { issue_id: issues![1].id, label_id: fl.Bug.id },
    { issue_id: issues![1].id, label_id: fl.Frontend.id },
    { issue_id: issues![2].id, label_id: fl.Improvement.id },
    { issue_id: issues![3].id, label_id: fl.Feature.id },
    { issue_id: issues![5].id, label_id: fl.Bug.id },
    { issue_id: issues![7].id, label_id: fl.Bug.id },
    { issue_id: issues![7].id, label_id: fl.Backend.id },
    { issue_id: issues![8].id, label_id: al.Backend.id },
    { issue_id: issues![10].id, label_id: al.Backend.id },
    { issue_id: issues![11].id, label_id: al.Documentation.id },
    { issue_id: issues![14].id, label_id: dl.Feature.id },
  ]);

  return issues!;
}

// ---------------------------------------------------------------------------
// Activities + Notifications
// ---------------------------------------------------------------------------

async function createActivities(
  workspaceId: string,
  userIds: Record<string, string>,
  ownerId: string,
  issues: any[],
  projects: Record<string, any>
) {
  const { data: activities, error } = await admin
    .from("activities")
    .insert([
      {
        workspace_id: workspaceId,
        actor_id: userIds.sarah,
        action: "updated",
        entity_type: "issue",
        entity_id: issues[0].id,
        metadata: {
          issue_key: issues[0].issue_key,
          title: issues[0].title,
          field: "status",
          old_value: "in_review",
          new_value: "done",
          project_name: "Frontend v2.4",
        },
        created_at: hoursAgo(2),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.alex,
        action: "updated",
        entity_type: "issue",
        entity_id: issues[2].id,
        metadata: {
          issue_key: issues[2].issue_key,
          title: issues[2].title,
          field: "assignee",
          new_value: ownerId,
          project_name: "Frontend v2.4",
        },
        created_at: hoursAgo(5),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.elena,
        action: "updated",
        entity_type: "issue",
        entity_id: issues[6].id,
        metadata: {
          issue_key: issues[6].issue_key,
          title: issues[6].title,
          field: "status",
          old_value: "in_progress",
          new_value: "in_review",
          project_name: "Frontend v2.4",
        },
        created_at: hoursAgo(8),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.marcus,
        action: "created",
        entity_type: "issue",
        entity_id: issues[8].id,
        metadata: {
          issue_key: issues[8].issue_key,
          title: issues[8].title,
          project_name: "API Platform",
        },
        created_at: hoursAgo(10),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.james,
        action: "updated",
        entity_type: "issue",
        entity_id: issues[9].id,
        metadata: {
          issue_key: issues[9].issue_key,
          title: issues[9].title,
          field: "status",
          old_value: "in_progress",
          new_value: "done",
          project_name: "API Platform",
        },
        created_at: daysAgo(1),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.lina,
        action: "created",
        entity_type: "sprint",
        entity_id: projects.frontendV2.id,
        metadata: {
          sprint_name: "Sprint 24",
          project_name: "Frontend v2.4",
        },
        created_at: daysAgo(11),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.sarah,
        action: "created",
        entity_type: "issue",
        entity_id: issues[14].id,
        metadata: {
          issue_key: issues[14].issue_key,
          title: issues[14].title,
          project_name: "Design System",
        },
        created_at: daysAgo(3),
      },
      {
        workspace_id: workspaceId,
        actor_id: userIds.alex,
        action: "updated",
        entity_type: "issue",
        entity_id: issues[4].id,
        metadata: {
          issue_key: issues[4].issue_key,
          title: issues[4].title,
          field: "priority",
          old_value: "3",
          new_value: "2",
          project_name: "Frontend v2.4",
        },
        created_at: daysAgo(4),
      },
    ])
    .select();
  if (error) throw error;

  // Notifications for the owner (Playwright Bot)
  await admin.from("notifications").insert([
    {
      workspace_id: workspaceId,
      user_id: ownerId,
      activity_id: activities![0].id,
      type: "status_change",
      is_read: false,
      created_at: activities![0].created_at,
    },
    {
      workspace_id: workspaceId,
      user_id: ownerId,
      activity_id: activities![1].id,
      type: "assigned",
      is_read: false,
      created_at: activities![1].created_at,
    },
    {
      workspace_id: workspaceId,
      user_id: ownerId,
      activity_id: activities![2].id,
      type: "status_change",
      is_read: false,
      created_at: activities![2].created_at,
    },
    {
      workspace_id: workspaceId,
      user_id: ownerId,
      activity_id: activities![3].id,
      type: "general",
      is_read: true,
      created_at: activities![3].created_at,
    },
    {
      workspace_id: workspaceId,
      user_id: ownerId,
      activity_id: activities![4].id,
      type: "status_change",
      is_read: true,
      created_at: activities![4].created_at,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
