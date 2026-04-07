'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import { getMonthTheme } from '@/data/monthThemes';
import { useSwipe } from '@/hooks/useSwipe';
import HeroImage from './HeroImage';
import MonthNavigation from './MonthNavigation';
import CalendarGrid from './CalendarGrid';
import RangeHighlighter from './RangeHighlighter';
import NotesPanel from './NotesPanel';
import SmartSuggestion from './SmartSuggestion';

export default function Calendar() {
  const { currentMonth, currentYear, nextMonth, prevMonth, loadFromStorage } =
    useCalendarStore();

  const theme = getMonthTheme(currentMonth);
  const swipeHandlers = useSwipe(nextMonth, prevMonth);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center p-2 md:p-8 transition-colors duration-700"
      style={{ backgroundColor: theme.bg }}
      {...swipeHandlers}
    >
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
          style={{ background: theme.primary, top: '-10%', left: '-10%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-15"
          style={{ background: theme.secondary, bottom: '-10%', right: '-10%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Main calendar card */}
        <motion.div
          className="flex-1 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${theme.bg}00, ${theme.bg}bb 30%)`,
            boxShadow: `
              0 0 0 1px ${theme.primary}15,
              0 4px 6px -1px ${theme.bg}66,
              0 20px 60px -15px ${theme.primary}22,
              inset 0 1px 0 ${theme.primary}11
            `,
            backdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Hero image */}
          <HeroImage theme={theme} month={currentMonth} year={currentYear} />

          {/* Calendar content */}
          <div className="px-4 md:px-6 pb-6">
            {/* Navigation */}
            <div className="flex items-center justify-between py-4">
              <MonthNavigation theme={theme} />
              <RangeHighlighter theme={theme} />
            </div>

            {/* Smart suggestion */}
            <SmartSuggestion theme={theme} />

            {/* Calendar grid */}
            <div className="mt-3">
              <CalendarGrid theme={theme} />
            </div>

            {/* Footer info */}
            <div className="mt-4 flex items-center justify-between text-xs" style={{ color: `${theme.text}44` }}>
              <span>Click a date to add notes</span>
              <span>Use range mode for multi-day plans</span>
            </div>
          </div>
        </motion.div>

        {/* Notes panel (desktop: side panel) */}
        <div className="hidden md:block">
          <NotesPanel theme={theme} />
        </div>

        {/* Notes panel (mobile: bottom sheet) */}
        <div className="md:hidden">
          <NotesPanel theme={theme} />
        </div>
      </div>
    </motion.div>
  );
}
