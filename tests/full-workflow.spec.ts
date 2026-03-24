import { test, expect } from "@playwright/test";

const WS = "/pw-workspace";

test.describe.serial("Full workflow: project → issues → board", () => {
  const projectName = `Test Project ${Date.now()}`;

  test("1. Create a project", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();

    // Open create project modal
    await page.getByRole("button", { name: "New Project" }).click();
    await expect(page.getByRole("heading", { name: "New Project" })).toBeVisible();

    // Fill form
    await page.getByPlaceholder("e.g. Mobile App").fill(projectName);
    await page.getByPlaceholder("What is this project about?").fill("E2E test project");

    // Pick a color
    const colorButtons = page.locator("[role='dialog'] button.rounded-full");
    await colorButtons.first().click();

    // Submit
    await page.getByRole("button", { name: "Create Project" }).click();

    // Modal closes, project card appears on the projects page
    await expect(page.getByRole("heading", { name: "New Project" })).not.toBeVisible({ timeout: 5000 });
    const main = page.locator("main");
    const projectCard = main.getByRole("link", { name: new RegExp(projectName) });
    await expect(projectCard).toBeVisible({ timeout: 5000 });
    await expect(projectCard.getByText("0 issues")).toBeVisible();

    await page.screenshot({ path: "tests/screenshots/01-project-created.png", fullPage: true });
  });

  test("2. Navigate to project and create issues", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    const main = page.locator("main");
    await expect(main.getByText(projectName).first()).toBeVisible({ timeout: 5000 });

    // Click into the project
    await main.getByRole("link", { name: new RegExp(projectName) }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });

    // Switch to list view
    await page.getByRole("link", { name: "List" }).click();
    await expect(page).toHaveURL(/\/list/, { timeout: 10000 });

    // Create first issue
    await page.getByRole("button", { name: /New Issue/ }).click();
    await expect(page.getByRole("heading", { name: "New Issue" })).toBeVisible();
    await page.getByPlaceholder("Enter issue title...").fill("Setup CI pipeline");
    await page.getByRole("button", { name: "Create Issue" }).click();
    await expect(page.getByRole("heading", { name: "New Issue" })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Setup CI pipeline")).toBeVisible({ timeout: 5000 });

    // Create second issue
    await page.getByRole("button", { name: /New Issue/ }).click();
    await page.getByPlaceholder("Enter issue title...").fill("Write unit tests");
    await page.getByRole("button", { name: "Create Issue" }).click();
    await expect(page.getByRole("heading", { name: "New Issue" })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Write unit tests")).toBeVisible({ timeout: 5000 });

    // Create third issue
    await page.getByRole("button", { name: /New Issue/ }).click();
    await page.getByPlaceholder("Enter issue title...").fill("Deploy to staging");
    await page.getByRole("button", { name: "Create Issue" }).click();
    await expect(page.getByRole("heading", { name: "New Issue" })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Deploy to staging")).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: "tests/screenshots/02-list-with-issues.png", fullPage: true });
  });

  test("3. Board view shows issues in Todo column", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await page.locator("main").getByRole("link", { name: new RegExp(projectName) }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });

    // All 3 issues should be visible (default status: todo)
    await expect(page.getByText("Setup CI pipeline")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Write unit tests")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Deploy to staging")).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: "tests/screenshots/03-board-initial.png", fullPage: true });
  });

  test("4. Drag issue from Todo to In Progress", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await page.locator("main").getByRole("link", { name: new RegExp(projectName) }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });
    await expect(page.getByText("Setup CI pipeline")).toBeVisible({ timeout: 5000 });

    // Find the card by its cursor-grab class and text content
    const card = page.locator(".cursor-grab", { hasText: "Setup CI pipeline" });
    const cardBox = await card.boundingBox();

    // The columns are 280px wide flex items. In Progress is the 2nd column.
    // Find it by the column container that has "In Progress" text
    const inProgressDrop = page
      .locator(".min-w-\\[280px\\]", { hasText: "In Progress" })
      .locator(".min-h-\\[120px\\]");
    const targetBox = await inProgressDrop.boundingBox();

    if (cardBox && targetBox) {
      const startX = cardBox.x + cardBox.width / 2;
      const startY = cardBox.y + cardBox.height / 2;
      const endX = targetBox.x + targetBox.width / 2;
      const endY = targetBox.y + 40;

      // dnd-kit pointer sensor: down → move past 8px activation → move to target → up
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 12, startY, { steps: 5 });
      await page.waitForTimeout(150);
      await page.mouse.move(endX, endY, { steps: 25 });
      await page.waitForTimeout(500);
      await page.mouse.up();
    }

    await page.waitForTimeout(1500);
    await page.screenshot({ path: "tests/screenshots/04-board-after-drag.png", fullPage: true });
  });

  test("5. Quick-add issue from board column", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await page.locator("main").getByRole("link", { name: new RegExp(projectName) }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });
    await expect(page.getByText("Todo")).toBeVisible({ timeout: 5000 });

    // Click the "+" button on the Todo column header
    await page.getByRole("button", { name: "Add issue to Todo" }).click();

    // Fill quick-add input
    const quickInput = page.getByPlaceholder("Issue title...");
    await expect(quickInput).toBeVisible({ timeout: 3000 });
    await quickInput.fill("Quick-added issue");

    // Submit via the exact "Add" submit button
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.waitForTimeout(1500);

    await expect(page.getByText("Quick-added issue")).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: "tests/screenshots/05-board-after-quickadd.png", fullPage: true });
  });
});
