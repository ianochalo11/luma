import { test, expect } from "@playwright/test";

test.describe("ticket flow happy path", () => {
  test("register page shows form + payment chrome", async ({ page }) => {
    await page.goto("/event/breakpoint2026/register");

    await expect(page.getByRole("heading", { name: "Your Info" })).toBeVisible();
    await expect(page.getByPlaceholder("Your Name")).toBeVisible();
    await expect(page.getByPlaceholder("you@email.com")).toBeVisible();
    await expect(page.getByLabel(/Legal Name/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Which category does your product/i }),
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Payment" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Pay with Wallet/i })).toBeVisible();
    await expect(page.getByText("USDC on Solana")).toBeVisible();

    await expect(
      page.getByRole("complementary", { name: /Order summary/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Add a coupon" })).toBeVisible();
    await expect(page.getByText("Total")).toBeVisible();
    await expect(page.getByText("$550.00")).toBeVisible();

    await expect(
      page.getByRole("link", { name: /Close and return to event/i }),
    ).toBeVisible();
  });

  test("complete form submits without Coming Soon dialog", async ({ page }) => {
    await page.goto("/event/breakpoint2026/register");

    await page.getByPlaceholder("Your Name").fill("Ada Lovelace");
    await page.getByPlaceholder("you@email.com").fill("ada@example.com");
    await page.getByLabel(/Legal Name/i).fill("Ada Lovelace");
    await page.getByLabel(/What company/i).fill("Analytical Engines");
    await page.getByLabel(/job title/i).fill("Mathematician");
    await page.getByLabel(/What country/i).selectOption({ label: "United Kingdom" });
    await page.getByLabel(/How long have you been/i).selectOption({ index: 1 });

    await page.getByRole("button", { name: /Which category does your product/i }).click();
    await page.getByRole("listbox").getByRole("option", { name: "DeFi" }).click();
    await page.keyboard.press("Escape");

    await page.getByRole("checkbox").nth(0).check();
    await page.getByRole("checkbox").nth(1).check();
    await page.getByRole("checkbox").nth(2).check();

    await page.getByRole("button", { name: /Pay with Wallet/i }).click();
    await expect(page.getByRole("heading", { name: "Coming Soon" })).toHaveCount(0);
  });
});
