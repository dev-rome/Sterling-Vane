"use client";

import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import type { BookingInput } from "@/lib/booking-schema";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { formatPrice } from "@/lib/format";
import { parseDate } from "@/lib/schedule";
import { formatDay, formatSlot } from "@/lib/dates";

function NotChosen({ children = "Not chosen" }: { children?: string }) {
  return <span className="text-stone">{children}</span>;
}

export function BookingSummary({ className = "" }: { className?: string }) {
  const { control } = useFormContext<BookingInput>();
  const [serviceSlug, barberSlug, date, time] = useWatch({
    control,
    name: ["service", "barber", "date", "time"],
  });

  const service = services.find((s) => s.slug === serviceSlug);
  const barber = barbers.find((b) => b.slug === barberSlug);
  const chosenDate = parseDate(date);

  return (
    <aside
      aria-labelledby="summary-heading"
      className={`flex flex-col gap-5 border border-line bg-card p-8 ${className}`}
    >
      <h2
        id="summary-heading"
        className="text-xs font-medium tracking-[0.24em] text-stone uppercase"
      >
        Your appointment
      </h2>

      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-[1.75rem] leading-tight">
          {service?.name ?? <NotChosen>Choose a service</NotChosen>}
        </p>
        {service && (
          <p className="font-display text-[1.75rem] text-amber">
            {formatPrice.format(service.price)}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y border-line py-5 text-[0.9375rem]">
        <dt className="text-stone">Barber</dt>
        <dd className="text-right">{barber?.name ?? "No preference"}</dd>
        <dt className="text-stone">Date</dt>
        <dd className="text-right">
          {chosenDate ? formatDay.format(chosenDate) : <NotChosen />}
        </dd>
        <dt className="text-stone">Time</dt>
        <dd className="text-right">
          {time ? formatSlot(time) : <NotChosen />}
        </dd>
        <dt className="text-stone">Length</dt>
        <dd className="text-right">
          {service ? `${service.duration} min` : <NotChosen>—</NotChosen>}
        </dd>
      </dl>

      <p className="text-sm text-stone">
        Pay in the shop. Free cancellation up to 24 hours before.
      </p>

      <div className="flex items-start gap-3 border border-line bg-espresso p-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mt-0.5 size-5 shrink-0 text-amber"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z" />
        </svg>
        <p className="text-sm">
          Not sure which service?{" "}
          <Link
            href="/#concierge"
            className="text-amber underline underline-offset-4 transition-colors hover:text-amber-light"
          >
            Ask the concierge
          </Link>
        </p>
      </div>
    </aside>
  );
}
