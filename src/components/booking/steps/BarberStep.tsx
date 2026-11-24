"use client";

import { useFormContext } from "react-hook-form";
import type { BookingInput } from "@/lib/booking-schema";
import { barbers } from "@/data/barbers";
import { optionCard, stepHeading } from "../styles";
import type { StepProps } from "./types";

export function BarberStep({ focusRef }: StepProps) {
  const { register } = useFormContext<BookingInput>();

  const options = [
    { slug: "any", name: "No preference", detail: "First available barber" },
    ...barbers.map((b) => ({
      slug: b.slug,
      name: b.name,
      detail: b.specialty,
    })),
  ];

  return (
    <fieldset ref={focusRef} tabIndex={-1} className="outline-none">
      <legend className={stepHeading}>Choose your barber</legend>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option.slug} className={optionCard}>
            <span className="flex items-center gap-3">
              <input
                type="radio"
                value={option.slug}
                {...register("barber")}
                className="size-4 accent-amber"
              />
              <span>
                <span className="block">{option.name}</span>
                <span className="text-sm text-stone">{option.detail}</span>
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
