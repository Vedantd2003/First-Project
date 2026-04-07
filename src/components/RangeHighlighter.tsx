'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import { getDaysInRange, sortRangeDates } from '@/utils/calendar';
import { MonthTheme } from '@/types';
import { format, parseISO } from 'date-fns';

interface RangeHighlighterProps {
  theme: MonthTheme;
}

export default function RangeHighlighter({ theme }: RangeHighlighterProps) {
  const { dateRange, isSelectingRange, setIsSelectingRange, setDateRange } =
    useCalendarStore();

  const hasRange = dateRange.start && dateRange.end;
  const daysCount = hasRange ? getDaysInRange(dateRange.start!, dateRange.end!) : 0;

  const clearRange = () => {
    setDateRange({ start: null, end: null });
    setIsSelectingRange(false);
  };

  const toggleRangeMode = () => {
    if (isSelectingRange) {
      setIsSelectingRange(false);
      setDateRange({ start: null, end: null });
    } else {
      setIsSelectingRange(true);
      setDateRange({ start: null, end: null });
    }
  };

  const formatRangeDate = (d: string) => format(parseISO(d), 'MMM d');

  return (
    <div className="flex flex-col gap-2">
      {/* Range toggle button */}
      <motion.button
        onClick={toggleRangeMode}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{
          background: isSelectingRange
            ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
            : `${theme.primary}22`,
          color: isSelectingRange ? '#fff' : theme.primary,
          border: `1px solid ${isSelectingRange ? 'transparent' : theme.primary}44`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {isSelectingRange ? 'Selecting range...' : 'Select range'}
      </motion.button>

      {/* Range info */}
      <AnimatePresence>
        {hasRange && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="rounded-xl px-4 py-3 backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}22)`,
              border: `1px solid ${theme.primary}33`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium" style={{ color: `${theme.text}88` }}>
                  Selected range
                </div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {formatRangeDate(sortRangeDates(dateRange.start!, dateRange.end!)[0])}
                  {' → '}
                  {formatRangeDate(sortRangeDates(dateRange.start!, dateRange.end!)[1])}
                </div>
                <div className="text-xs mt-1" style={{ color: theme.accent }}>
                  {daysCount} day{daysCount > 1 ? 's' : ''} selected
                  {daysCount >= 5 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: `${theme.accent}33`, color: theme.accent }}
                    >
                      💡 Add a plan?
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                onClick={clearRange}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selecting hint */}
      <AnimatePresence>
        {isSelectingRange && !dateRange.start && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center py-1"
            style={{ color: `${theme.text}88` }}
          >
            Click a start date
          </motion.div>
        )}
        {isSelectingRange && dateRange.start && !dateRange.end && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center py-1"
            style={{ color: `${theme.text}88` }}
          >
            Now click an end date
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
