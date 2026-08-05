"use client";

import { useSession } from "next-auth/react";
import { DEMO_USER } from "@/constants/event-content";

/** Thin wrapper — falls back to demo identity only when explicitly requested. */
export function useAppSession(options?: { fallbackToDemo?: boolean }) {
  const session = useSession();
  const user = session.data?.user;

  if (user) {
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

  if (options?.fallbackToDemo) {
    return {
      ...session,
      user: {
        id: DEMO_USER.id,
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        image: DEMO_USER.image,
        firstName: DEMO_USER.firstName,
      },
      isAuthenticated: false as const,
    };
  }

  return {
    ...session,
    user: null,
    isAuthenticated: false as const,
  };
}
