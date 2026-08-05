"use client";

import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { ExternalLink } from "lucide-react";
import { EventActions } from "@/components/event/EventActions";
import { FollowButton } from "@/components/event/FollowButton";
import type { Event } from "@/types/event";
import { BREAKPOINT_ORGANIZER_ID } from "@/constants/ids";
import { LINKS } from "@/constants/links";
import { cn } from "@/lib/utils/cn";

interface HostCardProps {
  event: Event;
}

export function HostCard({ event }: HostCardProps) {
  return (
    <div className="border-border-subtle flex flex-col gap-5 border-b pb-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div>
            <p className="micro-label mb-1.5">{event.meta.presentedByLabel}</p>
            <Link
              href={event.presentedBy.href}
              className="text-foreground flex items-center gap-2.5 font-medium transition-opacity hover:opacity-80"
            >
              <Image
                src={event.presentedBy.avatarUrl}
                alt=""
                width={36}
                height={36}
                className="rounded-lg object-cover"
              />
              <span>{event.presentedBy.name}</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FollowButton
            eventId={event.slug}
            organizerId={BREAKPOINT_ORGANIZER_ID}
            label={event.ctas.follow}
          />
          <div className="flex items-center gap-1">
            <SocialIcon href={LINKS.presentedBy.twitter} label="Solana Breakpoint on X">
              <FaXTwitter className="h-3.5 w-3.5" />
            </SocialIcon>
            <SocialIcon
              href={LINKS.presentedBy.youtube}
              label="Solana Foundation on YouTube"
            >
              <FaYoutube className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={LINKS.presentedBy.website} label="solana.com/breakpoint">
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            </SocialIcon>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="micro-label mb-1.5">{event.meta.hostedByLabel}</p>
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
        </div>

        <EventActions
          contactLabel={event.ctas.contactHost}
          reportLabel={event.ctas.reportEvent}
        />
      </div>
    </div>
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
        "hover:bg-brand-10 hover:text-foreground transition-colors",
      )}
    >
      {children}
    </a>
  );
}
