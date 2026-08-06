/**
 * Font loading — mirrored from https://luma.com/breakpoint2026
 *
 * Body `--font`:
 *   -apple-system, BlinkMacSystemFont, "Apple Color Emoji", Inter, Roboto, …
 * Title `--title-font`:
 *   alternate (Typekit) + body stack; @font-face uses size-adjust:115%
 *
 * Inter is loaded via next/font into `--font-inter` and slotted into the
 * exact Luma stack (system UI first), not used as the sole family.
 */
import { Inter } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
