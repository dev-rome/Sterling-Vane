import { z } from "zod";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";
import { getBookableSlots, getTimeSlots, parseDate } from "@/lib/schedule";
import { addDays } from "@/lib/dates";
import { getShopNow } from "@/lib/shop-time";

const MAX_DAYS_AHEAD = 60;

function isWithinBookingWindow(value: string) {
  if (!parseDate(value)) return false;
  const today = getShopNow().date;
  return value >= today && value <= addDays(today, MAX_DAYS_AHEAD);
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
  .refine(
    (data) => getBookableSlots(data.date, getShopNow()).includes(data.time),
    {
      error: "That time isn’t available. Please choose another.",
      path: ["time"],
    },
  );

export type BookingInput = z.infer<typeof bookingSchema>;
