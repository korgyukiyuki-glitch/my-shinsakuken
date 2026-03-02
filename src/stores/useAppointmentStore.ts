import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Appointment, ReminderType } from '../types';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt'>) => string;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  getUpcoming: () => Appointment[];
  getPast: () => Appointment[];
  getByClinic: (clinicId: string) => Appointment[];
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],

      addAppointment: (data) => {
        const id = generateId();
        const appointment: Appointment = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          appointments: [...state.appointments, appointment],
        }));
        return id;
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }));
      },

      getAppointment: (id) => {
        return get().appointments.find((a) => a.id === id);
      },

      getUpcoming: () => {
        const now = new Date().toISOString().slice(0, 10);
        return get()
          .appointments.filter((a) => a.date >= now)
          .sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            return dateCompare !== 0
              ? dateCompare
              : a.time.localeCompare(b.time);
          });
      },

      getPast: () => {
        const now = new Date().toISOString().slice(0, 10);
        return get()
          .appointments.filter((a) => a.date < now)
          .sort((a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            return dateCompare !== 0
              ? dateCompare
              : b.time.localeCompare(a.time);
          });
      },

      getByClinic: (clinicId) => {
        return get().appointments.filter((a) => a.clinicId === clinicId);
      },
    }),
    {
      name: 'appointment-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
