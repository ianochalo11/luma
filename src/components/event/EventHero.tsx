import { EventHeaderMeta } from "@/components/event/EventHeaderMeta";
import type { Event } from "@/types/event";

interface EventHeroProps {
  event: Event;
}

/**
 * Mirrors luma.com `.title` (desktop-first max-width queries → mobile-first):
 *   >1000 → 3rem | ≤1000 → 2.5 | ≤820 → 2.25 | ≤650 → 2 | ≤450 → 1.75
 * Typekit `alternate` face: size-adjust 115%, letter-spacing 1.25px.
 */
export function EventHero({ event }: EventHeroProps) {
  return (
    <div>
      <h1 className="font-title text-foreground text-[1.75rem] leading-[1.15] tracking-[1.25px] text-pretty break-words min-[451px]:text-[2rem] min-[451px]:leading-[1.2] min-[651px]:text-[2.25rem] min-[821px]:text-[2.5rem] min-[1001px]:text-[3rem] min-[1001px]:leading-[1.15]">
        {event.title}
      </h1>
      <EventHeaderMeta event={event} />
    </div>
  );
}
