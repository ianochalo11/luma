import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { BREAKPOINT_ORGANIZER_ID } from "@/constants/ids";
import { connectDb } from "@/lib/db/client";
import { EventModel, type EventDocument } from "@/lib/db/models";

export { BREAKPOINT_ORGANIZER_ID };

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location: {
    name?: string;
    cityLine?: string;
    fullAddress?: string;
    latitude?: number;
    longitude?: number;
  };
  priceUsd: number;
  currencyLabel: string;
  capacity: number | null;
  coverUrl: string;
}

function toEventRecord(doc: EventDocument): EventRecord {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    organizerId: doc.organizerId,
    organizerName: doc.organizerName,
    startAt: doc.startAt.toISOString(),
    endAt: doc.endAt.toISOString(),
    timezone: doc.timezone ?? "UTC",
    location: {
      name: doc.location?.name ?? undefined,
      cityLine: doc.location?.cityLine ?? undefined,
      fullAddress: doc.location?.fullAddress ?? undefined,
      latitude: doc.location?.latitude ?? undefined,
      longitude: doc.location?.longitude ?? undefined,
    },
    priceUsd: doc.priceUsd,
    currencyLabel: doc.currencyLabel ?? "USD",
    capacity: doc.capacity ?? null,
    coverUrl: doc.coverUrl ?? "",
  };
}

export async function ensureBreakpointEvent(): Promise<EventRecord> {
  await connectDb();
  const event = BREAKPOINT_EVENT;
  const doc = await EventModel.findOneAndUpdate(
    { slug: event.slug },
    {
      $set: {
        title: event.title,
        description: event.about.paragraphs.join("\n\n"),
        organizerId: BREAKPOINT_ORGANIZER_ID,
        organizerName: event.presentedBy.name,
        startAt: new Date(event.schedule.startAt),
        endAt: new Date(event.schedule.endAt),
        timezone: event.schedule.timezone,
        location: {
          name: event.venue.name,
          cityLine: event.venue.cityLine,
          fullAddress: event.venue.fullAddress,
          latitude: event.venue.latitude,
          longitude: event.venue.longitude,
        },
        priceUsd: event.ticket.priceUsd,
        currencyLabel: event.ticket.currencyLabel,
        capacity: 3000,
        coverUrl: event.coverUrl,
      },
      $setOnInsert: { slug: event.slug },
    },
    { upsert: true, returnDocument: "after" },
  );

  return toEventRecord(doc!);
}

export async function findEventBySlug(slug: string): Promise<EventRecord | null> {
  await connectDb();
  const doc = await EventModel.findOne({ slug });
  return doc ? toEventRecord(doc) : null;
}

export async function findEventById(id: string): Promise<EventRecord | null> {
  await connectDb();
  const doc = await EventModel.findById(id);
  return doc ? toEventRecord(doc) : null;
}
