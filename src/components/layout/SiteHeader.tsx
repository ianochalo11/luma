"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, CalendarCheck, Compass, type LucideIcon } from "lucide-react";
import { pageShellStyle } from "@/constants/layout";
import { LINKS } from "@/constants/links";
import { useAppSession } from "@/hooks/useSession";
import { useSignInModal } from "@/components/auth/SignInModalProvider";
import { LumaMark, LumaWordmark } from "@/components/layout/LumaLogo";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils/cn";

/** Shares the page shell gutters so the wordmark lines up with the cover. */
export function SiteHeader() {
  const { user, status } = useAppSession();
  const { openSignIn } = useSignInModal();
  const signedIn = status === "authenticated" && !!user;

  return (
    <header className="border-border-subtle bg-background sticky top-0 z-40 w-full border-b">
      <div
        className="mx-auto flex h-12 w-full items-center justify-between gap-4"
        style={pageShellStyle}
      >
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={LINKS.appRoutes.landing}
            className="text-nav -ml-0.5 flex shrink-0 items-center"
            aria-label="Luma Home"
          >
            {signedIn ? (
              <LumaMark className="h-[18px] w-[18px]" />
            ) : (
              <LumaWordmark className="h-4" />
            )}
          </Link>

          {signedIn && (
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
              <NavItem href={LINKS.nav.events} icon={CalendarCheck}>
                Events
              </NavItem>
              <NavItem href={LINKS.nav.calendars} icon={Calendar}>
                Calendars
              </NavItem>
              <NavItem href={LINKS.site.discover} icon={Compass}>
                Discover
              </NavItem>
            </nav>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {status === "loading" ? (
            <span className="h-8 w-28 animate-pulse rounded-full bg-[var(--opacity-light)]" />
          ) : signedIn && user ? (
            <>
              <LiveClock />
              <Link href={LINKS.nav.createEvent} className="text-nav text-sm font-medium">
                Create Event
              </Link>
              <NotificationsMenu />
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <LiveClock />
              <Link
                href={LINKS.site.discover}
                className="text-nav hidden text-sm font-medium sm:inline"
              >
                Discover Events
              </Link>
              <button
                type="button"
                onClick={() => openSignIn()}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors",
                  "text-muted bg-[var(--opacity-light)] hover:bg-[#2a2a2a] hover:text-white",
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

/** Idle: Luma tertiary / nav grey. Icon ↔ label 6px; items spaced via parent `gap-6`. */
function NavItem({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-nav inline-flex items-center gap-1.5 text-sm font-medium"
    >
      <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} aria-hidden />
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
      <span className="hidden h-4 w-24 animate-pulse rounded bg-[var(--opacity-light)] lg:block" />
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
    <span className="text-nav hidden text-xs font-medium whitespace-nowrap lg:inline">
      {time} {tz}
    </span>
  );
}
