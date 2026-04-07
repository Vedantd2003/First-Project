'use client';

import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import {
  formatDateKey,
  isDateInMonth,
  isToday,
  isWeekendDay,
  isDateInRange,
  isDateInHoverRange,
} from '@/utils/calendar';
import { getHolidayForDate } from '@/data/holidays';
import { MonthTheme } from '@/types';

interface DateCellProps {
  date: Date;
  year: number;
  month: number;
  theme: MonthTheme;
}

const DateCell = memo(function DateCell({ date, year, month, theme }: DateCellProps) {
  const dateKey = formatDateKey(date);
  const inMonth = isDateInMonth(date, year, month);
  const today = isToday(date);
  const weekend = isWeekendDay(date);
  const day = date.getDate();
  const holiday = getHolidayForDate(date.getMonth(), day);

  const {
    selectedDate,
    dateRange,
    isSelectingRange,
    hoverDate,
    notes,
    selectDate,
    setDateRange,
    setIsSelectingRange,
    setHoverDate,
    setNotesPanelOpen,
  } = useCalendarStore();

  const rangeState = isDateInRange(date, dateRange.start, dateRange.end);
  const inHoverRange =
    isSelectingRange && dateRange.start && !dateRange.end
      ? isDateInHoverRange(date, dateRange.start, hoverDate)
      : false;

  const hasNotes = notes.some((n) => n.date === dateKey);
  const isSelected = selectedDate === dateKey;

  const handleClick = useCallback(() => {
    if (!inMonth) return;

    if (isSelectingRange) {
      if (!dateRange.start) {
        setDateRange({ start: dateKey, end: null });
      } else if (!dateRange.end) {
        setDateRange({ start: dateRange.start, end: dateKey });
        setIsSelectingRange(false);
        setNotesPanelOpen(true);
      }
    } else {
      selectDate(dateKey);
      setDateRange({ start: null, end: null });
      setNotesPanelOpen(true);
    }
  }, [inMonth, isSelectingRange, dateRange, dateKey, setDateRange, setIsSelectingRange, selectDate, setNotesPanelOpen]);

  const handleMouseEnter = useCallback(() => {
    if (inMonth) {
      setHoverDate(dateKey);
    }
  }, [inMonth, dateKey, setHoverDate]);

  const getRangeClasses = () => {
    if (rangeState === 'start') return 'rounded-l-xl';
    if (rangeState === 'end') return 'rounded-r-xl';
    if (rangeState === 'in-range') return '';
    return 'rounded-xl';
  };

  const getRangeBg = () => {
    if (rangeState === 'start' || rangeState === 'end') {
      return `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
    }
    if (rangeState === 'in-range') {
      return `linear-gradient(135deg, ${theme.primary}33, ${theme.secondary}33)`;
    }
    if (inHoverRange) {
      return `linear-gradient(135deg, ${theme.primary}1a, ${theme.secondary}1a)`;
    }
    return 'transparent';
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center cursor-pointer select-none
        aspect-square ${getRangeClasses()}
        ${!inMonth ? 'opacity-20 pointer-events-none' : ''}
        ${isSelectingRange ? 'cursor-crosshair' : ''}
      `}
      style={{ background: getRangeBg() }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      whileHover={inMonth ? { scale: 1.15, zIndex: 10 } : {}}
      whileTap={inMonth ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Today ring */}
      {today && (
        <motion.div
          className="absolute inset-1 rounded-full border-2"
          style={{ borderColor: theme.primary }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      )}

      {/* Selected highlight */}
      {isSelected && !rangeState && (
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{ background: `linear-gradient(135deg, ${theme.primary}66, ${theme.secondary}66)` }}
          layoutId="selected-date"
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center">
        <span
          className={`text-sm md:text-base font-medium leading-none
            ${today ? 'font-bold' : ''}
            ${weekend && inMonth ? 'opacity-70' : ''}
            ${rangeState === 'start' || rangeState === 'end' ? 'text-white font-bold' : ''}
          `}
          style={{
            color:
              rangeState === 'start' || rangeState === 'end'
                ? '#fff'
                : isSelected
                ? theme.primary
                : theme.text,
          }}
        >
          {day}
        </span>

        {/* Holiday emoji */}
        {holiday && inMonth && (
          <span className="text-[10px] leading-none mt-0.5" title={holiday.name}>
            {holiday.emoji}
          </span>
        )}

        {/* Note indicator */}
        {hasNotes && inMonth && (
          <motion.div
            className="w-1.5 h-1.5 rounded-full mt-0.5"
            style={{ backgroundColor: theme.accent }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        )}
      </div>
    </motion.div>
  );
});

export default DateCell;
