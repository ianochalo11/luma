import type { Event } from "@/types/event";

interface AboutEventSectionProps {
  event: Event;
}

export function AboutEventSection({ event }: AboutEventSectionProps) {
  return (
    <section
      className="mt-10 border-t pt-4"
      style={{ borderColor: "var(--opacity-second-light)" }}
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="font-title-medium text-foreground text-lg">
        {event.meta.aboutHeading}
      </h2>
      <div className="text-foreground text-md mt-4 space-y-4 leading-[1.6]">
        {event.about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <p>
          {event.about.closingPrefix}
          <a
            href={event.about.closingLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-50 font-medium underline-offset-2 hover:underline"
          >
            {event.about.closingLinkLabel}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
