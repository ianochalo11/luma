/**
 * Event page shell — mirrors luma.com/breakpoint2026 proportions.
 *
 * Luma uses full-bleed flex with 1rem pads + 330px left rail.
 * We keep responsive gutters and a soft max so ultra-wide
 * monitors don’t stretch copy unreadably, while staying wider
 * than a narrow ~1000px cap.
 */
export const PAGE_SHELL = {
  /** Soft cap — content reads like Luma on laptop/desktop */
  maxWidth: "78rem", // 1248px
  /**
   * Outer gutters stay visible on all viewports.
   * Slightly roomier left/right pad so cover + copy sit off the edge.
   */
  paddingInline: "clamp(1.25rem, 4.5vw, 2.75rem)",
  /** Luma `.event-page-content-wrapper` gap */
  columnGap: "2rem",
  /** Luma `.event-page-left { width: 330px }` */
  sidebarWidth: "330px",
} as const;

export const pageShellStyle = {
  maxWidth: PAGE_SHELL.maxWidth,
  paddingLeft: PAGE_SHELL.paddingInline,
  paddingRight: PAGE_SHELL.paddingInline,
} as const;
