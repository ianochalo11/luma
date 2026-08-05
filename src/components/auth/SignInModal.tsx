"use client";

import { useEffect, useId, useState } from "react";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { Fingerprint, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

/**
 * Luma-style centered sign-in modal:
 * icon · welcome · email/phone · Continue · divider · Google · Passkey
 */
export function SignInModal({ open, onClose, onSuccess }: SignInModalProps) {
  const titleId = useId();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passkeyHint, setPasskeyHint] = useState<string | null>(null);
  const [googleHint, setGoogleHint] = useState<string | null>(null);
  const [magicHint, setMagicHint] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function continueWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMagicHint(null);
    setPasskeyHint(null);

    if (mode === "phone") {
      setError("Phone sign-in is coming soon. Use email for now.");
      return;
    }

    const value = email.trim().toLowerCase();
    if (!value.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setPending(true);
    // Magic-link stub: show brief feedback then sign in via email credentials
    setMagicHint("Sending magic link… (demo: signing you in directly)");

    const result = await signIn("email", {
      email: value,
      redirect: false,
    });

    setPending(false);
    if (result?.error) {
      setError("Could not sign in. Try again.");
      setMagicHint(null);
      return;
    }

    await onSuccess();
  }

  async function continueWithGoogle() {
    setGoogleHint(null);
    setError(null);
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        setGoogleHint(
          "Google sign-in isn’t configured yet. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET, or continue with email.",
        );
        return;
      }
      if (result?.ok) await onSuccess();
    } catch {
      setGoogleHint("Google sign-in isn’t configured yet. Use email for now.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close sign in"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:bg-surface-muted hover:text-foreground absolute top-4 right-4 rounded-full p-1.5 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="text-foreground mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0eef6]">
            <LumaMark className="h-7 w-7" />
          </div>
          <h2
            id={titleId}
            className="font-title text-foreground text-[22px] font-semibold tracking-tight"
          >
            Welcome to Luma
          </h2>
          <p className="text-muted mt-1.5 text-sm">Please sign in or sign up below.</p>
        </div>

        <form onSubmit={continueWithEmail} className="mt-7 space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label
                htmlFor="luma-signin-input"
                className="text-foreground text-sm font-medium"
              >
                {mode === "email" ? "Email" : "Phone Number"}
              </label>
              <button
                type="button"
                className="text-brand-50 text-sm font-medium hover:underline"
                onClick={() => {
                  setMode((m) => (m === "email" ? "phone" : "email"));
                  setError(null);
                }}
              >
                {mode === "email" ? "Use Phone Number" : "Use Email"}
              </button>
            </div>
            <input
              id="luma-signin-input"
              type={mode === "email" ? "email" : "tel"}
              autoComplete={mode === "email" ? "email" : "tel"}
              required
              value={mode === "email" ? email : phone}
              onChange={(e) =>
                mode === "email" ? setEmail(e.target.value) : setPhone(e.target.value)
              }
              placeholder={mode === "email" ? "you@example.com" : "+1 555 000 0000"}
              className="border-border text-foreground placeholder:text-faint focus-visible:border-foreground h-11 w-full rounded-lg border bg-white px-3 text-sm transition-colors outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {magicHint && (
            <p className="text-muted text-sm" role="status">
              {magicHint}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#171717] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending
              ? "Continuing…"
              : mode === "email"
                ? "Continue with Email"
                : "Continue with Phone"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border-subtle w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="text-faint bg-white px-3">OR</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => void continueWithGoogle()}
            className={cn(
              "border-border inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border bg-white",
              "text-foreground hover:bg-surface-muted text-sm font-medium transition-colors",
            )}
          >
            <FaGoogle className="h-4 w-4" />
            Sign in with Google
          </button>
          {googleHint && <p className="text-muted text-xs">{googleHint}</p>}

          <button
            type="button"
            onClick={() =>
              setPasskeyHint(
                "Passkeys (WebAuthn) aren’t wired yet — use email to continue.",
              )
            }
            className={cn(
              "border-border inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border bg-white",
              "text-foreground hover:bg-surface-muted text-sm font-medium transition-colors",
            )}
          >
            <Fingerprint className="h-4 w-4" />
            Sign in with Passkey
          </button>
          {passkeyHint && <p className="text-muted text-xs">{passkeyHint}</p>}
        </div>
      </div>
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
