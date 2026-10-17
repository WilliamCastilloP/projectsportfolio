"use client";

import { useEffect, useState } from "react";
export function LocalTime({ timeZone, location }: { timeZone: string; location: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
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
  }, [timeZone]);

  return (
    <span className="label inline-flex items-center gap-2 text-faint">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-accent/70 motion-safe:animate-pulse"
      />
      <span className="tabular-nums">
        {time ?? "--:--"} {location.split(",")[0]}
      </span>
    </span>
  );
}
