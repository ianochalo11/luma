"use client";

import { useState } from "react";
import { BREAKPOINT_EVENT, PAYMENT_COPY } from "@/constants/event-content";
import { useTicketFlow } from "@/hooks/useTicketFlow";
import { formatCurrency } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";

/** Sticky order summary — same radius/padding language as the form inputs. */
export function OrderSummaryCard() {
  const discountUsd = useTicketFlow((s) => s.discountUsd);
  const accessCode = useTicketFlow((s) => s.accessCode);
  const applyAccessCode = useTicketFlow((s) => s.applyAccessCode);

  const [showCoupon, setShowCoupon] = useState(false);
  const [codeInput, setCodeInput] = useState(accessCode);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);

  const price = BREAKPOINT_EVENT.ticket.priceUsd;
  const total = Math.max(price - discountUsd, 0);

  return (
    <aside
      className="border-border w-full rounded-xl border bg-white p-4"
      aria-label={PAYMENT_COPY.orderSummary}
    >
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BREAKPOINT_EVENT.coverUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-semibold">
            {BREAKPOINT_EVENT.title}
          </p>
          <p className="text-muted mt-0.5 text-xs">Nov 15, 4:00 PM GMT</p>
        </div>
      </div>

      <div className="mt-4">
        {showCoupon ? (
          <div className="space-y-2">
            <label
              htmlFor="coupon-code"
              className="text-foreground block text-xs font-medium"
            >
              Coupon code
            </label>
            <div className="flex gap-2">
              <input
                id="coupon-code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="border-border focus-visible:border-brand-50 h-10 min-w-0 flex-1 rounded-xl border bg-[#f4f3f6] px-3 text-sm outline-none"
                placeholder="e.g. SOLANA10"
                autoComplete="off"
              />
              <Button
                size="sm"
                variant="secondary"
                className="h-10 shrink-0 rounded-xl"
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
              <p className="text-muted text-xs" role="status">
                {codeMessage}
              </p>
            )}
            {discountUsd > 0 && (
              <p className="text-brand-60 text-xs font-medium">
                −{formatCurrency(discountUsd)}
                {accessCode ? ` (${accessCode})` : ""}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowCoupon(false)}
              className="text-muted text-xs underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCoupon(true)}
            className="text-brand-50 text-sm font-medium hover:underline"
          >
            {PAYMENT_COPY.addCoupon}
          </button>
        )}
      </div>

      <div className="border-border-subtle mt-4 flex items-baseline justify-between gap-3 border-t pt-3">
        <span className="text-muted text-sm">{PAYMENT_COPY.total}</span>
        <span className="text-foreground text-xl font-bold tracking-tight">
          {formatCurrency(total)}
        </span>
      </div>
    </aside>
  );
}
