"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useSignInModal } from "@/components/auth/SignInModalProvider";
import { useAppSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils/cn";

interface FollowButtonProps {
  eventId: string;
  organizerId: string;
  label?: string;
  initialFollowing?: boolean;
  className?: string;
}

export function FollowButton({
  eventId,
  organizerId,
  label = "Follow",
  initialFollowing = false,
  className,
}: FollowButtonProps) {
  const { status, update, isAuthenticated, user } = useAppSession();
  const { openSignIn } = useSignInModal();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();
  const isAuthed = isAuthenticated && !!user?.id;
  const showFollowing = isAuthed && following;

  useEffect(() => {
    if (!isAuthed) return;

    let cancelled = false;
    void (async () => {
      try {
        const qs = new URLSearchParams({ eventId, organizerId });
        const res = await fetch(`/api/follows?${qs}`);
        if (!res.ok) return;
        const data = (await res.json()) as { following: boolean };
        if (!cancelled) setFollowing(data.following);
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthed, eventId, organizerId]);

  async function toggleFollow(next: boolean) {
    const res = await fetch("/api/follows", {
      method: next ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, organizerId }),
    });
    if (!res.ok) {
      throw new Error("Follow request failed");
    }
    const data = (await res.json()) as { following: boolean };
    return data.following;
  }

  function handleClick() {
    if (status === "loading") return;

    if (status !== "authenticated") {
      openSignIn({
        onSuccess: async () => {
          await update();
          setFollowing(true);
          try {
            const result = await toggleFollow(true);
            setFollowing(result);
          } catch {
            setFollowing(false);
          }
        },
      });
      return;
    }

    const next = !following;
    setFollowing(next); // optimistic
    startTransition(async () => {
      try {
        const result = await toggleFollow(next);
        setFollowing(result);
      } catch {
        setFollowing(!next); // rollback
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={showFollowing ? "secondary" : "light"}
      className={cn("min-w-[4.5rem]", className)}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={showFollowing}
    >
      {showFollowing ? "Following" : label}
    </Button>
  );
}
