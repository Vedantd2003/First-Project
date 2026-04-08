import { useState, useCallback, useEffect } from 'react';
import { loadNotes, saveNotes, type NotesMap } from '../utils/localStorage';
import { formatDateKey, getDatesInRange } from '../utils/dateHelpers';

export interface NotesActions {
  notes: NotesMap;
  addNote: (dateKey: string, text: string) => void;
  addNoteToRange: (start: Date, end: Date, text: string) => void;
  deleteNote: (dateKey: string) => void;
  deleteNoteFromRange: (start: Date, end: Date) => void;
  updateNote: (dateKey: string, text: string) => void;
  hasNote: (dateKey: string) => boolean;
  getNote: (dateKey: string) => string | undefined;
  setNotes: (notes: NotesMap) => void;
}

export const useNotes = (): NotesActions => {
  const [notes, setNotesState] = useState<NotesMap>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadNotes();
    setNotesState(saved);
  }, []);

  // BroadcastChannel for real-time sync across tabs
  useEffect(() => {
    const channel = new BroadcastChannel('calendar_notes_sync');
    channel.onmessage = (event) => {
      if (event.data && typeof event.data === 'object') {
        setNotesState(event.data as NotesMap);
      }
    };
    return () => channel.close();
  }, []);

  const persistAndBroadcast = useCallback((updated: NotesMap) => {
    setNotesState(updated);
    saveNotes(updated);
    try {
      const channel = new BroadcastChannel('calendar_notes_sync');
      channel.postMessage(updated);
      channel.close();
    } catch {
      // BroadcastChannel not supported
    }
  }, []);

  const addNote = useCallback(
    (dateKey: string, text: string) => {
      const updated = { ...notes, [dateKey]: text };
      persistAndBroadcast(updated);
    },
    [notes, persistAndBroadcast]
  );

  const addNoteToRange = useCallback(
    (start: Date, end: Date, text: string) => {
      const dates = getDatesInRange(start, end);
      const updated = { ...notes };
      dates.forEach((d) => {
        updated[formatDateKey(d)] = text;
      });
      persistAndBroadcast(updated);
    },
    [notes, persistAndBroadcast]
  );

  const deleteNote = useCallback(
    (dateKey: string) => {
      const updated = { ...notes };
      delete updated[dateKey];
      persistAndBroadcast(updated);
    },
    [notes, persistAndBroadcast]
  );

  const deleteNoteFromRange = useCallback(
    (start: Date, end: Date) => {
      const dates = getDatesInRange(start, end);
      const updated = { ...notes };
      dates.forEach((d) => {
        delete updated[formatDateKey(d)];
      });
      persistAndBroadcast(updated);
    },
    [notes, persistAndBroadcast]
  );

  const updateNote = useCallback(
    (dateKey: string, text: string) => {
      if (text.trim() === '') {
        deleteNote(dateKey);
        return;
      }
      addNote(dateKey, text);
    },
    [addNote, deleteNote]
  );

  const hasNote = useCallback(
    (dateKey: string) => dateKey in notes && notes[dateKey].trim() !== '',
    [notes]
  );

  const getNote = useCallback(
    (dateKey: string) => notes[dateKey],
    [notes]
  );

  const setNotes = useCallback(
    (newNotes: NotesMap) => {
      persistAndBroadcast(newNotes);
    },
    [persistAndBroadcast]
  );

  return {
    notes,
    addNote,
    addNoteToRange,
    deleteNote,
    deleteNoteFromRange,
    updateNote,
    hasNote,
    getNote,
    setNotes,
  };
};
