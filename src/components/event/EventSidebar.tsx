"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { EventActions } from "@/components/event/EventActions";
import { FollowButton } from "@/components/event/FollowButton";
import { LINKS } from "@/constants/links";
import { BREAKPOINT_ORGANIZER_ID } from "@/constants/ids";
import type { Event } from "@/types/event";
import { cn } from "@/lib/utils/cn";

interface EventSidebarProps {
  event: Event;
}

/** Left column: cover image + presented by + hosted by + crypto tag */
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
          sizes="(max-width: 1024px) 100vw, 380px"
        />
      </div>

      <div className="space-y-3">
        <p className="micro-label">{event.meta.presentedByLabel}</p>
        <div className="flex items-center justify-between gap-3">
          <Link
            href={event.presentedBy.href}
            className="text-foreground flex min-w-0 items-center gap-2.5 font-medium transition-opacity hover:opacity-80"
          >
            <Image
              src={event.presentedBy.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="rounded-lg object-cover"
            />
            <span className="truncate">{event.presentedBy.name}</span>
          </Link>
          <FollowButton
            eventId={event.slug}
            organizerId={BREAKPOINT_ORGANIZER_ID}
            label={event.ctas.follow}
            className="shrink-0"
          />
        </div>
        <div className="flex items-center gap-1">
          <SocialIcon href={LINKS.presentedBy.twitter} label="X">
            <FaXTwitter className="h-3.5 w-3.5" />
          </SocialIcon>
          <SocialIcon href={LINKS.presentedBy.youtube} label="YouTube">
            <FaYoutube className="h-4 w-4" />
          </SocialIcon>
          <SocialIcon href={LINKS.presentedBy.website} label="Website">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
          </SocialIcon>
        </div>
      </div>

      <div className="border-border space-y-3 border-t pt-6">
        <p className="micro-label">{event.meta.hostedByLabel}</p>
        <Link
          href={event.host.href}
          className="text-foreground flex items-center gap-2.5 font-medium transition-opacity hover:opacity-80"
        >
          <Image
            src={event.host.avatarUrl}
            alt=""
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span>{event.host.name}</span>
        </Link>
        <EventActions
          contactLabel={event.ctas.contactHost}
          reportLabel={event.ctas.reportEvent}
        />
      </div>

      {cryptoTag && (
        <Link
          href={cryptoTag.href}
          className="border-border bg-surface text-foreground-secondary hover:border-brand-30 hover:text-brand-60 inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors"
        >
          # {cryptoTag.label}
        </Link>
      )}
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
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "text-muted inline-flex h-8 w-8 items-center justify-center rounded-full",
        "hover:bg-surface-muted hover:text-foreground transition-colors",
      )}
    >
      {children}
    </a>
  );
}
