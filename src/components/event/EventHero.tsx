import { EventHeaderMeta } from "@/components/event/EventHeaderMeta";
import type { Event } from "@/types/event";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  return (
    <div>
      <h1 className="font-title text-foreground text-[1.875rem] leading-tight font-bold tracking-tight lg:text-[2.5rem] lg:leading-[1.15]">
        {event.title}
      </h1>
      <EventHeaderMeta event={event} />
    </div>
  );
}
