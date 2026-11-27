import { describe, expect, it } from "vitest";
import { getBookableSlots, getTimeSlots, parseDate } from "@/lib/schedule";
import { getShopNow } from "@/lib/shop-time";

// Calendar used below: Sat 28 Nov, Sun 29 Nov, Mon 30 Nov, Tue 1 Dec 2026.

describe("parseDate", () => {
  it("reads a valid date", () => {
    expect(parseDate("2026-12-01")?.getDate()).toBe(1);
  });

  it("rejects impossible or badly formatted dates", () => {
    expect(parseDate("2026-02-30")).toBeNull();
    expect(parseDate("01/12/2026")).toBeNull();
    expect(parseDate("")).toBeNull();
  });
});

describe("getTimeSlots", () => {
  it("has no slots on Monday (closed)", () => {
    expect(getTimeSlots("2026-11-30")).toEqual([]);
  });

  it("runs 10 AM to the last hour before 8 PM on weekdays", () => {
    const slots = getTimeSlots("2026-12-01");
    expect(slots).toHaveLength(10);
    expect(slots[0]).toBe("10:00");
    expect(slots.at(-1)).toBe("19:00");
  });

  it("opens early on Saturday and closes early on Sunday", () => {
    expect(getTimeSlots("2026-11-28")[0]).toBe("09:00");
    expect(getTimeSlots("2026-11-29").at(-1)).toBe("15:00");
  });
});

describe("getBookableSlots", () => {
  const today = "2026-12-01"; // Tuesday

  it("returns nothing for a past day", () => {
    expect(getBookableSlots("2026-11-28", { date: today, hour: 9 })).toEqual(
      [],
    );
  });

  it("returns every slot for a future day", () => {
    expect(getBookableSlots("2026-12-02", { date: today, hour: 15 })).toEqual(
      getTimeSlots("2026-12-02"),
    );
  });

  it("only offers later hours today", () => {
    expect(getBookableSlots(today, { date: today, hour: 15 })).toEqual([
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ]);
  });

  it("offers nothing today after the last slot has started", () => {
    expect(getBookableSlots(today, { date: today, hour: 19 })).toEqual([]);
  });
});

describe("getShopNow", () => {
  it("uses Chicago time, not the server's time zone", () => {
    // 4:30 AM UTC on 25 Nov is still 10:30 PM on 24 Nov in Chicago.
    expect(getShopNow(new Date("2026-11-25T04:30:00Z"))).toEqual({
      date: "2026-11-24",
      hour: 22,
    });
  });
});
