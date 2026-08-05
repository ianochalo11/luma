import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRegistration, ensureBreakpointEvent } from "@/lib/db";
import { registrationSchema } from "@/lib/validation/registrationSchema";

/** Persist a paid / confirmed registration after checkout. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const form = registrationSchema.parse(body.form);
    const event = await ensureBreakpointEvent();

    const ticketPriceUsd = Number(body.ticketPriceUsd ?? event.priceUsd);
    const discountUsd = Number(body.discountUsd ?? 0);
    const amountPaidUsd = Number(
      body.amountPaidUsd ?? Math.max(ticketPriceUsd - discountUsd, 0),
    );

    const registration = await createRegistration({
      userId: session.user.id,
      eventId: event.id,
      eventSlug: event.slug,
      form,
      ticketPriceUsd,
      discountUsd,
      amountPaidUsd,
      accessCode: body.accessCode ?? null,
      paymentSignature: body.paymentSignature ?? null,
      walletAddress: body.walletAddress ?? null,
      ticketStatus: body.ticketStatus ?? "confirmed",
      paymentStatus: body.paymentStatus ?? "paid",
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (err) {
    console.error("[registrations] POST failed", err);
    return NextResponse.json({ error: "Invalid registration payload" }, { status: 400 });
  }
}
