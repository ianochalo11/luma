import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--admin-surface-muted)]",
        className,
      )}
    />
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
        <Skeleton className="h-10 rounded-none" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-12 rounded-none border-t border-[var(--admin-border)]"
          />
        ))}
      </div>
    </div>
  );
}
