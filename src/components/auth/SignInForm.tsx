"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { EmailOtpAuth } from "@/components/auth/EmailOtpAuth";
import { LINKS } from "@/constants/links";

/** Full-page sign-in (middleware redirects). Mirrors the modal UX. */
export function SignInForm() {
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? LINKS.appRoutes.landing;

  return (
    <div className="mx-auto w-full max-w-[400px] rounded-[22px] bg-white p-8 shadow-2xl">
      <EmailOtpAuth
        showIcon
        onSuccess={async () => {
          await update();
          router.push(callbackUrl);
          router.refresh();
        }}
      />
    </div>
  );
}
