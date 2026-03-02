import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings, ReminderType } from '../types';

interface SettingsState extends AppSettings {
  completeOnboarding: () => void;
  setBiometric: (enabled: boolean) => void;
  setDefaultReminder: (reminder: ReminderType) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      biometricEnabled: false,
      defaultReminder: 'morning' as ReminderType,

      completeOnboarding: () => {
        set({ isOnboarded: true });
      },

      setBiometric: (enabled) => {
        set({ biometricEnabled: enabled });
      },

      setDefaultReminder: (reminder) => {
        set({ defaultReminder: reminder });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
