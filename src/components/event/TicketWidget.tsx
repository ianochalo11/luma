"use client";

import Link from "next/link";
import { useState } from "react";
import { LINKS } from "@/constants/links";
import type { Event } from "@/types/event";
import { UserAvatar } from "@/components/account/UserAvatar";
import { Button } from "@/components/ui/Button";
import { useAppSession } from "@/hooks/useSession";

interface TicketWidgetProps {
  event: Event;
}

/**
 * Mirrors luma.com `base-11-card` ticket block:
 * padding .75rem 1rem, translucent surface, fs / tinted tokens.
 * @see https://luma.com/breakpoint2026
 */
export function TicketWidget({ event }: TicketWidgetProps) {
  const { user, status } = useAppSession();
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const sessionReady = status !== "loading";
  const signedIn = status === "authenticated" && !!user;

  const welcome = signedIn
    ? event.welcome.signedInTemplate.replace("{firstName}", user.firstName)
    : event.welcome.signedOut;

  return (
    <section
      id="tickets"
      aria-label="Tickets"
      className="mt-6 w-full overflow-hidden rounded-xl"
      style={{
        padding: "0.75rem 1rem",
        backgroundColor: "rgba(255, 255, 255, 0.32)",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Header bleeds to card edges (Luma negative-margin pattern) */}
      <div
        className="font-title-medium text-tinted text-sm"
        style={{
          backgroundColor: "var(--opacity-light)",
          margin: "calc(1px - 0.75rem) calc(1px - 1rem) 0.75rem",
          padding: "calc(0.5rem - 1px) calc(1rem - 1px)",
        }}
      >
        {event.meta.getTicketsHeading}
      </div>

      {!sessionReady ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--opacity-light)]" />
          <div className="h-7 w-28 animate-pulse rounded bg-[var(--opacity-light)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[var(--opacity-light)]" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--opacity-light)]" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Price block + divider */}
          <div
            className="pb-3"
            style={{ borderBottom: "1px solid var(--opacity-second-light)" }}
          >
            <p className="text-tinted text-sm leading-snug">
              {event.meta.ticketPriceLabel}
            </p>
            <p className="text-foreground text-xxxl mt-0.5 leading-[1.15] font-medium tracking-tight">
              {event.ticket.displayPrice}
            </p>
          </div>

          {/* Welcome + identity — matches Luma signed-in ticket card */}
          <div>
            <p className="text-foreground text-md leading-snug">{welcome}</p>
            {signedIn ? (
              <div className="mt-3 flex min-w-0 items-center gap-2.5">
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  size="xs"
                  className="h-8 w-8"
                />
                <p className="min-w-0 truncate text-sm leading-snug">
                  <span className="text-foreground font-medium">{user.firstName}</span>
                  <span className="text-tinted font-normal"> {user.email}</span>
                </p>
              </div>
            ) : null}
          </div>

          {/* CTA — Luma medium primary, rounded-lg (not pill), no icon */}
          <Link
            href={LINKS.appRoutes.register}
            className="bg-brand-50 hover:bg-brand-60 text-md inline-flex h-[2.375rem] w-full items-center justify-center rounded-lg font-medium text-white transition-colors active:scale-[0.99]"
          >
            {event.ctas.getTicket}
          </Link>

          {/* Access code footer — fs-xs + text-tinted */}
          <div className="text-tinted text-xs">
            {showAccessCode ? (
              <div className="space-y-2 pt-0.5">
                <label
                  htmlFor="access-code"
                  className="text-foreground block font-medium"
                >
                  Access code
                </label>
                <input
                  id="access-code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="border-border text-foreground focus-visible:border-brand-50 h-9 w-full rounded-lg border bg-white/40 px-3 text-sm outline-none"
                  placeholder="Enter code"
                  autoComplete="off"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowAccessCode(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="flex items-start gap-2 pt-0.5">
                <LockIcon />
                <span className="leading-snug">
                  Have an access code? You can{" "}
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(true)}
                    className="text-tinted hover:text-brand-50 underline decoration-[var(--opacity-second-light)] underline-offset-2 transition-colors hover:decoration-[var(--brand-50)]"
                  >
                    enter it here
                  </button>
                  .
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** Luma padlock path (16×16), sized .875rem. */
function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className="mt-0.5 h-3.5 w-3.5 shrink-0"
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.105 2.201C7.615 2 7.981 2 8.08 2h.008a2.6 2.6 0 0 1 .994.209c.62.224 1.117.69 1.382 1.283a.75.75 0 0 0 1.37-.613A3.91 3.91 0 0 0 9.603.802 4.1 4.1 0 0 0 8.083.5c-.182 0-.76.004-1.52.302a3.91 3.91 0 0 0-2.34 2.352c-.256.77-.289 1.48-.293 2.417l-.064.02-.016.005-.015.005a3.46 3.46 0 0 0-2.072 2.064l-.005.014-.005.014C1.5 8.486 1.5 9.223 1.5 10.35v.185c0 1.129 0 1.865.254 2.658l.005.015.005.014a3.46 3.46 0 0 0 2.072 2.063l.015.006.016.004c.802.253 1.552.252 2.744.252h2.944c1.193 0 1.943 0 2.745-.252l.015-.004.015-.006a3.46 3.46 0 0 0 2.073-2.063l.005-.014.004-.015c.255-.793.255-1.529.255-2.658v-.185c0-1.129 0-1.865-.255-2.658l-.004-.014-.005-.014A3.46 3.46 0 0 0 12.33 5.6l-.015-.005-.015-.005c-.802-.253-1.552-.252-2.745-.252H6.611c-.445 0-.83 0-1.177.013.01-.771.049-1.224.21-1.716A2.41 2.41 0 0 1 7.105 2.2ZM3.178 8.166c.198-.53.62-.95 1.155-1.15.552-.17 1.07-.177 2.376-.177h2.75c1.305 0 1.822.007 2.375.178a1.96 1.96 0 0 1 1.155 1.15c.17.54.178 1.04.178 2.277 0 1.236-.007 1.737-.178 2.277-.199.53-.62.95-1.155 1.15-.553.17-1.07.177-2.376.177h-2.75c-1.305 0-1.823-.007-2.375-.178a1.96 1.96 0 0 1-1.155-1.149c-.17-.54-.178-1.04-.178-2.277s.007-1.738.178-2.278"
      />
    </svg>
  );
}
