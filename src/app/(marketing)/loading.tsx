import type { CSSProperties } from "react";
import { PAGE_SHELL, pageShellStyle } from "@/constants/layout";

export default function HomeLoading() {
  return (
    <div
      className="mx-auto grid w-full grid-cols-1 py-4 lg:[grid-template-columns:var(--event-sidebar)_minmax(0,1fr)]"
      style={
        {
          ...pageShellStyle,
          columnGap: PAGE_SHELL.columnGap,
          rowGap: PAGE_SHELL.columnGap,
          ["--event-sidebar"]: PAGE_SHELL.sidebarWidth,
        } as CSSProperties
      }
    >
      <div className="aspect-square animate-pulse rounded-2xl bg-[var(--opacity-light)]" />
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-full bg-[var(--opacity-light)]" />
        <div className="h-12 w-3/4 animate-pulse rounded-md bg-[var(--opacity-light)]" />
        <div className="h-40 animate-pulse rounded-2xl bg-[var(--opacity-light)]" />
      </div>
    </div>
  );
}
