import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "success" | "warn" | "danger" | "brand";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-[var(--admin-surface-muted)] text-[var(--admin-fg-secondary)]",
  success: "bg-emerald-500/12 text-emerald-700",
  warn: "bg-amber-500/12 text-amber-800",
  danger: "bg-red-500/12 text-red-700",
  brand: "bg-[var(--admin-brand-soft)] text-[var(--admin-brand)]",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function paymentTone(status: string): BadgeTone {
  if (status === "paid") return "success";
  if (status === "failed") return "danger";
  if (status === "refunded") return "warn";
  return "neutral";
}

export function ticketTone(status: string): BadgeTone {
  if (status === "confirmed") return "success";
  if (status === "cancelled") return "danger";
  return "warn";
}
