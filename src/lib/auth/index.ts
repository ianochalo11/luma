import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DEMO_USER } from "@/constants/event-content";
import { authConfig } from "@/lib/auth/config";

let seeded = false;

/** Lazy-load DB only in Node (authorize/signIn). */
async function ensureSeed() {
  if (seeded) return;
  try {
    const { seedDatabase } = await import("@/lib/db/seed");
    await seedDatabase();
    seeded = true;
  } catch (err) {
    console.error("[auth] DB seed failed:", err);
  }
}

async function upsertUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  authProvider: "email" | "google" | "credentials" | "github";
}) {
  const { upsertUserOnSignIn } = await import("@/lib/db/repositories/users");
  return upsertUserOnSignIn(input);
}

/**
 * Auth.js v5
 * - Email OTP: Continue with Email → Resend code → verify via `email-otp`.
 * - Credentials demo: joseph / demo for local admin UX.
 * - Google: enabled when AUTH_GOOGLE_ID/SECRET are set.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        await ensureSeed();
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const code = String(credentials?.code ?? "").trim();
        if (!email || !email.includes("@") || !/^\d{6}$/.test(code)) return null;

        const { verifyOtp } = await import("@/lib/auth/otp");
        const result = await verifyOtp(email, code);
        if (!result.ok) return null;

        const user = await upsertUser({
          email,
          name: email === DEMO_USER.email.toLowerCase() ? DEMO_USER.name : undefined,
          authProvider: "email",
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
        };
      },
    }),
    Credentials({
      id: "email",
      name: "Email (legacy)",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize() {
        return null;
      },
    }),
    Credentials({
      id: "credentials",
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await ensureSeed();
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        if (
          email === DEMO_USER.email.toLowerCase() &&
          (password === "demo" || password.length >= 1)
        ) {
          const user = await upsertUser({
            email: DEMO_USER.email,
            name: DEMO_USER.name,
            image: DEMO_USER.image,
            authProvider: "credentials",
          });
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
          };
        }

        if (password.length >= 4) {
          const user = await upsertUser({
            email,
            authProvider: "credentials",
          });
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
          };
        }

        return null;
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await ensureSeed();
        const dbUser = await upsertUser({
          email: user.email,
          name: user.name,
          image: user.image,
          authProvider: "google",
        });
        user.id = dbUser.id;
        user.isAdmin = dbUser.isAdmin;
      }
      return true;
    },
  },
});
