"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { TxStatus } from "@/hooks/useTicketFlow";
import { cn } from "@/lib/utils/cn";

interface TransactionStatusProps {
  status: TxStatus;
  error?: string | null;
  signature?: string | null;
}

const copy: Record<TxStatus, { title: string; body: string }> = {
  idle: {
    title: "Ready to pay",
    body: "Connect your Solana wallet to pay with USDC.",
  },
  connecting: {
    title: "Connecting wallet",
    body: "Approve the connection in your wallet extension…",
  },
  confirming: {
    title: "Confirming transaction",
    body: "Waiting for USDC transfer confirmation on Solana…",
  },
  success: {
    title: "Payment confirmed",
    body: "Your Breakpoint 2026 ticket is ready. A receipt was mocked for this demo.",
  },
  error: {
    title: "Payment failed",
    body: "Something went wrong with the mock transaction. Try again.",
  },
};

export function TransactionStatus({ status, error, signature }: TransactionStatusProps) {
  const content = copy[status];

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        status === "success" && "border-green-200 bg-green-50",
        status === "error" && "border-red-200 bg-red-50",
        status !== "success" && status !== "error" && "border-border bg-brand-5",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={status} />
        <div className="min-w-0">
          <p className="text-foreground font-medium">{content.title}</p>
          <p className="text-muted mt-0.5 text-sm">
            {status === "error" && error ? error : content.body}
          </p>
          {signature && status === "success" && (
            <p className="text-faint mt-2 truncate font-mono text-xs">sig: {signature}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: TxStatus }) {
  if (status === "success") {
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden />;
  }
  if (status === "error") {
    return <XCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />;
  }
  if (status === "connecting" || status === "confirming") {
    return (
      <Loader2 className="text-brand-60 h-5 w-5 shrink-0 animate-spin" aria-hidden />
    );
  }
  return (
    <div className="border-brand-30 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2" />
  );
}
