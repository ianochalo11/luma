import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistrationById } from "@/lib/db";
import { formatCurrency } from "@/lib/utils/format";
import { DetailPanel, DetailRow, DetailTabs } from "@/app/admin/components/DetailTabs";
import { StatusBadge, paymentTone, ticketTone } from "@/app/admin/components/StatusBadge";
import { adminUi } from "@/app/admin/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const booking = await getRegistrationById(id);
  if (!booking) notFound();

  const formEntries = Object.entries(booking.form).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );

  const summary = (
    <dl>
      <DetailRow label="Legal name" value={booking.form.legalName} />
      <DetailRow label="Company" value={booking.form.company} />
      <DetailRow label="Country" value={booking.form.country} />
      <DetailRow label="Ticket" value={booking.ticketStatus} />
      <DetailRow label="Payment" value={booking.paymentStatus} />
      <DetailRow label="Amount paid" value={formatCurrency(booking.amountPaidUsd)} />
      <DetailRow label="Created" value={new Date(booking.createdAt).toLocaleString()} />
    </dl>
  );

  const userPanel = (
    <dl>
      <DetailRow label="Name" value={booking.user?.name ?? "—"} />
      <DetailRow label="Email" value={booking.user?.email ?? "—"} />
      <DetailRow label="User ID" value={booking.userId} />
      <DetailRow label="Provider" value={booking.user?.authProvider ?? "—"} />
    </dl>
  );

  const formPanel = (
    <dl>
      {formEntries.map(([key, value]) => (
        <DetailRow
          key={key}
          label={key}
          value={Array.isArray(value) ? value.join(", ") : String(value)}
        />
      ))}
    </dl>
  );

  const paymentPanel = (
    <dl>
      <DetailRow label="Ticket price" value={formatCurrency(booking.ticketPriceUsd)} />
      <DetailRow label="Discount" value={formatCurrency(booking.discountUsd)} />
      <DetailRow label="Amount paid" value={formatCurrency(booking.amountPaidUsd)} />
      <DetailRow label="Access code" value={booking.accessCode ?? "—"} />
      <DetailRow label="Wallet" value={booking.walletAddress ?? "—"} />
      <DetailRow label="Signature" value={booking.paymentSignature ?? "—"} />
    </dl>
  );

  return (
    <div className="animate-admin-fade mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/bookings"
          className="text-xs font-semibold text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-brand)]"
        >
          ← Bookings
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--admin-fg)]">
              {booking.form.legalName}
            </h2>
            <p className={adminUi.pageSub}>
              <span className="font-mono text-xs">{booking.id}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={ticketTone(booking.ticketStatus)}>
              {booking.ticketStatus}
            </StatusBadge>
            <StatusBadge tone={paymentTone(booking.paymentStatus)}>
              {booking.paymentStatus}
            </StatusBadge>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Meta label="Ticket" value={booking.ticketStatus} />
        <Meta label="Payment" value={booking.paymentStatus} />
        <Meta label="Amount" value={formatCurrency(booking.amountPaidUsd)} />
      </div>

      <DetailPanel>
        <DetailTabs
          tabs={[
            { id: "summary", label: "Summary", content: summary },
            { id: "user", label: "User", content: userPanel },
            { id: "form", label: "Form answers", content: formPanel },
            { id: "payment", label: "Payment", content: paymentPanel },
          ]}
        />
      </DetailPanel>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
      <p className="text-[11px] font-semibold tracking-wide text-[var(--admin-muted)] uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-[var(--admin-fg)] capitalize">{value}</p>
    </div>
  );
}
