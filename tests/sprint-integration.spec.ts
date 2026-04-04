import { test, expect } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/types";

const WS = "/pw-workspace";
const SPRINT_GOAL = "Ship dashboard redesign and fix critical auth issues";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let admin: SupabaseClient<Database>;
let completedSprintId: string | null = null;
let completedSprintName = "";
let completedSprintProjectId: string | null = null;

test("sprint planning is connected to dashboard, analytics, and project views", async ({
  page,
}) => {
  await page.goto(`${WS}/dashboard`);

  await expect(page.getByText("Sprint 24")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(SPRINT_GOAL)).toBeVisible();
  await expect(page.getByRole("link", { name: "Sprint Planning" })).toBeVisible();

  await page.getByRole("link", { name: "Sprint Planning" }).click();
  await expect(page).toHaveURL(/\/projects\/.+\/sprint-planning\?sprint=/, {
    timeout: 10000,
  });

  await expect(page.getByRole("button", { name: "Complete Sprint" })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: "Analytics" })).toBeVisible();

  await page.locator("main").getByRole("link", { name: "Analytics" }).click();
  await expect(page).toHaveURL(/\/pw-workspace\/analytics\?tab=sprints&sprint=/, {
    timeout: 10000,
  });

  await expect(page.getByText("Sprint Context")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sprint 24" })).toBeVisible();
  await expect(page.getByText(SPRINT_GOAL)).toBeVisible();
  await expect(page.getByText(/in scope, .* completed/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Project Board" })).toBeVisible();

  await page.locator("main").getByRole("link", { name: "Project Board" }).click();
  await expect(page).toHaveURL(/\/projects\/.+\/board$/, { timeout: 10000 });
  await expect(page.getByText(`Goal: ${SPRINT_GOAL}`)).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: "Analytics" })).toBeVisible();
});

test.describe.serial("completed sprint review links", () => {
  test.beforeAll(async () => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error("Missing Supabase env for sprint integration test");
    }

    admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: workspace, error: workspaceError } = await admin
      .from("workspaces")
      .select("id")
      .eq("slug", WS.slice(1))
      .single();

    if (workspaceError || !workspace) {
      throw new Error(
        `Failed to load sprint integration workspace: ${workspaceError?.message ?? "missing"}`
      );
    }

    const { data: activeSprint, error: activeSprintError } = await admin
      .from("sprints")
      .select("project_id")
      .eq("workspace_id", workspace.id)
      .eq("status", "active")
      .single();

    if (activeSprintError || !activeSprint) {
      throw new Error(
        `Failed to load active sprint project: ${activeSprintError?.message ?? "missing"}`
      );
    }

    completedSprintName = `Review Completed Sprint ${Date.now()}`;

    const { data: sprint, error: sprintError } = await admin
      .from("sprints")
      .insert({
        workspace_id: workspace.id,
        project_id: activeSprint.project_id,
        name: completedSprintName,
        goal: "Validate completed sprint review links",
        start_date: "2026-03-01",
        end_date: "2026-03-14",
        status: "completed",
        capacity: 0,
      })
      .select("id, project_id")
      .single();

    if (sprintError || !sprint) {
      throw new Error(
        `Failed to create completed sprint: ${sprintError?.message ?? "missing"}`
      );
    }

    const { data: users, error: usersError } = await admin.auth.admin.listUsers();
    if (usersError) {
      throw new Error(`Failed to load test user: ${usersError.message}`);
    }

    const actorId =
      users.users.find((user) => user.email === "playwright@test.flow.dev")?.id ?? null;

    if (!actorId) {
      throw new Error("Missing playwright@test.flow.dev for sprint integration test");
    }

    const { error: activityError } = await admin.from("activities").insert({
      workspace_id: workspace.id,
      actor_id: actorId,
      action: "completed",
      entity_type: "sprint",
      entity_id: sprint.id,
      metadata: {
        name: completedSprintName,
        project_id: sprint.project_id,
        moved_count: 0,
        scope_issue_ids: [],
      },
    });

    if (activityError) {
      throw new Error(
        `Failed to create sprint completion activity: ${activityError.message}`
      );
    }

    completedSprintId = sprint.id;
    completedSprintProjectId = sprint.project_id;
  });

  test.afterAll(async () => {
    if (!completedSprintId) return;

    await admin
      .from("activities")
      .delete()
      .eq("entity_type", "sprint")
      .eq("action", "completed")
      .eq("entity_id", completedSprintId);

    await admin.from("sprints").delete().eq("id", completedSprintId);
  });

  test("analytics review links back to the same completed sprint in read-only mode", async ({
    page,
  }) => {
    test.skip(!completedSprintId || !completedSprintProjectId, "Completed sprint setup failed");

    await page.goto(`${WS}/analytics?tab=sprints&sprint=${completedSprintId}`);

    await expect(page.getByRole("heading", { name: completedSprintName })).toBeVisible();
    await page.getByRole("link", { name: "Sprint Planning" }).click();

    await expect(page).toHaveURL(
      `${WS}/projects/${completedSprintProjectId}/sprint-planning?sprint=${completedSprintId}`
    );
    await expect(page.getByText(completedSprintName)).toBeVisible();
    await expect(page.getByText("Completed sprint scope is read-only.")).toBeVisible();
  });
});
