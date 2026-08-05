import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LINKS } from "@/constants/links";

export function FeaturedInLondonPill() {
  return (
    <Link
      href={LINKS.tags.featuredInLondon}
      className="border-border bg-surface text-foreground hover:bg-surface-muted mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors"
    >
      <Image
        src={LINKS.assets.londonIcon}
        alt=""
        width={18}
        height={18}
        className="rounded-full"
      />
      <span>Featured in London</span>
      <ChevronRight className="text-muted h-3.5 w-3.5" strokeWidth={2} aria-hidden />
    </Link>
  );
}
