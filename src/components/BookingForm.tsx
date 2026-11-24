"use client";

import { useRef, useState, type FormEvent } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { submitBooking } from "@/app/book/actions";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { formatPrice } from "@/lib/format";
import { parseDate } from "@/lib/schedule";
import { formatDay, formatSlot } from "@/lib/dates";
import { ServiceStep } from "@/components/booking/steps/ServiceStep";
import { BarberStep } from "@/components/booking/steps/BarberStep";
import { DateTimeStep } from "@/components/booking/steps/DateTimeStep";
import { DetailsStep } from "@/components/booking/steps/DetailsStep";

const steps: {
  title: string;
  fields: (keyof BookingInput)[];
  next?: string;
}[] = [
  { title: "Service", fields: ["service"], next: "Continue to barber" },
  { title: "Barber", fields: ["barber"], next: "Continue to date & time" },
  {
    title: "Date & time",
    fields: ["date", "time"],
    next: "Continue to your details",
  },
  { title: "Your details", fields: ["name", "email", "phone", "notes"] },
];

export function BookingForm() {
  const methods = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      barber: "any",
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });
  const {
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState<{
    booking: BookingInput;
    demo: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState("");
  const hasNavigated = useRef(false);

  const [serviceSlug, barberSlug, selectedDate, selectedTime] = useWatch({
    control,
    name: ["service", "barber", "date", "time"],
  });
  const chosenService = services.find((s) => s.slug === serviceSlug);
  const chosenBarber = barbers.find((b) => b.slug === barberSlug);
  const chosenDate = parseDate(selectedDate);
  const isLastStep = step === steps.length - 1;

  // Moves focus to the new step's heading, but not on the first page load.
  function focusStep(element: HTMLElement | null) {
    if (element && hasNavigated.current) element.focus();
  }

  function goToStep(index: number) {
    hasNavigated.current = true;
    setStep(index);
  }

  async function goNext() {
    const valid = await trigger(steps[step].fields);
    if (valid) goToStep(step + 1);
  }

  async function onSubmit(data: BookingInput) {
    setServerError("");
    try {
      const result = await submitBooking(data);
      if (result.ok) {
        setConfirmed({ booking: data, demo: result.mode === "demo" });
        window.scrollTo({ top: 0 });
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError(
        "We couldn’t reach the shop. Check your connection and try again.",
      );
    }
  }

  // Enter in a field moves to the next step instead of submitting early.
  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isLastStep) {
      event.preventDefault();
      void goNext();
      return;
    }
    void handleSubmit(onSubmit)(event);
  }

  function startOver() {
    reset();
    setStep(0);
    setConfirmed(null);
  }

  if (confirmed) {
    const service = services.find((s) => s.slug === confirmed.booking.service);
    const barber = barbers.find((b) => b.slug === confirmed.booking.barber);
    const date = parseDate(confirmed.booking.date);

    return (
      <section
        aria-labelledby="confirmation-heading"
        className="mt-14 max-w-160 border border-amber bg-card p-8 md:p-12"
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
          Thank you, {confirmed.booking.name.split(" ")[0]}.
        </h2>
        <p className="mt-4 text-stone">
          We&rsquo;ve received your request and will email{" "}
          <span className="text-ivory">{confirmed.booking.email}</span> to
          confirm your appointment.
        </p>

        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y border-line py-5 text-[0.9375rem]">
          <dt className="text-stone">Service</dt>
          <dd className="text-right">{service?.name}</dd>
          <dt className="text-stone">Barber</dt>
          <dd className="text-right">{barber?.name ?? "No preference"}</dd>
          <dt className="text-stone">Date</dt>
          <dd className="text-right">{date && formatDay.format(date)}</dd>
          <dt className="text-stone">Time</dt>
          <dd className="text-right">{formatSlot(confirmed.booking.time)}</dd>
        </dl>

        {confirmed.demo && (
          <p className="mt-5 text-sm text-muted">
            Demo mode: no email was sent.
          </p>
        )}

        <button
          type="button"
          onClick={startOver}
          className="mt-8 border-b border-amber pb-1.5 text-[0.8125rem] tracking-[0.18em] uppercase transition-colors hover:text-amber"
        >
          Make another booking
        </button>
      </section>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_21.25rem] lg:items-start"
      >
        {/* Progress steps */}
        <ol
          aria-label="Booking progress"
          className="grid grid-cols-2 gap-x-2 gap-y-4 text-sm sm:grid-cols-4 lg:col-span-2"
        >
          {steps.map((s, i) => {
            const isDone = i < step;
            const isCurrent = i === step;
            return (
              <li
                key={s.title}
                aria-current={isCurrent ? "step" : undefined}
                className={`border-t-2 pt-3 ${
                  isDone || isCurrent ? "border-amber" : "border-line"
                } ${isCurrent ? "font-medium text-amber" : isDone ? "text-ivory" : "text-stone"}`}
              >
                {isDone ? (
                  <button
                    type="button"
                    onClick={() => goToStep(i)}
                    className="text-left transition-colors hover:text-amber"
                  >
                    0{i + 1} {s.title} <span aria-hidden="true">✓</span>
                    <span className="sr-only"> (completed, go back)</span>
                  </button>
                ) : (
                  <>
                    0{i + 1} {s.title}
                  </>
                )}
              </li>
            );
          })}
        </ol>

        {/* Current step */}
        <div className="lg:col-start-1 lg:row-start-2">
          {step === 0 && <ServiceStep key="service" focusRef={focusStep} />}
          {step === 1 && <BarberStep key="barber" focusRef={focusStep} />}
          {step === 2 && <DateTimeStep key="datetime" focusRef={focusStep} />}
          {step === 3 && <DetailsStep key="details" focusRef={focusStep} />}
        </div>

        {/* Summary */}
        <aside
          aria-labelledby="summary-heading"
          className="flex flex-col gap-5 border border-line bg-card p-8 lg:sticky lg:top-8 lg:col-start-2 lg:row-span-2 lg:row-start-2"
        >
          <h2
            id="summary-heading"
            className="text-xs font-medium tracking-[0.24em] text-stone uppercase"
          >
            Your appointment
          </h2>

          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-[1.75rem] leading-tight">
              {chosenService?.name ?? (
                <span className="text-muted">Choose a service</span>
              )}
            </p>
            {chosenService && (
              <p className="font-display text-[1.75rem] text-amber">
                {formatPrice.format(chosenService.price)}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y border-line py-5 text-[0.9375rem]">
            <dt className="text-stone">Barber</dt>
            <dd className="text-right">
              {chosenBarber?.name ?? "No preference"}
            </dd>
            <dt className="text-stone">Date</dt>
            <dd className="text-right">
              {chosenDate ? (
                formatDay.format(chosenDate)
              ) : (
                <span className="text-muted">Not chosen</span>
              )}
            </dd>
            <dt className="text-stone">Time</dt>
            <dd className="text-right">
              {selectedTime ? (
                formatSlot(selectedTime)
              ) : (
                <span className="text-muted">Not chosen</span>
              )}
            </dd>
            <dt className="text-stone">Length</dt>
            <dd className="text-right">
              {chosenService ? (
                `${chosenService.duration} min`
              ) : (
                <span className="text-muted">—</span>
              )}
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
                className="text-amber underline-offset-4 hover:underline"
              >
                Ask the concierge
              </Link>
            </p>
          </div>
        </aside>

        {/* Navigation */}
        <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-3">
          {serverError && (
            <p
              role="alert"
              className="border border-error/40 bg-error/10 px-4 py-3 text-[0.9375rem] text-error"
            >
              {serverError}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6 border-t border-line pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber px-9 py-5 text-[0.8125rem] font-medium tracking-[0.18em] text-espresso uppercase transition-colors hover:bg-amber-light disabled:cursor-wait disabled:opacity-60"
            >
              {isLastStep
                ? isSubmitting
                  ? "Sending…"
                  : "Request appointment"
                : steps[step].next}
            </button>
            {step > 0 && (
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                className="text-sm text-stone transition-colors hover:text-amber"
              >
                ← Back to {steps[step - 1].title.toLowerCase()}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
