import type { ReactNode } from "react";
import { cn } from "~/app/libs/utils";

export function Card({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn(
      'bg-surface p-6 flex flex-col gap-6 rounded-2xl',
        className
      )}>
      {children}
    </div>
  );
}