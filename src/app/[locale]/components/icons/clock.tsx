'use client'

import { useCurrentTime } from "~/app/[locale]/hooks/use-current-time";

export function ClockIcon({ className }: { className?: string }) {
  const time = useCurrentTime();
  const hour = time.getHours();
  const minute = time.getMinutes();

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  const hourRadians = ((hourAngle - 90) * Math.PI) / 180;
  const minuteRadians = ((minuteAngle - 90) * Math.PI) / 180;

  const hourX = 12 + Math.cos(hourRadians) * 4;
  const hourY = 12 + Math.sin(hourRadians) * 4;
  const minuteX = 12 + Math.cos(minuteRadians) * 6;
  const minuteY = 12 + Math.sin(minuteRadians) * 6;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-clock-icon lucide-clock ${className}`}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2={minuteX} y2={minuteY} />
      <line x1="12" y1="12" x2={hourX} y2={hourY} />
    </svg>
  );
}
