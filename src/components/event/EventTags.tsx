import Link from "next/link";
import type { EventTag } from "@/types/event";

interface EventTagsProps {
  tags: EventTag[];
}

export function EventTags({ tags }: EventTagsProps) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Event categories">
      {tags.map((tag) => (
        <li key={tag.label}>
          <Link
            href={tag.href}
            className="border-border-subtle bg-surface text-foreground-secondary hover:border-brand-30 hover:bg-brand-10 hover:text-brand-70 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors"
          >
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
