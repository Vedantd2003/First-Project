const NOTES_KEY = 'calendar_notes_v1';
const THEME_KEY = 'calendar_theme_v1';

export type NotesMap = Record<string, string>;

export const loadNotes = (): NotesMap => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as NotesMap;
  } catch {
    return {};
  }
};

export const saveNotes = (notes: NotesMap): void => {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    console.warn('Failed to save notes to localStorage');
  }
};

export const exportNotesAsJSON = (notes: NotesMap): void => {
  const blob = new Blob([JSON.stringify(notes, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calendar-notes.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const importNotesFromJSON = (
  file: File,
  callback: (notes: NotesMap) => void
): void => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string) as NotesMap;
      callback(data);
    } catch {
      console.warn('Failed to parse imported notes');
    }
  };
  reader.readAsText(file);
};

export const loadThemeMode = (): 'light' | 'dark' => {
  try {
    const mode = localStorage.getItem(THEME_KEY);
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    // Respect system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  } catch {
    return 'light';
  }
};

export const saveThemeMode = (mode: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    console.warn('Failed to save theme mode');
  }
};
