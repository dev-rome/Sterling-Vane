import { z } from "zod";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { getTimeSlots, parseDate } from "@/lib/schedule";

const MAX_DAYS_AHEAD = 60;

function isWithinBookingWindow(value: string) {
  const date = parseDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latest = new Date(today);
  latest.setDate(latest.getDate() + MAX_DAYS_AHEAD);
  return date >= today && date <= latest;
}

export const bookingSchema = z
  .object({
    service: z
      .string()
      .refine((value) => services.some((s) => s.slug === value), {
        error: "Choose a service.",
      }),
    barber: z
      .string()
      .refine(
        (value) => value === "any" || barbers.some((b) => b.slug === value),
        {
          error: "Choose a barber.",
        },
      ),
    date: z
      .string()
      .refine(isWithinBookingWindow, {
        error: `Choose a date within the next ${MAX_DAYS_AHEAD} days.`,
        abort: true,
      })
      .refine((value) => getTimeSlots(value).length > 0, {
        error: "We’re closed on Mondays. Please choose another day.",
      }),
    time: z.string().min(1, { error: "Choose a time." }),
    name: z
      .string()
      .trim()
      .min(2, { error: "Please enter your name." })
      .max(80, { error: "Please keep your name under 80 characters." }),
    email: z.email({ error: "Enter a valid email address." }),
    phone: z
      .string()
      .trim()
      .max(20, { error: "That phone number looks too long." })
      .regex(/^[\d\s()+-]*$/, {
        error: "Use digits, spaces and + ( ) - only.",
      }),
    notes: z
      .string()
      .trim()
      .max(500, { error: "Please keep notes under 500 characters." }),
  })
  .refine((data) => getTimeSlots(data.date).includes(data.time), {
    error: "That time isn’t available. Please choose another.",
    path: ["time"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;
