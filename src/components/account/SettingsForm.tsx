"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { LINKS } from "@/constants/links";
import { useAppSession } from "@/hooks/useSession";
import { useTicketFlow } from "@/hooks/useTicketFlow";
import { UserAvatar } from "@/components/account/UserAvatar";

/** Signed-in home: identity + tickets empty/filled states. */
export function SettingsForm() {
  const { user } = useAppSession();
  const registration = useTicketFlow((s) => s.registration);
  const txStatus = useTicketFlow((s) => s.txStatus);

  if (!user) {
    return (
      <p className="text-muted">
        <Link href={LINKS.site.signIn} className="text-brand-60 hover:underline">
          Sign in
        </Link>{" "}
        to manage your tickets.
      </p>
    );
  }

  const hasTicket = txStatus === "success" || !!registration;

  return (
    <div className="mx-auto w-full max-w-[640px] space-y-8">
      <header className="flex items-center gap-3.5">
        <UserAvatar name={user.name} image={user.image} size="md" />
        <div className="min-w-0">
          <h1 className="text-foreground truncate text-lg font-semibold tracking-tight">
            {user.firstName}
          </h1>
          <p className="text-muted truncate text-sm">{user.email}</p>
        </div>
      </header>

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-foreground text-base font-semibold tracking-tight">
            Your tickets
          </h2>
          <span className="text-brand-50 text-sm font-medium">Settings</span>
        </div>

        {hasTicket ? (
          <article className="border-border bg-surface mt-4 rounded-2xl border p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-brand-10 text-brand-60 flex h-10 w-10 items-center justify-center rounded-lg">
                <Ticket className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium">{BREAKPOINT_EVENT.title}</h3>
                <p className="text-muted mt-0.5 text-sm">
                  {BREAKPOINT_EVENT.schedule.weekdayLine} · {BREAKPOINT_EVENT.venue.name}
                </p>
                <p className="mt-2 text-sm">
                  <span
                    className={
                      txStatus === "success"
                        ? "font-medium text-green-700"
                        : "text-brand-70 font-medium"
                    }
                  >
                    {txStatus === "success" ? "Confirmed" : "Registration saved"}
                  </span>
                  <span className="text-muted">
                    {" "}
                    · {BREAKPOINT_EVENT.ticket.displayPrice}
                  </span>
                </p>
              </div>
              <Link
                href={LINKS.appRoutes.landing}
                className="text-muted hover:text-foreground text-sm hover:underline"
              >
                View
              </Link>
            </div>
          </article>
        ) : (
          <div className="border-border bg-surface mt-4 rounded-2xl border px-6 py-10 text-center shadow-sm">
            <p className="text-muted text-sm">No tickets yet</p>
            <Link
              href={LINKS.appRoutes.landing}
              className="bg-brand-50 hover:bg-brand-60 mt-4 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition-colors"
            >
              Get Breakpoint tickets
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
