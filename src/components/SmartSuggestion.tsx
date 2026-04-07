'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import { getDaysInRange } from '@/utils/calendar';
import { MonthTheme } from '@/types';

interface SmartSuggestionProps {
  theme: MonthTheme;
}

export default function SmartSuggestion({ theme }: SmartSuggestionProps) {
  const { dateRange, setNotesPanelOpen } = useCalendarStore();
  const hasRange = dateRange.start && dateRange.end;

  if (!hasRange) return null;

  const daysCount = getDaysInRange(dateRange.start!, dateRange.end!);

  const getSuggestion = () => {
    if (daysCount === 1) return null;
    if (daysCount === 2) return { text: 'Weekend getaway?', icon: '🏖️' };
    if (daysCount <= 4) return { text: 'Short trip planned?', icon: '✈️' };
    if (daysCount <= 7) return { text: `${daysCount} days selected — plan a week?`, icon: '📋' };
    if (daysCount <= 14) return { text: 'Two-week sprint? Add milestones!', icon: '🎯' };
    return { text: `${daysCount} days — that's a big plan!`, icon: '🚀' };
  };

  const suggestion = getSuggestion();
  if (!suggestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="rounded-xl p-3 cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${theme.accent}15, ${theme.primary}15)`,
          border: `1px solid ${theme.accent}33`,
        }}
        onClick={() => setNotesPanelOpen(true)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{suggestion.icon}</span>
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            {suggestion.text}
          </span>
          <motion.span
            className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
            style={{ background: `${theme.accent}22`, color: theme.accent }}
            whileHover={{ scale: 1.1 }}
          >
            Add note →
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
