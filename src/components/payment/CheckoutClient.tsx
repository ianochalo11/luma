"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BREAKPOINT_EVENT, PAYMENT_COPY } from "@/constants/event-content";
import { LINKS } from "@/constants/links";
import { useTicketFlow } from "@/hooks/useTicketFlow";
import { mockPayWithWallet } from "@/lib/solana/mock-tx";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { TransactionStatus } from "@/components/payment/TransactionStatus";
import { WalletConnectButton } from "@/components/payment/WalletConnectButton";
import { Button } from "@/components/ui/Button";

export function CheckoutClient() {
  const router = useRouter();
  const registration = useTicketFlow((s) => s.registration);
  const discountUsd = useTicketFlow((s) => s.discountUsd);
  const accessCode = useTicketFlow((s) => s.accessCode);
  const applyAccessCode = useTicketFlow((s) => s.applyAccessCode);
  const walletAddress = useTicketFlow((s) => s.walletAddress);
  const txStatus = useTicketFlow((s) => s.txStatus);
  const txError = useTicketFlow((s) => s.txError);
  const setTxStatus = useTicketFlow((s) => s.setTxStatus);
  const resetPayment = useTicketFlow((s) => s.resetPayment);

  const [codeInput, setCodeInput] = useState(accessCode);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const total = useMemo(
    () => Math.max(BREAKPOINT_EVENT.ticket.priceUsd - discountUsd, 0),
    [discountUsd],
  );

  if (!registration) {
    return (
      <div className="border-border bg-surface rounded-xl border p-8 text-center">
        <p className="font-medium">Complete registration first</p>
        <p className="text-muted mt-1 text-sm">
          Your form answers are required before payment.
        </p>
        <Link
          href={LINKS.appRoutes.register}
          className="bg-brand-50 mt-4 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-white"
        >
          Go to registration
        </Link>
      </div>
    );
  }

  async function handlePay() {
    if (!walletAddress) {
      setTxStatus("error", "Connect a wallet first");
      return;
    }
    setTxStatus("confirming");
    setSignature(null);
    const result = await mockPayWithWallet(total);
    if (result.status === "success") {
      setSignature(result.signature);
      try {
        await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            form: registration,
            ticketPriceUsd: BREAKPOINT_EVENT.ticket.priceUsd,
            discountUsd,
            amountPaidUsd: total,
            accessCode: accessCode || null,
            paymentSignature: result.signature,
            walletAddress,
            ticketStatus: "confirmed",
            paymentStatus: "paid",
          }),
        });
      } catch {
        /* payment succeeded; booking persist is best-effort */
      }
      setTxStatus("success");
    } else {
      setTxStatus("error", result.error ?? "Transaction failed");
    }
  }

  if (txStatus === "success") {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8">
          <p className="font-title text-foreground text-2xl font-semibold">
            You’re going to Breakpoint
          </p>
          <p className="text-muted mt-2 text-sm">
            Mock ticket for {registration.legalName} · {BREAKPOINT_EVENT.title}
          </p>
          {signature && (
            <p className="text-faint mt-4 font-mono text-xs break-all">
              Receipt: {signature}
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              resetPayment();
              router.push(LINKS.site.profile);
            }}
          >
            View profile
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              resetPayment();
              router.push(LINKS.appRoutes.landing);
            }}
          >
            Back to event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-6">
        <div>
          <h1 className="font-title text-2xl font-semibold">{PAYMENT_COPY.heading}</h1>
          <p className="text-muted mt-1 text-sm">
            {PAYMENT_COPY.methodLabel}:{" "}
            <span className="text-foreground font-medium">
              {PAYMENT_COPY.methodValue}
            </span>
          </p>
        </div>

        <TransactionStatus
          status={txStatus === "idle" && walletAddress ? "idle" : txStatus}
          error={txError}
          signature={signature}
        />

        <div className="border-border bg-surface space-y-4 rounded-xl border p-5">
          <WalletConnectButton onConnected={() => setTxStatus("idle")} />
          {walletAddress && (
            <Button
              size="lg"
              className="w-full"
              disabled={txStatus === "confirming" || txStatus === "connecting"}
              onClick={() => void handlePay()}
            >
              {txStatus === "confirming"
                ? "Confirming…"
                : `Pay $${total.toFixed(2)} USDC`}
            </Button>
          )}
        </div>

        <div className="border-border bg-surface rounded-xl border p-5">
          <label htmlFor="checkout-access-code" className="text-sm font-medium">
            Have an access code?
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="checkout-access-code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="border-border focus-visible:border-brand-50 h-10 flex-1 rounded-lg border px-3 text-sm outline-none"
              placeholder="e.g. SOLANA10"
            />
            <Button
              variant="secondary"
              onClick={() => {
                const ok = applyAccessCode(codeInput);
                setCodeMessage(
                  ok ? "Discount applied" : "Code not recognized (try SOLANA10)",
                );
              }}
            >
              Apply
            </Button>
          </div>
          {codeMessage && (
            <p className="text-muted mt-2 text-sm" role="status">
              {codeMessage}
            </p>
          )}
        </div>

        <Link
          href={LINKS.appRoutes.register}
          className="text-muted hover:text-foreground inline-block text-sm underline-offset-2 hover:underline"
        >
          ← Edit registration
        </Link>
      </section>

      <PaymentSummary discountUsd={discountUsd} accessCode={accessCode} />
    </div>
  );
}
