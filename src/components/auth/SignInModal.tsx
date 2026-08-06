"use client";

import { useEffect } from "react";
import { EmailOtpAuth } from "@/components/auth/EmailOtpAuth";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

/** Luma-style auth modal: welcome → email → 6-digit code (Resend OTP). */
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

  if (!open) return null;

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
        aria-label="Sign in"
        className="relative w-full max-w-[400px] rounded-[22px] bg-white p-8 shadow-2xl"
      >
        <EmailOtpAuth key={String(open)} onSuccess={onSuccess} showIcon />
      </div>
    </div>
  );
}
