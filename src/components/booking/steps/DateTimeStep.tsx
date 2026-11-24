"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { BookingInput } from "@/lib/booking-schema";
import { barbers } from "@/data/barbers";
import { getBookableSlots, parseDate } from "@/lib/schedule";
import {
  addDays,
  formatLongDay,
  formatMonthYear,
  formatSlot,
  formatWeekday,
} from "@/lib/dates";
import { useShopNow } from "@/hooks/useShopNow";
import { dayChip, errorText, stepHeading, timeChip } from "../styles";
import type { StepProps } from "./types";

const DAYS_PER_WEEK = 7;
const WEEKS_SHOWN = 2;

export function DateTimeStep({ focusRef }: StepProps) {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<BookingInput>();
  const now = useShopNow();
  const today = now?.date ?? "";
  const [weekOffset, setWeekOffset] = useState(() => {
    // Open on the week containing the already-chosen date, if there is one.
    const chosen = parseDate(getValues("date"));
    const start = parseDate(today);
    if (!chosen || !start) return 0;
    const daysAhead = Math.round(
      (chosen.getTime() - start.getTime()) / 86_400_000,
    );
    return Math.min(
      Math.max(Math.floor(daysAhead / DAYS_PER_WEEK), 0),
      WEEKS_SHOWN - 1,
    );
  });

  const [barberSlug, selectedDate] = useWatch({
    control,
    name: ["barber", "date"],
  });
  const chosenBarber = barbers.find((b) => b.slug === barberSlug);
  const chosenDate = parseDate(selectedDate);
  const timeSlots = now ? getBookableSlots(selectedDate, now) : [];

  const weekDays = today
    ? Array.from({ length: DAYS_PER_WEEK }, (_, i) => {
        const value = addDays(today, weekOffset * DAYS_PER_WEEK + i);
        const date = parseDate(value)!;
        return {
          value,
          date,
          weekday: formatWeekday.format(date),
          dayNumber: date.getDate(),
          isOpen: now ? getBookableSlots(value, now).length > 0 : false,
        };
      })
    : [];

  // "November 2026", or "November – December 2026" when a week spans two months.
  const monthLabel =
    weekDays.length > 0
      ? formatMonthYear.formatRange(weekDays[0].date, weekDays.at(-1)!.date)
      : "";

  return (
    <fieldset ref={focusRef} tabIndex={-1} className="outline-none">
      <legend className={stepHeading}>Choose a day</legend>

      <div
        role="radiogroup"
        aria-label="Day"
        aria-describedby={errors.date ? "date-error" : undefined}
        className="mt-6"
      >
        <p className="mb-3 text-sm text-stone" aria-live="polite">
          {monthLabel}
        </p>
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
          <p id="date-error" role="alert" className={`mt-3 ${errorText}`}>
            {errors.date.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <button
          type="button"
          onClick={() => setWeekOffset((w) => w - 1)}
          disabled={weekOffset === 0}
          className="text-stone transition-colors hover:text-amber disabled:invisible"
        >
          ← Previous week
        </button>
        <button
          type="button"
          onClick={() => setWeekOffset((w) => w + 1)}
          disabled={weekOffset === WEEKS_SHOWN - 1}
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
        <p className="mt-1 text-xs text-stone">
          Times shown in Chicago time (CT).
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
          <p id="time-error" role="alert" className={`mt-3 ${errorText}`}>
            {errors.time.message}
          </p>
        )}
      </div>
    </fieldset>
  );
}
