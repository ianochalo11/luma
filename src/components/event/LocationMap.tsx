import { ArrowUpRight } from "lucide-react";
import { LINKS } from "@/constants/links";
import type { Event } from "@/types/event";

interface LocationMapProps {
  event: Event;
}

export function LocationMap({ event }: LocationMapProps) {
  const { venue } = event;

  return (
    <section
      className="border-border mt-10 border-t pt-8"
      aria-labelledby="location-heading"
    >
      <h2
        id="location-heading"
        className="font-title text-foreground text-xl font-semibold"
      >
        {event.meta.locationHeading}
      </h2>

      <div className="mt-4">
        <p className="text-foreground font-semibold">{venue.name}</p>
        <p className="text-muted mt-1 text-sm">{venue.streetLine}</p>
      </div>

      <div className="border-border bg-surface relative mt-4 overflow-hidden rounded-2xl border shadow-sm">
        <a
          href={venue.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-surface text-foreground hover:bg-surface-muted absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition-colors"
        >
          Maps
          <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden />
        </a>

        <iframe
          title={`Google Map of ${venue.name}`}
          src={LINKS.venue.mapsEmbed}
          className="aspect-[2/1] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
