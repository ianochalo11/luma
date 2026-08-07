"use client";

import { useEffect, useState } from "react";
import { BrowserVerification } from "@/components/auth/BrowserVerification";
import { EmailOtpAuth } from "@/components/auth/EmailOtpAuth";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const VERIFY_MS = 1600;

/** Luma-style auth modal: browser check → welcome → email → 6-digit code. */
export function SignInModal({ open, onClose, onSuccess }: SignInModalProps) {
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

  // Unmount while closed so verify state resets cleanly on next open.
  if (!open) return null;

  return <SignInModalContent onClose={onClose} onSuccess={onSuccess} />;
}

function SignInModalContent({ onClose, onSuccess }: Omit<SignInModalProps, "open">) {
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVerifying(false), VERIFY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close sign in"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={verifying ? "Verifying your browser" : "Sign in"}
        aria-busy={verifying}
        className="relative w-full max-w-[400px] rounded-[22px] bg-white p-8 shadow-2xl"
      >
        {verifying ? (
          <BrowserVerification />
        ) : (
          <EmailOtpAuth onSuccess={onSuccess} showIcon />
        )}
      </div>
    </div>
  );
}
