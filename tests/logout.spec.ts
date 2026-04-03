import { expect, test } from "@playwright/test";

test("authenticated user can log out from the account menu", async ({ page }) => {
  await page.goto("/pw-workspace/dashboard");
  await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });

  await page.getByRole("button", { name: "Open account menu" }).click();
  await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();

  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  await expect(page.getByText("Welcome back")).toBeVisible();

  await page.goto("/pw-workspace/dashboard");
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
});
