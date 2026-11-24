"use client";

import { useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { formatPrice } from "@/lib/format";
import { getTimeSlots } from "@/lib/schedule";

const optionCard =
  "flex cursor-pointer items-center justify-between gap-4 border border-line bg-card p-5 transition-colors hover:border-amber has-[:checked]:border-amber";

const timeChip =
  "flex cursor-pointer items-center justify-center border border-line bg-card px-3 py-3 text-[0.9375rem] transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber";

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

  const today = useSyncExternalStore(
    subscribeToNothing,
    () => toInputDate(new Date()), // in the browser: the visitor's date
    () => "", // on the server: no date yet
  );
  const latestDate = today ? addDays(today, 60) : "";

  const selectedDate = useWatch({ control, name: "date" });
  const timeSlots = getTimeSlots(selectedDate);

  async function onSubmit(data: BookingInput) {
    // Temporary: replaced by a server action in Part 6.
    console.log("Valid booking:", data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-14 flex max-w-3xl flex-col gap-14"
    >
      <fieldset aria-describedby={errors.service ? "service-error" : undefined}>
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
                  <span className="text-sm text-stone">{barber.specialty}</span>
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

        <div className="mt-5 flex flex-col gap-2">
          <label htmlFor="date" className="text-sm text-stone">
            Date
          </label>
          <input
            id="date"
            type="date"
            min={today || undefined}
            max={latestDate || undefined}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={errors.date ? "date-error" : undefined}
            {...register("date", { onChange: () => setValue("time", "") })}
            className="w-full max-w-[20rem] border border-line bg-card px-4 py-3 scheme-dark aria-invalid:border-error"
          />
          {errors.date && (
            <p id="date-error" role="alert" className="text-sm text-error">
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
            <p id="time-error" role="alert" className="mt-3 text-sm text-error">
              {errors.time.message}
            </p>
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start bg-amber px-9 py-5 text-[0.8125rem] font-medium tracking-[0.18em] text-espresso uppercase transition-colors hover:bg-amber-light disabled:opacity-60"
      >
        Request appointment
      </button>
    </form>
  );
}
