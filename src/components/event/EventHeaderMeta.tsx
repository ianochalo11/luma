import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Event } from "@/types/event";

interface EventHeaderMetaProps {
  event: Event;
}

/**
 * Luma icon-row / calendar tile:
 * light bordered square — gray month strip + dark day (not solid purple).
 */
export function EventHeaderMeta({ event }: EventHeaderMetaProps) {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 flex-col overflow-hidden rounded-md"
          style={{ border: "1px solid var(--opacity-second-light)" }}
          aria-hidden
        >
          <div
            className="text-foreground py-px text-center text-[0.5625rem] font-semibold tracking-wider uppercase"
            style={{ backgroundColor: "var(--opacity-second-light)" }}
          >
            {event.schedule.dateTile.month}
          </div>
          <div className="text-foreground flex flex-1 items-center justify-center text-base font-medium">
            {event.schedule.dateTile.day}
          </div>
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="font-title-medium text-foreground text-sm">
            {event.schedule.weekdayLine}
          </p>
          <p className="text-tinted mt-px text-sm max-[450px]:text-xs">
            {event.schedule.timeRangeLine}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
          style={{ border: "1px solid var(--opacity-second-light)" }}
          aria-hidden
        >
          <PinIcon />
        </div>
        <div className="min-w-0 pt-0.5">
          <Link
            href={event.venue.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-title-medium text-foreground hover:text-brand-50 inline-flex items-center gap-1 text-sm underline-offset-2 transition-colors hover:underline"
          >
            {event.venue.name}
            <ArrowUpRight
              className="text-faint h-3.5 w-3.5"
              strokeWidth={2}
              aria-hidden
            />
          </Link>
          <p className="text-tinted mt-px text-sm max-[450px]:text-xs">
            {event.venue.cityLine}
          </p>
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
      className="text-tinted h-5 w-5"
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
