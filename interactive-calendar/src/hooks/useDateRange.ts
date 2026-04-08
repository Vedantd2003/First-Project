import { useState, useCallback, useRef } from 'react';
import { isSameDay } from 'date-fns';

export type SelectionMode = 'click' | 'drag';

export interface DateRangeState {
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  isDragging: boolean;
  selectionMode: SelectionMode;
}

export interface DateRangeActions {
  handleDateMouseDown: (date: Date) => void;
  handleDateMouseEnter: (date: Date) => void;
  handleDateMouseUp: (date: Date) => void;
  handleDateClick: (date: Date) => void;
  clearSelection: () => void;
  setSelectionMode: (mode: SelectionMode) => void;
  setHoverDate: (date: Date | null) => void;
}

export const useDateRange = (): DateRangeState & DateRangeActions => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('click');
  const clickCount = useRef(0);

  const handleDateMouseDown = useCallback(
    (date: Date) => {
      if (selectionMode !== 'drag') return;
      setIsDragging(true);
      setStartDate(date);
      setEndDate(null);
      setHoverDate(null);
    },
    [selectionMode]
  );

  const handleDateMouseEnter = useCallback(
    (date: Date) => {
      if (selectionMode === 'drag' && isDragging) {
        setEndDate(date);
      } else if (selectionMode === 'click' && startDate && !endDate) {
        setHoverDate(date);
      }
    },
    [selectionMode, isDragging, startDate, endDate]
  );

  const handleDateMouseUp = useCallback(
    (date: Date) => {
      if (selectionMode !== 'drag') return;
      setIsDragging(false);
      if (startDate && isSameDay(startDate, date)) {
        // Single date selection
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    },
    [selectionMode, startDate]
  );

  const handleDateClick = useCallback(
    (date: Date) => {
      if (selectionMode !== 'click') return;
      if (clickCount.current === 0 || (startDate && endDate)) {
        // First click or reset after complete selection
        setStartDate(date);
        setEndDate(null);
        setHoverDate(null);
        clickCount.current = 1;
      } else if (clickCount.current === 1) {
        // Second click sets end date
        setEndDate(date);
        setHoverDate(null);
        clickCount.current = 0;
      }
    },
    [selectionMode, startDate, endDate]
  );

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    setIsDragging(false);
    clickCount.current = 0;
  }, []);

  return {
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
    setHoverDate,
  };
};
