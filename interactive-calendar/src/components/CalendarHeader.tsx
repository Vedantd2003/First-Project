import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { SelectionMode } from '../hooks/useDateRange';

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  selectionMode: SelectionMode;
  onSelectionModeChange: (mode: SelectionMode) => void;
  hasSelection: boolean;
  onClearSelection: () => void;
  themeColor: string;
  isDark: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = React.memo(
  ({
    monthName,
    year,
    onPrevMonth,
    onNextMonth,
    onToday,
    selectionMode,
    onSelectionModeChange,
    hasSelection,
    onClearSelection,
    themeColor,
    isDark,
  }) => {
    const buttonBase = `
      relative flex items-center justify-center rounded-xl 
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
    `;

    const navButton = `${buttonBase} w-10 h-10 
      ${isDark 
        ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10' 
        : 'bg-black/5 hover:bg-black/10 text-gray-600 hover:text-gray-900 border border-black/5'}
    `;

    const activeTabStyle = {
      backgroundColor: themeColor,
      color: '#fff',
    };

    return (
      <div className="flex flex-col gap-4 mb-6">
        {/* Top row: Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevMonth}
              className={navButton}
              aria-label="Previous month"
              style={{ focusRingColor: themeColor } as React.CSSProperties}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextMonth}
              className={navButton}
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToday}
              className={`${navButton} px-3 w-auto text-xs font-medium tracking-wide uppercase`}
              aria-label="Go to today"
            >
              Today
            </motion.button>
          </div>

          {/* Month/Year display (visible on mobile where ImagePanel stacks) */}
          <div className="lg:hidden">
            <motion.h2
              key={`${monthName}-${year}-header`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {monthName} {year}
            </motion.h2>
          </div>

          {/* Selection mode toggle + clear */}
          <div className="flex items-center gap-2">
            <div
              className={`flex rounded-xl p-1 text-xs font-medium ${
                isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/5'
              }`}
            >
              <button
                onClick={() => onSelectionModeChange('click')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  selectionMode === 'click'
                    ? 'text-white shadow-sm'
                    : isDark
                    ? 'text-white/50 hover:text-white/80'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                style={selectionMode === 'click' ? activeTabStyle : undefined}
                aria-label="Click selection mode"
              >
                Click
              </button>
              <button
                onClick={() => onSelectionModeChange('drag')}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  selectionMode === 'drag'
                    ? 'text-white shadow-sm'
                    : isDark
                    ? 'text-white/50 hover:text-white/80'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                style={selectionMode === 'drag' ? activeTabStyle : undefined}
                aria-label="Drag selection mode"
              >
                Drag
              </button>
            </div>

            {hasSelection && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearSelection}
                className={`${navButton} w-8 h-8`}
                aria-label="Clear selection"
              >
                <RotateCcw size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CalendarHeader.displayName = 'CalendarHeader';

export default CalendarHeader;
