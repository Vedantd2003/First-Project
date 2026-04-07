'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import { getCalendarDays } from '@/utils/calendar';
import { DAY_NAMES, DAY_NAMES_SHORT } from '@/data/heroImages';
import { MonthTheme } from '@/types';
import DateCell from './DateCell';

interface CalendarGridProps {
  theme: MonthTheme;
}

const flipVariants = {
  enter: (direction: number) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    rotateX: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function CalendarGrid({ theme }: CalendarGridProps) {
  const { currentMonth, currentYear, direction } = useCalendarStore();

  const days = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const gridKey = `${currentYear}-${currentMonth}`;

  return (
    <div className="w-full" style={{ perspective: '1200px' }}>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className="text-center text-xs font-semibold uppercase tracking-wider py-2"
            style={{ color: `${theme.text}88` }}
          >
            <span className="hidden md:inline">{name}</span>
            <span className="md:hidden">{DAY_NAMES_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid with flip animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={gridKey}
          custom={direction}
          variants={flipVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            rotateX: { type: 'spring', stiffness: 200, damping: 25 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
          }}
          className="grid grid-cols-7 gap-0.5 md:gap-1"
          style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
        >
          {days.map((date) => (
            <DateCell
              key={date.toISOString()}
              date={date}
              year={currentYear}
              month={currentMonth}
              theme={theme}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
