"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EventActions } from "@/components/event/EventActions";
import { FollowButton } from "@/components/event/FollowButton";
import { LINKS } from "@/constants/links";
import { BREAKPOINT_ORGANIZER_ID } from "@/constants/ids";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils/cn";

interface EventSidebarProps {
  event: Event;
}

/** Left column: cover + presented by + hosted by + crypto — matched to luma.com. */
export function EventSidebar({ event }: EventSidebarProps) {
  const cryptoTag = event.tags.find((t) => t.label === "Crypto");

  return (
    <aside className="flex flex-col gap-6">
      <div className="bg-cover-deep relative aspect-square w-full overflow-hidden rounded-2xl shadow-sm">
        <Image
          src={event.coverUrl}
          alt={`${event.title} cover`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 330px"
        />
      </div>

      {/* Presented by */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Link
            href={event.presentedBy.href}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <Image
              src={event.presentedBy.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="border-border h-8 w-8 shrink-0 rounded-md object-cover"
              style={{ borderWidth: 0.5 }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-tinted text-xxs leading-tight">
                {event.meta.presentedByLabel}
              </p>
              <span className="text-foreground group inline-flex max-w-full items-center gap-0.5 font-medium transition-colors hover:text-[var(--brand-50)]">
                <span className="truncate">{event.presentedBy.name}</span>
                <ChevronRight
                  className="text-nav h-3.5 w-3.5 shrink-0 translate-y-px transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand-50)]"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
            </div>
          </Link>

          <FollowButton
            eventId={event.slug}
            organizerId={BREAKPOINT_ORGANIZER_ID}
            label={event.ctas.follow}
            className="shrink-0"
          />
        </div>

        <div className="-mx-1.5 flex items-center">
          <SocialIcon href={LINKS.presentedBy.twitter} label="X">
            <XIcon />
          </SocialIcon>
          <SocialIcon href={LINKS.presentedBy.youtube} label="YouTube">
            <YouTubeIcon />
          </SocialIcon>
          <SocialIcon href={LINKS.presentedBy.website} label="Website">
            <GlobeIcon />
          </SocialIcon>
        </div>
      </div>

      {/* Hosted By */}
      <div>
        <div
          className="text-tinted mb-4 flex items-center gap-2 border-b pb-2 text-sm font-medium"
          style={{ borderColor: "var(--border)" }}
        >
          {event.meta.hostedByLabel}
        </div>

        <Link
          href={event.host.href}
          className="text-foreground flex items-center gap-2 font-medium transition-colors hover:text-[var(--brand-50)]"
        >
          <Image
            src={event.host.avatarUrl}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 rounded-full object-cover"
            style={{ boxShadow: "inset 0 0 0 0.5px var(--border)" }}
          />
          <span className="truncate">{event.host.name}</span>
        </Link>

        <div className="mt-3.5">
          <EventActions
            contactLabel={event.ctas.contactHost}
            reportLabel={event.ctas.reportEvent}
          />
        </div>

        {cryptoTag ? (
          <Link
            href={cryptoTag.href}
            className="text-nav hover:border-brand-40 hover:text-brand-50 mt-3.5 inline-flex w-fit items-center gap-0.5 rounded-full border px-2 py-0.5 text-sm font-medium transition-colors"
            style={{ borderColor: "var(--opacity-second-light)" }}
          >
            <HashIcon />
            {cryptoTag.label}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      aria-label={label}
      className={cn(
        "text-nav hover:text-foreground inline-flex items-center justify-center p-1.5 transition-colors",
      )}
    >
      {children}
    </a>
  );
}

/** Exact paths sampled from luma.com social-link SVGs. */
function XIcon() {
  return (
    <svg viewBox="0 0 120 120" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="m108.783 107.652-38.24-55.748.066.053L105.087 12H93.565L65.478 44.522 43.174 12H12.957l35.7 52.048-.005-.005L11 107.653h11.522L53.748 71.47l24.817 36.182zM38.609 20.696l53.652 78.26h-9.13l-53.696-78.26z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.112 8.665 7.31 10.26a.74.74 0 0 1-.746-.011.73.73 0 0 1-.36-.633V6.424c0-.267.138-.508.37-.642a.73.73 0 0 1 .738-.001l2.801 1.595a.74.74 0 0 1 0 1.289Zm4.808-4.567a2.37 2.37 0 0 0-1.609-1.709c-1.349-.445-9.38-.42-10.611.027a2.33 2.33 0 0 0-1.61 1.68c-.452 1.32-.452 6.544-.007 7.851.221.798.841 1.43 1.592 1.638.66.24 3.018.358 5.363.358 2.329 0 4.646-.117 5.267-.35a2.35 2.35 0 0 0 1.605-1.676c.45-1.296.452-6.506.01-7.819"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.394 12.674c-.604 1.208-1.178 1.42-1.394 1.42s-.79-.212-1.394-1.42c-.491-.982-.85-2.368-.932-3.97h4.652c-.082 1.602-.44 2.988-.932 3.97m.932-5.377H5.674c.082-1.603.44-2.989.932-3.971C7.21 2.118 7.784 1.906 8 1.906s.79.212 1.394 1.42c.491.982.85 2.368.932 3.97m1.408 1.406c-.09 1.915-.538 3.622-1.21 4.846a6.1 6.1 0 0 0 3.53-4.846zm2.32-1.406h-2.32c-.09-1.915-.538-3.622-1.21-4.845a6.1 6.1 0 0 1 3.53 4.845m-9.788 0c.09-1.915.538-3.622 1.21-4.845a6.1 6.1 0 0 0-3.53 4.845zm-2.32 1.406a6.1 6.1 0 0 0 3.53 4.846c-.672-1.224-1.12-2.93-1.21-4.846zM15.5 8a7.5 7.5 0 1 0-15 0 7.5 7.5 0 0 0 15 0"
      />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.182 1.273a.75.75 0 0 1 .546.91L6.96 5.25h3.453l.858-3.432a.75.75 0 0 1 1.456.364L11.96 5.25H14a.75.75 0 0 1 0 1.5h-2.414l-.875 3.5H13a.75.75 0 0 1 0 1.5h-2.664l-.608 2.432a.75.75 0 0 1-1.456-.364l.517-2.068H5.336l-.608 2.432a.75.75 0 0 1-1.456-.364l.517-2.068H2a.75.75 0 0 1 0-1.5h2.164l.875-3.5H3a.75.75 0 0 1 0-1.5h2.414l.858-3.432a.75.75 0 0 1 .91-.545m1.982 8.977.875-3.5H6.586l-.875 3.5z"
      />
    </svg>
  );
}
