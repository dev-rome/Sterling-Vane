"use client";

import { useFormContext } from "react-hook-form";
import type { BookingInput } from "@/lib/booking-schema";
import { services } from "@/data/services";
import { formatPrice } from "@/lib/format";
import { errorText, optionCard, stepHeading } from "../styles";
import type { StepProps } from "./types";

export function ServiceStep({ focusRef }: StepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingInput>();

  return (
    <fieldset
      ref={focusRef}
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
        <p id="service-error" role="alert" className={`mt-3 ${errorText}`}>
          {errors.service.message}
        </p>
      )}
    </fieldset>
  );
}
