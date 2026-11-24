// "2026-12-04" from a Date, in local time.
export function toInputDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// "2026-11-30" + 2 days → "2026-12-02"
export function addDays(value: string, days: number) {
  const [year, month, day] = value.split("-").map(Number);
  return toInputDate(new Date(year, month - 1, day + days));
}

// "14:00" → "2 PM"
export function formatSlot(slot: string) {
  const hour = Number(slot.split(":")[0]);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12} ${suffix}`;
}

// "Sat, Nov 28"
export const formatDay = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

// "Saturday, November 28"
export const formatLongDay = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// "Sat"
export const formatWeekday = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

// "November 2026"
export const formatMonthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
