import type { BookingInput } from "@/lib/booking-schema";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { parseDate } from "@/lib/schedule";
import { formatDay, formatSlot } from "@/lib/dates";

type BookingConfirmationProps = {
  booking: BookingInput;
  demo: boolean;
  onStartOver: () => void;
};

export function BookingConfirmation({
  booking,
  demo,
  onStartOver,
}: BookingConfirmationProps) {
  const service = services.find((s) => s.slug === booking.service);
  const barber = barbers.find((b) => b.slug === booking.barber);
  const date = parseDate(booking.date);
  const firstName = booking.name.split(" ")[0];

  return (
    <section
      aria-labelledby="confirmation-heading"
      className="mt-14 max-w-[40rem] border border-amber bg-card p-8 md:p-12"
    >
      <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
        Request received
      </p>
      <h2
        id="confirmation-heading"
        tabIndex={-1}
        ref={(el) => el?.focus()}
        className="mt-4 font-display text-[clamp(2rem,1.5rem+2vw,2.75rem)] leading-tight outline-none"
      >
        Thank you, {firstName}.
      </h2>
      <p className="mt-4 text-stone">
        We&rsquo;ve received your request and will email{" "}
        <span className="text-ivory">{booking.email}</span> to confirm your
        appointment.
      </p>

      <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y border-line py-5 text-[0.9375rem]">
        <dt className="text-stone">Service</dt>
        <dd className="text-right">{service?.name}</dd>
        <dt className="text-stone">Barber</dt>
        <dd className="text-right">{barber?.name ?? "No preference"}</dd>
        <dt className="text-stone">Date</dt>
        <dd className="text-right">{date && formatDay.format(date)}</dd>
        <dt className="text-stone">Time</dt>
        <dd className="text-right">{formatSlot(booking.time)}</dd>
      </dl>

      {demo && (
        <p className="mt-5 text-sm text-muted">Demo mode: no email was sent.</p>
      )}

      <button
        type="button"
        onClick={onStartOver}
        className="mt-8 border-b border-amber pb-1.5 text-[0.8125rem] tracking-[0.18em] uppercase transition-colors hover:text-amber"
      >
        Make another booking
      </button>
    </section>
  );
}
