"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { signIn as signInWithPasskey } from "next-auth/webauthn";
import { FaGoogle } from "react-icons/fa";
import { ChevronLeft, ClipboardPaste, Fingerprint, LogIn, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Step = "contact" | "code";

interface EmailOtpAuthProps {
  onSuccess: () => void | Promise<void>;
  /** Show the LogIn icon (modal). Full-page can hide it. */
  showIcon?: boolean;
  className?: string;
  /** Admin console: login copy only, no phone pivot, optional email allow-list. */
  variant?: "default" | "admin";
  /** When set (admin), only this email may request a code / continue. */
  allowedEmail?: string;
}

/**
 * Luma-style email OTP: welcome → continue with email → 6-digit code.
 * Phone can be collected first; verification always continues via email.
 */
export function EmailOtpAuth({
  onSuccess,
  showIcon = true,
  className,
  variant = "default",
  allowedEmail,
}: EmailOtpAuthProps) {
  const isAdmin = variant === "admin";
  const allowlist = allowedEmail?.toLowerCase().trim() || null;
  const titleId = useId();
  const contactInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<Step>("contact");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  /** After phone continue, soft-pivot to email without mentioning SMS limits. */
  const [needsEmail, setNeedsEmail] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [pending, setPending] = useState(false);
  const [passkeyPending, setPasskeyPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleHint, setGoogleHint] = useState<string | null>(null);
  const [passkeyHint, setPasskeyHint] = useState<string | null>(null);
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  useEffect(() => {
    let cancelled = false;
    void getProviders().then((providers) => {
      if (cancelled) return;
      setGoogleAvailable(Boolean(providers?.google));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function sendCode(targetEmail: string) {
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: targetEmail,
        ...(isAdmin ? { admin: true } : {}),
      }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Could not send code.");
    }
  }

  function isValidPhone(value: string) {
    const digitsOnly = value.replace(/\D/g, "");
    return digitsOnly.length >= 8 && digitsOnly.length <= 15;
  }

  async function continueWithContact(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPasskeyHint(null);
    setGoogleHint(null);

    if (!isAdmin && mode === "phone" && !needsEmail) {
      const value = phone.trim();
      if (!isValidPhone(value)) {
        setError("Enter a valid phone number.");
        return;
      }
      setNeedsEmail(true);
      setMode("email");
      setError(null);
      window.setTimeout(() => contactInputRef.current?.focus(), 50);
      return;
    }

    const value = email.trim().toLowerCase();
    if (!value.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (allowlist && value !== allowlist) {
      setError("This email is not authorized for admin access.");
      return;
    }

    setPending(true);
    try {
      await sendCode(value);
      setStep("code");
      setDigits(["", "", "", "", "", ""]);
      setResendIn(60);
      window.setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code.");
    } finally {
      setPending(false);
    }
  }

  async function submitCode(code: string) {
    setError(null);
    setPending(true);
    const result = await signIn("email-otp", {
      email: email.trim().toLowerCase(),
      code,
      redirect: false,
    });
    setPending(false);

    if (result?.error) {
      setError("Incorrect or expired code. Try again.");
      return;
    }
    await onSuccess();
  }

  function onDigitChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""];
      chars.forEach((c, i) => {
        next[i] = c;
      });
      setDigits(next);
      const focusAt = Math.min(chars.length, 5);
      inputRefs.current[focusAt]?.focus();
      if (chars.length === 6) void submitCode(chars.join(""));
      return;
    }

    const next = [...digits];
    next[index] = cleaned.slice(-1);
    setDigits(next);
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
    const code = next.join("");
    if (code.length === 6 && next.every(Boolean)) void submitCode(code);
  }

  function onDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function pasteCode() {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, "").slice(0, 6);
      if (!cleaned) return;
      const next = ["", "", "", "", "", ""];
      cleaned.split("").forEach((c, i) => {
        next[i] = c;
      });
      setDigits(next);
      if (cleaned.length === 6) void submitCode(cleaned);
      else inputRefs.current[cleaned.length]?.focus();
    } catch {
      setError("Could not read clipboard.");
    }
  }

  async function resendCode() {
    if (resendIn > 0 || pending) return;
    setError(null);
    setPending(true);
    try {
      await sendCode(email.trim().toLowerCase());
      setResendIn(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setPending(false);
    }
  }

  async function continueWithGoogle() {
    setGoogleHint(null);
    setError(null);
    try {
      const providers = await getProviders();
      // next-auth hard-navigates to /sign-in when "google" is missing — don't call signIn.
      if (!providers?.google) {
        setGoogleAvailable(false);
        setGoogleHint(
          "Google sign-in isn’t configured. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to .env.local, restart the dev server, and use a Google OAuth client with redirect URI http://localhost:3000/api/auth/callback/google.",
        );
        return;
      }

      // OAuth must leave the page for Google. With redirect:false we still have to
      // navigate to result.url — otherwise Auth never reaches Google.
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.href,
      });
      if (result?.error) {
        setGoogleHint(
          "Google sign-in failed. Check AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET and the Google Cloud redirect URI, or continue with email.",
        );
        return;
      }
      if (result?.url) {
        window.location.assign(result.url);
        return;
      }
      if (result?.ok) await onSuccess();
    } catch {
      setGoogleHint("Google sign-in isn’t available right now. Use email for now.");
    }
  }

  async function continueWithPasskey() {
    setPasskeyHint(null);
    setGoogleHint(null);
    setError(null);
    setPasskeyPending(true);
    try {
      const result = await signInWithPasskey("passkey", { redirect: false });
      if (!result) {
        setPasskeyHint(
          "Passkey sign-in didn’t complete. Try again, or continue with email.",
        );
        return;
      }
      if (result.error) {
        setPasskeyHint(
          "No matching passkey, or the request was cancelled. Add a passkey in Settings after signing in with email.",
        );
        return;
      }
      if (result.ok) await onSuccess();
    } catch {
      setPasskeyHint(
        "Passkeys aren’t available in this browser, or the prompt was dismissed. Use email instead.",
      );
    } finally {
      setPasskeyPending(false);
    }
  }

  const showPhoneField = !isAdmin && mode === "phone" && !needsEmail;

  return (
    <div className={className}>
      {step === "contact" ? (
        <>
          {needsEmail ? (
            <button
              type="button"
              onClick={() => {
                setNeedsEmail(false);
                setMode("phone");
                setError(null);
                window.setTimeout(() => contactInputRef.current?.focus(), 50);
              }}
              className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f4f5] text-[#111111] transition-colors hover:bg-[#e4e4e7]"
              aria-label="Back"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            showIcon && (
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <LogIn
                  className="h-5 w-5 text-neutral-700"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
            )
          )}
          <h2
            id={titleId}
            className="text-[22px] font-semibold tracking-tight text-[#111111]"
          >
            {needsEmail
              ? "Confirm your email"
              : isAdmin
                ? "Admin sign in"
                : "Welcome to Luma"}
          </h2>
          <p className="mt-1.5 text-sm text-[#6b7280]">
            {needsEmail
              ? "We’ll send a one-time code to your email to finish signing in."
              : isAdmin
                ? "Sign in with your admin email. New accounts can’t be created here."
                : "Please sign in or sign up below."}
          </p>

          <form onSubmit={continueWithContact} className="mt-7 space-y-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="luma-signin-input" className="text-sm text-[#6b7280]">
                {showPhoneField ? "Phone" : "Email"}
              </label>
              {!isAdmin && !needsEmail && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#111111]"
                  onClick={() => {
                    setMode((m) => (m === "email" ? "phone" : "email"));
                    setError(null);
                    window.setTimeout(() => contactInputRef.current?.focus(), 50);
                  }}
                >
                  {mode === "email" ? (
                    <>
                      <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Use Phone Number
                    </>
                  ) : (
                    "Use Email"
                  )}
                </button>
              )}
            </div>
            <input
              ref={contactInputRef}
              id="luma-signin-input"
              type={showPhoneField ? "tel" : "email"}
              autoComplete={showPhoneField ? "tel" : "email"}
              inputMode={showPhoneField ? "tel" : "email"}
              required
              value={showPhoneField ? phone : email}
              onChange={(e) =>
                showPhoneField ? setPhone(e.target.value) : setEmail(e.target.value)
              }
              placeholder={showPhoneField ? "+1 555 000 0000" : "you@email.com"}
              className="h-11 w-full rounded-lg border border-[#d4d4d8] bg-white px-3 text-sm text-[#111111] transition-colors outline-none placeholder:text-[#a1a1aa] focus:border-[#111111]"
            />

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending || passkeyPending}
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#111111] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending
                ? "Sending code…"
                : showPhoneField
                  ? "Continue"
                  : "Continue with Email"}
            </button>
          </form>

          {!needsEmail && (
            <>
              <div className="my-5 border-t border-[#ececef]" />

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => void continueWithGoogle()}
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg bg-[#f4f4f5]",
                    "text-sm font-medium text-[#27272a] transition-colors hover:bg-[#e4e4e7]",
                  )}
                >
                  <FaGoogle className="h-4 w-4" />
                  Sign in with Google
                </button>
                {(googleHint || googleAvailable === false) && (
                  <p className="text-xs text-[#6b7280]">
                    {googleHint ??
                      "Google isn’t configured (missing AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET). Use email, or add those keys and restart the server."}
                  </p>
                )}

                <button
                  type="button"
                  disabled={pending || passkeyPending}
                  onClick={() => void continueWithPasskey()}
                  className={cn(
                    "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg bg-[#f4f4f5]",
                    "text-sm font-medium text-[#27272a] transition-colors hover:bg-[#e4e4e7]",
                    "disabled:opacity-50",
                  )}
                >
                  <Fingerprint className="h-4 w-4" strokeWidth={1.75} />
                  {passkeyPending ? "Waiting for passkey…" : "Sign in with Passkey"}
                </button>
                {passkeyHint && <p className="text-xs text-[#6b7280]">{passkeyHint}</p>}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setStep("contact");
              setError(null);
              setDigits(["", "", "", "", "", ""]);
            }}
            className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f4f5] text-[#111111] transition-colors hover:bg-[#e4e4e7]"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          <h2
            id={titleId}
            className="text-[22px] font-semibold tracking-tight text-[#111111]"
          >
            Enter Code
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#6b7280]">
            Please enter the 6 digit code we sent to{" "}
            <span className="text-[#111111]">{email.trim().toLowerCase()}</span>.
          </p>

          <div className="mt-7 flex justify-between gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={6}
                value={d}
                onChange={(e) => onDigitChange(i, e.target.value)}
                onKeyDown={(e) => onDigitKeyDown(i, e)}
                disabled={pending}
                className={cn(
                  "h-12 w-11 rounded-lg bg-[#f4f4f5] text-center text-lg font-medium text-[#111111] outline-none",
                  "focus:bg-white focus:ring-2 focus:ring-[#111111]",
                  d && "bg-white ring-1 ring-[#d4d4d8]",
                )}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => void pasteCode()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#f4f4f5] px-3 text-sm font-medium text-[#27272a] transition-colors hover:bg-[#e4e4e7]"
            >
              <ClipboardPaste className="h-3.5 w-3.5" strokeWidth={1.75} />
              Paste Code
            </button>
            <button
              type="button"
              disabled={resendIn > 0 || pending}
              onClick={() => void resendCode()}
              className="text-sm text-[#9ca3af] disabled:cursor-default"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
