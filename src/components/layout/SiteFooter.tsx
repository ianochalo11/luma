import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Mail } from "lucide-react";
import { FOOTER_NAV_LINKS } from "@/constants/event-content";
import { pageShellStyle } from "@/constants/layout";
import { LINKS } from "@/constants/links";

export function SiteFooter() {
  return (
    <footer className="bg-background mt-auto w-full">
      <div
        className="border-border mx-auto flex w-full flex-col gap-6 border-t py-8 sm:flex-row sm:items-center sm:justify-between"
        style={pageShellStyle}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href={LINKS.site.home} className="text-nav" aria-label="Luma Home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 133 134"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden
            >
              <path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
            </svg>
          </Link>
          <nav
            className="text-nav flex flex-wrap gap-x-4 gap-y-2 text-sm"
            aria-label="Footer"
          >
            {FOOTER_NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                {...(item.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-nav flex items-center gap-2">
          <a
            href={LINKS.social.lumaInstagram}
            target="_blank"
            rel="nofollow noopener"
            aria-label="Luma on Instagram"
            className="rounded-md p-1.5"
          >
            <FaInstagram className="h-4 w-4" />
          </a>
          <a
            href={LINKS.social.lumaX}
            target="_blank"
            rel="nofollow noopener"
            aria-label="Luma on X"
            className="rounded-md p-1.5"
          >
            <FaXTwitter className="h-4 w-4" />
          </a>
          <a
            href={LINKS.social.lumaSupportEmail}
            aria-label="Contact Us"
            className="rounded-md p-1.5"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
          </a>
          <Link
            href={LINKS.site.app}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/80 text-nav ml-1 inline-flex h-8 items-center rounded-full border bg-transparent px-3 text-xs font-medium"
          >
            Get the App
          </Link>
        </div>
      </div>
    </footer>
  );
}
