'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import { MonthTheme } from '@/types';

interface MonthNavigationProps {
  theme: MonthTheme;
}

export default function MonthNavigation({ theme }: MonthNavigationProps) {
  const { nextMonth, prevMonth } = useCalendarStore();

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={prevMonth}
        className="p-2.5 rounded-xl backdrop-blur-md transition-colors"
        style={{
          background: `${theme.primary}18`,
          border: `1px solid ${theme.primary}22`,
        }}
        whileHover={{ scale: 1.1, background: `${theme.primary}33` }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.button>

      <motion.button
        onClick={() => {
          const now = new Date();
          useCalendarStore.getState().setMonth(now.getMonth(), now.getFullYear());
        }}
        className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-colors"
        style={{
          background: `${theme.primary}18`,
          border: `1px solid ${theme.primary}22`,
          color: theme.primary,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Today
      </motion.button>

      <motion.button
        onClick={nextMonth}
        className="p-2.5 rounded-xl backdrop-blur-md transition-colors"
        style={{
          background: `${theme.primary}18`,
          border: `1px solid ${theme.primary}22`,
        }}
        whileHover={{ scale: 1.1, background: `${theme.primary}33` }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.button>
    </div>
  );
}
