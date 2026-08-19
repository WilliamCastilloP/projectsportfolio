"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const formatter = new Intl.DateTimeFormat("en-CA", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: site.timeZone,
});

/**
 * Montréal wall clock. Rendered empty on the server — the visitor's machine
 * is the only thing that can tell us the current time without a request.
 */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();

    // Re-sync on the minute boundary, then every minute.
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className="label inline-flex items-center gap-2 text-faint">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-accent/70 motion-safe:animate-pulse"
      />
      <span className="tabular-nums">
        {time ?? "--:--"} {site.location.split(",")[0]}
      </span>
    </span>
  );
}
