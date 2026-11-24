"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { submitBooking } from "@/app/book/actions";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
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

const emptyBooking: BookingInput = {
  service: "",
  barber: "any",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

// Reads ?service= and ?barber= from links like /book?service=skin-fade.
// Only known slugs are accepted; anything else is ignored.
function getInitialBooking(params: URLSearchParams): BookingInput {
  const service = params.get("service") ?? "";
  const barber = params.get("barber") ?? "";

  return {
    ...emptyBooking,
    service: services.some((s) => s.slug === service) ? service : "",
    barber: barbers.some((b) => b.slug === barber) ? barber : "any",
  };
}

// A new key (different link) builds a fresh wizard with the new choices.
export function BookingForm() {
  const searchParams = useSearchParams();

  return (
    <BookingWizard
      key={searchParams.toString()}
      initialBooking={getInitialBooking(searchParams)}
    />
  );
}

function BookingWizard({ initialBooking }: { initialBooking: BookingInput }) {
  const methods = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialBooking,
  });
  const {
    handleSubmit,
    trigger,
    reset,
    formState: { isSubmitting },
  } = methods;

  // A service from the link is already chosen, so start at the barber step.
  const [step, setStep] = useState(initialBooking.service ? 1 : 0);
  const [confirmed, setConfirmed] = useState<{
    booking: BookingInput;
    demo: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState("");
  const hasNavigated = useRef(false);
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
    reset(emptyBooking);
    setStep(0);
    setConfirmed(null);
  }

  if (confirmed) {
    return (
      <BookingConfirmation
        booking={confirmed.booking}
        demo={confirmed.demo}
        onStartOver={startOver}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleFormSubmit}
        noValidate
        className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_21.25rem] lg:items-start"
      >
        <BookingProgress
          titles={steps.map((s) => s.title)}
          current={step}
          onSelect={goToStep}
          className="lg:col-span-2"
        />

        <div className="lg:col-start-1 lg:row-start-2">
          {step === 0 && <ServiceStep key="service" focusRef={focusStep} />}
          {step === 1 && <BarberStep key="barber" focusRef={focusStep} />}
          {step === 2 && <DateTimeStep key="datetime" focusRef={focusStep} />}
          {step === 3 && <DetailsStep key="details" focusRef={focusStep} />}
        </div>

        <BookingSummary className="lg:sticky lg:top-8 lg:col-start-2 lg:row-span-2 lg:row-start-2" />

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
