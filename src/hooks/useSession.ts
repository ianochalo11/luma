"use client";

import { useSession } from "next-auth/react";

/** Session helper — `status === "authenticated"` is the source of truth for signed-in UI. */
export function useAppSession() {
  const session = useSession();
  const user = session.data?.user;

  if (session.status === "authenticated" && user) {
    return {
      ...session,
      user: {
        id: user.id,
        name: user.name ?? "Guest",
        email: user.email ?? "",
        image: user.image ?? null,
        firstName: (user.name ?? "Guest").split(" ")[0] ?? "Guest",
      },
      isAuthenticated: true as const,
    };
  }

  return {
    ...session,
    user: null,
    isAuthenticated: false as const,
  };
}
