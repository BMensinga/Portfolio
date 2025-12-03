import type { ReactNode } from "react";
import { cn } from "~/app/libs/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-surface flex flex-col gap-4 rounded-2xl p-4 sm:gap-6 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
