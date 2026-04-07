'use client';

import { create } from 'zustand';
import { CalendarNote, RangeNote, DateRange } from '@/types';

interface CalendarState {
  currentMonth: number;
  currentYear: number;
  selectedDate: string | null;
  dateRange: DateRange;
  isSelectingRange: boolean;
  hoverDate: string | null;
  notes: CalendarNote[];
  rangeNotes: RangeNote[];
  notesPanelOpen: boolean;
  direction: number;

  setMonth: (month: number, year: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  selectDate: (date: string | null) => void;
  setDateRange: (range: DateRange) => void;
  setIsSelectingRange: (v: boolean) => void;
  setHoverDate: (date: string | null) => void;
  addNote: (note: CalendarNote) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  addRangeNote: (note: RangeNote) => void;
  updateRangeNote: (id: string, content: string) => void;
  deleteRangeNote: (id: string) => void;
  setNotesPanelOpen: (open: boolean) => void;
  loadFromStorage: () => void;
}

function saveNotes(notes: CalendarNote[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }
}

function saveRangeNotes(notes: RangeNote[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('calendar-range-notes', JSON.stringify(notes));
  }
}

const now = new Date();

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentMonth: now.getMonth(),
  currentYear: now.getFullYear(),
  selectedDate: null,
  dateRange: { start: null, end: null },
  isSelectingRange: false,
  hoverDate: null,
  notes: [],
  rangeNotes: [],
  notesPanelOpen: false,
  direction: 0,

  setMonth: (month, year) => set({ currentMonth: month, currentYear: year }),

  nextMonth: () => {
    const { currentMonth, currentYear } = get();
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    set({ currentMonth: newMonth, currentYear: newYear, direction: 1 });
  },

  prevMonth: () => {
    const { currentMonth, currentYear } = get();
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    set({ currentMonth: newMonth, currentYear: newYear, direction: -1 });
  },

  selectDate: (date) => set({ selectedDate: date }),

  setDateRange: (range) => set({ dateRange: range }),

  setIsSelectingRange: (v) => set({ isSelectingRange: v }),

  setHoverDate: (date) => set({ hoverDate: date }),

  addNote: (note) => {
    const notes = [...get().notes, note];
    saveNotes(notes);
    set({ notes });
  },

  updateNote: (id, content) => {
    const notes = get().notes.map((n) => (n.id === id ? { ...n, content } : n));
    saveNotes(notes);
    set({ notes });
  },

  deleteNote: (id) => {
    const notes = get().notes.filter((n) => n.id !== id);
    saveNotes(notes);
    set({ notes });
  },

  addRangeNote: (note) => {
    const rangeNotes = [...get().rangeNotes, note];
    saveRangeNotes(rangeNotes);
    set({ rangeNotes });
  },

  updateRangeNote: (id, content) => {
    const rangeNotes = get().rangeNotes.map((n) =>
      n.id === id ? { ...n, content } : n
    );
    saveRangeNotes(rangeNotes);
    set({ rangeNotes });
  },

  deleteRangeNote: (id) => {
    const rangeNotes = get().rangeNotes.filter((n) => n.id !== id);
    saveRangeNotes(rangeNotes);
    set({ rangeNotes });
  },

  setNotesPanelOpen: (open) => set({ notesPanelOpen: open }),

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('calendar-notes');
      const rawRange = localStorage.getItem('calendar-range-notes');
      set({
        notes: raw ? JSON.parse(raw) : [],
        rangeNotes: rawRange ? JSON.parse(rawRange) : [],
      });
    } catch {
      set({ notes: [], rangeNotes: [] });
    }
  },
}));
