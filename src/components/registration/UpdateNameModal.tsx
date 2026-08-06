"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Pencil, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface UpdateNameModalProps {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onUpdated?: (name: string) => void;
}

/** Luma-style “Update Name” dialog from registration Your Info. */
export function UpdateNameModal({
  open,
  initialName,
  onClose,
  onUpdated,
}: UpdateNameModalProps) {
  if (!open) return null;

  // Remount on open so field state initializes from props (no setState-in-effect).
  return (
    <UpdateNameModalContent
      key={initialName}
      initialName={initialName}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  );
}

function UpdateNameModalContent({
  initialName,
  onClose,
  onUpdated,
}: Omit<UpdateNameModalProps, "open">) {
  const { update } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descId = useId();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, saving]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = (await res.json().catch(() => null)) as {
        name?: string;
        error?: string;
      } | null;

      if (!res.ok) {
        setError(data?.error ?? "Could not update name");
        return;
      }

      const next = data?.name ?? trimmed;
      await update({ name: next });
      onUpdated?.(next);
      onClose();
    } catch {
      setError("Could not update name");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={() => {
          if (!saving) onClose();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-[360px] rounded-2xl bg-white px-6 pt-7 pb-6 shadow-2xl shadow-black/20"
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="bg-surface-muted text-foreground-secondary relative flex h-14 w-14 items-center justify-center rounded-full"
            aria-hidden
          >
            <User className="h-7 w-7" strokeWidth={1.5} />
            <span className="border-border absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full border bg-white shadow-sm">
              <Pencil className="text-muted h-2.5 w-2.5" strokeWidth={2} />
            </span>
          </div>

          <h2
            id={titleId}
            className="text-foreground mt-4 text-lg font-semibold tracking-tight"
          >
            Update Name
          </h2>
          <p id={descId} className="text-muted mt-1.5 text-sm leading-snug">
            Your updated name will be saved to your Luma profile.
          </p>
        </div>

        <form onSubmit={(e) => void submit(e)} className="mt-5 space-y-3">
          <div>
            <label htmlFor="update-name-input" className="sr-only">
              Name
            </label>
            <input
              ref={inputRef}
              id="update-name-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              autoComplete="name"
              disabled={saving}
              className={cn(
                "text-foreground h-11 w-full rounded-xl border bg-white px-3.5 text-sm outline-none",
                "border-foreground/80 focus-visible:border-foreground",
                error && "border-red-400 focus-visible:border-red-400",
              )}
            />
            {error ? (
              <p className="mt-1.5 text-left text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="bg-foreground hover:bg-brand-90 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            {saving ? "Updating…" : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
