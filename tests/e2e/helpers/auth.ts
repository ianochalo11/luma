import type { APIRequestContext, Page } from "@playwright/test";

const DEMO_EMAIL = "josephwamiti8711@gmail.com";

/**
 * Establish a NextAuth session via the credentials provider (not the OTP UI).
 * Product sign-in remains email OTP; this keeps e2e deterministic without Resend.
 */
export async function signInWithCredentials(
  page: Page,
  opts?: { email?: string; password?: string },
) {
  const email = opts?.email ?? DEMO_EMAIL;
  const password = opts?.password ?? "demo";
  await authenticate(page.request, email, password);
  await page.goto("/");
}

async function authenticate(request: APIRequestContext, email: string, password: string) {
  const csrfRes = await request.get("/api/auth/csrf");
  if (!csrfRes.ok()) {
    throw new Error(`Failed to fetch CSRF token: ${csrfRes.status()}`);
  }
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };

  const res = await request.post("/api/auth/callback/credentials", {
    form: {
      csrfToken,
      email,
      password,
      redirect: "false",
      json: "true",
    },
  });

  if (!res.ok()) {
    throw new Error(`Credentials sign-in failed: ${res.status()} ${await res.text()}`);
  }
}
