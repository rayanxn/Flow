import { test as setup, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Stable test user — reused across runs so storageState stays valid
const TEST_EMAIL = "playwright@test.flow.dev";
const TEST_PASSWORD = "playwrightTest!2026";
const TEST_FULL_NAME = "Playwright Bot";
const AUTH_FILE = "tests/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Ensure the test user exists (idempotent)
  const { data: existing } = await admin.auth.admin.listUsers();
  const alreadyExists = existing?.users?.find(
    (u) => u.email === TEST_EMAIL
  );

  if (!alreadyExists) {
    const { error } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: TEST_FULL_NAME },
    });
    if (error) throw new Error(`Failed to create test user: ${error.message}`);
  }

  // Log in via the UI
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();

  // Wait for redirect away from login (onboarding or dashboard)
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

  // If landed on onboarding (first run), create a workspace
  if (page.url().includes("/onboarding")) {
    // Check if we see the workspace setup form
    const setupHeading = page.getByText("Set up your workspace");
    if (await setupHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.getByPlaceholder("Acme Inc").fill("Playwright Workspace");
      const slugInput = page.locator('input[name="slug"]');
      await slugInput.fill("pw-workspace");
      await page.getByRole("button", { name: "6 – 20" }).click();
      await page.getByRole("button", { name: "Continue" }).click();

      // Step 2: skip invites
      await expect(page.getByText("Invite your team")).toBeVisible({ timeout: 10000 });
      await page.getByRole("button", { name: /skip/i }).click();

      // Step 3: skip project creation
      await expect(page.getByRole("heading", { name: /project/i })).toBeVisible({ timeout: 10000 });
      await page.getByRole("button", { name: /skip|finish/i }).click();

      // Wait for dashboard
      await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    }
  }

  // Save authenticated state
  await page.context().storageState({ path: AUTH_FILE });
});
