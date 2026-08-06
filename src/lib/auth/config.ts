import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config for middleware.
 * Providers / DB / Node APIs live in `./index.ts` only.
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = Boolean(user.isAdmin);
      }
      if (trigger === "update") {
        const payload = session as
          { name?: string; user?: { name?: string } } | undefined;
        const nextName =
          typeof payload?.name === "string"
            ? payload.name
            : typeof payload?.user?.name === "string"
              ? payload.user.name
              : null;
        if (nextName) token.name = nextName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.isAdmin = Boolean(token.isAdmin);
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/profile") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/admin");

      if (isProtected && !session?.user) return false;
      if (pathname.startsWith("/admin") && !session?.user?.isAdmin) {
        return false;
      }
      return true;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "breakpoint-dev-secret-change-me",
} satisfies NextAuthConfig;
