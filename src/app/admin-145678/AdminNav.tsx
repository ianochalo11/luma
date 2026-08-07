"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck2, LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/admin-145678", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin-145678/bookings", label: "Bookings", icon: CalendarCheck2 },
  { href: "/admin-145678/users", label: "Users", icon: Users },
];

export function AdminNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
              collapsed && "lg:justify-center lg:px-0",
              active
                ? "bg-[var(--admin-brand-soft)] text-[var(--admin-brand)]"
                : "text-[var(--admin-fg-secondary)] hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)]",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active
                  ? "text-[var(--admin-brand)]"
                  : "text-[var(--admin-muted)] group-hover:text-[var(--admin-fg)]",
              )}
              strokeWidth={1.75}
            />
            <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
