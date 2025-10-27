'use client'

import { useCurrentTime } from "~/app/hooks/use-current-time";

export function ClockIcon({ className }: { className?: string }) {
  const time = useCurrentTime();
  const hour = time?.getHours() ?? 0;
  const minute = time?.getMinutes() ?? 0;

  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

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
      <line x1="12" y1="12" x2="12" y2="6" style={{
          transformOrigin: '12px 12px',
          transform: `rotate(${minuteAngle}deg)`,
          transition: 'transform 0.6s ease-in-out',
        }}
      />
      <line x1="12" y1="12" x2="12" y2="8" style={{
          transformOrigin: '12px 12px',
          transform: `rotate(${hourAngle}deg)`,
          transition: 'transform 0.6s ease-in-out',
        }}
      />
    </svg>
  );
}
