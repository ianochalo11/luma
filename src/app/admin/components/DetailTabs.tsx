"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface DetailTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

/** Lightweight tabs for booking detail panels — no page reload. */
export function DetailTabs({ tabs }: { tabs: DetailTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-[var(--admin-border)]">
        {tabs.map((tab) => {
          const selected = tab.id === current?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                selected
                  ? "text-[var(--admin-brand)]"
                  : "text-[var(--admin-muted)] hover:text-[var(--admin-fg)]",
              )}
            >
              {tab.label}
              {selected && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--admin-brand)]" />
              )}
            </button>
          );
        })}
      </div>
      <div key={current?.id} role="tabpanel" className="animate-admin-fade pt-5">
        {current?.content}
      </div>
    </div>
  );
}

export function DetailPanel({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5">
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-[var(--admin-fg)]">{title}</h3>
      )}
      {children}
    </section>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-[var(--admin-border)] py-2.5 last:border-0 sm:grid-cols-[140px_1fr] sm:gap-3">
      <dt className="text-xs font-medium tracking-wide text-[var(--admin-muted)] uppercase">
        {label}
      </dt>
      <dd className="text-sm break-all text-[var(--admin-fg)]">{value}</dd>
    </div>
  );
}
