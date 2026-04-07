import { Holiday } from '@/types';

export const HOLIDAYS: Holiday[] = [
  { date: '01-01', name: "New Year's Day", emoji: '🎉' },
  { date: '01-15', name: 'Martin Luther King Jr. Day', emoji: '✊' },
  { date: '02-14', name: "Valentine's Day", emoji: '❤️' },
  { date: '02-17', name: "Presidents' Day", emoji: '🇺🇸' },
  { date: '03-17', name: "St. Patrick's Day", emoji: '☘️' },
  { date: '04-01', name: "April Fools' Day", emoji: '🃏' },
  { date: '04-20', name: 'Easter', emoji: '🐣' },
  { date: '05-05', name: 'Cinco de Mayo', emoji: '🇲🇽' },
  { date: '05-11', name: "Mother's Day", emoji: '💐' },
  { date: '05-26', name: 'Memorial Day', emoji: '🎖️' },
  { date: '06-15', name: "Father's Day", emoji: '👔' },
  { date: '06-19', name: 'Juneteenth', emoji: '✊' },
  { date: '07-04', name: 'Independence Day', emoji: '🎆' },
  { date: '09-01', name: 'Labor Day', emoji: '⚒️' },
  { date: '10-13', name: 'Columbus Day', emoji: '🧭' },
  { date: '10-31', name: 'Halloween', emoji: '🎃' },
  { date: '11-11', name: "Veterans Day", emoji: '🎖️' },
  { date: '11-27', name: 'Thanksgiving', emoji: '🦃' },
  { date: '12-24', name: 'Christmas Eve', emoji: '🎄' },
  { date: '12-25', name: 'Christmas Day', emoji: '🎅' },
  { date: '12-31', name: "New Year's Eve", emoji: '🥂' },
];

export function getHolidayForDate(month: number, day: number): Holiday | undefined {
  const key = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return HOLIDAYS.find((h) => h.date === key);
}
