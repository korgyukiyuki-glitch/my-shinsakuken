import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Appointment, ReminderType } from '../types';
import { scheduleReminder, cancelReminder } from '../utils/notifications';
import { useClinicStore } from './useClinicStore';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt'>) => Promise<string>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  deleteByClinic: (clinicId: string) => Promise<void>;
  getAppointment: (id: string) => Appointment | undefined;
  getUpcoming: () => Appointment[];
  getPast: () => Appointment[];
  getByClinic: (clinicId: string) => Appointment[];
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 11);

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],

      addAppointment: async (data) => {
        const id = generateId();
        const appointment: Appointment = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };

        // 通知をスケジュール
        const clinicName =
          useClinicStore.getState().getClinic(data.clinicId)?.name ?? '医院';
        const notificationId = await scheduleReminder(appointment, clinicName);
        if (notificationId) {
          appointment.notificationId = notificationId;
        }

        set((state) => ({
          appointments: [...state.appointments, appointment],
        }));
        return id;
      },

      updateAppointment: async (id, updates) => {
        const current = get().appointments.find((a) => a.id === id);

        // 日時・リマインダーが変更された場合、既存通知をキャンセルして再スケジュール
        if (
          current?.notificationId &&
          (updates.date || updates.time || updates.reminder)
        ) {
          await cancelReminder(current.notificationId);
        }

        let newNotificationId: string | undefined;
        if (current && (updates.date || updates.time || updates.reminder)) {
          const merged = { ...current, ...updates };
          const clinicName =
            useClinicStore.getState().getClinic(merged.clinicId)?.name ?? '医院';
          newNotificationId = await scheduleReminder(merged, clinicName);
        }

        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  ...updates,
                  ...(newNotificationId !== undefined
                    ? { notificationId: newNotificationId }
                    : {}),
                }
              : a,
          ),
        }));
      },

      deleteAppointment: async (id) => {
        const appointment = get().appointments.find((a) => a.id === id);
        if (appointment?.notificationId) {
          await cancelReminder(appointment.notificationId);
        }
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }));
      },

      deleteByClinic: async (clinicId) => {
        const toDelete = get().appointments.filter(
          (a) => a.clinicId === clinicId,
        );
        for (const appointment of toDelete) {
          if (appointment.notificationId) {
            await cancelReminder(appointment.notificationId);
          }
        }
        set((state) => ({
          appointments: state.appointments.filter(
            (a) => a.clinicId !== clinicId,
          ),
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
    },
  ),
);
