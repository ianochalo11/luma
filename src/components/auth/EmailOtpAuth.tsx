"use client";

import { useEffect, useId, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { ChevronLeft, ClipboardPaste, DoorOpen, Fingerprint, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Step = "email" | "code";

interface EmailOtpAuthProps {
  onSuccess: () => void | Promise<void>;
  /** Show the door icon (modal). Full-page can hide it. */
  showIcon?: boolean;
  className?: string;
}

/**
 * Luma-style email OTP: welcome → continue with email → 6-digit code.
 */
export function EmailOtpAuth({
  onSuccess,
  showIcon = true,
  className,
}: EmailOtpAuthProps) {
  const titleId = useId();
  const [step, setStep] = useState<Step>("email");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleHint, setGoogleHint] = useState<string | null>(null);
  const [passkeyHint, setPasskeyHint] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  async function sendCode(targetEmail: string) {
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Could not send code.");
    }
  }

  async function continueWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPasskeyHint(null);
    setGoogleHint(null);

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
    <div className={className}>
      {step === "email" ? (
        <>
          {showIcon && (
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0eef6] text-[#3f3f46]">
              <DoorOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
          )}
          <h2
            id={titleId}
            className="text-[22px] font-semibold tracking-tight text-[#111111]"
          >
            Welcome to Luma
          </h2>
          <p className="mt-1.5 text-sm text-[#6b7280]">
            Please sign in or sign up below.
          </p>

          <form onSubmit={continueWithEmail} className="mt-7 space-y-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="luma-signin-input" className="text-sm text-[#6b7280]">
                Email
              </label>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#111111]"
                onClick={() => {
                  setMode((m) => (m === "email" ? "phone" : "email"));
                  setError(null);
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
            </div>
            <input
              id="luma-signin-input"
              type={mode === "email" ? "email" : "tel"}
              autoComplete={mode === "email" ? "email" : "tel"}
              required
              value={mode === "email" ? email : ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === "email" ? "you@email.com" : "+1 555 000 0000"}
              className="h-11 w-full rounded-lg border border-[#d4d4d8] bg-white px-3 text-sm text-[#111111] transition-colors outline-none placeholder:text-[#a1a1aa] focus:border-[#111111]"
            />

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#111111] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Sending code…" : "Continue with Email"}
            </button>
          </form>

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
            {googleHint && <p className="text-xs text-[#6b7280]">{googleHint}</p>}

            <button
              type="button"
              onClick={() =>
                setPasskeyHint(
                  "Passkeys (WebAuthn) aren’t wired yet — use email to continue.",
                )
              }
              className={cn(
                "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg bg-[#f4f4f5]",
                "text-sm font-medium text-[#27272a] transition-colors hover:bg-[#e4e4e7]",
              )}
            >
              <Fingerprint className="h-4 w-4" strokeWidth={1.75} />
              Sign in with Passkey
            </button>
            {passkeyHint && <p className="text-xs text-[#6b7280]">{passkeyHint}</p>}
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setStep("email");
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
