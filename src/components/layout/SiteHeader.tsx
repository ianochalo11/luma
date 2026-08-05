"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { LINKS } from "@/constants/links";
import { useAppSession } from "@/hooks/useSession";
import { useSignInModal } from "@/components/auth/SignInModalProvider";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils/cn";

/**
 * Attendee navbar for the Breakpoint event page.
 * Signed-in: clock + notifications + avatar (no organizer "Create Event").
 */
export function SiteHeader() {
  const { user, isAuthenticated, status } = useAppSession();
  const { openSignIn } = useSignInModal();

  return (
    <header className="border-border bg-surface sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Left: logo (fixed) + optional signed-in nav */}
        <div className="flex min-w-0 items-center gap-5">
          <Link
            href={LINKS.appRoutes.landing}
            className="text-foreground flex shrink-0 items-center transition-opacity hover:opacity-80"
            aria-label="Luma Home"
          >
            <LumaMark className="h-7 w-7" />
          </Link>

          {isAuthenticated && (
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
              <HeaderLink href={LINKS.appRoutes.landing}>Event</HeaderLink>
              <HeaderLink href={LINKS.site.discover}>Discover</HeaderLink>
            </nav>
          )}
        </div>

        {/* Right: auth-dependent actions — shared control height (h-9) */}
        <div className="flex shrink-0 items-center gap-2">
          {status === "loading" ? (
            <span className="bg-surface-muted h-9 w-28 animate-pulse rounded-full" />
          ) : isAuthenticated && user ? (
            <>
              <LiveClock />
              <button
                type="button"
                className={cn(
                  controlBase,
                  "text-muted hover:bg-surface-muted hover:text-foreground w-9 px-0",
                )}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <HeaderLink href={LINKS.site.discover}>Discover Events</HeaderLink>
              <button
                type="button"
                onClick={() => openSignIn()}
                className={cn(
                  controlBase,
                  "border-border text-foreground hover:bg-surface-muted border px-3.5",
                )}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const controlBase =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors";

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        controlBase,
        "text-muted hover:bg-surface-muted hover:text-foreground px-3",
      )}
    >
      {children}
    </Link>
  );
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const immediate = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(id);
    };
  }, []);

  if (!now) {
    return (
      <span className="bg-surface-muted hidden h-4 w-28 animate-pulse rounded lg:block" />
    );
  }

  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  const tz =
    mins === 0
      ? `GMT${sign}${hours}`
      : `GMT${sign}${hours}:${String(mins).padStart(2, "0")}`;

  return (
    <span className="text-muted hidden px-1 text-xs font-medium whitespace-nowrap lg:inline">
      {time} {tz}
    </span>
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
