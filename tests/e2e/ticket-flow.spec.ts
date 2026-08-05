import { test, expect } from "@playwright/test";

test.describe("ticket flow happy path", () => {
  test("sign in → register page → reach payment", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("josephwamiti8711@gmail.com");
    await page.getByLabel("Password").fill("demo");
    await page.getByRole("button", { name: /Continue with email/i }).click();
    await page.waitForURL(/breakpoint2026|profile|register/);

    await page.goto("/breakpoint2026");
    await expect(
      page.getByRole("heading", { name: /Solana Breakpoint 2026/i }),
    ).toBeVisible();

    await page
      .getByRole("link", { name: /Get Ticket/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/event\/breakpoint2026\/register/);

    await expect(page.getByText("Your Info")).toBeVisible();
    await expect(page.getByLabel(/^Name/i)).toBeVisible();
    await expect(page.getByLabel(/^Email/i)).toBeVisible();
    await expect(page.getByText("Add a coupon")).toBeVisible();
    await expect(page.getByText("Total")).toBeVisible();

    await page.getByLabel(/^Name/i).fill("Joseph Wamiti");
    await page.getByLabel(/^Email/i).fill("josephwamiti8711@gmail.com");
    await page.getByLabel(/Legal Name/i).fill("Joseph Wamiti");
    await page.getByLabel(/company/i).fill("Independent");
    await page.getByLabel(/country/i).selectOption("Kenya");
    await page.getByLabel(/How long have you participated/i).selectOption("1–2 years");
    await page.getByRole("button", { name: /Select one or more/i }).click();
    await page.getByRole("option", { name: "DeFi" }).click();
    await page.keyboard.press("Escape");
    await page.getByText(/Terms and Conditions of the event/i).click();
    await page.getByText(/Code of Conduct/i).click();
    await page.getByText(/non-refundable/i).click();

    await expect(page.getByRole("heading", { name: /^Payment$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Pay with Wallet/i })).toBeVisible();
    await expect(page.getByText("USDC on Solana")).toBeVisible();
  });
});
