import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRegistration, ensureBreakpointEvent } from "@/lib/db";
import { upsertUserOnSignIn } from "@/lib/db/repositories/users";
import { registrationSchema } from "@/lib/validation/registrationSchema";

/** Persist a paid / confirmed registration after checkout (auth optional). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const form = registrationSchema.parse(body.form);
    const event = await ensureBreakpointEvent();

    const session = await auth();
    let userId = session?.user?.id;

    // Guest checkout: upsert an account from the form email/name.
    if (!userId) {
      const guest = await upsertUserOnSignIn({
        email: form.email,
        name: form.name,
        authProvider: "email",
      });
      userId = guest.id;
    }

    const ticketPriceUsd = Number(body.ticketPriceUsd ?? event.priceUsd);
    const discountUsd = Number(body.discountUsd ?? 0);
    const amountPaidUsd = Number(
      body.amountPaidUsd ?? Math.max(ticketPriceUsd - discountUsd, 0),
    );

    const registration = await createRegistration({
      userId,
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
