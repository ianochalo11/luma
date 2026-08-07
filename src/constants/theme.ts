/**
 * Light-theme tokens sampled from https://luma.com/breakpoint2026
 * Keep values in sync with `src/app/globals.css` `:root` (CSS is the runtime source).
 * Primary text: --black-base-rgb 29,3,51 → #1D0333
 * Brand accent: #836AA2
 */

export const theme = {
  colors: {
    background: "#F4F0F9",
    backgroundElevated: "#FCFBFE",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F0F9",

    foreground: "#1D0333",
    foregroundSecondary: "#503E65",
    muted: "rgba(29, 3, 51, 0.64)",
    faint: "rgba(29, 3, 51, 0.36)",
    nav: "rgba(29, 3, 51, 0.36)",

    border: "#E1E1E1",
    borderSubtle: "#EBEBEB",

    opacityLight: "rgba(29, 3, 51, 0.04)",
    opacitySecondLight: "rgba(29, 3, 51, 0.08)",

    brand5: "#FCFBFE",
    brand10: "#F4F0F9",
    brand20: "#F2EBFB",
    brand30: "#D4C7E6",
    brand40: "#9885B0",
    brand50: "#836AA2",
    brand60: "#6D5788",
    brand70: "#503E65",
    brand80: "#332840",
    brand90: "#18141E",
    brand100: "#131016",

    coverDeep: "#100917",
    coverTint: "#110A19",
    coverVibrant: "#836AA2",
    paleBrand: "#836AA221",
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
    /** Soft content cap (~1248px) — wider than a 1000px shell */
    maxWidth: "78rem",
    sidebarWidth: "330px",
    horizontalPadding: "clamp(1rem, 3.5vw, 2rem)",
  },

  typography: {
    titleFamily: '"alternate", var(--font-sans)',
    bodyFamily:
      '-apple-system, BlinkMacSystemFont, "Apple Color Emoji", var(--font-inter), Roboto, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    sizes: {
      xxxl: "1.5rem",
      xxl: "1.375rem",
      xl: "1.25rem",
      lg: "1.125rem",
      md: "1rem",
      sm: "0.875rem",
      xs: "0.8125rem",
      xxs: "0.75rem",
      xxxs: "0.625rem",
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 600,
    },
  },

  motion: {
    fast: "150ms",
    base: "200ms",
    slow: "320ms",
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type Theme = typeof theme;
