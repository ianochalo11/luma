import { NextResponse } from "next/server";
import { z } from "zod";
import { generateOtpCode, storeOtp } from "@/lib/auth/otp";
import { sendSignInCodeEmail } from "@/lib/auth/send-otp-email";
import { resolveAdminEmail } from "@/constants/admin";

const bodySchema = z.object({
  email: z.string().trim().email(),
  admin: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, admin } = bodySchema.parse(json);
    const normalized = email.toLowerCase();

    if (admin) {
      const adminEmail = resolveAdminEmail();
      if (!adminEmail || normalized !== adminEmail) {
        return NextResponse.json(
          { ok: false, error: "This email is not authorized for admin access." },
          { status: 403 },
        );
      }
    }

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
