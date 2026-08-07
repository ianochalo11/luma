"use client";

import { useState } from "react";
import { BREAKPOINT_EVENT, PAYMENT_COPY } from "@/constants/event-content";
import { useTicketFlow } from "@/hooks/useTicketFlow";
import { formatCurrency } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import {
  fieldControlClass,
  registrationAccentClass,
} from "@/components/registration/fieldStyles";

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
      className="w-full rounded-xl border border-[#E5E7EB] bg-white p-4"
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
          <p className="truncate text-sm font-semibold text-[#171717]">
            {BREAKPOINT_EVENT.title}
          </p>
          <p className="mt-0.5 text-xs text-[#6B7280]">Nov 15, 4:00 PM GMT</p>
        </div>
      </div>

      <div className="mt-4">
        {showCoupon ? (
          <div className="space-y-2">
            <label
              htmlFor="coupon-code"
              className="block text-xs font-medium text-[#171717]"
            >
              Coupon code
            </label>
            <div className="flex gap-2">
              <input
                id="coupon-code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className={fieldControlClass(false, "min-w-0 flex-1")}
                placeholder="e.g. SOLANA10"
                autoComplete="off"
              />
              <Button
                size="sm"
                variant="secondary"
                className="h-[38px] shrink-0 rounded-[8px]"
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
              <p className="text-xs text-[#6B7280]" role="status">
                {codeMessage}
              </p>
            )}
            {discountUsd > 0 && (
              <p className="text-xs font-medium text-[#6d5788]">
                −{formatCurrency(discountUsd)}
                {accessCode ? ` (${accessCode})` : ""}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowCoupon(false)}
              className="text-xs text-[#6B7280] underline-offset-2 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCoupon(true)}
            className={`${registrationAccentClass} text-sm font-medium hover:underline`}
          >
            {PAYMENT_COPY.addCoupon}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-[#E5E7EB] pt-3">
        <span className="text-sm text-[#6B7280]">{PAYMENT_COPY.total}</span>
        <span className="text-xl font-bold tracking-tight text-[#171717]">
          {formatCurrency(total)}
        </span>
      </div>
    </aside>
  );
}
