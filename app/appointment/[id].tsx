import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAppointmentStore } from '../../src/stores/useAppointmentStore';
import { useClinicStore } from '../../src/stores/useClinicStore';

const reminderLabels: Record<string, string> = {
  none: 'なし',
  day_before: '前日',
  morning: '当日の朝',
  hour_before: '1時間前',
};

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = useAppointmentStore((s) => s.getAppointment(id!));
  const deleteAppointment = useAppointmentStore((s) => s.deleteAppointment);
  const getClinic = useClinicStore((s) => s.getClinic);

  if (!appointment) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            <Text style={styles.backText}>戻る</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>予約が見つかりません</Text>
        </View>
      </View>
    );
  }

  const clinic = getClinic(appointment.clinicId);
  const isUpcoming = appointment.date >= new Date().toISOString().slice(0, 10);

  const handleDelete = () => {
    Alert.alert(
      '予約メモを削除',
      'この予約メモを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteAppointment(appointment.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          <Text style={styles.backText}>戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & time header */}
        <View style={styles.dateHeader}>
          <View>
            <Text style={styles.dateText}>
              {appointment.date.replace(/-/g, '/')}
            </Text>
            <Text style={styles.timeText}>{appointment.time}</Text>
          </View>
          <View style={styles.badges}>
            <View style={[styles.badge, isUpcoming ? styles.badgeUpcoming : styles.badgePast]}>
              <Text style={[styles.badgeText, isUpcoming ? styles.badgeTextUpcoming : styles.badgeTextPast]}>
                {isUpcoming ? '予約中' : '完了'}
              </Text>
            </View>
            {appointment.source === 'manual' && (
              <View style={styles.memoBadge}>
                <Ionicons name="pencil" size={10} color={Colors.textTertiary} />
                <Text style={styles.memoBadgeText}>メモ</Text>
              </View>
            )}
          </View>
        </View>

        {/* Appointment info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={18} color={Colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>医院</Text>
              <View style={styles.clinicRow}>
                <View
                  style={[
                    styles.clinicDot,
                    { backgroundColor: clinic?.color ?? Colors.textTertiary },
                  ]}
                />
                <Text style={styles.infoValue}>
                  {clinic?.name ?? '不明な医院'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={18} color={Colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>内容</Text>
              <Text style={styles.infoValue}>{appointment.type}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="notifications-outline" size={18} color={Colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>リマインダー</Text>
              <Text style={styles.infoValue}>
                {reminderLabels[appointment.reminder] ?? appointment.reminder}
              </Text>
            </View>
          </View>

          {appointment.memo && (
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Ionicons name="document-text-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>メモ</Text>
                <Text style={styles.infoValue}>{appointment.memo}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Note about manual entries */}
        {appointment.source === 'manual' && (
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.textTertiary} />
            <Text style={styles.noteText}>
              この予約メモはあなたの個人的な記録です。医院の予約台帳とは連動しません。
            </Text>
          </View>
        )}

        {/* Metadata */}
        <Text style={styles.meta}>
          記録日時: {new Date(appointment.createdAt).toLocaleDateString('ja-JP')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeUpcoming: {
    backgroundColor: Colors.accentLight,
  },
  badgePast: {
    backgroundColor: Colors.borderLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextUpcoming: {
    color: Colors.accent,
  },
  badgeTextPast: {
    color: Colors.textTertiary,
  },
  memoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.borderLight,
  },
  memoBadgeText: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  clinicDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
    padding: 12,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textTertiary,
    flex: 1,
    lineHeight: 18,
  },
  meta: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
