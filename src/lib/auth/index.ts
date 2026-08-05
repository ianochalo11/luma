import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DEMO_USER } from "@/constants/event-content";

let seeded = false;

/** Lazy-load DB only in Node (authorize/signIn) — keep middleware Edge-safe. */
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
 * - Email (magic-link stub): "Continue with Email" upserts user + signs in.
 * - Credentials demo: joseph / demo for local admin UX.
 * - Google: enabled when AUTH_GOOGLE_ID/SECRET are set.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "email",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        await ensureSeed();
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        if (!email || !email.includes("@")) return null;

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
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = Boolean(user.isAdmin);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/profile") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/admin") ||
        /\/event\/[^/]+\/(register|checkout)/.test(pathname);

      if (isProtected && !session?.user) return false;
      if (pathname.startsWith("/admin") && !session?.user?.isAdmin) {
        return false;
      }
      return true;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "breakpoint-dev-secret-change-me",
});
