import { useSyncExternalStore } from "react";
import { getShopNow, type ShopNow } from "@/lib/shop-time";

// Re-check the clock every minute, so slots disappear as the hour passes.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

// A string snapshot ("2026-11-24|16") stays equal until the hour changes.
function getSnapshot() {
  const now = getShopNow();
  return `${now.date}|${now.hour}`;
}

/** The shop's current date and hour in the browser; null while rendering on the server. */
export function useShopNow(): ShopNow | null {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "");
  if (!snapshot) return null;
  const [date, hour] = snapshot.split("|");
  return { date, hour: Number(hour) };
}
