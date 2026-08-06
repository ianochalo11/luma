import type { Metadata, Viewport } from "next";
import { BREAKPOINT_EVENT } from "@/constants/event-content";
import { LINKS } from "@/constants/links";
import { AuthSessionProvider } from "@/components/layout/AuthSessionProvider";
import { fontSans } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BREAKPOINT_EVENT.title} · Luma`,
  description: BREAKPOINT_EVENT.about.paragraphs[0],
  openGraph: {
    title: `${BREAKPOINT_EVENT.title} · Luma`,
    description: BREAKPOINT_EVENT.about.paragraphs[0],
    url: LINKS.event.page,
    images: [{ url: LINKS.assets.socialImage, width: 800, height: 420 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F0F9",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
