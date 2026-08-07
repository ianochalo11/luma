"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

/** Session helper — `status === "authenticated"` is the source of truth for signed-in UI. */
export function useAppSession() {
  const session = useSession();
  const raw = session.data?.user;

  const user = useMemo(() => {
    if (session.status !== "authenticated" || !raw) return null;
    const name = raw.name ?? "Guest";
    return {
      id: raw.id,
      name,
      email: raw.email ?? "",
      image: raw.image ?? null,
      firstName: name.split(" ")[0] ?? "Guest",
      isAdmin: Boolean(raw.isAdmin),
    };
  }, [session.status, raw]);

  if (user) {
    return {
      ...session,
      user,
      isAuthenticated: true as const,
    };
  }

  return {
    ...session,
    user: null,
    isAuthenticated: false as const,
  };
}
