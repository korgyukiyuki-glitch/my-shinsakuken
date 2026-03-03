// ========== Department ==========

export type Department =
  | 'dental'       // 歯科
  | 'internal'     // 内科
  | 'ophthalmology' // 眼科
  | 'dermatology'  // 皮膚科
  | 'orthopedics'  // 整形外科
  | 'ent'          // 耳鼻咽喉科
  | 'pediatrics'   // 小児科
  | 'obgyn'        // 産婦人科
  | 'other';       // その他

export const DEPARTMENT_CONFIG: Record<Department, { label: string; icon: string }> = {
  dental:        { label: '歯科',       icon: 'medical' },
  internal:      { label: '内科',       icon: 'fitness' },
  ophthalmology: { label: '眼科',       icon: 'eye' },
  dermatology:   { label: '皮膚科',     icon: 'hand-left' },
  orthopedics:   { label: '整形外科',   icon: 'body' },
  ent:           { label: '耳鼻咽喉科', icon: 'ear' },
  pediatrics:    { label: '小児科',     icon: 'happy' },
  obgyn:         { label: '産婦人科',   icon: 'heart' },
  other:         { label: 'その他',     icon: 'medkit' },
};

// ========== Clinic & Card ==========

export interface BusinessHours {
  morning?: string;  // e.g. "9:00〜12:00"
  afternoon?: string; // e.g. "14:00〜18:00"
  closed?: boolean;   // true = 休診
}

export interface Clinic {
  id: string;
  name: string;
  patientId: string;
  department: Department;
  color: string;
  address?: string;
  phone?: string;
  memo?: string;
  businessHours?: {
    mon?: BusinessHours;
    tue?: BusinessHours;
    wed?: BusinessHours;
    thu?: BusinessHours;
    fri?: BusinessHours;
    sat?: BusinessHours;
    sun?: BusinessHours;
  };
  closedDays?: string; // e.g. "木曜・日曜・祝日"
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
