import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureBreakpointEvent, getFollowStatus, setFollow } from "@/lib/db";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ following: false });
  }

  const { searchParams } = new URL(request.url);
  const eventIdParam = searchParams.get("eventId") ?? undefined;
  const organizerId = searchParams.get("organizerId") ?? undefined;

  // Resolve slug → db id when client passes slug-like id
  let eventId = eventIdParam;
  if (eventIdParam && !eventIdParam.match(/^[a-f\d]{24}$/i)) {
    const event = await ensureBreakpointEvent();
    if (event.slug === eventIdParam || eventIdParam === event.id) {
      eventId = event.id;
    }
  }

  const following = await getFollowStatus({
    userId: session.user.id,
    eventId,
    organizerId,
  });

  return NextResponse.json({ following });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    eventId?: string;
    organizerId?: string;
  };

  const event = await ensureBreakpointEvent();
  let eventId = body.eventId;
  if (!eventId || eventId === event.slug) eventId = event.id;
  const organizerId = body.organizerId ?? event.organizerId;

  const result = await setFollow({
    userId: session.user.id,
    eventId,
    organizerId,
    following: true,
  });

  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    eventId?: string;
    organizerId?: string;
  };

  const event = await ensureBreakpointEvent();
  let eventId = body.eventId;
  if (!eventId || eventId === event.slug) eventId = event.id;
  const organizerId = body.organizerId ?? event.organizerId;

  const result = await setFollow({
    userId: session.user.id,
    eventId,
    organizerId,
    following: false,
  });

  return NextResponse.json(result);
}
