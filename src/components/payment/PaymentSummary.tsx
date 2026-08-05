import { BREAKPOINT_EVENT, PAYMENT_COPY } from "@/constants/event-content";
import { formatCurrency } from "@/lib/utils/format";

interface PaymentSummaryProps {
  discountUsd?: number;
  accessCode?: string;
}

export function PaymentSummary({
  discountUsd = 0,
  accessCode = "",
}: PaymentSummaryProps) {
  const price = BREAKPOINT_EVENT.ticket.priceUsd;
  const total = Math.max(price - discountUsd, 0);

  return (
    <aside
      className="border-border bg-surface rounded-xl border p-5 shadow-sm"
      aria-label={PAYMENT_COPY.orderSummary}
    >
      <h2 className="font-title text-lg font-semibold">{PAYMENT_COPY.orderSummary}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{PAYMENT_COPY.ticketLine}</dt>
          <dd className="font-medium">{formatCurrency(price)}</dd>
        </div>
        {discountUsd > 0 && (
          <div className="text-brand-60 flex justify-between gap-4">
            <dt>
              {PAYMENT_COPY.accessCodeDiscount}
              {accessCode ? ` (${accessCode})` : ""}
            </dt>
            <dd>−{formatCurrency(discountUsd)}</dd>
          </div>
        )}
        <div className="border-border-subtle flex justify-between gap-4 border-t pt-3 text-base">
          <dt className="font-semibold">{PAYMENT_COPY.total}</dt>
          <dd className="font-semibold">{formatCurrency(total)}</dd>
        </div>
      </dl>
      <p className="text-faint mt-4 text-xs">
        {PAYMENT_COPY.methodLabel}: {PAYMENT_COPY.methodValue}
      </p>
    </aside>
  );
}
