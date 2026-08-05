import Link from "next/link";
import { CalendarCheck2, CircleDollarSign, Ticket, UsersRound } from "lucide-react";
import {
  countFollowers,
  countRegistrations,
  ensureBreakpointEvent,
  listRegistrations,
  sumRevenueUsd,
} from "@/lib/db";
import { formatCurrency } from "@/lib/utils/format";
import { StatCard } from "@/app/admin/components/StatCard";
import {
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  Td,
  Th,
} from "@/app/admin/components/DataTable";
import { PageHeader } from "@/app/admin/components/PageChrome";
import { StatusBadge, paymentTone } from "@/app/admin/components/StatusBadge";
import { adminUi } from "@/app/admin/ui";

export default async function AdminOverviewPage() {
  const event = await ensureBreakpointEvent();
  const [bookings, revenue, followers, ticketsSold, recent] = await Promise.all([
    countRegistrations({ eventSlug: event.slug }),
    sumRevenueUsd(event.slug),
    countFollowers({ eventId: event.id, organizerId: event.organizerId }),
    countRegistrations({
      eventSlug: event.slug,
      ticketStatus: "confirmed",
    }),
    listRegistrations({
      eventSlug: event.slug,
      page: 1,
      pageSize: 8,
      sort: "-createdAt",
    }),
  ]);

  const capacity = event.capacity ?? 0;
  const fill = capacity > 0 ? Math.round((ticketsSold / capacity) * 100) : null;

  return (
    <div className="animate-admin-fade space-y-8">
      <PageHeader
        title={event.title}
        description="Live snapshot of bookings, revenue, and followers"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={String(bookings)}
          hint="All registration records"
          icon={CalendarCheck2}
          tone="brand"
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(revenue)}
          hint="Paid tickets only"
          icon={CircleDollarSign}
          tone="success"
        />
        <StatCard
          label="Followers"
          value={String(followers)}
          hint="Event + organizer follows"
          icon={UsersRound}
        />
        <StatCard
          label="Tickets sold"
          value={String(ticketsSold)}
          hint={
            capacity > 0
              ? `${ticketsSold} / ${capacity} · ${fill}% capacity`
              : "Confirmed tickets"
          }
          icon={Ticket}
          tone="warn"
        />
      </div>

      {capacity > 0 && (
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide text-[var(--admin-muted)] uppercase">
              Capacity fill
            </span>
            <span className="text-[var(--admin-fg-secondary)] tabular-nums">{fill}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--admin-surface-muted)]">
            <div
              className="h-full rounded-full bg-[var(--admin-brand)] transition-[width] duration-300"
              style={{ width: `${Math.min(fill ?? 0, 100)}%` }}
            />
          </div>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className={adminUi.sectionTitle}>Recent bookings</h3>
          <Link href="/admin/bookings" className={adminUi.brandLink}>
            View all →
          </Link>
        </div>

        <DataTable minWidth="640px">
          <DataTableHead>
            <tr>
              <Th>Name</Th>
              <Th className="hidden sm:table-cell">User</Th>
              <Th>Payment</Th>
              <Th>Amount</Th>
              <Th className="hidden md:table-cell">Created</Th>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {recent.items.length === 0 ? (
              <DataTableEmpty
                colSpan={5}
                title="No bookings yet"
                description="When someone completes checkout on the event page, their registration will show up here."
                action={
                  <Link href="/breakpoint2026" className={adminUi.btnPrimary}>
                    Open event page
                  </Link>
                }
              />
            ) : (
              recent.items.map((row) => (
                <DataTableRow key={row.id}>
                  <Td>
                    <Link href={`/admin/bookings/${row.id}`} className={adminUi.link}>
                      {row.form.legalName}
                    </Link>
                  </Td>
                  <Td className="hidden sm:table-cell">
                    <span className={adminUi.cellMuted}>
                      {row.user?.email ?? row.userId.slice(0, 8)}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge tone={paymentTone(row.paymentStatus)}>
                      {row.paymentStatus}
                    </StatusBadge>
                  </Td>
                  <Td mono>{formatCurrency(row.amountPaidUsd)}</Td>
                  <Td className="hidden md:table-cell">
                    <span className={adminUi.cellMuted}>
                      {new Date(row.createdAt).toLocaleString()}
                    </span>
                  </Td>
                </DataTableRow>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </section>
    </div>
  );
}
