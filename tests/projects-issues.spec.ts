import { test, expect } from "@playwright/test";

// Tests run with NEXT_PUBLIC_MOCK_AUTH=true, using mock data

test.describe("Projects Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/acme-inc/projects");
  });

  test("displays page title and New Project button", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(main.getByRole("button", { name: "New Project" })).toBeVisible();
  });

  test("displays project cards with names", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("Frontend v2.4")).toBeVisible();
    await expect(main.getByText("API Platform")).toBeVisible();
    await expect(main.getByText("Design System")).toBeVisible();
    await expect(main.getByText("Mobile App")).toBeVisible();
  });

  test("project cards show descriptions", async ({ page }) => {
    const main = page.locator("main");
    await expect(
      main.getByText("Main frontend app for v2.4 release")
    ).toBeVisible();
    await expect(
      main.getByText("Core API services, authentication")
    ).toBeVisible();
  });

  test("project cards show issue counts", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("20 issues")).toBeVisible();
    await expect(main.getByText("14 issues")).toBeVisible();
    await expect(main.getByText("9 issues")).toBeVisible();
    await expect(main.getByText("6 issues")).toBeVisible();
  });

  test("project cards show lead names", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("Marcus")).toBeVisible();
    await expect(main.getByText("Elena")).toBeVisible();
    await expect(main.getByText("Sarah")).toBeVisible();
    await expect(main.getByText("Alex")).toBeVisible();
  });

  test("project cards link to board view", async ({ page }) => {
    const main = page.locator("main");
    const frontendCard = main.getByRole("link", { name: /Frontend v2\.4/ });
    await expect(frontendCard).toHaveAttribute(
      "href",
      /\/acme-inc\/projects\/.*\/board/
    );
  });
});

test.describe("Create Project Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/acme-inc/projects");
  });

  test("opens modal when clicking New Project", async ({ page }) => {
    await page.getByRole("button", { name: "New Project" }).click();
    await expect(
      page.getByRole("heading", { name: "New Project" })
    ).toBeVisible();
  });

  test("displays all form fields", async ({ page }) => {
    await page.getByRole("button", { name: "New Project" }).click();

    await expect(page.getByLabel("Project Name")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
    await expect(page.getByText("Color")).toBeVisible();
    await expect(page.getByLabel("Team")).toBeVisible();
    await expect(page.getByText("Private project")).toBeVisible();
  });

  test("displays color picker with 6 colors", async ({ page }) => {
    await page.getByRole("button", { name: "New Project" }).click();

    // Color buttons are 5x5 round buttons (exclude the dialog close button)
    const colorButtons = page
      .locator("[role='dialog']")
      .locator("button.rounded-full.w-5");
    await expect(colorButtons).toHaveCount(6);
  });

  test("displays team dropdown with mock teams", async ({ page }) => {
    await page.getByRole("button", { name: "New Project" }).click();
    const teamSelect = page.getByLabel("Team");
    await expect(teamSelect).toBeVisible();
    await expect(teamSelect.locator("option")).toHaveCount(4); // No team + 3 teams
  });

  test("has Cancel and Create Project buttons", async ({ page }) => {
    await page.getByRole("button", { name: "New Project" }).click();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Project" })
    ).toBeVisible();
  });

  test("closes modal on Cancel", async ({ page }) => {
    await page.getByRole("button", { name: "New Project" }).click();
    await expect(
      page.getByRole("heading", { name: "New Project" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: "New Project" })
    ).not.toBeVisible();
  });
});

test.describe("List View", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the Frontend v2.4 project list view using mock project ID
    await page.goto(
      "/acme-inc/projects/00000000-0000-0000-0000-000000000033/list"
    );
  });

  test("displays status groups", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("In Progress")).toBeVisible();
    await expect(main.getByText("In Review")).toBeVisible();
    await expect(main.getByText("Todo")).toBeVisible();
    await expect(main.getByText("Done")).toBeVisible();
  });

  test("displays issue keys", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("FLO-141")).toBeVisible();
    await expect(main.getByText("FLO-142")).toBeVisible();
  });

  test("displays issue titles", async ({ page }) => {
    const main = page.locator("main");
    await expect(
      main.getByText("Implement drag-and-drop reordering for tasks")
    ).toBeVisible();
    await expect(
      main.getByText("Fix auth token refresh on expired sessions")
    ).toBeVisible();
  });

  test("displays priority badges", async ({ page }) => {
    const main = page.locator("main");
    const priorities = main.getByText(/^P[0-3]$/);
    expect(await priorities.count()).toBeGreaterThan(0);
  });

  test("has New Issue button", async ({ page }) => {
    const main = page.locator("main");
    await expect(
      main.getByRole("button", { name: /New Issue/ })
    ).toBeVisible();
  });

  test("displays column headers", async ({ page }) => {
    const main = page.locator("main");
    // Headers have uppercase CSS but DOM text is mixed-case
    await expect(main.getByText("ID", { exact: true })).toBeVisible();
    await expect(main.getByText("Title", { exact: true }).first()).toBeVisible();
    await expect(main.getByText("Priority", { exact: true }).first()).toBeVisible();
    await expect(main.getByText("Due", { exact: true }).first()).toBeVisible();
  });
});

test.describe("Create Issue Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/acme-inc/projects/00000000-0000-0000-0000-000000000033/list"
    );
  });

  test("opens modal when clicking New Issue", async ({ page }) => {
    await page.getByRole("button", { name: /New Issue/ }).click();
    await expect(
      page.getByRole("heading", { name: "New Issue" })
    ).toBeVisible();
  });

  test("displays all form fields", async ({ page }) => {
    await page.getByRole("button", { name: /New Issue/ }).click();

    const dialog = page.locator("[role='dialog']");
    await expect(dialog.getByLabel("Title")).toBeVisible();
    await expect(dialog.getByLabel("Description")).toBeVisible();
    await expect(dialog.getByLabel("Assignee")).toBeVisible();
    await expect(dialog.getByText("Priority")).toBeVisible();
    await expect(dialog.getByLabel("Project")).toBeVisible();
    await expect(dialog.getByLabel("Sprint")).toBeVisible();
    await expect(dialog.getByText("Labels")).toBeVisible();
  });

  test("displays priority buttons P0-P3", async ({ page }) => {
    await page.getByRole("button", { name: /New Issue/ }).click();

    const dialog = page.locator("[role='dialog']");
    await expect(dialog.getByText("P0", { exact: true })).toBeVisible();
    await expect(dialog.getByText("P1", { exact: true })).toBeVisible();
    await expect(dialog.getByText("P2", { exact: true })).toBeVisible();
    await expect(dialog.getByText("P3", { exact: true })).toBeVisible();
  });

  test("has Cancel and Create Issue buttons", async ({ page }) => {
    await page.getByRole("button", { name: /New Issue/ }).click();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Issue" })
    ).toBeVisible();
  });

  test("shows keyboard shortcut hint", async ({ page }) => {
    await page.getByRole("button", { name: /New Issue/ }).click();
    await expect(page.getByText("to create")).toBeVisible();
  });
});

test.describe("My Issues Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/acme-inc/my-issues");
  });

  test("displays page title", async ({ page }) => {
    const main = page.locator("main");
    await expect(
      main.getByRole("heading", { name: "My Issues" })
    ).toBeVisible();
  });

  test("displays List/Board toggle", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByRole("button", { name: "List" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Board" })).toBeVisible();
  });

  test("displays sort control", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("Sort: Priority")).toBeVisible();
  });

  test("displays issues grouped by status", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("In Progress")).toBeVisible();
    await expect(main.getByText("Todo")).toBeVisible();
    await expect(main.getByText("Done")).toBeVisible();
  });

  test("displays issue keys and titles", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("FLO-139")).toBeVisible();
    await expect(
      main.getByText("Migrate user settings to new API schema")
    ).toBeVisible();
  });

  test("shows project names with colored dots", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByText("API Platform").first()).toBeVisible();
  });

  test("shows priority indicators", async ({ page }) => {
    const main = page.locator("main");
    const priorities = main.getByText(/^P[0-3]$/);
    expect(await priorities.count()).toBeGreaterThan(0);
  });

  test("Done group is collapsed by default", async ({ page }) => {
    const main = page.locator("main");
    // Done group header should be visible
    const doneHeader = main.getByRole("button", { name: /Done/ });
    await expect(doneHeader).toBeVisible();

    // But done issues should not be visible initially
    await expect(
      main.getByText("Implement workspace creation flow")
    ).not.toBeVisible();
  });

  test("can expand collapsed Done group", async ({ page }) => {
    const main = page.locator("main");
    const doneHeader = main.getByRole("button", { name: /Done/ });
    await doneHeader.click();

    await expect(
      main.getByText("Implement workspace creation flow")
    ).toBeVisible();
  });
});
