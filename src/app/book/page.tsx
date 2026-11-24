import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Reserve your chair at Sterling & Vane. Choose a service, a barber and a time that suits you.",
};

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-site px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
          Reserve your chair
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.75rem,2rem+3vw,4rem)] leading-none font-normal">
          Book an appointment
        </h1>
        <p className="mt-5 max-w-136 text-stone">
          Choose a service, a barber and a time. We&rsquo;ll confirm your
          appointment by email.
        </p>
        <BookingForm />
      </main>
      <SiteFooter />
    </>
  );
}
