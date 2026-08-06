import { NextResponse } from "next/server";
import { z } from "zod";
import { generateOtpCode, storeOtp } from "@/lib/auth/otp";
import { sendSignInCodeEmail } from "@/lib/auth/send-otp-email";

const bodySchema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email } = bodySchema.parse(json);
    const normalized = email.toLowerCase();

    const code = generateOtpCode();
    await storeOtp(normalized, code);
    await sendSignInCodeEmail(normalized, code);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[otp/send]", err);
    const message =
      err instanceof z.ZodError
        ? "Enter a valid email address."
        : err instanceof Error
          ? err.message
          : "Could not send code.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
