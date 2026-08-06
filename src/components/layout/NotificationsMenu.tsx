"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Bell trigger + empty notifications panel (Luma “It’s Quiet Here”). */
export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          "text-foreground inline-flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70",
          open && "opacity-70",
        )}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Notifications"
          className="border-border bg-surface absolute top-full right-0 z-50 mt-2 flex w-[min(360px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border shadow-lg shadow-black/10"
        >
          <div className="flex min-h-[280px] flex-col items-center justify-center px-8 py-12 text-center">
            <QuietMoonIcon />
            <p className="text-muted mt-5 text-[15px] font-semibold tracking-tight">
              It&apos;s Quiet Here
            </p>
            <p className="text-faint mt-1.5 text-sm leading-snug">
              Create an event and invite some friends.
            </p>
          </div>

          <div
            className="border-border-subtle flex h-9 items-center justify-between border-t px-3"
            aria-hidden
          >
            <ChevronLeft className="text-nav h-3.5 w-3.5" strokeWidth={2} />
            <div className="bg-nav/25 mx-3 h-1 flex-1 rounded-full" />
            <ChevronRight className="text-nav h-3.5 w-3.5" strokeWidth={2} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function QuietMoonIcon() {
  const uid = useId().replace(/:/g, "");
  const maskId = `quiet-moon-${uid}`;

  return (
    <svg
      viewBox="0 0 72 60"
      className="h-12 w-14 text-[#9a92a8]"
      fill="currentColor"
      aria-hidden
    >
      <defs>
        <mask id={maskId}>
          <rect width="72" height="60" fill="black" />
          {/* Body of the moon */}
          <circle cx="30" cy="34" r="22" fill="white" />
          {/* Offset cut creates a right-facing crescent */}
          <circle cx="42" cy="30" r="18.5" fill="black" />
        </mask>
      </defs>

      <rect width="72" height="60" fill="currentColor" mask={`url(#${maskId})`} />

      {/* Luma 4-point sparkles (same geometry as the nav mark) */}
      <g transform="translate(44 2) scale(0.095)" fill="currentColor">
        <path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
      </g>
      <g transform="translate(56 12) scale(0.055)" fill="currentColor">
        <path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
      </g>
    </svg>
  );
}
