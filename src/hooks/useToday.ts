import { useSyncExternalStore } from "react";
import { toInputDate } from "@/lib/dates";

// The browser's clock is an "external store" with no events to subscribe to.
const subscribeToNothing = () => () => {};

/** Today's date as "YYYY-MM-DD" in the browser; "" while rendering on the server. */
export function useToday() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => toInputDate(new Date()),
    () => "",
  );
}
