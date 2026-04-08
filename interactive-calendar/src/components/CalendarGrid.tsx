import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayCell from './DayCell';
import {
  getCalendarDays,
  isInCurrentMonth,
  isSameDateCheck,
  isDateInRange,
  isRangeStart,
  isRangeEnd,
  isToday,
  getDayNumber,
  formatDateKey,
  WEEKDAY_LABELS,
  getHolidays,
} from '../utils/dateHelpers';
import type { NotesMap } from '../utils/localStorage';

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  notes: NotesMap;
  themeColor: string;
  themeGlow: string;
  isDark: boolean;
  direction: number;
  onDateMouseDown: (date: Date) => void;
  onDateMouseEnter: (date: Date) => void;
  onDateMouseUp: (date: Date) => void;
  onDateClick: (date: Date) => void;
}

const gridVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const CalendarGrid: React.FC<CalendarGridProps> = React.memo(
  ({
    currentMonth,
    startDate,
    endDate,
    hoverDate,
    notes,
    themeColor,
    themeGlow,
    isDark,
    direction,
    onDateMouseDown,
    onDateMouseEnter,
    onDateMouseUp,
    onDateClick,
  }) => {
    const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

    const holidays = useMemo(
      () => getHolidays(currentMonth.getFullYear()),
      [currentMonth]
    );

    // Compute effective range end (use hoverDate as preview if no endDate yet)
    const effectiveEnd = endDate || hoverDate;

    const weeks = useMemo(() => {
      const result: Date[][] = [];
      for (let i = 0; i < days.length; i += 7) {
        result.push(days.slice(i, i + 7));
      }
      return result;
    }, [days]);

    const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;

    return (
      <div
        className="select-none"
        role="grid"
        aria-label="Calendar"
        onMouseLeave={() => {
          // Clear hover when leaving grid
        }}
      >
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2" role="row">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              role="columnheader"
              className={`
                text-center text-xs font-semibold uppercase tracking-wider py-2
                ${isDark ? 'text-white/40' : 'text-gray-400'}
              `}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid with animation */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={monthKey}
              custom={direction}
              variants={gridVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30, duration: 0.3 },
                opacity: { duration: 0.2 },
              }}
            >
              {weeks.map((week, weekIndex) => (
                <motion.div
                  key={weekIndex}
                  className="grid grid-cols-7 gap-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: weekIndex * 0.03,
                    duration: 0.25,
                    ease: [0.2, 0.9, 0.4, 1.1],
                  }}
                >
                  {week.map((date) => {
                    const dateKey = formatDateKey(date);
                    const inMonth = isInCurrentMonth(date, currentMonth);
                    const isStartDate = isRangeStart(date, startDate, effectiveEnd);
                    const isEndDate = isRangeEnd(date, startDate, effectiveEnd);
                    const inRange =
                      isDateInRange(date, startDate, effectiveEnd) &&
                      !isStartDate &&
                      !isEndDate;
                    const isPreview =
                      !endDate &&
                      hoverDate &&
                      startDate &&
                      isDateInRange(date, startDate, hoverDate) &&
                      !isSameDateCheck(date, startDate);

                    return (
                      <div key={dateKey} className="group">
                        <DayCell
                          date={date}
                          dayNumber={getDayNumber(date)}
                          isCurrentMonth={inMonth}
                          isToday={isToday(date)}
                          isStart={isStartDate && inMonth}
                          isEnd={isEndDate && inMonth}
                          isInRange={inRange && inMonth}
                          isHoverPreview={!!isPreview && inMonth}
                          hasNote={!!notes[dateKey]}
                          notePreview={notes[dateKey]}
                          holiday={holidays[dateKey]}
                          themeColor={themeColor}
                          themeGlow={themeGlow}
                          isDark={isDark}
                          onMouseDown={onDateMouseDown}
                          onMouseEnter={onDateMouseEnter}
                          onMouseUp={onDateMouseUp}
                          onClick={onDateClick}
                        />
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;
