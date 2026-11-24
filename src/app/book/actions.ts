"use server";

import { Resend } from "resend";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { parseDate } from "@/lib/schedule";

export type BookingResult =
  { ok: true; mode: "email" | "demo" } | { ok: false; error: string };

const formatLongDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

export async function submitBooking(
  input: BookingInput,
): Promise<BookingResult> {
  // 1. Never trust the browser: validate again on the server.
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Some details look wrong. Please check the form and try again.",
    };
  }
  const booking = parsed.data;

  // 2. Turn slugs back into readable details.
  const service = services.find((s) => s.slug === booking.service)!;
  const barber = barbers.find((b) => b.slug === booking.barber);
  const date = formatLongDate.format(parseDate(booking.date)!);

  const message = [
    "New booking request",
    "",
    `Service: ${service.name} (${service.duration} min, $${service.price})`,
    `Barber:  ${barber?.name ?? "No preference"}`,
    `Date:    ${date}`,
    `Time:    ${booking.time}`,
    "",
    `Name:    ${booking.name}`,
    `Email:   ${booking.email}`,
    `Phone:   ${booking.phone || "Not given"}`,
    "",
    `Notes:   ${booking.notes || "None"}`,
  ].join("\n");

  // 3. Demo mode: no key configured, so log instead of emailing.
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.BOOKING_INBOX;
  if (!apiKey || !inbox) {
    console.info(`[booking] Demo mode, no email sent:\n${message}`);
    return { ok: true, mode: "demo" };
  }

  // 4. Send the booking to the shop's inbox.
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Sterling & Vane <onboarding@resend.dev>",
    to: inbox,
    replyTo: booking.email,
    subject: `New booking: ${service.name}, ${date} at ${booking.time}`,
    text: message,
  });

  if (error) {
    console.error("[booking] Resend error:", error);
    return {
      ok: false,
      error:
        "We couldn’t send your request just now. Please try again or call us.",
    };
  }

  return { ok: true, mode: "email" };
}
