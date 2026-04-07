import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isWeekend,
  isWithinInterval,
  parseISO,
  isBefore,
  isAfter,
} from 'date-fns';

export function getCalendarDays(year: number, month: number): Date[] {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  return eachDayOfInterval({ start: calStart, end: calEnd });
}

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function isDateInMonth(date: Date, year: number, month: number): boolean {
  return isSameMonth(date, new Date(year, month));
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekendDay(date: Date): boolean {
  return isWeekend(date);
}

export function isDateInRange(
  date: Date,
  start: string | null,
  end: string | null
): 'start' | 'end' | 'in-range' | null {
  if (!start) return null;

  const startDate = parseISO(start);

  if (!end) {
    if (isSameDay(date, startDate)) return 'start';
    return null;
  }

  const endDate = parseISO(end);
  const [rangeStart, rangeEnd] = isBefore(startDate, endDate)
    ? [startDate, endDate]
    : [endDate, startDate];

  if (isSameDay(date, rangeStart)) return 'start';
  if (isSameDay(date, rangeEnd)) return 'end';
  if (isWithinInterval(date, { start: rangeStart, end: rangeEnd })) return 'in-range';
  return null;
}

export function isDateInHoverRange(
  date: Date,
  start: string | null,
  hover: string | null
): boolean {
  if (!start || !hover) return false;
  const startDate = parseISO(start);
  const hoverDate = parseISO(hover);
  const [rangeStart, rangeEnd] = isBefore(startDate, hoverDate)
    ? [startDate, hoverDate]
    : [hoverDate, startDate];
  return (
    isWithinInterval(date, { start: rangeStart, end: rangeEnd }) ||
    isSameDay(date, rangeStart) ||
    isSameDay(date, rangeEnd)
  );
}

export function getDaysInRange(start: string, end: string): number {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const [rs, re] = isBefore(startDate, endDate)
    ? [startDate, endDate]
    : [endDate, startDate];
  return eachDayOfInterval({ start: rs, end: re }).length;
}

export function sortRangeDates(
  start: string,
  end: string
): [string, string] {
  const s = parseISO(start);
  const e = parseISO(end);
  if (isAfter(s, e)) return [end, start];
  return [start, end];
}
