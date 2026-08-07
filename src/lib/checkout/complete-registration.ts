import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { mockPayWithWallet } from "@/lib/solana/mock-tx";
import type { RegistrationSchema } from "@/lib/validation/registrationSchema";

export type CompleteRegistrationInput = {
  form: RegistrationSchema;
  amountPaidUsd: number;
  discountUsd: number;
  accessCode: string;
  walletAddress: string;
};

export type CompleteRegistrationResult =
  { ok: true; signature: string } | { ok: false; error: string };

/**
 * Mock Solana payment + best-effort booking persist.
 * UI owns wallet connect / tx status presentation.
 */
export async function completeRegistrationPayment(
  input: CompleteRegistrationInput,
): Promise<CompleteRegistrationResult> {
  const result = await mockPayWithWallet(input.amountPaidUsd);
  if (result.status !== "success") {
    return { ok: false, error: result.error ?? "Transaction failed" };
  }

  try {
    await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: input.form,
        ticketPriceUsd: BREAKPOINT_EVENT.ticket.priceUsd,
        discountUsd: input.discountUsd,
        amountPaidUsd: input.amountPaidUsd,
        accessCode: input.accessCode || null,
        paymentSignature: result.signature,
        walletAddress: input.walletAddress,
        ticketStatus: "confirmed",
        paymentStatus: "paid",
      }),
    });
  } catch {
    /* payment succeeded; booking persist is best-effort */
  }

  return { ok: true, signature: result.signature };
}
