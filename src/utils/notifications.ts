import * as Notifications from 'expo-notifications';
import type { ReminderType } from '../types';

/**
 * 通知ハンドラーの設定（モジュールレベルで1回呼ぶ）
 */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * 通知権限をリクエスト。許可済みなら即 true を返す。
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * 予約日時とリマインダー種別から通知トリガー日時を算出
 * 過去の日時なら null を返す（スケジュールしない）
 */
export function calculateTriggerDate(
  date: string, // YYYY-MM-DD
  time: string, // HH:mm
  reminderType: ReminderType,
): Date | null {
  if (reminderType === 'none') return null;

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  if (!year || !month || !day) return null;

  const appointmentDate = new Date(year, month - 1, day, hour || 0, minute || 0);

  let triggerDate: Date;

  switch (reminderType) {
    case 'day_before':
      // 前日 18:00
      triggerDate = new Date(year, month - 1, day - 1, 18, 0);
      break;
    case 'morning':
      // 当日 08:00
      triggerDate = new Date(year, month - 1, day, 8, 0);
      break;
    case 'hour_before':
      // 予約1時間前
      triggerDate = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
      break;
    default:
      return null;
  }

  // 過去の日時ならスケジュールしない
  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  return triggerDate;
}

/**
 * 通知をスケジュール。notificationId を返す。
 * スケジュール不要（none / 過去日時 / 権限なし）なら undefined を返す。
 */
export async function scheduleReminder(
  appointment: {
    id: string;
    date: string;
    time: string;
    type: string;
    reminder: ReminderType;
  },
  clinicName: string,
): Promise<string | undefined> {
  if (appointment.reminder === 'none') return undefined;

  const triggerDate = calculateTriggerDate(
    appointment.date,
    appointment.time,
    appointment.reminder,
  );
  if (!triggerDate) return undefined;

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return undefined;

  const title = getNotificationTitle(appointment.reminder, clinicName);
  const body = `${appointment.time} ${appointment.type}`;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { appointmentId: appointment.id },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return notificationId;
}

/**
 * スケジュール済みの通知をキャンセル
 */
export async function cancelReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // 通知が既に発火済み or クリア済みの場合は無視
  }
}

// ========== 内部ヘルパー ==========

function getNotificationTitle(
  reminderType: ReminderType,
  clinicName: string,
): string {
  switch (reminderType) {
    case 'day_before':
      return `明日は${clinicName}の予約があります`;
    case 'morning':
      return `本日${clinicName}の予約があります`;
    case 'hour_before':
      return `まもなく${clinicName}の予約です`;
    default:
      return '予約リマインダー';
  }
}
