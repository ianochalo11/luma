import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/app/admin-145678/components/EmptyState";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}

export function DataTable({ children, className, minWidth = "720px" }: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]/80">
      {children}
    </thead>
  );
}

export function DataTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[var(--admin-border)]">{children}</tbody>;
}

export function DataTableRow({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const row = (
    <tr
      className={cn(
        "transition-colors duration-150 hover:bg-[var(--admin-row-hover)]",
        href && "cursor-pointer",
      )}
    >
      {children}
    </tr>
  );
  return row;
}

export function Th({
  children,
  className,
  sortKey,
  currentSort,
  basePath,
  searchParams,
}: {
  children: React.ReactNode;
  className?: string;
  sortKey?: string;
  currentSort?: string;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
}) {
  if (!sortKey || !basePath) {
    return (
      <th
        className={cn(
          "px-4 py-2.5 text-[11px] font-semibold tracking-[0.05em] text-[var(--admin-muted)] uppercase",
          className,
        )}
      >
        {children}
      </th>
    );
  }

  const isAsc = currentSort === sortKey;
  const isDesc = currentSort === `-${sortKey}`;
  const next = isDesc ? sortKey : `-${sortKey}`;

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams ?? {})) {
    if (v && k !== "sort" && k !== "page") qs.set(k, v);
  }
  qs.set("sort", next);
  qs.set("page", "1");

  const Icon = isAsc ? ArrowUp : isDesc ? ArrowDown : ArrowUpDown;

  return (
    <th
      className={cn(
        "px-4 py-2.5 text-[11px] font-semibold tracking-[0.05em] text-[var(--admin-muted)] uppercase",
        className,
      )}
    >
      <Link
        href={`${basePath}?${qs}`}
        className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--admin-fg)]"
      >
        {children}
        <Icon
          className={cn(
            "h-3 w-3",
            isAsc || isDesc ? "text-[var(--admin-brand)]" : "text-[var(--admin-faint)]",
          )}
          strokeWidth={2}
        />
      </Link>
    </th>
  );
}

export function Td({
  children,
  className,
  mono,
}: {
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle text-[var(--admin-fg-secondary)]",
        mono && "font-mono text-xs tabular-nums",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function DataTableEmpty({
  colSpan,
  title,
  description,
  action,
}: {
  colSpan: number;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <EmptyState title={title} description={description} action={action} />
      </td>
    </tr>
  );
}
