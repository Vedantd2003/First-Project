'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/store/calendarStore';
import { getRandomNoteColor } from '@/utils/colors';
import { sortRangeDates } from '@/utils/calendar';
import { MonthTheme } from '@/types';
import { format, parseISO } from 'date-fns';

interface NotesPanelProps {
  theme: MonthTheme;
}

export default function NotesPanel({ theme }: NotesPanelProps) {
  const {
    selectedDate,
    dateRange,
    notes,
    rangeNotes,
    notesPanelOpen,
    addNote,
    updateNote,
    deleteNote,
    addRangeNote,
    updateRangeNote,
    deleteRangeNote,
    setNotesPanelOpen,
    selectDate,
    setDateRange,
  } = useCalendarStore();

  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasRange = dateRange.start && dateRange.end;
  const isRangeView = hasRange;

  const dateNotes = selectedDate
    ? notes.filter((n) => n.date === selectedDate)
    : [];

  const currentRangeNotes =
    hasRange
      ? (() => {
          const [s, e] = sortRangeDates(dateRange.start!, dateRange.end!);
          return rangeNotes.filter((n) => n.startDate === s && n.endDate === e);
        })()
      : [];

  const displayNotes = isRangeView ? currentRangeNotes : dateNotes;

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    if (isRangeView && hasRange) {
      const [s, e] = sortRangeDates(dateRange.start!, dateRange.end!);
      addRangeNote({
        id: crypto.randomUUID(),
        startDate: s,
        endDate: e,
        content: newNote.trim(),
        color: getRandomNoteColor(),
        createdAt: Date.now(),
      });
    } else if (selectedDate) {
      addNote({
        id: crypto.randomUUID(),
        date: selectedDate,
        content: newNote.trim(),
        color: getRandomNoteColor(),
        createdAt: Date.now(),
      });
    }
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    if (isRangeView) {
      deleteRangeNote(id);
    } else {
      deleteNote(id);
    }
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = (id: string) => {
    if (isRangeView) {
      updateRangeNote(id, editContent);
    } else {
      updateNote(id, editContent);
    }
    setEditingId(null);
  };

  const handleClose = () => {
    setNotesPanelOpen(false);
    selectDate(null);
  };

  const getTitle = () => {
    if (isRangeView && hasRange) {
      const [s, e] = sortRangeDates(dateRange.start!, dateRange.end!);
      return `${format(parseISO(s), 'MMM d')} → ${format(parseISO(e), 'MMM d')}`;
    }
    if (selectedDate) {
      return format(parseISO(selectedDate), 'EEEE, MMM d, yyyy');
    }
    return 'Notes';
  };

  useEffect(() => {
    if (notesPanelOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [notesPanelOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <AnimatePresence>
      {notesPanelOpen && (selectedDate || hasRange) && (
        <>
          {/* Mobile: Bottom sheet overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Desktop: Side panel / Mobile: Bottom sheet */}
          <motion.div
            className="fixed z-50
              bottom-0 left-0 right-0 max-h-[70vh] rounded-t-3xl
              md:static md:max-h-none md:rounded-2xl md:max-w-sm md:w-full
            "
            style={{
              background: `linear-gradient(180deg, ${theme.bg}ee, ${theme.bg}ff)`,
              border: `1px solid ${theme.primary}33`,
              backdropFilter: 'blur(20px)',
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.primary }}>
                  {isRangeView ? 'Range Notes' : 'Day Notes'}
                </div>
                <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                  {getTitle()}
                </h3>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Notes list */}
            <div className="px-4 pb-2 max-h-60 md:max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
              <AnimatePresence>
                {displayNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="rounded-xl p-3 relative group"
                    style={{
                      background: `${note.color}15`,
                      borderLeft: `3px solid ${note.color}`,
                    }}
                  >
                    {editingId === note.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-sm resize-none"
                          style={{ color: theme.text }}
                          rows={2}
                        />
                        <motion.button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium"
                          style={{ background: note.color, color: '#fff' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed pr-14" style={{ color: theme.text }}>
                          {note.content}
                        </p>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={() => handleStartEdit(note.id, note.content)}
                            className="p-1 rounded hover:bg-white/10"
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(note.id)}
                            className="p-1 rounded hover:bg-red-500/20"
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {displayNotes.length === 0 && (
                <div className="text-center py-6 text-sm" style={{ color: `${theme.text}44` }}>
                  No notes yet. Add one below!
                </div>
              )}
            </div>

            {/* Add note input */}
            <div className="p-4 pt-2">
              <div
                className="flex gap-2 items-end rounded-xl p-2"
                style={{
                  background: `${theme.primary}11`,
                  border: `1px solid ${theme.primary}22`,
                }}
              >
                <textarea
                  ref={inputRef}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a note..."
                  className="flex-1 bg-transparent border-none outline-none text-sm resize-none placeholder:opacity-40"
                  style={{ color: theme.text }}
                  rows={2}
                />
                <motion.button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="p-2 rounded-lg disabled:opacity-30 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
