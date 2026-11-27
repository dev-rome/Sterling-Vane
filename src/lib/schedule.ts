import type { ShopNow } from "@/lib/shop-time";

// Opening hours in 24-hour time, matching shop.hours. 0 = Sunday … 6 = Saturday.
export const openingHours: Record<
  number,
  { open: number; close: number } | null
> = {
  0: { open: 10, close: 16 },
  1: null,
  2: { open: 10, close: 20 },
  3: { open: 10, close: 20 },
  4: { open: 10, close: 20 },
  5: { open: 10, close: 20 },
  6: { open: 9, close: 18 },
};

// Turns "2026-12-04" into a local Date, or null if the format is wrong.
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 ? date : null;
}

// One-hour slots from opening until the last hour before closing.
export function getTimeSlots(value: string): string[] {
  const date = parseDate(value);
  if (!date) return [];
  const hours = openingHours[date.getDay()];
  if (!hours) return [];

  const slots: string[] = [];
  for (let hour = hours.open; hour < hours.close; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
}

/** Slots that can still be booked: none in the past, and today only from the next hour on. */
export function getBookableSlots(value: string, now: ShopNow): string[] {
  if (value < now.date) return [];
  const slots = getTimeSlots(value);
  if (value > now.date) return slots;
  return slots.filter((slot) => Number(slot.slice(0, 2)) > now.hour);
}
