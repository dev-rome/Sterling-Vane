"use client";

import { useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { submitBooking } from "@/app/book/actions";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { formatPrice } from "@/lib/format";
import { getTimeSlots, parseDate } from "@/lib/schedule";

const DAYS_SHOWN = 14;

const optionCard =
  "flex cursor-pointer items-center justify-between gap-4 border border-line bg-card p-5 transition-colors hover:border-amber has-[:checked]:border-amber";

const chipFocus =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber";

const timeChip = `flex cursor-pointer items-center justify-center border border-line bg-card px-3 py-3 text-[0.9375rem] transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso ${chipFocus}`;

const dayChip = `flex cursor-pointer flex-col items-center gap-0.5 border border-line bg-card px-2 py-3 transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso has-[:disabled]:cursor-not-allowed has-[:disabled]:text-muted has-[:disabled]:line-through has-[:disabled]:hover:border-line ${chipFocus}`;

const textInput =
  "w-full border border-line bg-card px-4 py-3 text-[0.9375rem] placeholder:text-muted aria-invalid:border-error";

const formatDay = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const formatWeekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const formatMonth = new Intl.DateTimeFormat("en-US", { month: "short" });

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

  const [confirmed, setConfirmed] = useState<{
    booking: BookingInput;
    demo: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState("");

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
          month: formatMonth.format(date),
          isOpen: getTimeSlots(value).length > 0,
        };
      })
    : [];

  const [serviceSlug, barberSlug, selectedDate, selectedTime] = useWatch({
    control,
    name: ["service", "barber", "date", "time"],
  });
  const timeSlots = getTimeSlots(selectedDate);

  const chosenService = services.find((s) => s.slug === serviceSlug);
  const chosenBarber = barbers.find((b) => b.slug === barberSlug);
  const chosenDate = parseDate(selectedDate);

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

  function startOver() {
    reset();
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
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
    >
      <div className="flex flex-col gap-14">
        <fieldset
          aria-describedby={errors.service ? "service-error" : undefined}
        >
          <legend className="font-display text-[1.75rem]">
            1. Choose a service
          </legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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

        <fieldset>
          <legend className="font-display text-[1.75rem]">
            2. Choose a barber
          </legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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

        <fieldset>
          <legend className="font-display text-[1.75rem]">
            3. Choose a date and time
          </legend>

          <div
            role="radiogroup"
            aria-labelledby="date-label"
            aria-describedby={errors.date ? "date-error" : undefined}
            className="mt-5"
          >
            <p id="date-label" className="text-sm text-stone">
              Date
            </p>
            {upcomingDays.length > 0 ? (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {upcomingDays.map((day) => (
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
                    <span className="font-display text-2xl leading-none">
                      {day.dayNumber}
                    </span>
                    <span className="text-xs">{day.month}</span>
                    {!day.isOpen && <span className="sr-only">, closed</span>}
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[0.9375rem] text-stone">
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

          <div
            role="radiogroup"
            aria-labelledby="time-label"
            aria-describedby={errors.time ? "time-error" : undefined}
            className="mt-8"
          >
            <p id="time-label" className="text-sm text-stone">
              Time
            </p>
            {timeSlots.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
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
            ) : (
              <p className="mt-3 text-[0.9375rem] text-stone">
                Choose a date to see available times.
              </p>
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

        <fieldset>
          <legend className="font-display text-[1.75rem]">
            4. Your details
          </legend>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
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
                <p id="name-error" role="alert" className="text-sm text-error">
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
                <p id="email-error" role="alert" className="text-sm text-error">
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
                <p id="phone-error" role="alert" className="text-sm text-error">
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
                <p id="notes-error" role="alert" className="text-sm text-error">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>
        </fieldset>
      </div>

      <aside
        aria-labelledby="summary-heading"
        className="border border-line bg-card p-8 lg:sticky lg:top-8 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <h2
          id="summary-heading"
          className="text-xs font-medium tracking-[0.24em] text-stone uppercase"
        >
          Your appointment
        </h2>

        <div className="mt-5 flex items-baseline justify-between gap-4">
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

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-y border-line py-5 text-[0.9375rem]">
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

        <p className="mt-5 text-sm text-stone">
          Pay in the shop. Free cancellation up to 24 hours before.
        </p>
      </aside>

      <div className="flex flex-col gap-4 lg:col-start-1">
        {serverError && (
          <p
            role="alert"
            className="border border-error/40 bg-error/10 px-4 py-3 text-[0.9375rem] text-error"
          >
            {serverError}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start bg-amber px-9 py-5 text-[0.8125rem] font-medium tracking-[0.18em] text-espresso uppercase transition-colors hover:bg-amber-light disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Request appointment"}
        </button>
      </div>
    </form>
  );
}
