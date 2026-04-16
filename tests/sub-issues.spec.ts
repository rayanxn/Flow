import { expect, test, type Page } from "@playwright/test";

const WS = "/pw-workspace";
const runId = Date.now().toString(36);
const parentTitle = `Sub-issue parent ${runId}`;
const firstChildTitle = `Sub-issue child A ${runId}`;
const secondChildTitle = `Sub-issue child B ${runId}`;
const thirdChildTitle = `Sub-issue child C ${runId}`;

let parentKey = "";
let selectedSprintId: string | null = null;

async function openSeedProjectList(page: Page) {
  await page.goto(`${WS}/projects`);
  const projectCard = page.locator("main").getByRole("link", {
    name: /Frontend v2\.4/,
  });
  await expect(projectCard).toBeVisible({ timeout: 10000 });
  const boardHref = await projectCard.getAttribute("href");
  expect(boardHref).toMatch(/\/board$/);
  await page.goto(`http://localhost:3000${boardHref}`);
  await expect(page).toHaveURL(new RegExp(`${WS}/projects/.+/board$`), {
    timeout: 10000,
  });
  await page.getByRole("link", { name: "List" }).click();
  await expect(page).toHaveURL(/\/list$/, { timeout: 10000 });
}

async function createChildFromParentDetail(page: Page, title: string, storyPoints: string) {
  await page.getByRole("button", { name: /Add sub-issue/i }).click();
  const dialog = page.locator("[role='dialog']").filter({ hasText: "New Issue" }).last();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(parentKey)).toBeVisible();
  await expect(dialog.getByLabel("Project")).toBeDisabled();
  if (selectedSprintId) {
    await expect(dialog.getByLabel("Sprint")).toHaveValue(selectedSprintId);
  }
  await dialog.getByLabel("Title").fill(title);
  await dialog.getByLabel("Story Points").fill(storyPoints);
  await dialog.getByRole("button", { name: "Create Issue" }).click();
  await expect(dialog).not.toBeVisible({ timeout: 10000 });
}

test.describe.serial("sub-issues hierarchy", () => {
  test("creates sub-issues from the detail panel and shows board progress", async ({
    page,
  }) => {
    await openSeedProjectList(page);

    await page.getByRole("button", { name: /New Issue/ }).click();
    const dialog = page.locator("[role='dialog']").filter({ hasText: "New Issue" }).last();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Title").fill(parentTitle);

    const sprintSelect = dialog.getByLabel("Sprint");
    const sprintOptionCount = await sprintSelect.locator("option").count();
    if (sprintOptionCount > 1) {
      selectedSprintId = await sprintSelect.locator("option").nth(1).getAttribute("value");
      if (selectedSprintId) {
        await sprintSelect.selectOption(selectedSprintId);
      }
    }

    await dialog.getByRole("button", { name: "Create Issue" }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(parentTitle)).toBeVisible({ timeout: 10000 });

    await page.getByText(parentTitle).click();
    const detail = page.locator("[role='dialog']").last();
    await expect(detail).toBeVisible({ timeout: 10000 });
    parentKey = (await detail.getByText(/^FLO-\d+$/).first().textContent())?.trim() ?? "";
    expect(parentKey).toMatch(/^FLO-\d+$/);

    await createChildFromParentDetail(page, firstChildTitle, "3");
    await expect(detail.getByText(firstChildTitle)).toBeVisible({ timeout: 10000 });

    await createChildFromParentDetail(page, secondChildTitle, "5");
    await expect(detail.getByText(secondChildTitle)).toBeVisible({ timeout: 10000 });
    await expect(detail.getByText("0/2 sub-issues done")).toBeVisible();
    await expect(detail.getByText("8 pts from sub-issues")).toBeVisible();

    await page.getByRole("link", { name: "Board" }).click();
    await expect(page).toHaveURL(/\/board$/, { timeout: 10000 });

    const parentCard = page.locator(`[aria-label*="${parentTitle}"]`).first();
    await expect(parentCard).toContainText("0/2");

    const firstChildCard = page.locator(`[aria-label*="${firstChildTitle}"]`).first();
    await expect(firstChildCard).toContainText(`parent: ${parentKey}`);
    await expect(
      page.locator(`[aria-label*="${secondChildTitle}"]`).first(),
    ).toContainText(`parent: ${parentKey}`);

    await firstChildCard.click();
    const childDetail = page.locator("[role='dialog']").last();
    await expect(childDetail.getByText(parentKey)).toBeVisible();
    await childDetail.getByRole("button", { name: "Done" }).click();
    await expect(parentCard).toContainText("1/2", { timeout: 10000 });
  });

  test("renders a collapsible list tree and supports parent selection in the create modal", async ({
    page,
  }) => {
    await openSeedProjectList(page);

    await expect(page.getByText(firstChildTitle)).not.toBeVisible();
    const expandButton = page.getByLabel("Expand sub-issues").first();
    await expandButton.click();
    await expect(page.getByText(firstChildTitle)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(secondChildTitle)).toBeVisible();

    const collapseButton = page.getByLabel("Collapse sub-issues").first();
    await collapseButton.click();
    await expect(page.getByText(firstChildTitle)).not.toBeVisible();

    await page.getByRole("button", { name: /New Issue/ }).click();
    const dialog = page.locator("[role='dialog']").filter({ hasText: "New Issue" }).last();
    await expect(dialog).toBeVisible();

    const parentSearch = dialog.getByPlaceholder("Search for a parent issue...");
    await parentSearch.fill(parentTitle);
    await dialog.getByRole("button", { name: new RegExp(parentKey) }).click();
    await expect(dialog.getByText(parentKey)).toBeVisible();
    await expect(dialog.getByLabel("Project")).toBeDisabled();
    if (selectedSprintId) {
      await expect(dialog.getByLabel("Sprint")).toHaveValue(selectedSprintId);
    }

    await dialog.getByLabel("Title").fill(thirdChildTitle);
    await dialog.getByRole("button", { name: "Create Issue" }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10000 });

    await page.getByLabel("Expand sub-issues").first().click();
    await expect(page.getByText(thirdChildTitle)).toBeVisible({ timeout: 10000 });
  });
});
