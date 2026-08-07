"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { BrowserVerification } from "@/components/auth/BrowserVerification";
import { EmailOtpAuth } from "@/components/auth/EmailOtpAuth";
import { LINKS } from "@/constants/links";

const VERIFY_MS = 1600;

/** Full-page sign-in (middleware redirects). Mirrors the modal UX. */
export function SignInForm() {
  const router = useRouter();
  const { status, update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? LINKS.appRoutes.landing;
  const authError = searchParams.get("error");
  // Skip verify animation when Auth.js bounced back with an OAuth error.
  const [timerDone, setTimerDone] = useState(Boolean(authError));

  // After Google callback lands here already signed in, leave immediately.
  useEffect(() => {
    if (status !== "authenticated") return;
    router.replace(callbackUrl);
    router.refresh();
  }, [status, callbackUrl, router]);

  useEffect(() => {
    if (authError || status === "authenticated") return;
    const id = window.setTimeout(() => setTimerDone(true), VERIFY_MS);
    return () => window.clearTimeout(id);
  }, [authError, status]);

  // Brief verify UX while we redirect a completed Google session — do not gate
  // the form on session "loading" or Google never becomes clickable.
  const showVerify = status === "authenticated" || !timerDone;

  return (
    <div
      className="mx-auto w-full max-w-[400px] rounded-[22px] bg-white p-8 shadow-2xl"
      aria-busy={showVerify}
      aria-label={showVerify ? "Verifying your browser" : "Sign in"}
    >
      {showVerify ? (
        <BrowserVerification />
      ) : (
        <EmailOtpAuth
          showIcon
          onSuccess={async () => {
            await update();
            router.push(callbackUrl);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
