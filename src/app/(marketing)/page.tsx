import type { CSSProperties } from "react";
import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { PAGE_SHELL, pageShellStyle } from "@/constants/layout";
import { AboutEventSection } from "@/components/event/AboutEventSection";
import { EventHero } from "@/components/event/EventHero";
import { EventSidebar } from "@/components/event/EventSidebar";
import { FeaturedInLondonPill } from "@/components/event/FeaturedInLondonPill";
import { LocationMap } from "@/components/event/LocationMap";
import { TicketWidget } from "@/components/event/TicketWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

/**
 * Two-rail event layout:
 *   [ 330px cover + hosts ] — 2rem — [ title / tickets / about ]
 * Centered with shared gutters so logo, cover, and Sign In share one edge.
 */
export default function HomePage() {
  const event = BREAKPOINT_EVENT;

  return (
    <>
      <SiteHeader />
      <div
        className="mx-auto grid w-full flex-1 grid-cols-1 py-4 lg:[grid-template-columns:var(--event-sidebar)_minmax(0,1fr)]"
        style={
          {
            ...pageShellStyle,
            columnGap: PAGE_SHELL.columnGap,
            rowGap: PAGE_SHELL.columnGap,
            ["--event-sidebar"]: PAGE_SHELL.sidebarWidth,
          } as CSSProperties
        }
      >
        <EventSidebar event={event} />

        <main className="min-w-0">
          <FeaturedInLondonPill />
          <EventHero event={event} />
          <TicketWidget event={event} />
          <AboutEventSection event={event} />
          <LocationMap event={event} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
