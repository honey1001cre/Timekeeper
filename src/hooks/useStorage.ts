import { useState, useEffect } from 'react';

export interface TimeEntry {
  id: string;
  taskName: string;
  startTime: string; // ISO String
  endTime?: string;  // ISO String
  durationSeconds: number;
}

const STORAGE_KEY = 'chronos_time_entries';

export const useStorage = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setEntries(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error('Failed to parse storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addEntry = (entry: TimeEntry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const updateEntry = (updatedEntry: TimeEntry) => {
    const newEntries = entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e));
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  return { entries, addEntry, updateEntry, deleteEntry, isLoaded };
};
