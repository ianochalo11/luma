"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { LINKS } from "@/constants/links";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { OrderSummaryCard } from "@/components/registration/OrderSummaryCard";

/**
 * Register + pay surface: page scrolls on the right edge;
 * left form moves while the order summary stays sticky.
 */
export function RegistrationCheckout() {
  return (
    <div className="registration-page-scroll relative h-svh overflow-y-auto bg-white text-[#171717]">
      <Link
        href={LINKS.appRoutes.landing}
        className="absolute top-4 right-4 z-20 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#555555] text-white transition-opacity hover:opacity-90 sm:top-6 sm:right-8"
        aria-label="Close and return to event"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </Link>

      <div className="mx-auto flex min-h-full w-full max-w-[980px] flex-col gap-8 px-5 pt-14 pb-10 sm:px-8 sm:pt-16 sm:pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10 lg:pt-14 lg:pb-10">
        <div className="order-2 min-w-0 lg:order-1">
          <div className="max-w-[440px] pb-6">
            <RegistrationForm />
          </div>
        </div>
        <div className="order-1 w-full shrink-0 lg:sticky lg:top-14 lg:order-2 lg:w-[360px] lg:self-start">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
}
