import { cn } from "@/lib/utils/cn";

/**
 * Registration form chroma on pure white page:
 * near-black labels, grey helpers — not brand-purple tokens.
 */
const ink = "text-[#171717]";
const inkMuted = "text-[#6B7280]";
const inkFaint = "text-[#9CA3AF]";

/**
 * Shared control chrome sampled from luma.com lux-input on Breakpoint register:
 * height 38px, padding 10×14, radius 8px, 16px type.
 */
export function fieldControlClass(invalid?: boolean, className?: string): string {
  return cn(
    "box-border h-[38px] w-full rounded-[8px] border border-transparent",
    "bg-[#F3F4F6] px-3.5 py-2.5",
    `${ink} text-md font-normal leading-4 outline-none transition-colors`,
    "placeholder:text-[#9CA3AF]",
    "focus-visible:border-[#171717] focus-visible:bg-white",
    "disabled:cursor-not-allowed disabled:opacity-60",
    invalid && "border-red-400 focus-visible:border-red-400",
    className,
  );
}

/** Native <select> — same box as lux-input + room for chevron. */
export function fieldSelectClass(invalid?: boolean, className?: string): string {
  return fieldControlClass(
    invalid,
    cn("cursor-pointer appearance-none pr-9 [&>option]:text-[#171717]", className),
  );
}

/** Near-black primary label. */
export const fieldLabelClass = `${ink} mb-1.5 block text-sm leading-[21px] font-medium`;

/** Grey secondary clause after the label (“- this will only be used…”). */
export const fieldHelperClass = `font-normal ${inkMuted}`;

export const agreementLabelClass = `${ink} flex cursor-pointer items-start gap-2.5 text-md leading-5`;

export const agreementCheckboxClass =
  "mt-0.5 h-5 w-5 shrink-0 rounded-[4px] border-[#D1D5DB] accent-[#171717]";

export const registrationHeadingClass = `font-title ${ink} text-[22px] font-semibold tracking-tight`;

export const registrationMutedClass = inkMuted;
export const registrationFaintClass = inkFaint;

/** Purple accent for “Add a coupon” (Luma brand-50). */
export const registrationAccentClass = "text-[#836AA2]";
