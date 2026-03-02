import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryRecord } from '../types';

interface HistoryState {
  records: HistoryRecord[];
  addRecord: (data: Omit<HistoryRecord, 'id' | 'createdAt'>) => string;
  updateRecord: (id: string, updates: Partial<HistoryRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => HistoryRecord | undefined;
  getByClinic: (clinicId: string) => HistoryRecord[];
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (data) => {
        const id = generateId();
        const record: HistoryRecord = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ records: [...state.records, record] }));
        return id;
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
      },

      getRecord: (id) => {
        return get().records.find((r) => r.id === id);
      },

      getByClinic: (clinicId) => {
        return get()
          .records.filter((r) => r.clinicId === clinicId)
          .sort((a, b) => b.date.localeCompare(a.date));
      },
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
