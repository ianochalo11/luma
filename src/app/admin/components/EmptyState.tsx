import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/** Polished empty state — teaches the next action, not "nothing here". */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]">
        <Inbox className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </span>
      <p className="text-sm font-semibold text-[var(--admin-fg)]">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--admin-muted)]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
