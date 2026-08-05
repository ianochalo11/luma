"use client";

import { SessionProvider } from "next-auth/react";
import { SignInModalProvider } from "@/components/auth/SignInModalProvider";

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SignInModalProvider>{children}</SignInModalProvider>
    </SessionProvider>
  );
}
