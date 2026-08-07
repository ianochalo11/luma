import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "brand" | "success" | "warn";
}

const toneIcon: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-[var(--admin-surface-muted)] text-[var(--admin-fg-secondary)]",
  brand: "bg-[var(--admin-brand-soft)] text-[var(--admin-brand)]",
  success: "bg-emerald-500/12 text-emerald-700",
  warn: "bg-amber-500/12 text-amber-700",
};

/** Dense metric tile — icon chip + label + value + optional meta. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4",
        "transition-colors duration-150 hover:border-[var(--admin-brand)]/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
          {label}
        </p>
        <span
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            toneIcon[tone],
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--admin-fg)] tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-[var(--admin-muted)]">{hint}</p>}
    </div>
  );
}
