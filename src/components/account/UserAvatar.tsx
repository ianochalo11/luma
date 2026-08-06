import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const sizeMap = {
  xs: { box: "h-8 w-8", face: "h-5 w-5", px: 32 },
  sm: { box: "h-10 w-10", face: "h-6 w-6", px: 40 },
  md: { box: "h-11 w-11", face: "h-7 w-7", px: 44 },
  lg: { box: "h-[4.5rem] w-[4.5rem]", face: "h-10 w-10", px: 72 },
} as const;

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}

/** Soft gradient + smiley fallback used across profile, settings, and checkout. */
export function UserAvatar({ name, image, size = "md", className }: UserAvatarProps) {
  const dim = sizeMap[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-gradient-to-br from-[#c4b5fd] via-[#bfdbfe] to-[#93c5fd]",
        dim.box,
        className,
      )}
      aria-hidden={image ? undefined : true}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={dim.px}
          height={dim.px}
          className="h-full w-full object-cover"
        />
      ) : (
        <SmileyFace className={dim.face} />
      )}
    </div>
  );
}

function SmileyFace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("text-[#1e3a5f]", className)}
      fill="none"
      aria-hidden
    >
      <circle cx="14" cy="16" r="2.25" fill="currentColor" />
      <circle cx="26" cy="16" r="2.25" fill="currentColor" />
      <path
        d="M13 24c2.2 2.6 5 3.9 7 3.9S24.8 26.6 27 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
