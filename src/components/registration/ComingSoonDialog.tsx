"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ComingSoonDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Placeholder until wallet payment is wired. */
export function ComingSoonDialog({ open, onClose }: ComingSoonDialogProps) {
  const titleId = useId();
  const descId = useId();

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

  // Only opens from a client click, so document.body is always available here.
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-[360px] rounded-2xl bg-white px-6 pt-7 pb-6 shadow-2xl shadow-black/20"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#939597] text-white transition-opacity hover:opacity-90"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
        </button>

        <h2
          id={titleId}
          className="text-center text-lg font-semibold tracking-tight text-[#171717]"
        >
          Coming Soon
        </h2>
        <p id={descId} className="mt-2 text-center text-sm leading-snug text-[#6B7280]">
          Wallet payment isn’t available yet. Your registration details are saved — we’ll
          turn on USDC checkout next.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#171717] text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Got it
        </button>
      </div>
    </div>,
    document.body,
  );
}
