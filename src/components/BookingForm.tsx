"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { submitBooking } from "@/app/book/actions";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { formatPrice } from "@/lib/format";
import { getTimeSlots, parseDate } from "@/lib/schedule";

const DAYS_SHOWN = 14;

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

const optionCard =
  "flex cursor-pointer items-center justify-between gap-4 border border-line bg-card p-5 transition-colors hover:border-amber has-[:checked]:border-amber";

const chipFocus =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber";

const timeChip = `flex min-h-13 cursor-pointer items-center justify-center border border-line bg-card px-3 text-[0.9375rem] transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso ${chipFocus}`;

const dayChip = `flex min-h-18 cursor-pointer flex-col items-center justify-center gap-1 border border-line bg-card px-2 transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso has-[:disabled]:cursor-not-allowed has-[:disabled]:text-muted has-[:disabled]:line-through has-[:disabled]:hover:border-line ${chipFocus}`;

const textInput =
  "w-full border border-line bg-card px-4 py-3 text-[0.9375rem] placeholder:text-muted aria-invalid:border-error";

const stepHeading = "font-display text-[2rem] leading-tight";

const formatDay = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const formatLongDay = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const formatWeekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });

// "2026-12-04" from a Date, in local time.
function toInputDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// The browser's clock is an "external store" with no events to subscribe to.
const subscribeToNothing = () => () => {};

function addDays(value: string, days: number) {
  const [year, month, day] = value.split("-").map(Number);
  return toInputDate(new Date(year, month - 1, day + days));
}

// "14:00" → "2 PM"
function formatSlot(slot: string) {
  const hour = Number(slot.split(":")[0]);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12} ${suffix}`;
}

export function BookingForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
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

  const [step, setStep] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [confirmed, setConfirmed] = useState<{
    booking: BookingInput;
    demo: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState("");
  const hasNavigated = useRef(false);

  const today = useSyncExternalStore(
    subscribeToNothing,
    () => toInputDate(new Date()), // in the browser: the visitor's date
    () => "", // on the server: no date yet
  );

  const upcomingDays = today
    ? Array.from({ length: DAYS_SHOWN }, (_, i) => {
        const value = addDays(today, i);
        const date = parseDate(value)!;
        return {
          value,
          weekday: formatWeekday.format(date),
          dayNumber: date.getDate(),
          isOpen: getTimeSlots(value).length > 0,
        };
      })
    : [];
  const weekDays = upcomingDays.slice(weekOffset * 7, weekOffset * 7 + 7);

  const [serviceSlug, barberSlug, selectedDate, selectedTime] = useWatch({
    control,
    name: ["service", "barber", "date", "time"],
  });
  const timeSlots = getTimeSlots(selectedDate);

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
    setWeekOffset(0);
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
        {step === 0 && (
          <fieldset
            key="service"
            ref={focusStep}
            tabIndex={-1}
            aria-describedby={errors.service ? "service-error" : undefined}
            className="outline-none"
          >
            <legend className={stepHeading}>Choose a service</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service.slug} className={optionCard}>
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={service.slug}
                      {...register("service")}
                      className="size-4 accent-amber"
                    />
                    <span>
                      <span className="block">{service.name}</span>
                      <span className="text-sm text-stone">
                        {service.duration} min
                      </span>
                    </span>
                  </span>
                  <span className="font-display text-xl text-amber">
                    {formatPrice.format(service.price)}
                  </span>
                </label>
              ))}
            </div>
            {errors.service && (
              <p
                id="service-error"
                role="alert"
                className="mt-3 text-sm text-error"
              >
                {errors.service.message}
              </p>
            )}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset
            key="barber"
            ref={focusStep}
            tabIndex={-1}
            className="outline-none"
          >
            <legend className={stepHeading}>Choose your barber</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className={optionCard}>
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    value="any"
                    {...register("barber")}
                    className="size-4 accent-amber"
                  />
                  <span>
                    <span className="block">No preference</span>
                    <span className="text-sm text-stone">
                      First available barber
                    </span>
                  </span>
                </span>
              </label>
              {barbers.map((barber) => (
                <label key={barber.slug} className={optionCard}>
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={barber.slug}
                      {...register("barber")}
                      className="size-4 accent-amber"
                    />
                    <span>
                      <span className="block">{barber.name}</span>
                      <span className="text-sm text-stone">
                        {barber.specialty}
                      </span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset
            key="datetime"
            ref={focusStep}
            tabIndex={-1}
            className="outline-none"
          >
            <legend className={stepHeading}>Choose a day</legend>

            <div
              role="radiogroup"
              aria-label="Day"
              aria-describedby={errors.date ? "date-error" : undefined}
              className="mt-6"
            >
              {weekDays.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {weekDays.map((day) => (
                    <label key={day.value} className={dayChip}>
                      <input
                        type="radio"
                        value={day.value}
                        disabled={!day.isOpen}
                        {...register("date", {
                          onChange: () => setValue("time", ""),
                        })}
                        className="sr-only"
                      />
                      <span className="text-xs tracking-[0.12em] uppercase">
                        {day.weekday}
                      </span>
                      <span className="font-display text-[1.625rem] leading-none">
                        {day.dayNumber}
                      </span>
                      {!day.isOpen && <span className="sr-only">, closed</span>}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-[0.9375rem] text-stone">
                  Loading available dates…
                </p>
              )}
              {errors.date && (
                <p
                  id="date-error"
                  role="alert"
                  className="mt-3 text-sm text-error"
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                disabled={weekOffset === 0}
                className="text-stone transition-colors hover:text-amber disabled:invisible"
              >
                ← This week
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(1)}
                disabled={weekOffset === 1}
                className="text-stone transition-colors hover:text-amber disabled:invisible"
              >
                Next week →
              </button>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="time-heading"
              aria-describedby={errors.time ? "time-error" : undefined}
              className="mt-10"
            >
              <h3 id="time-heading" className={stepHeading}>
                Available times
              </h3>
              <p className="mt-2 text-sm text-stone">
                {chosenDate
                  ? `${formatLongDay.format(chosenDate)} · ${
                      chosenBarber
                        ? `with ${chosenBarber.name}`
                        : "first available barber"
                    }`
                  : "Choose a day to see available times."}
              </p>
              {timeSlots.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <label key={slot} className={timeChip}>
                      <input
                        type="radio"
                        value={slot}
                        {...register("time")}
                        className="sr-only"
                      />
                      {formatSlot(slot)}
                    </label>
                  ))}
                </div>
              )}
              {errors.time && (
                <p
                  id="time-error"
                  role="alert"
                  className="mt-3 text-sm text-error"
                >
                  {errors.time.message}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset
            key="details"
            ref={focusStep}
            tabIndex={-1}
            className="outline-none"
          >
            <legend className={stepHeading}>Your details</legend>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm text-stone">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                  className={textInput}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-sm text-error"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-stone">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : "email-hint"}
                  {...register("email")}
                  className={textInput}
                />
                {errors.email ? (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-sm text-error"
                  >
                    {errors.email.message}
                  </p>
                ) : (
                  <p id="email-hint" className="text-sm text-stone">
                    We&rsquo;ll send your confirmation here.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm text-stone">
                  Phone <span className="text-muted">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone")}
                  className={textInput}
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    role="alert"
                    className="text-sm text-error"
                  >
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="notes" className="text-sm text-stone">
                  Notes for your barber{" "}
                  <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Anything we should know: the look you’re after, allergies, running late…"
                  aria-invalid={errors.notes ? true : undefined}
                  aria-describedby={errors.notes ? "notes-error" : undefined}
                  {...register("notes")}
                  className={`${textInput} resize-y`}
                />
                {errors.notes && (
                  <p
                    id="notes-error"
                    role="alert"
                    className="text-sm text-error"
                  >
                    {errors.notes.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        )}
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
  );
}
