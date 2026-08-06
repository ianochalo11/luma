import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LINKS } from "@/constants/links";

/** Luma featured-pill — translucent wash, no solid white fill */
export function FeaturedInLondonPill() {
  return (
    <Link
      href={LINKS.tags.featuredInLondon}
      className="mb-2 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm font-medium backdrop-blur-md transition-colors"
      style={{ backgroundColor: "var(--opacity-light)" }}
    >
      <Image
        src={LINKS.assets.londonIcon}
        alt=""
        width={18}
        height={18}
        className="rounded-full"
      />
      <span className="text-foreground max-w-[150px] truncate">Featured in London</span>
      <ChevronRight
        className="text-faint h-3.5 w-3.5 shrink-0"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  );
}
