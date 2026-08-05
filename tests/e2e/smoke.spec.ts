import { test, expect } from "@playwright/test";

test.describe("phase 1 smoke", () => {
  test("landing scaffold renders event title", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Solana Breakpoint 2026/i }),
    ).toBeVisible();
  });
});
