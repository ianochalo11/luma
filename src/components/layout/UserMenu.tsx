"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useId, useRef, useState } from "react";
import { UserAvatar } from "@/components/account/UserAvatar";
import { ADMIN_BASE_PATH } from "@/constants/admin";
import { LINKS } from "@/constants/links";
import { cn } from "@/lib/utils/cn";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    isAdmin?: boolean;
  };
}

/** Avatar trigger + Luma-style account dropdown. */
export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

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
          "inline-flex rounded-full transition-opacity hover:opacity-90",
          open && "ring-brand-30 ring-offset-background ring-2 ring-offset-2",
        )}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <UserAvatar name={user.name} image={user.image} size="xs" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="border-border bg-surface absolute right-0 z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border shadow-lg shadow-black/8"
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <UserAvatar name={user.name} image={user.image} size="md" />
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                {user.name}
              </p>
              <p className="text-muted truncate text-xs">{user.email}</p>
            </div>
          </div>

          <div className="border-border-subtle border-t py-1.5">
            {user.isAdmin && (
              <MenuLink href={ADMIN_BASE_PATH} onClick={() => setOpen(false)}>
                Admin dashboard
              </MenuLink>
            )}
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
