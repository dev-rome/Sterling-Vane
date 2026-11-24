export const SHOP_TIME_ZONE = "America/Chicago";

const shopClock = new Intl.DateTimeFormat("en-CA", {
  timeZone: SHOP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

export type ShopNow = { date: string; hour: number };

/** The current date ("YYYY-MM-DD") and hour (0–23) at the shop, wherever this code runs. */
export function getShopNow(at: Date = new Date()): ShopNow {
  const parts = Object.fromEntries(
    shopClock.formatToParts(at).map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
  };
}
