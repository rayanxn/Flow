import { test, expect } from "@playwright/test";

/**
 * Smoke test — verifies authenticated storageState works.
 * This test navigates to the dashboard (a protected route)
 * without logging in. If auth setup is working, the page
 * loads normally instead of redirecting to /login.
 */
test("authenticated user can access dashboard", async ({ page }) => {
  await page.goto("/pw-workspace/dashboard");
  await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
  await expect(page.locator("aside")).toBeVisible();
});
