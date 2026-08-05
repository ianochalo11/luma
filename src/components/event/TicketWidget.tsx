"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, Ticket } from "lucide-react";
import { LINKS } from "@/constants/links";
import type { Event } from "@/types/event";
import { Button } from "@/components/ui/Button";
import { useAppSession } from "@/hooks/useSession";
import { useSignInModal } from "@/components/auth/SignInModalProvider";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface TicketWidgetProps {
  event: Event;
}

/** Inline ticket card — sits in the right column, full column width */
export function TicketWidget({ event }: TicketWidgetProps) {
  const router = useRouter();
  const { user, isAuthenticated, status } = useAppSession();
  const { openSignIn } = useSignInModal();
  const [checking, setChecking] = useState(true);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setChecking(false), 600);
    return () => window.clearTimeout(id);
  }, []);

  const welcome =
    isAuthenticated && user
      ? event.welcome.signedInTemplate.replace("{firstName}", user.firstName)
      : event.welcome.signedOut;

  function goToRegister() {
    if (isAuthenticated) {
      router.push(LINKS.appRoutes.register);
      return;
    }
    openSignIn({
      onSuccess: () => {
        router.push(LINKS.appRoutes.register);
      },
    });
  }

  return (
    <section
      id="tickets"
      aria-label="Tickets"
      className="border-border bg-surface mt-8 rounded-2xl border p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-foreground text-sm font-semibold">
        {event.meta.getTicketsHeading}
      </h2>

      {checking || status === "loading" ? (
        <div className="mt-4 space-y-3" aria-busy="true">
          <div className="bg-surface-muted h-3 w-24 animate-pulse rounded" />
          <div className="bg-surface-muted h-8 w-28 animate-pulse rounded" />
          <div className="bg-surface-muted h-4 w-full animate-pulse rounded" />
          <div className="bg-surface-muted h-11 w-full animate-pulse rounded-full" />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <p className="text-muted text-sm">{event.meta.ticketPriceLabel}</p>
            <p className="text-foreground mt-0.5 text-3xl font-bold tracking-tight">
              {event.ticket.displayPrice}
            </p>
          </div>

          <div className="border-border border-t pt-4">
            <p className="text-muted text-sm leading-relaxed">{welcome}</p>
            {isAuthenticated && user && (
              <div className="mt-3 flex items-center gap-3">
                <div className="bg-brand-50 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {user.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 text-sm">
                  <p className="text-foreground truncate font-medium">{user.name}</p>
                  <p className="text-muted truncate">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <Link
              href={LINKS.appRoutes.register}
              className="bg-brand-50 hover:bg-brand-60 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors active:scale-[0.99]"
            >
              <Ticket className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {event.ctas.getTicket}
            </Link>
          ) : (
            <button
              type="button"
              onClick={goToRegister}
              className="bg-brand-50 hover:bg-brand-60 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors active:scale-[0.99]"
            >
              <Ticket className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Sign in to continue
            </button>
          )}

          <div className="text-muted text-sm">
            {showAccessCode ? (
              <div className="space-y-2">
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
                  className="border-border bg-background text-foreground focus-visible:border-brand-50 h-10 w-full rounded-lg border px-3 outline-none"
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
              <p className="flex flex-wrap items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                <span>
                  Have an access code? You can{" "}
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(true)}
                    className={cn(
                      "text-brand-50 font-medium underline-offset-2 hover:underline",
                    )}
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
