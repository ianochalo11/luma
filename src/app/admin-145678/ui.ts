/** Shared admin dashboard class tokens (theme via --admin-* CSS vars).
 *  Operate-mode: dense, scannable, restrained accent. */
export const adminUi = {
  pageTitle: "text-base font-semibold tracking-tight text-[var(--admin-fg)]",
  pageSub: "mt-1 text-sm text-[var(--admin-muted)]",
  sectionTitle: "text-sm font-semibold text-[var(--admin-fg)]",

  card: "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]",
  cardPad: "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5",

  label:
    "flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-muted)]",
  input:
    "h-9 w-full min-w-0 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 text-sm text-[var(--admin-fg)] outline-none transition-colors duration-150 placeholder:text-[var(--admin-faint)] focus:border-[var(--admin-brand)] sm:w-52",
  select:
    "h-9 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 text-sm text-[var(--admin-fg)] outline-none transition-colors duration-150 focus:border-[var(--admin-brand)]",
  btnPrimary:
    "inline-flex h-9 items-center justify-center rounded-lg bg-[var(--admin-brand)] px-4 text-sm font-medium text-white transition-[transform,background-color] duration-150 hover:bg-[var(--admin-brand-hover)] active:scale-[0.98]",
  btnGhost:
    "inline-flex items-center justify-center rounded-lg border border-[var(--admin-border)] px-3 py-1.5 text-sm text-[var(--admin-fg-secondary)] transition-colors duration-150 hover:bg-[var(--admin-surface-muted)] hover:text-[var(--admin-fg)]",

  link: "font-medium text-[var(--admin-fg)] transition-colors hover:text-[var(--admin-brand)]",
  brandLink:
    "text-xs font-semibold text-[var(--admin-brand)] transition-colors hover:underline",
  brandAccent: "text-[var(--admin-brand)]",
  faint: "text-[var(--admin-faint)]",
  cellStrong: "font-medium text-[var(--admin-fg)]",
  cellMuted: "text-[var(--admin-muted)]",
} as const;
