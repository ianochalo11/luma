"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Fingerprint } from "lucide-react";
import { DEMO_USER } from "@/constants/event-content";
import { LINKS } from "@/constants/links";

/** Full-page sign-in (middleware redirects). Mirrors the modal UX. */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? LINKS.appRoutes.landing;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setHint("Sending magic link… (demo: signing you in directly)");

    const result = await signIn("email", {
      email: email.trim().toLowerCase(),
      redirect: false,
      callbackUrl,
    });

    setPending(false);
    if (result?.error) {
      setError("Could not sign in. Try again.");
      setHint(null);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="border-border bg-surface mx-auto w-full max-w-[400px] rounded-2xl border p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0eef6]">
          <LumaMark className="h-7 w-7" />
        </div>
        <h1 className="font-title text-[22px] font-semibold tracking-tight">
          Welcome to Luma
        </h1>
        <p className="text-muted mt-1.5 text-sm">Please sign in or sign up below.</p>
        <p className="text-faint mt-2 text-xs">Admin demo: {DEMO_USER.email}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border focus-visible:border-foreground mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && (
          <p className="text-muted text-sm" role="status">
            {hint}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#171717] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Continuing…" : "Continue with Email"}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border-subtle w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface text-faint px-3">OR</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => {
            void signIn("google", { callbackUrl }).catch(() => {
              setHint("Google isn’t configured — use email.");
            });
          }}
          className="border-border hover:bg-surface-muted inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border text-sm font-medium"
        >
          <FaGoogle className="h-4 w-4" />
          Sign in with Google
        </button>
        <button
          type="button"
          onClick={() => setHint("Passkeys aren’t wired yet — use email.")}
          className="border-border hover:bg-surface-muted inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border text-sm font-medium"
        >
          <Fingerprint className="h-4 w-4" />
          Sign in with Passkey
        </button>
      </div>

      <p className="text-muted mt-6 text-center text-sm">
        No account?{" "}
        <Link
          href={LINKS.site.signUp}
          className="text-brand-60 font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

function LumaMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 133 134"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
    </svg>
  );
}
