import { BREAKPOINT_EVENT } from "@/constants/event-content";
import type { Event } from "@/types/event";

const EVENTS: Record<string, Event> = {
  [BREAKPOINT_EVENT.slug]: BREAKPOINT_EVENT,
};

export function getEventBySlug(slug: string): Event | null {
  return EVENTS[slug] ?? null;
}
