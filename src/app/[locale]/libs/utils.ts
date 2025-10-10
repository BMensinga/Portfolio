import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('nl-NL', {
    month: 'short',
    year: 'numeric',
  }).format(date);

export const formatDuration = (start: Date, end?: Date) => {
  const endDate = end ?? new Date();

  if (endDate < start) {
    return '0 mth';
  }

  let totalMonths =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());

  if (endDate.getDate() < start.getDate()) {
    totalMonths -= 1;
  }

  totalMonths = Math.max(totalMonths, 0);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} yr`);
  }

  if (months > 0) {
    parts.push(`${months} mth`);
  }

  if (parts.length === 0) {
    return '< 1 mth';
  }

  return parts.join(' ');
};