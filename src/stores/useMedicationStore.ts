import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Medication } from '../types';

interface MedicationState {
  medications: Medication[];
  addMedication: (data: Omit<Medication, 'id' | 'createdAt'>) => string;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  deleteByClinic: (clinicId: string) => void;
  getMedication: (id: string) => Medication | undefined;
  getByClinic: (clinicId: string) => Medication[];
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 11);

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set, get) => ({
      medications: [],

      addMedication: (data) => {
        const id = generateId();
        const medication: Medication = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ medications: [...state.medications, medication] }));
        return id;
      },

      updateMedication: (id, updates) => {
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      deleteMedication: (id) => {
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        }));
      },

      deleteByClinic: (clinicId) => {
        set((state) => ({
          medications: state.medications.filter((m) => m.clinicId !== clinicId),
        }));
      },

      getMedication: (id) => {
        return get().medications.find((m) => m.id === id);
      },

      getByClinic: (clinicId) => {
        return get()
          .medications.filter((m) => m.clinicId === clinicId)
          .sort((a, b) => b.date.localeCompare(a.date));
      },
    }),
    {
      name: 'medication-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
