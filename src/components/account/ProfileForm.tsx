"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { LINKS } from "@/constants/links";
import { useAppSession } from "@/hooks/useSession";
import { UserAvatar } from "@/components/account/UserAvatar";

const JOINED_MONTH = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
}).format(new Date());

/** Public profile — matches Luma’s user page empty state. */
export function ProfileForm() {
  const { user } = useAppSession();

  if (!user) {
    return (
      <p className="text-muted">
        <Link href={LINKS.site.signIn} className="text-brand-60 hover:underline">
          Sign in
        </Link>{" "}
        to view your profile.
      </p>
    );
  }

  const firstName = user.firstName;
  const bio = "I good";
  const hosted = 0;
  const attended = 0;
  const publicEvents = 0;

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <header className="flex items-start gap-5 sm:gap-6">
        <UserAvatar name={user.name} image={user.image} size="lg" />

        <div className="min-w-0 pt-0.5">
          <h1 className="text-foreground text-[22px] font-semibold tracking-tight sm:text-2xl">
            {firstName}
          </h1>
          <p className="text-muted mt-1 text-[15px]">{bio}</p>
          <p className="text-muted mt-2.5 flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span>Joined {JOINED_MONTH}</span>
          </p>
          <p className="text-foreground mt-2.5 text-sm font-medium">
            {hosted} Hosted · {attended} Attended
          </p>
        </div>
      </header>

      <div className="border-border-subtle mt-10 border-t" />

      <div className="flex flex-col items-center px-4 pt-16 pb-8 text-center">
        <EmptyEventsGlyph count={publicEvents} />
        <h2 className="text-muted mt-5 text-base font-semibold tracking-tight">
          Nothing Here, Yet
        </h2>
        <p className="text-faint mt-1.5 max-w-xs text-sm">
          {firstName} has no public events at this time.
        </p>
      </div>
    </div>
  );
}

function EmptyEventsGlyph({ count }: { count: number }) {
  return (
    <div className="relative inline-flex" aria-hidden>
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        className="text-[#d4d0dc]"
      >
        <rect
          x="8"
          y="10"
          width="40"
          height="36"
          rx="8"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="15"
          y="18"
          width="18"
          height="4"
          rx="1.5"
          fill="currentColor"
          opacity="0.55"
        />
        <rect
          x="15"
          y="26"
          width="26"
          height="3.5"
          rx="1.5"
          fill="currentColor"
          opacity="0.35"
        />
        <rect
          x="15"
          y="33"
          width="20"
          height="3.5"
          rx="1.5"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
      <span className="border-border-subtle text-muted absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-md border bg-white px-1 text-[11px] font-semibold shadow-sm shadow-black/5">
        {count}
      </span>
    </div>
  );
}
