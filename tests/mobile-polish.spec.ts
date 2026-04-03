import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:3001";
const WS = "/pw-workspace";

test.use({ viewport: { width: 375, height: 812 } });

async function openFrontendProject(page: import("@playwright/test").Page) {
  await page.goto(`${BASE_URL}${WS}/projects`);
  await page.getByRole("link", { name: /Frontend v2\.4/i }).click();
}

test("dashboard stacks recent activity below the primary content on mobile", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}${WS}/dashboard`);

  const primary = page.getByRole("heading", { name: "My Top Issues" });
  const secondary = page.getByRole("heading", { name: "Recent Activity" });

  await expect(primary).toBeVisible();
  await expect(secondary).toBeVisible();

  const primaryBox = await primary.boundingBox();
  const secondaryBox = await secondary.boundingBox();

  expect(primaryBox).not.toBeNull();
  expect(secondaryBox).not.toBeNull();
  expect((secondaryBox?.y ?? 0) - (primaryBox?.y ?? 0)).toBeGreaterThan(120);
});

test("command palette stays inside the mobile viewport", async ({ page }) => {
  await page.goto(`${BASE_URL}${WS}/dashboard`);
  await page.getByRole("button", { name: "Search..." }).click();

  const input = page.getByPlaceholder("Search issues, projects, actions...");
  await expect(input).toBeVisible();

  const dialog = page.locator('[cmdk-dialog][data-state="open"]').filter({ has: input });

  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(375);
});

test("project tabs remain visible without wrapping on mobile", async ({ page }) => {
  await openFrontendProject(page);

  await expect(page.getByRole("link", { name: "Sprint Planning" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
});

test("my issues shows assigned issue titles as readable mobile cards", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}${WS}/my-issues`);

  const issueTitle = page.getByText("Redesign onboarding flow").first();
  await expect(issueTitle).toBeVisible();

  const issueBox = await issueTitle.boundingBox();
  expect(issueBox).not.toBeNull();
  expect(issueBox?.width ?? 0).toBeGreaterThan(180);
});

test("board columns stack vertically on mobile instead of forcing a horizontal-only kanban", async ({
  page,
}) => {
  await openFrontendProject(page);

  const todo = page.getByRole("region", { name: /Todo column/i });
  const inProgress = page.getByRole("region", { name: /In Progress column/i });

  await expect(todo).toBeVisible();
  await expect(inProgress).toBeVisible();

  const todoBox = await todo.boundingBox();
  const inProgressBox = await inProgress.boundingBox();

  expect(todoBox).not.toBeNull();
  expect(inProgressBox).not.toBeNull();
  expect(todoBox?.width ?? 0).toBeGreaterThan(300);
  expect(inProgressBox?.width ?? 0).toBeGreaterThan(300);
  expect(inProgressBox?.y ?? 0).toBeGreaterThan((todoBox?.y ?? 0) + 300);
});

test("sprint planning stacks backlog and sprint panes on mobile", async ({
  page,
}) => {
  await openFrontendProject(page);
  await page.getByRole("link", { name: "Sprint Planning" }).click();

  const backlogHeading = page.getByRole("heading", { name: "Backlog" });
  const sprintHeading = page.getByText("Sprint 24").first();

  await expect(backlogHeading).toBeVisible();
  await expect(sprintHeading).toBeVisible();

  const backlogBox = await backlogHeading.boundingBox();
  const sprintBox = await sprintHeading.boundingBox();

  expect(backlogBox).not.toBeNull();
  expect(sprintBox).not.toBeNull();
  expect((sprintBox?.y ?? 0) - (backlogBox?.y ?? 0)).toBeGreaterThan(250);
});

test("analytics KPI cards fit the mobile viewport", async ({ page }) => {
  await page.goto(`${BASE_URL}${WS}/analytics`);

  await expect(page.getByText("Issues Completed")).toBeVisible();
  await expect(page.getByText("Avg Cycle Time")).toBeVisible();
  await expect(page.getByText("Throughput", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Points Delivered")).toBeVisible();
});

test("older unread inbox notifications stay visually distinct on mobile", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}${WS}/inbox`);

  const olderUnreadRow = page
    .locator('[role="button"]')
    .filter({ hasText: "Alex commented on FLO-279" });
  await expect(olderUnreadRow).toBeVisible();
  await expect(olderUnreadRow.getByText("UNREAD")).toBeVisible();

  const readRow = page
    .locator('[role="button"]')
    .filter({ hasText: "James moved FLO-288 to Done" });
  await expect(readRow).toBeVisible();
  await expect(readRow.getByText("UNREAD")).toHaveCount(0);
});
