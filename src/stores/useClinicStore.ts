import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Clinic } from '../types';

interface ClinicState {
  clinics: Clinic[];
  addClinic: (clinic: Omit<Clinic, 'id' | 'order' | 'createdAt'>) => string;
  updateClinic: (id: string, updates: Partial<Clinic>) => void;
  deleteClinic: (id: string) => void;
  reorderClinics: (clinics: Clinic[]) => void;
  getClinic: (id: string) => Clinic | undefined;
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      clinics: [],

      addClinic: (clinicData) => {
        const id = generateId();
        const clinic: Clinic = {
          ...clinicData,
          id,
          order: get().clinics.length,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ clinics: [...state.clinics, clinic] }));
        return id;
      },

      updateClinic: (id, updates) => {
        set((state) => ({
          clinics: state.clinics.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteClinic: (id) => {
        set((state) => ({
          clinics: state.clinics
            .filter((c) => c.id !== id)
            .map((c, i) => ({ ...c, order: i })),
        }));
      },

      reorderClinics: (clinics) => {
        set({ clinics: clinics.map((c, i) => ({ ...c, order: i })) });
      },

      getClinic: (id) => {
        return get().clinics.find((c) => c.id === id);
      },
    }),
    {
      name: 'clinic-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
