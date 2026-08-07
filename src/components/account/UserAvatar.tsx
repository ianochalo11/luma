import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const sizeMap = {
  xs: { box: "h-8 w-8", face: "h-[18px] w-[18px]", px: 32 },
  sm: { box: "h-10 w-10", face: "h-[22px] w-[22px]", px: 40 },
  md: { box: "h-11 w-11", face: "h-6 w-6", px: 44 },
  lg: { box: "h-[4.5rem] w-[4.5rem]", face: "h-10 w-10", px: 72 },
} as const;

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
}

/**
 * Default placeholder: soft blue circular smiley (Luma-style).
 * Used everywhere when the user has no profile photo.
 */
export function UserAvatar({ name, image, size = "md", className }: UserAvatarProps) {
  const dim = sizeMap[size];

  if (image) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
          dim.box,
          className,
        )}
      >
        <Image
          src={image}
          alt={name}
          width={dim.px}
          height={dim.px}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-[#8ec8ea]",
        dim.box,
        className,
      )}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #c5eaf8 0%, #8ec8ea 48%, #6bb3dc 100%)",
        boxShadow: "inset 0 -1px 2px rgba(30, 80, 120, 0.12)",
      }}
      aria-hidden
    >
      <SmileyFace className={dim.face} />
    </div>
  );
}

/** Minimal dark-gray eyes + smile on the blue bubble. */
function SmileyFace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("text-[#2c3540]", className)}
      fill="none"
      aria-hidden
    >
      <circle cx="14.5" cy="16.5" r="2.1" fill="currentColor" />
      <circle cx="25.5" cy="16.5" r="2.1" fill="currentColor" />
      <path
        d="M14 24.5c1.8 2.2 4.2 3.2 6 3.2s4.2-1 6-3.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
