// ========== Clinic & Card ==========

export interface Clinic {
  id: string;
  name: string;
  patientId: string;
  color: string;
  address?: string;
  phone?: string;
  memo?: string;
  order: number;
  createdAt: string;
}

// ========== Appointment ==========

export type ReminderType = 'none' | 'day_before' | 'morning' | 'hour_before';
export type AppointmentSource = 'manual' | 'confirmed';

export interface Appointment {
  id: string;
  clinicId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: string;
  memo?: string;
  reminder: ReminderType;
  notificationId?: string;
  source: AppointmentSource;
  createdAt: string;
}

// ========== History ==========

export interface HistoryRecord {
  id: string;
  clinicId: string;
  date: string; // YYYY-MM-DD
  treatment: string;
  doctor?: string;
  notes?: string;
  createdAt: string;
}

// ========== Profile ==========

export interface Profile {
  name: string;
  birthDate?: string;
  contactPhone?: string;
}

// ========== Settings ==========

export interface AppSettings {
  isOnboarded: boolean;
  biometricEnabled: boolean;
  defaultReminder: ReminderType;
}
