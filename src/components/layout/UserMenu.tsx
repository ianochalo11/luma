"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useId, useRef, useState } from "react";
import { LINKS } from "@/constants/links";
import { cn } from "@/lib/utils/cn";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

/** Avatar trigger + Luma-style account dropdown. */
export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
          "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full",
          "bg-brand-50 text-xs font-semibold text-white transition-opacity hover:opacity-90",
          open && "ring-brand-30 ring-offset-surface ring-2 ring-offset-2",
        )}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="border-border bg-surface absolute right-0 z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border shadow-lg shadow-black/8"
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-300 via-lime-200 to-rose-300">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              ) : (
                <SmileyFace />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                {user.name}
              </p>
              <p className="text-muted truncate text-xs">{user.email}</p>
            </div>
          </div>

          <div className="border-border-subtle border-t py-1.5">
            <MenuLink href={LINKS.site.profile} onClick={() => setOpen(false)}>
              View Profile
            </MenuLink>
            <MenuLink href={LINKS.site.settings} onClick={() => setOpen(false)}>
              Settings
            </MenuLink>
            <button
              type="button"
              role="menuitem"
              className="text-foreground-secondary hover:bg-surface-muted block w-full px-4 py-2.5 text-left text-sm transition-colors"
              onClick={() => {
                setOpen(false);
                void signOut({ callbackUrl: LINKS.appRoutes.landing });
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="text-foreground-secondary hover:bg-surface-muted block px-4 py-2.5 text-sm transition-colors"
    >
      {children}
    </Link>
  );
}

function SmileyFace() {
  return (
    <svg viewBox="0 0 40 40" className="text-foreground h-7 w-7" fill="none" aria-hidden>
      <circle cx="14" cy="16" r="2" fill="currentColor" />
      <circle cx="26" cy="16" r="2" fill="currentColor" />
      <path
        d="M13 24c2.2 2.8 5 4.2 7 4.2S24.8 26.8 27 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
