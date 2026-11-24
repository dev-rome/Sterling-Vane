"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { formatPrice } from "@/lib/format";

const optionCard =
  "flex cursor-pointer items-center justify-between gap-4 border border-line bg-card p-5 transition-colors hover:border-amber has-[:checked]:border-amber";

export function BookingForm() {
  const {
    register,
    handleSubmit,
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
