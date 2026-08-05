import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Event } from "@/types/event";

interface EventHeaderMetaProps {
  event: Event;
}

/** Date tile + schedule + venue rows */
export function EventHeaderMeta({ event }: EventHeaderMetaProps) {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className="bg-brand-50 flex h-14 w-12 shrink-0 flex-col overflow-hidden rounded-lg text-white shadow-sm"
          aria-hidden
        >
          <div className="bg-brand-60 py-0.5 text-center text-[0.625rem] font-semibold tracking-wider uppercase">
            {event.schedule.dateTile.month}
          </div>
          <div className="flex flex-1 items-center justify-center text-xl font-semibold">
            {event.schedule.dateTile.day}
          </div>
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-foreground font-semibold">{event.schedule.weekdayLine}</p>
          <p className="text-muted mt-0.5 text-sm">{event.schedule.timeRangeLine}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div
          className="border-border bg-surface flex h-14 w-12 shrink-0 items-center justify-center rounded-lg border"
          aria-hidden
        >
          <PinIcon />
        </div>
        <div className="min-w-0 pt-0.5">
          <Link
            href={event.venue.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-brand-50 inline-flex items-center gap-1 font-semibold underline-offset-2 transition-colors hover:underline"
          >
            {event.venue.name}
            <ArrowUpRight
              className="text-muted h-3.5 w-3.5"
              strokeWidth={2}
              aria-hidden
            />
          </Link>
          <p className="text-muted mt-0.5 text-sm">{event.venue.cityLine}</p>
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="text-brand-50 h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
      />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}
