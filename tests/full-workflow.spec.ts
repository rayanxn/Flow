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

    // Pick a color (first color button)
    const colorButtons = page.locator("[role='dialog'] button.rounded-full");
    await colorButtons.first().click();

    // Submit
    await page.getByRole("button", { name: "Create Project" }).click();

    // Should redirect to the new project's board view
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });
  });

  test("2. Create issues from list view", async ({ page }) => {
    await page.goto(`${WS}/projects`);

    // Click into the project we just created
    await page.getByRole("link", { name: projectName }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });

    // Switch to list view
    await page.getByRole("link", { name: "List" }).click();
    await expect(page).toHaveURL(/\/list/, { timeout: 10000 });

    // Create first issue
    await page.getByRole("button", { name: /New Issue/ }).click();
    await expect(page.getByRole("heading", { name: "New Issue" })).toBeVisible();
    await page.getByPlaceholder("Enter issue title...").fill("Setup CI pipeline");
    await page.getByRole("button", { name: "Create Issue" }).click();

    // Wait for modal to close and issue to appear
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

    // Take a screenshot of list view with issues
    await page.screenshot({ path: "tests/screenshots/list-with-issues.png", fullPage: true });
  });

  test("3. Board view shows issues in Todo column", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await page.getByRole("link", { name: projectName }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });

    // All 3 issues should be in the Todo column (default status)
    await expect(page.getByText("Setup CI pipeline")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Write unit tests")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Deploy to staging")).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: "tests/screenshots/board-initial.png", fullPage: true });
  });

  test("4. Drag issue from Todo to In Progress", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await page.getByRole("link", { name: projectName }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });

    // Wait for board to load
    await expect(page.getByText("Setup CI pipeline")).toBeVisible({ timeout: 5000 });

    // Find the issue card to drag
    const card = page.getByText("Setup CI pipeline").locator("..").locator("..");

    // Find the "In Progress" column droppable area
    const inProgressColumn = page.getByText("In Progress").locator("..").locator("..");

    // Perform drag and drop
    // dnd-kit uses pointer events, so we need to simulate the full drag gesture
    const cardBox = await card.boundingBox();
    const targetBox = await inProgressColumn.boundingBox();

    if (cardBox && targetBox) {
      const startX = cardBox.x + cardBox.width / 2;
      const startY = cardBox.y + cardBox.height / 2;
      const endX = targetBox.x + targetBox.width / 2;
      const endY = targetBox.y + 100; // Drop near top of column

      // dnd-kit needs: pointerdown → pointermove (past activation distance) → pointermove (to target) → pointerup
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      // Move past the 8px activation distance
      await page.mouse.move(startX + 10, startY, { steps: 3 });
      await page.waitForTimeout(100);
      // Move to target column
      await page.mouse.move(endX, endY, { steps: 15 });
      await page.waitForTimeout(200);
      await page.mouse.up();
    }

    // Wait for potential state update
    await page.waitForTimeout(1000);

    await page.screenshot({ path: "tests/screenshots/board-after-drag.png", fullPage: true });
  });

  test("5. Quick-add issue from board column", async ({ page }) => {
    await page.goto(`${WS}/projects`);
    await page.getByRole("link", { name: projectName }).click();
    await expect(page).toHaveURL(/\/board/, { timeout: 10000 });

    // Wait for board to load
    await expect(page.getByText("Todo")).toBeVisible({ timeout: 5000 });

    // Click the "+" button on the Todo column to quick-add
    // The "+" button is inside each column header
    const todoHeader = page.getByText("Todo").locator("..");
    const plusButton = todoHeader.getByRole("button");
    await plusButton.click();

    // Fill the quick-add input
    const quickInput = page.getByPlaceholder("Issue title...");
    await expect(quickInput).toBeVisible({ timeout: 3000 });
    await quickInput.fill("Quick-added issue");

    // Click Add
    await page.getByRole("button", { name: "Add" }).click();

    // Verify the issue appeared
    await page.waitForTimeout(1000);
    await expect(page.getByText("Quick-added issue")).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: "tests/screenshots/board-after-quickadd.png", fullPage: true });
  });
});
