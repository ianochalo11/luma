/**
 * Light-theme tokens for Breakpoint 2026 — flat SaaS aesthetic.
 * Mirrored into `src/app/globals.css` via `@theme`.
 */

export const theme = {
  colors: {
    background: "#F4F2FA",
    backgroundElevated: "#F6F5FB",
    surface: "#FFFFFF",
    surfaceMuted: "#F0EEF6",

    foreground: "#171717",
    foregroundSecondary: "#374151",
    muted: "#6B7280",
    faint: "#9CA3AF",

    border: "#E5E7EB",
    borderSubtle: "#EEEFF2",

    /** Accent purple (CTAs, date tile, links) */
    brand5: "#F5F3FF",
    brand10: "#EDE9FE",
    brand20: "#DDD6FE",
    brand30: "#C4B5FD",
    brand40: "#A78BFA",
    brand50: "#6D5BD0",
    brand60: "#5B4BB8",
    brand70: "#4C3D9A",
    brand80: "#3B2F78",
    brand90: "#2A2154",
    brand100: "#171717",

    coverDeep: "#100917",
    coverTint: "#110a19",
    coverVibrant: "#7C5FE0",

    paleBrand: "#6D5BD01A",
    destructive: "#DC2626",
    success: "#16A34A",
  },

  radii: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    card: "1rem",
    pill: "9999px",
  },

  layout: {
    maxWidth: "72rem", // max-w-6xl
    sidebarWidth: "380px",
    horizontalPadding: "1.5rem",
  },

  typography: {
    titleFamily: "var(--font-title), var(--font-sans), system-ui, sans-serif",
    bodyFamily: "var(--font-sans), system-ui, sans-serif",
    titleSizeDesktop: "2.5rem",
    titleSizeMobile: "1.875rem",
    microLabel: "0.6875rem",
  },

  motion: {
    fast: "150ms",
    base: "200ms",
    slow: "320ms",
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type Theme = typeof theme;
