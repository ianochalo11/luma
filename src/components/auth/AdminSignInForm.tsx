"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { EmailOtpAuth } from "@/components/auth/EmailOtpAuth";
import { ADMIN_ALLOWED_EMAIL, ADMIN_BASE_PATH } from "@/constants/admin";

/** Admin console sign-in — OTP UI only (no browser verification), locked to admin email. */
export function AdminSignInForm() {
  const router = useRouter();
  const { status, data: session, update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? ADMIN_BASE_PATH;

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.isAdmin) {
      router.replace(
        callbackUrl.startsWith(ADMIN_BASE_PATH) ? callbackUrl : ADMIN_BASE_PATH,
      );
      router.refresh();
      return;
    }
    router.replace("/");
  }, [status, session?.user?.isAdmin, callbackUrl, router]);

  if (status === "authenticated") {
    return (
      <div
        className="mx-auto w-full max-w-[400px] rounded-[22px] bg-white p-8 shadow-2xl"
        aria-busy
        aria-label="Signing in"
      >
        <div className="h-40 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  return (
    <div
      className="mx-auto w-full max-w-[400px] rounded-[22px] bg-white p-8 shadow-2xl"
      aria-label="Admin sign in"
    >
      <EmailOtpAuth
        showIcon
        variant="admin"
        allowedEmail={ADMIN_ALLOWED_EMAIL}
        onSuccess={async () => {
          const next = await update();
          if (next?.user?.isAdmin) {
            router.push(
              callbackUrl.startsWith(ADMIN_BASE_PATH) ? callbackUrl : ADMIN_BASE_PATH,
            );
            router.refresh();
            return;
          }
          router.replace("/");
        }}
      />
    </div>
  );
}
