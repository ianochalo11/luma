import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { adminUi } from "@/app/admin-145678/ui";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className={adminUi.pageTitle}>{title}</h2>
        {description && <p className={adminUi.pageSub}>{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <form
      className={cn(
        "flex flex-wrap items-end gap-3 rounded-xl border border-[var(--admin-border)]",
        "bg-[var(--admin-surface)] p-3 sm:p-4",
      )}
    >
      {children}
    </form>
  );
}

export function Pagination({
  page,
  totalPages,
  total,
  searchParams,
  basePath,
}: {
  page: number;
  totalPages: number;
  total: number;
  searchParams: Record<string, string | undefined>;
  basePath: string;
}) {
  function href(p: number) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") qs.set(k, v);
    }
    qs.set("page", String(p));
    return `${basePath}?${qs}`;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--admin-muted)]">
      <span>
        Page {page} of {totalPages}
        <span className="text-[var(--admin-faint)]"> · {total} total</span>
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={adminUi.btnGhost}>
            Previous
          </Link>
        ) : (
          <span className={cn(adminUi.btnGhost, "pointer-events-none opacity-40")}>
            Previous
          </span>
        )}
        {page < totalPages ? (
          <Link href={href(page + 1)} className={adminUi.btnGhost}>
            Next
          </Link>
        ) : (
          <span className={cn(adminUi.btnGhost, "pointer-events-none opacity-40")}>
            Next
          </span>
        )}
      </div>
    </div>
  );
}
