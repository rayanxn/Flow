import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  startOfWeek,
  startOfMonth,
  format,
} from "date-fns";

export type TimelineScale = "day" | "week" | "month";

export const SCALE_CONFIG: Record<TimelineScale, { colWidth: number; label: string }> = {
  day: { colWidth: 40, label: "Day" },
  week: { colWidth: 120, label: "Week" },
  month: { colWidth: 160, label: "Month" },
};

export function daysBetween(a: Date | string, b: Date | string): number {
  const dateA = typeof a === "string" ? new Date(a) : a;
  const dateB = typeof b === "string" ? new Date(b) : b;
  return differenceInDays(dateB, dateA);
}

export function getDateRange(
  issues: { created_at: string; due_date: string | null }[]
): { start: Date; end: Date } {
  const dates = issues.flatMap((i) => {
    const result = [new Date(i.created_at)];
    if (i.due_date) result.push(new Date(i.due_date));
    return result;
  });

  if (dates.length === 0) {
    const now = new Date();
    return { start: now, end: addDays(now, 30) };
  }

  const min = new Date(Math.min(...dates.map((d) => d.getTime())));
  const max = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Add padding
  return {
    start: addDays(startOfDay(min), -3),
    end: addDays(startOfDay(max), 5),
  };
}

export function getColumnForDate(
  date: Date | string,
  startDate: Date,
  scale: TimelineScale
): number {
  const d = typeof date === "string" ? new Date(date) : date;
  switch (scale) {
    case "day":
      return differenceInDays(d, startDate) + 1;
    case "week":
      return differenceInWeeks(d, startDate) + 1;
    case "month":
      return differenceInMonths(d, startDate) + 1;
  }
}

export function getColumnCount(
  startDate: Date,
  endDate: Date,
  scale: TimelineScale
): number {
  switch (scale) {
    case "day":
      return differenceInDays(endDate, startDate) + 1;
    case "week":
      return differenceInWeeks(endDate, startDate) + 2;
    case "month":
      return differenceInMonths(endDate, startDate) + 2;
  }
}

export type DateHeader = {
  label: string;
  column: number;
  isToday?: boolean;
};

export function generateDateHeaders(
  startDate: Date,
  endDate: Date,
  scale: TimelineScale
): DateHeader[] {
  const headers: DateHeader[] = [];
  const today = startOfDay(new Date());

  let current: Date;
  let addFn: (date: Date, amount: number) => Date;
  let formatStr: string;

  switch (scale) {
    case "day":
      current = startOfDay(startDate);
      addFn = addDays;
      formatStr = "MMM d";
      break;
    case "week":
      current = startOfWeek(startDate, { weekStartsOn: 1 });
      addFn = addWeeks;
      formatStr = "MMM d";
      break;
    case "month":
      current = startOfMonth(startDate);
      addFn = addMonths;
      formatStr = "MMM yyyy";
      break;
  }

  let col = 1;
  while (current <= endDate) {
    headers.push({
      label: format(current, formatStr),
      column: col,
      isToday:
        scale === "day" && current.getTime() === today.getTime(),
    });
    current = addFn(current, 1);
    col++;
  }

  return headers;
}

export function getTodayColumn(
  startDate: Date,
  scale: TimelineScale
): number | null {
  const today = startOfDay(new Date());
  const col = getColumnForDate(today, startDate, scale);
  return col > 0 ? col : null;
}
