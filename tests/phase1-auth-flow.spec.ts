import { test, expect } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/types";

/**
 * Phase 1 Verification #1 (from issue #3):
 * Sign up → log in → see onboarding → create workspace → create first project → land on board
 *
 * Uses the Supabase admin API to create a confirmed test user,
 * then drives the full flow through the browser.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEST_EMAIL = `e2e-${Date.now()}@test.flow.dev`;
const TEST_PASSWORD = "testpassword123";
const TEST_FULL_NAME = "E2E Tester";
const TEST_WORKSPACE_NAME = `Test Workspace ${Date.now()}`;
const TEST_WORKSPACE_SLUG = `test-ws-${Date.now()}`;

let adminClient: SupabaseClient<Database>;
let testUserId: string | null = null;

test.describe.serial("Phase 1: Auth → Onboarding → Board", () => {
  test.beforeAll(async () => {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Create a confirmed test user via admin API
    const { data, error } = await adminClient.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: TEST_FULL_NAME },
    });

    if (error) throw new Error(`Failed to create test user: ${error.message}`);
    testUserId = data.user.id;
  });

  test.afterAll(async () => {
    if (!testUserId) return;

    // Clean up: delete workspace members, workspaces, projects, labels, then user
    const { data: memberships } = await adminClient
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", testUserId);

    if (memberships?.length) {
      const wsIds = memberships.map((m) => m.workspace_id);

      // Delete projects + labels for these workspaces
      const { data: projects } = await adminClient
        .from("projects")
        .select("id")
        .in("workspace_id", wsIds);

      if (projects?.length) {
        const projectIds = projects.map((p) => p.id);
        await adminClient.from("labels").delete().in("project_id", projectIds);
        await adminClient.from("projects").delete().in("workspace_id", wsIds);
      }

      // Delete invites
      await adminClient.from("workspace_invites").delete().in("workspace_id", wsIds);

      // Delete membership then workspace
      await adminClient.from("workspace_members").delete().eq("user_id", testUserId);
      await adminClient.from("workspaces").delete().in("id", wsIds);
    }

    // Delete profile and auth user
    await adminClient.from("profiles").delete().eq("id", testUserId);
    await adminClient.auth.admin.deleteUser(testUserId);
  });

  test("1. Login page renders correctly", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByText("Sign in to your workspace")).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("2. Signup page renders correctly", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.getByText("Create your account")).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Account" })
    ).toBeVisible();
  });

  test("3. Log in → redirected to onboarding", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();

    // Should redirect to onboarding since user has no workspace
    await expect(page).toHaveURL(/onboarding/, { timeout: 10000 });
  });

  test("4. Onboarding creates the workspace and first project", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/onboarding/, { timeout: 10000 });

    // Step 1 UI
    await expect(page.getByText("Set up your workspace")).toBeVisible();
    await expect(page.getByText("Step 1 of 2", { exact: false })).toBeVisible();

    // Fill workspace name
    await page.getByPlaceholder("Acme Inc").fill(TEST_WORKSPACE_NAME);

    // Slug should auto-generate
    const slugInput = page.locator('input[name="slug"]');
    await expect(slugInput).not.toHaveValue("");

    // Override slug with our unique one
    await slugInput.fill("");
    await slugInput.fill(TEST_WORKSPACE_SLUG);

    // Select team size
    await page.getByRole("button", { name: "6 – 20" }).click();

    // Submit
    await page.getByRole("button", { name: "Continue" }).click();

    // Should move to step 2
    await expect(page.getByText("Create your first project")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Step 2 of 2", { exact: false })).toBeVisible();

    await page.getByPlaceholder("My First Project").fill("Onboarding Project");
    await page.getByRole("button", { name: "Create Project" }).click();

    await expect(page).toHaveURL(new RegExp(`${TEST_WORKSPACE_SLUG}/projects/.*/board`), {
      timeout: 15000,
    });
    await expect(page.getByRole("button", { name: /create first issue/i })).toBeVisible();
  });

  test("5. Board-first setup is visible on the new project", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    const { data: workspace, error: workspaceError } = await adminClient
      .from("workspaces")
      .select("id")
      .eq("slug", TEST_WORKSPACE_SLUG)
      .single();

    if (workspaceError || !workspace) {
      throw new Error(
        `Failed to load onboarding workspace: ${workspaceError?.message ?? "missing"}`
      );
    }

    const { data: project, error: projectError } = await adminClient
      .from("projects")
      .select("id")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: true })
      .single();

    if (projectError || !project) {
      throw new Error(
        `Failed to load onboarding project: ${projectError?.message ?? "missing"}`
      );
    }

    await page.goto(`/${TEST_WORKSPACE_SLUG}/projects/${project.id}/board`);

    await expect(page.getByRole("button", { name: /create first issue/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /create first sprint/i })).toBeVisible();
  });

  test("6. Subsequent login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("7. Dashboard shows app shell with sidebar", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Sidebar elements
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Flow")).toBeVisible();
    await expect(sidebar.getByText(TEST_WORKSPACE_NAME)).toBeVisible();
    await expect(sidebar.getByText("Dashboard")).toBeVisible();
    await expect(sidebar.getByText("Inbox")).toBeVisible();
    await expect(sidebar.getByText("My Issues")).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Projects" })).toBeVisible();
    await expect(sidebar.getByText("Settings")).toBeVisible();

    // Header
    await expect(page.getByText("Search...")).toBeVisible();

    // User initials (ET for "E2E Tester")
    await expect(page.getByText("ET", { exact: true })).toBeVisible();
  });

  test("8. Sidebar navigation works", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Navigate to each section
    const sidebar = page.locator("aside");

    await sidebar.getByRole("link", { name: "My Issues" }).click();
    await expect(page).toHaveURL(/my-issues/);

    await sidebar.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/projects/);

    await sidebar.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/settings/);

    await sidebar.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("9. Unauthenticated user is redirected to login", async ({ page }) => {
    // Fresh context, no cookies — should redirect to login
    await page.goto(`/${TEST_WORKSPACE_SLUG}/dashboard`);
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });
});
