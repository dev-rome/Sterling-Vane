"use client";

import { useFormContext } from "react-hook-form";
import type { BookingInput } from "@/lib/booking-schema";
import { errorText, stepHeading, textInput } from "../styles";
import type { StepProps } from "./types";

export function DetailsStep({ focusRef }: StepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingInput>();

  return (
    <fieldset ref={focusRef} tabIndex={-1} className="outline-none">
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
            <p id="name-error" role="alert" className={errorText}>
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
            <p id="email-error" role="alert" className={errorText}>
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
            <p id="phone-error" role="alert" className={errorText}>
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="notes" className="text-sm text-stone">
            Notes for your barber <span className="text-muted">(optional)</span>
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
            <p id="notes-error" role="alert" className={errorText}>
              {errors.notes.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
