export interface CalendarNote {
  id: string;
  date: string; // ISO date string
  content: string;
  color: string;
  createdAt: number;
}

export interface RangeNote {
  id: string;
  startDate: string;
  endDate: string;
  content: string;
  color: string;
  createdAt: number;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface MonthTheme {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  heroUrl: string;
}

export interface Holiday {
  date: string;
  name: string;
  emoji: string;
}
