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
            className="hover:border-brand-40 hover:text-brand-50 text-nav inline-flex items-center rounded-full border px-2 py-0.5 text-sm font-medium transition-colors"
            style={{ borderColor: "var(--opacity-second-light)" }}
          >
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
