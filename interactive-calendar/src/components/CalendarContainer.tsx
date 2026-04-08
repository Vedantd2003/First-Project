import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import ImagePanel, { MONTHLY_IMAGES } from './ImagePanel';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { useDateRange } from '../hooks/useDateRange';
import { useNotes } from '../hooks/useNotes';
import { useThemeFromImage } from '../hooks/useThemeFromImage';
import { getMonthName, getYear, getNextMonth, getPrevMonth } from '../utils/dateHelpers';
import { loadThemeMode, saveThemeMode } from '../utils/localStorage';

const CalendarContainer: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Initialize dark mode
  useEffect(() => {
    const mode = loadThemeMode();
    setIsDark(mode === 'dark');
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Set initial image source
  useEffect(() => {
    const monthIndex = currentMonth.getMonth();
    setImageSrc(MONTHLY_IMAGES[monthIndex] || MONTHLY_IMAGES[0]);
  }, [currentMonth]);

  // Theme extraction from hero image
  const theme = useThemeFromImage(imageSrc);

  // Date range selection
  const {
    startDate,
    endDate,
    hoverDate,
    isDragging,
    selectionMode,
    handleDateMouseDown,
    handleDateMouseEnter,
    handleDateMouseUp,
    handleDateClick,
    clearSelection,
    setSelectionMode,
  } = useDateRange();

  // Notes management
  const {
    notes,
    addNote,
    addNoteToRange,
    deleteNote,
    deleteNoteFromRange,
    updateNote,
    setNotes,
  } = useNotes();

  const monthName = useMemo(() => getMonthName(currentMonth), [currentMonth]);
  const year = useMemo(() => getYear(currentMonth), [currentMonth]);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentMonth((prev) => getPrevMonth(prev));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentMonth((prev) => getNextMonth(prev));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    const current = currentMonth;
    if (today.getMonth() === current.getMonth() && today.getFullYear() === current.getFullYear()) {
      return;
    }
    setDirection(today > current ? 1 : -1);
    setCurrentMonth(new Date());
  }, [currentMonth]);

  const handleImageLoad = useCallback((src: string) => {
    setImageSrc(src);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      saveThemeMode(next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevMonth();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextMonth();
          break;
        case 'Escape':
          clearSelection();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevMonth, handleNextMonth, clearSelection]);

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // Handle global mouseup for drag mode
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging && startDate) {
        handleDateMouseUp(startDate);
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, startDate, handleDateMouseUp]);

  const hasSelection = !!(startDate || endDate);

  return (
    <div
      className={`
        min-h-screen w-full transition-colors duration-500
        ${isDark
          ? 'bg-[#0a0a1a]'
          : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'
        }
      `}
    >
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${theme.primary}22 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.9, 0.4, 1.1] }}
          className={`
            w-full max-w-6xl rounded-3xl overflow-hidden
            ${isDark
              ? 'bg-[#12122a]/80 border border-white/[0.06] shadow-2xl shadow-black/40'
              : 'bg-white/70 border border-white/50 shadow-2xl shadow-black/10'
            }
            backdrop-blur-2xl
          `}
        >
          <div className="flex flex-col lg:flex-row lg:h-[680px]">
            {/* Hero Image Panel */}
            <ImagePanel
              month={currentMonth.getMonth()}
              monthName={monthName}
              year={year}
              onImageLoad={handleImageLoad}
              themeGradient={theme.gradient}
              isDark={isDark}
            />

            {/* Calendar Panel */}
            <div className="flex-1 flex flex-col p-6 sm:p-8 lg:overflow-y-auto">
              {/* Top bar with dark mode toggle */}
              <div className="flex items-center justify-between mb-2">
                {/* Hidden on mobile since ImagePanel shows it; shown on desktop */}
                <div className="hidden lg:block">
                  <motion.h2
                    key={`${monthName}-${year}-desktop`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-2xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {monthName}{' '}
                    <span className={isDark ? 'text-white/40' : 'text-gray-400'}>
                      {year}
                    </span>
                  </motion.h2>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className={`
                    p-2.5 rounded-xl transition-colors duration-200
                    ${isDark
                      ? 'bg-white/5 hover:bg-white/10 text-yellow-400 border border-white/10'
                      : 'bg-black/5 hover:bg-black/10 text-gray-600 border border-black/5'
                    }
                  `}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </motion.button>
              </div>

              {/* Calendar Header */}
              <CalendarHeader
                monthName={monthName}
                year={year}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                selectionMode={selectionMode}
                onSelectionModeChange={setSelectionMode}
                hasSelection={hasSelection}
                onClearSelection={clearSelection}
                themeColor={theme.primary}
                isDark={isDark}
              />

              {/* Calendar Grid */}
              <CalendarGrid
                currentMonth={currentMonth}
                startDate={startDate}
                endDate={endDate}
                hoverDate={hoverDate}
                notes={notes}
                themeColor={theme.primary}
                themeGlow={theme.glowColor}
                isDark={isDark}
                direction={direction}
                onDateMouseDown={handleDateMouseDown}
                onDateMouseEnter={handleDateMouseEnter}
                onDateMouseUp={handleDateMouseUp}
                onDateClick={handleDateClick}
              />

              {/* Notes Panel */}
              <NotesPanel
                startDate={startDate}
                endDate={endDate}
                notes={notes}
                onAddNote={addNote}
                onAddNoteToRange={addNoteToRange}
                onDeleteNote={deleteNote}
                onDeleteNoteFromRange={deleteNoteFromRange}
                onUpdateNote={updateNote}
                onSetNotes={setNotes}
                themeColor={theme.primary}
                themeGradient={theme.gradient}
                isDark={isDark}
              />

              {/* Accessibility: Live region for range changes */}
              <div aria-live="polite" className="sr-only">
                {startDate && endDate
                  ? `Range selected from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
                  : startDate
                  ? `Selected ${startDate.toLocaleDateString()}`
                  : ''}
              </div>

              {/* Keyboard hints */}
              <div
                className={`
                  mt-4 flex flex-wrap gap-3 text-[10px] tracking-wide uppercase
                  ${isDark ? 'text-white/20' : 'text-gray-300'}
                `}
              >
                <span>Arrow keys: change month</span>
                <span>Esc: clear selection</span>
                <span>Click/Drag: select dates</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarContainer;
