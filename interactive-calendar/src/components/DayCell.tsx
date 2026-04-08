import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface DayCellProps {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isHoverPreview: boolean;
  hasNote: boolean;
  notePreview: string | undefined;
  holiday: string | undefined;
  themeColor: string;
  themeGlow: string;
  isDark: boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: (date: Date) => void;
  onClick: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = React.memo(
  ({
    date,
    dayNumber,
    isCurrentMonth,
    isToday,
    isStart,
    isEnd,
    isInRange,
    isHoverPreview,
    hasNote,
    notePreview,
    holiday,
    themeColor,
    themeGlow,
    isDark,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onClick,
  }) => {
    const handleMouseDown = useCallback(() => onMouseDown(date), [date, onMouseDown]);
    const handleMouseEnter = useCallback(() => onMouseEnter(date), [date, onMouseEnter]);
    const handleMouseUp = useCallback(() => onMouseUp(date), [date, onMouseUp]);
    const handleClick = useCallback(() => onClick(date), [date, onClick]);

    const isSelected = isStart || isEnd;
    const isActive = isSelected || isInRange;

    // Compute styles based on state
    const cellStyle = useMemo(() => {
      if (!isCurrentMonth) return {};
      if (isSelected) {
        return {
          backgroundColor: themeColor,
          color: '#fff',
          boxShadow: `0 4px 20px ${themeGlow}, 0 0 0 2px ${themeColor}`,
        };
      }
      if (isInRange) {
        return {
          backgroundColor: isDark
            ? `${themeColor}33`
            : `${themeColor}22`,
          color: isDark ? '#fff' : themeColor,
        };
      }
      if (isHoverPreview) {
        return {
          backgroundColor: isDark
            ? `${themeColor}1a`
            : `${themeColor}11`,
          borderColor: `${themeColor}44`,
        };
      }
      return {};
    }, [isCurrentMonth, isSelected, isInRange, isHoverPreview, themeColor, themeGlow, isDark]);

    const textColorClass = useMemo(() => {
      if (!isCurrentMonth) return isDark ? 'text-white/15' : 'text-gray-300';
      if (isSelected) return 'text-white';
      if (isToday && !isActive) return '';
      return isDark ? 'text-white/90' : 'text-gray-800';
    }, [isCurrentMonth, isSelected, isToday, isActive, isDark]);

    return (
      <motion.button
        role="gridcell"
        aria-label={`${dayNumber}${isToday ? ', today' : ''}${holiday ? `, ${holiday}` : ''}${hasNote ? ', has note' : ''}${isStart ? ', range start' : ''}${isEnd ? ', range end' : ''}`}
        aria-selected={isActive}
        tabIndex={isCurrentMonth ? 0 : -1}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={`
          relative flex flex-col items-center justify-center
          w-full aspect-square rounded-2xl cursor-pointer select-none
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
          ${!isCurrentMonth ? 'pointer-events-none' : ''}
          ${isCurrentMonth && !isActive && !isHoverPreview
            ? isDark
              ? 'hover:bg-white/5'
              : 'hover:bg-gray-100'
            : ''
          }
          ${textColorClass}
        `}
        style={{
          ...cellStyle,
          minHeight: '44px',
          minWidth: '44px',
        }}
        whileHover={isCurrentMonth ? { scale: 1.08, y: -2 } : undefined}
        whileTap={isCurrentMonth ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Today indicator ring */}
        {isToday && !isSelected && (
          <motion.div
            className="absolute inset-1 rounded-xl border-2"
            style={{ borderColor: themeColor }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Day number */}
        <span
          className={`text-sm font-medium relative z-10 ${
            isSelected ? 'font-bold' : ''
          }`}
        >
          {dayNumber}
        </span>

        {/* Note indicator dot */}
        {hasNote && isCurrentMonth && (
          <motion.div
            className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: isSelected ? '#fff' : themeColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          />
        )}

        {/* Holiday indicator */}
        {holiday && isCurrentMonth && (
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            title={holiday}
          />
        )}

        {/* Hover tooltip for notes */}
        {hasNote && notePreview && isCurrentMonth && (
          <div
            className={`
              absolute -top-10 left-1/2 -translate-x-1/2 
              px-2.5 py-1 rounded-lg text-xs font-medium
              whitespace-nowrap opacity-0 group-hover:opacity-100
              transition-opacity duration-200 pointer-events-none z-50
              ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
              shadow-lg
            `}
          >
            {notePreview.length > 30 ? `${notePreview.slice(0, 30)}...` : notePreview}
          </div>
        )}

        {/* Range connection indicators */}
        {isInRange && !isStart && isCurrentMonth && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-6 -ml-1 rounded-r-none"
            style={{ backgroundColor: isDark ? `${themeColor}33` : `${themeColor}22` }}
          />
        )}
        {isInRange && !isEnd && isCurrentMonth && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-6 -mr-1 rounded-l-none"
            style={{ backgroundColor: isDark ? `${themeColor}33` : `${themeColor}22` }}
          />
        )}
      </motion.button>
    );
  },
  // Custom comparator for performance
  (prev, next) =>
    prev.dayNumber === next.dayNumber &&
    prev.isCurrentMonth === next.isCurrentMonth &&
    prev.isToday === next.isToday &&
    prev.isStart === next.isStart &&
    prev.isEnd === next.isEnd &&
    prev.isInRange === next.isInRange &&
    prev.isHoverPreview === next.isHoverPreview &&
    prev.hasNote === next.hasNote &&
    prev.notePreview === next.notePreview &&
    prev.themeColor === next.themeColor &&
    prev.isDark === next.isDark &&
    prev.holiday === next.holiday
);

DayCell.displayName = 'DayCell';

export default DayCell;
