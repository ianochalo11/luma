import "server-only";
import { createHash, randomInt } from "crypto";
import { connectDb } from "@/lib/db/client";
import { OtpModel } from "@/lib/db/models/Otp";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashCode(email: string, code: string): string {
  return createHash("sha256")
    .update(`${email}:${code}:${process.env.AUTH_SECRET ?? "dev"}`)
    .digest("hex");
}

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function storeOtp(email: string, code: string): Promise<void> {
  await connectDb();
  const normalized = email.toLowerCase().trim();
  const codeHash = hashCode(normalized, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await OtpModel.deleteMany({ email: normalized });
  await OtpModel.create({ email: normalized, codeHash, expiresAt, attempts: 0 });
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await connectDb();
  const normalized = email.toLowerCase().trim();
  const doc = await OtpModel.findOne({ email: normalized }).sort({ createdAt: -1 });

  if (!doc) {
    return { ok: false, error: "No code found. Request a new one." };
  }
  if (doc.expiresAt.getTime() < Date.now()) {
    await OtpModel.deleteMany({ email: normalized });
    return { ok: false, error: "Code expired. Request a new one." };
  }
  if (doc.attempts >= MAX_ATTEMPTS) {
    await OtpModel.deleteMany({ email: normalized });
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  const expected = hashCode(normalized, code.trim());
  if (doc.codeHash !== expected) {
    doc.attempts += 1;
    await doc.save();
    return { ok: false, error: "Incorrect code. Try again." };
  }

  await OtpModel.deleteMany({ email: normalized });
  return { ok: true };
}
