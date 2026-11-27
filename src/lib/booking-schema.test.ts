import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bookingSchema, type BookingInput } from "@/lib/booking-schema";

// Frozen "now": Tuesday 1 Dec 2026, 3 PM in Chicago (9 PM UTC).
const NOW = new Date("2026-12-01T21:00:00Z");

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

const validBooking: BookingInput = {
  service: "skin-fade",
  barber: "marcus",
  date: "2026-12-02", // Wednesday
  time: "10:00",
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "",
  notes: "",
};

// Returns { field: "error message" } for a booking with some fields changed.
function errorsFor(changes: Partial<BookingInput>) {
  const result = bookingSchema.safeParse({ ...validBooking, ...changes });
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
  );
}

describe("bookingSchema", () => {
  it("accepts a valid booking", () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("accepts 'any' barber, but not an unknown one", () => {
    expect(errorsFor({ barber: "any" })).toEqual({});
    expect(errorsFor({ barber: "nobody" })).toHaveProperty("barber");
  });

  it("rejects a service that doesn't exist", () => {
    expect(errorsFor({ service: "free-haircut" })).toEqual({
      service: "Choose a service.",
    });
  });

  describe("dates", () => {
    it("rejects Mondays", () => {
      expect(errorsFor({ date: "2026-12-07" }).date).toMatch(
        /closed on Mondays/,
      );
    });

    it("rejects past days and days more than 60 days ahead", () => {
      expect(errorsFor({ date: "2026-11-28" })).toHaveProperty("date");
      expect(errorsFor({ date: "2027-03-01" })).toHaveProperty("date");
    });
  });

  describe("times today (it's 3 PM in Chicago)", () => {
    it("rejects a time that has already passed", () => {
      expect(errorsFor({ date: "2026-12-01", time: "14:00" }).time).toMatch(
        /isn’t available/,
      );
    });

    it("accepts a later time today", () => {
      expect(errorsFor({ date: "2026-12-01", time: "16:00" })).toEqual({});
    });
  });

  describe("contact details", () => {
    it("rejects an invalid email", () => {
      expect(errorsFor({ email: "alex@" })).toHaveProperty("email");
    });

    it("rejects letters in the phone number", () => {
      expect(errorsFor({ phone: "call me" })).toHaveProperty("phone");
      expect(errorsFor({ phone: "+1 (312) 555-0142" })).toEqual({});
    });

    it("trims the name before checking its length", () => {
      expect(errorsFor({ name: "  A  " })).toHaveProperty("name");
    });
  });
});
