import Link from "next/link";
import { ensureBreakpointEvent, listRegistrations } from "@/lib/db";
import { formatCurrency } from "@/lib/utils/format";
import {
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  Td,
  Th,
} from "@/app/admin/components/DataTable";
import { FilterBar, PageHeader, Pagination } from "@/app/admin/components/PageChrome";
import { StatusBadge, paymentTone, ticketTone } from "@/app/admin/components/StatusBadge";
import { adminUi } from "@/app/admin/ui";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    paymentStatus?: string;
    ticketStatus?: string;
    sort?: string;
  }>;
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const event = await ensureBreakpointEvent();

  const sort =
    sp.sort === "createdAt" ||
    sp.sort === "-createdAt" ||
    sp.sort === "amountPaidUsd" ||
    sp.sort === "-amountPaidUsd"
      ? sp.sort
      : "-createdAt";

  const paymentStatus =
    sp.paymentStatus === "paid" ||
    sp.paymentStatus === "unpaid" ||
    sp.paymentStatus === "failed" ||
    sp.paymentStatus === "refunded"
      ? sp.paymentStatus
      : undefined;

  const ticketStatus =
    sp.ticketStatus === "confirmed" ||
    sp.ticketStatus === "pending" ||
    sp.ticketStatus === "cancelled"
      ? sp.ticketStatus
      : undefined;

  const { items, total, pageSize } = await listRegistrations({
    eventSlug: event.slug,
    page,
    pageSize: 20,
    search: sp.search,
    paymentStatus,
    ticketStatus,
    sort,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="animate-admin-fade space-y-5">
      <PageHeader
        title="Bookings"
        description={`${total} registration${total === 1 ? "" : "s"} for ${event.title}`}
      />

      <FilterBar>
        <label className={adminUi.label}>
          Search
          <input
            name="search"
            defaultValue={sp.search ?? ""}
            placeholder="Name, company…"
            className={adminUi.input}
          />
        </label>
        <label className={adminUi.label}>
          Payment
          <select
            name="paymentStatus"
            defaultValue={sp.paymentStatus ?? ""}
            className={adminUi.select}
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </label>
        <label className={adminUi.label}>
          Ticket
          <select
            name="ticketStatus"
            defaultValue={sp.ticketStatus ?? ""}
            className={adminUi.select}
          >
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <input type="hidden" name="sort" value={sort} />
        <button type="submit" className={adminUi.btnPrimary}>
          Apply filters
        </button>
      </FilterBar>

      <DataTable minWidth="900px">
        <DataTableHead>
          <tr>
            <Th>Legal name</Th>
            <Th>Company</Th>
            <Th className="hidden lg:table-cell">Country</Th>
            <Th className="hidden md:table-cell">User</Th>
            <Th>Ticket</Th>
            <Th>Payment</Th>
            <Th
              sortKey="amountPaidUsd"
              currentSort={sort}
              basePath="/admin/bookings"
              searchParams={sp}
            >
              Amount
            </Th>
            <Th
              sortKey="createdAt"
              currentSort={sort}
              basePath="/admin/bookings"
              searchParams={sp}
            >
              Created
            </Th>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {items.length === 0 ? (
            <DataTableEmpty
              colSpan={8}
              title="No bookings match these filters"
              description="Try clearing search or switching payment/ticket status to see more results."
            />
          ) : (
            items.map((row) => (
              <DataTableRow key={row.id}>
                <Td>
                  <Link href={`/admin/bookings/${row.id}`} className={adminUi.link}>
                    {row.form.legalName}
                  </Link>
                </Td>
                <Td>{row.form.company}</Td>
                <Td className="hidden lg:table-cell">{row.form.country}</Td>
                <Td className="hidden md:table-cell">
                  <span className={adminUi.cellMuted}>{row.user?.email ?? "—"}</span>
                </Td>
                <Td>
                  <StatusBadge tone={ticketTone(row.ticketStatus)}>
                    {row.ticketStatus}
                  </StatusBadge>
                </Td>
                <Td>
                  <StatusBadge tone={paymentTone(row.paymentStatus)}>
                    {row.paymentStatus}
                  </StatusBadge>
                </Td>
                <Td mono>{formatCurrency(row.amountPaidUsd)}</Td>
                <Td>
                  <span className={adminUi.cellMuted}>
                    {new Date(row.createdAt).toLocaleString()}
                  </span>
                </Td>
              </DataTableRow>
            ))
          )}
        </DataTableBody>
      </DataTable>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        searchParams={sp}
        basePath="/admin/bookings"
      />
    </div>
  );
}
