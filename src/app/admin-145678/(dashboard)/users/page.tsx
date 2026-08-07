import Link from "next/link";
import { ensureBreakpointEvent, listFollowerUserIds, listUsers } from "@/lib/db";
import {
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  Td,
  Th,
} from "@/app/admin-145678/components/DataTable";
import {
  FilterBar,
  PageHeader,
  Pagination,
} from "@/app/admin-145678/components/PageChrome";
import { StatusBadge } from "@/app/admin-145678/components/StatusBadge";
import { adminUi } from "@/app/admin-145678/ui";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const event = await ensureBreakpointEvent();

  const { items, total, pageSize } = await listUsers({
    page,
    pageSize: 20,
    search: sp.search,
  });

  const followerIds = await listFollowerUserIds(
    items.map((u) => u.id),
    event.id,
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="animate-admin-fade space-y-5">
      <PageHeader
        title="Users"
        description={`${total} registered account${total === 1 ? "" : "s"}`}
      />

      <FilterBar>
        <label className={adminUi.label}>
          Search
          <input
            name="search"
            defaultValue={sp.search ?? ""}
            placeholder="Name or email…"
            className={adminUi.input}
          />
        </label>
        <button type="submit" className={adminUi.btnPrimary}>
          Search
        </button>
      </FilterBar>

      <DataTable minWidth="720px">
        <DataTableHead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Provider</Th>
            <Th>Followed event</Th>
            <Th>Role</Th>
            <Th>Signed up</Th>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {items.length === 0 ? (
            <DataTableEmpty
              colSpan={6}
              title="No users yet"
              description="Accounts appear here after someone signs in from the event page."
              action={
                <Link href="/" className={adminUi.btnPrimary}>
                  Open event page
                </Link>
              }
            />
          ) : (
            items.map((user) => (
              <DataTableRow key={user.id}>
                <Td>
                  <span className={adminUi.cellStrong}>{user.name}</span>
                </Td>
                <Td>
                  <span className={adminUi.cellMuted}>{user.email}</span>
                </Td>
                <Td>
                  <StatusBadge>{user.authProvider}</StatusBadge>
                </Td>
                <Td>
                  {followerIds.has(user.id) ? (
                    <StatusBadge tone="success">Following</StatusBadge>
                  ) : (
                    <span className={adminUi.faint}>—</span>
                  )}
                </Td>
                <Td>
                  {user.isAdmin ? (
                    <StatusBadge tone="brand">Admin</StatusBadge>
                  ) : (
                    <StatusBadge>User</StatusBadge>
                  )}
                </Td>
                <Td>
                  <span className={adminUi.cellMuted}>
                    {new Date(user.createdAt).toLocaleString()}
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
        basePath="/admin-145678/users"
      />
    </div>
  );
}
