import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  isToday as isTodayFn,
  isBefore,
  isAfter,
} from 'date-fns';

export const formatDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getCalendarDays = (currentMonth: Date): Date[] => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const isInCurrentMonth = (date: Date, currentMonth: Date): boolean =>
  isSameMonth(date, currentMonth);

export const isSameDateCheck = (a: Date, b: Date): boolean => isSameDay(a, b);

export const isDateInRange = (
  date: Date,
  start: Date | null,
  end: Date | null
): boolean => {
  if (!start || !end) return false;
  const rangeStart = isBefore(start, end) ? start : end;
  const rangeEnd = isAfter(start, end) ? start : end;
  return isWithinInterval(date, { start: rangeStart, end: rangeEnd });
};

export const isRangeStart = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start) return false;
  if (!end) return isSameDay(date, start);
  const rangeStart = isBefore(start, end) ? start : end;
  return isSameDay(date, rangeStart);
};

export const isRangeEnd = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const rangeEnd = isAfter(start, end) ? start : end;
  return isSameDay(date, rangeEnd);
};

export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPrevMonth = (date: Date): Date => subMonths(date, 1);

export const getMonthName = (date: Date): string => format(date, 'MMMM');
export const getYear = (date: Date): number => date.getFullYear();
export const getDayNumber = (date: Date): number => date.getDate();
export const isToday = (date: Date): boolean => isTodayFn(date);

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getOrderedRange = (
  start: Date | null,
  end: Date | null
): { rangeStart: Date; rangeEnd: Date } | null => {
  if (!start || !end) return null;
  return {
    rangeStart: isBefore(start, end) ? start : end,
    rangeEnd: isAfter(start, end) ? start : end,
  };
};

export const getDatesInRange = (start: Date, end: Date): Date[] => {
  const rangeStart = isBefore(start, end) ? start : end;
  const rangeEnd = isAfter(start, end) ? start : end;
  return eachDayOfInterval({ start: rangeStart, end: rangeEnd });
};

// US holidays for the current year (hardcoded examples)
export const getHolidays = (year: number): Record<string, string> => {
  return {
    [`${year}-01-01`]: "New Year's Day",
    [`${year}-01-20`]: 'Martin Luther King Jr. Day',
    [`${year}-02-14`]: "Valentine's Day",
    [`${year}-02-17`]: "Presidents' Day",
    [`${year}-03-17`]: "St. Patrick's Day",
    [`${year}-04-13`]: 'Easter Sunday',
    [`${year}-05-26`]: 'Memorial Day',
    [`${year}-06-19`]: 'Juneteenth',
    [`${year}-07-04`]: 'Independence Day',
    [`${year}-09-01`]: 'Labor Day',
    [`${year}-10-13`]: 'Columbus Day',
    [`${year}-10-31`]: 'Halloween',
    [`${year}-11-11`]: "Veterans Day",
    [`${year}-11-27`]: 'Thanksgiving',
    [`${year}-12-25`]: 'Christmas Day',
    [`${year}-12-31`]: "New Year's Eve",
  };
};
