import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { AboutEventSection } from "@/components/event/AboutEventSection";
import { EventHero } from "@/components/event/EventHero";
import { EventSidebar } from "@/components/event/EventSidebar";
import { FeaturedInLondonPill } from "@/components/event/FeaturedInLondonPill";
import { LocationMap } from "@/components/event/LocationMap";
import { TicketWidget } from "@/components/event/TicketWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

// Staging: event landing served at `/` (formerly `/breakpoint2026`).

/**
 * Layout mirrors luma.com/breakpoint2026:
 * left = cover + host meta; right = title, ticket card, about, map.
 * Mobile stacks sidebar-first, then main.
 */
export default function HomePage() {
  const event = BREAKPOINT_EVENT;

  return (
    <>
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[380px_1fr]">
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
