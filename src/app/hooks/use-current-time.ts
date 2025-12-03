"use client";

import { useEffect, useRef, useState } from "react";

type UseCurrentTimeOptions = {
  intervalMs?: number;
};

export function useCurrentTime({
  intervalMs = 60_000,
}: UseCurrentTimeOptions = {}) {
  const [time, setTime] = useState<Date | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setTime(new Date());

    update();

    const current = new Date();
    const delay =
      intervalMs - (current.getSeconds() * 1_000 + current.getMilliseconds());

    timeoutRef.current = window.setTimeout(() => {
      update();
      intervalRef.current = window.setInterval(update, intervalMs);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs]);

  return time;
}
