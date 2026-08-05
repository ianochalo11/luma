"use client";

import Link from "next/link";
import { Ticket } from "lucide-react";
import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { LINKS } from "@/constants/links";
import { useAppSession } from "@/hooks/useSession";
import { useTicketFlow } from "@/hooks/useTicketFlow";

export function ProfileForm() {
  const { user } = useAppSession();
  const registration = useTicketFlow((s) => s.registration);
  const txStatus = useTicketFlow((s) => s.txStatus);

  if (!user) {
    return (
      <p className="text-muted">
        <Link href={LINKS.site.signIn} className="text-brand-60 hover:underline">
          Sign in
        </Link>{" "}
        to view your profile.
      </p>
    );
  }

  const hasTicket = txStatus === "success" || !!registration;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-brand-50 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white">
          {user.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <h1 className="font-title text-2xl font-semibold">{user.name}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-title text-lg font-semibold">Your tickets</h2>
          <Link
            href={LINKS.site.settings}
            className="text-brand-60 text-sm hover:underline"
          >
            Settings
          </Link>
        </div>

        {hasTicket ? (
          <article className="border-border bg-surface mt-4 rounded-xl border p-5 shadow-sm">
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
          <div className="border-border bg-brand-5 mt-4 rounded-xl border border-dashed p-6 text-center">
            <p className="text-muted text-sm">No tickets yet</p>
            <Link
              href={LINKS.appRoutes.landing}
              className="bg-brand-50 mt-3 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-white"
            >
              Get Breakpoint tickets
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
