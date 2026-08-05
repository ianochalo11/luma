"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { LINKS } from "@/constants/links";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { OrderSummaryCard } from "@/components/registration/OrderSummaryCard";

/**
 * Full-page register + pay: form left on page ground, sticky summary card right.
 */
export function RegistrationCheckout() {
  const router = useRouter();

  return (
    <div className="relative min-h-full flex-1 bg-[#f6f5f8]">
      <Link
        href={LINKS.appRoutes.landing}
        className="text-foreground absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 transition-colors hover:bg-black/15 sm:top-6 sm:right-8"
        aria-label="Close and return to event"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </Link>

      <div className="mx-auto grid w-full max-w-[920px] grid-cols-1 items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <div className="order-2 min-w-0 lg:order-1">
          <RegistrationForm onPaid={() => router.push(LINKS.appRoutes.landing)} />
        </div>
        <div className="order-1 w-full lg:sticky lg:top-8 lg:order-2 lg:self-start">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
}
