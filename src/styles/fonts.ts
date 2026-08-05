/**
 * Font loading strategy
 *
 * Luma titles on this page use Adobe Typekit family "alternate"
 * (`--title-font: alternate, var(--font)` from /fonts/alternate.css).
 * We cannot redistribute Typekit files, so titles use Outfit (similar
 * geometric sans, medium weight + slight tracking) via next/font.
 *
 * Luma body `--font` is an Inter-like system stack; we load Inter for UI.
 */
import { Inter, Outfit } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontTitle = Outfit({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["500", "600", "700"],
  display: "swap",
});
