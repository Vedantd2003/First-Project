import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  FileText,
  Trash2,
  Save,
  Download,
  Upload,
  Edit3,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { formatDateKey, getOrderedRange, getDatesInRange } from '../utils/dateHelpers';
import { exportNotesAsJSON, importNotesFromJSON, type NotesMap } from '../utils/localStorage';

interface NotesPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  notes: NotesMap;
  onAddNote: (dateKey: string, text: string) => void;
  onAddNoteToRange: (start: Date, end: Date, text: string) => void;
  onDeleteNote: (dateKey: string) => void;
  onDeleteNoteFromRange: (start: Date, end: Date) => void;
  onUpdateNote: (dateKey: string, text: string) => void;
  onSetNotes: (notes: NotesMap) => void;
  themeColor: string;
  themeGradient: string;
  isDark: boolean;
}

const NotesPanel: React.FC<NotesPanelProps> = React.memo(
  ({
    startDate,
    endDate,
    notes,
    onAddNote,
    onAddNoteToRange,
    onDeleteNote,
    onDeleteNoteFromRange,
    onUpdateNote,
    onSetNotes,
    themeColor,
    themeGradient,
    isDark,
  }) => {
    const [noteText, setNoteText] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isRange = startDate && endDate && !isSameDate(startDate, endDate);
    const selectedDateKey = startDate ? formatDateKey(startDate) : null;

    // Get existing notes for selected date(s)
    const selectedNotes = React.useMemo(() => {
      if (!startDate) return [];
      if (isRange && endDate) {
        const dates = getDatesInRange(startDate, endDate);
        return dates
          .map((d) => ({
            key: formatDateKey(d),
            date: d,
            text: notes[formatDateKey(d)],
          }))
          .filter((n) => n.text);
      }
      const key = formatDateKey(startDate);
      return notes[key] ? [{ key, date: startDate, text: notes[key] }] : [];
    }, [startDate, endDate, isRange, notes]);

    // Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [noteText]);

    const handleSaveNote = useCallback(() => {
      if (!noteText.trim() || !startDate) return;
      if (isRange && endDate) {
        onAddNoteToRange(startDate, endDate, noteText.trim());
      } else if (selectedDateKey) {
        onAddNote(selectedDateKey, noteText.trim());
      }
      setNoteText('');
    }, [noteText, startDate, endDate, isRange, selectedDateKey, onAddNote, onAddNoteToRange]);

    const handleUpdateNote = useCallback(
      (key: string) => {
        if (!editText.trim()) {
          onDeleteNote(key);
        } else {
          onUpdateNote(key, editText.trim());
        }
        setEditingKey(null);
        setEditText('');
      },
      [editText, onUpdateNote, onDeleteNote]
    );

    const handleDeleteAll = useCallback(() => {
      if (isRange && startDate && endDate) {
        onDeleteNoteFromRange(startDate, endDate);
      } else if (selectedDateKey) {
        onDeleteNote(selectedDateKey);
      }
    }, [isRange, startDate, endDate, selectedDateKey, onDeleteNote, onDeleteNoteFromRange]);

    const handleExport = useCallback(() => {
      exportNotesAsJSON(notes);
    }, [notes]);

    const handleImport = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          importNotesFromJSON(file, (imported) => {
            // Merge imported notes with existing
            onSetNotes({ ...notes, ...imported });
          });
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      [notes, onSetNotes]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          handleSaveNote();
        }
      },
      [handleSaveNote]
    );

    const selectionLabel = React.useMemo(() => {
      if (!startDate) return 'Select a date';
      if (isRange && endDate) {
        const ordered = getOrderedRange(startDate, endDate);
        if (!ordered) return '';
        return `${format(ordered.rangeStart, 'MMM d')} - ${format(ordered.rangeEnd, 'MMM d, yyyy')}`;
      }
      return format(startDate, 'EEEE, MMMM d, yyyy');
    }, [startDate, endDate, isRange]);

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.9, 0.4, 1.0] }}
        className={`
          mt-4 rounded-2xl overflow-hidden
          ${isDark
            ? 'bg-white/[0.03] border border-white/10'
            : 'bg-white/60 border border-black/5 shadow-sm'
          }
          backdrop-blur-xl
        `}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: themeGradient }}
              >
                <Calendar size={14} className="text-white" />
              </div>
              <div>
                <h3
                  className={`text-sm font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Notes
                </h3>
                <p
                  className={`text-xs ${
                    isDark ? 'text-white/50' : 'text-gray-500'
                  }`}
                >
                  {selectionLabel}
                </p>
              </div>
            </div>

            {/* Export/Import buttons */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleExport}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-white/10 text-white/50'
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
                aria-label="Export notes as JSON"
                title="Export notes"
              >
                <Download size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleImport}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-white/10 text-white/50'
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
                aria-label="Import notes from JSON"
                title="Import notes"
              >
                <Upload size={14} />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Note input */}
          {startDate && (
            <div className="mb-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isRange
                      ? 'Add a note for the selected range...'
                      : 'Add a note for this date...'
                  }
                  rows={2}
                  className={`
                    w-full px-4 py-3 rounded-xl resize-none
                    text-sm leading-relaxed
                    transition-all duration-200
                    focus:outline-none focus:ring-2
                    ${isDark
                      ? 'bg-white/5 text-white placeholder-white/30 border border-white/10 focus:border-transparent'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-transparent'
                    }
                  `}
                  style={
                    {
                      '--tw-ring-color': themeColor,
                    } as React.CSSProperties
                  }
                  aria-label="Note text input"
                />
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs ${
                      isDark ? 'text-white/30' : 'text-gray-400'
                    }`}
                  >
                    {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to save
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                    className={`
                      flex items-center gap-1.5 px-4 py-2 rounded-xl
                      text-xs font-semibold text-white
                      transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed
                    `}
                    style={{ background: noteText.trim() ? themeGradient : undefined }}
                    aria-label="Save note"
                  >
                    <Save size={12} />
                    Save
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Existing notes list */}
          <AnimatePresence>
            {selectedNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      isDark ? 'text-white/30' : 'text-gray-400'
                    }`}
                  >
                    {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''}
                  </span>
                  {selectedNotes.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeleteAll}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      aria-label="Delete all notes in selection"
                    >
                      <Trash2 size={10} />
                      Clear all
                    </motion.button>
                  )}
                </div>

                {selectedNotes.map((note) => (
                  <motion.div
                    key={note.key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      group relative p-3 rounded-xl
                      ${isDark
                        ? 'bg-white/[0.03] border border-white/5'
                        : 'bg-white border border-gray-100'
                      }
                    `}
                  >
                    {editingKey === note.key ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className={`
                            w-full px-3 py-2 rounded-lg resize-none text-sm
                            focus:outline-none focus:ring-1
                            ${isDark
                              ? 'bg-white/5 text-white border border-white/10'
                              : 'bg-gray-50 text-gray-900 border border-gray-200'
                            }
                          `}
                          rows={2}
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingKey(null)}
                            className={`text-xs px-3 py-1.5 rounded-lg ${
                              isDark
                                ? 'bg-white/5 text-white/60'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateNote(note.key)}
                            className="text-xs px-3 py-1.5 rounded-lg text-white"
                            style={{ background: themeColor }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <MessageSquare
                            size={12}
                            className={`mt-0.5 flex-shrink-0 ${
                              isDark ? 'text-white/20' : 'text-gray-300'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs mb-1 ${
                                isDark ? 'text-white/30' : 'text-gray-400'
                              }`}
                            >
                              {format(note.date, 'EEE, MMM d')}
                            </p>
                            <p
                              className={`text-sm leading-relaxed ${
                                isDark ? 'text-white/80' : 'text-gray-700'
                              }`}
                            >
                              {note.text}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons (visible on hover) */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingKey(note.key);
                              setEditText(note.text);
                            }}
                            className={`p-1.5 rounded-lg ${
                              isDark
                                ? 'hover:bg-white/10 text-white/40'
                                : 'hover:bg-gray-100 text-gray-400'
                            }`}
                            aria-label={`Edit note for ${format(note.date, 'MMM d')}`}
                          >
                            <Edit3 size={12} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDeleteNote(note.key)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"
                            aria-label={`Delete note for ${format(note.date, 'MMM d')}`}
                          >
                            <Trash2 size={12} />
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {startDate && selectedNotes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-6 ${
                isDark ? 'text-white/20' : 'text-gray-300'
              }`}
            >
              <FileText size={24} className="mx-auto mb-2" />
              <p className="text-xs">No notes for this selection</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
);

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

NotesPanel.displayName = 'NotesPanel';

export default NotesPanel;
