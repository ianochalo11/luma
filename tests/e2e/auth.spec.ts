import { test, expect } from "@playwright/test";
import { signInWithCredentials } from "./helpers/auth";

test.describe("credentials auth helper", () => {
  test("establishes a session for the demo admin", async ({ page }) => {
    await signInWithCredentials(page);
    const session = await page.request.get("/api/auth/session");
    expect(session.ok()).toBeTruthy();
    const data = (await session.json()) as { user?: { email?: string } };
    expect(data.user?.email?.toLowerCase()).toBe("josephwamiti8711@gmail.com");
  });
});
