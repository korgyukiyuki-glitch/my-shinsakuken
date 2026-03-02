import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { useAppointmentStore } from '../../src/stores/useAppointmentStore';

export default function HomeScreen() {
  const clinics = useClinicStore((s) => s.clinics);
  const getUpcoming = useAppointmentStore((s) => s.getUpcoming);
  const getClinic = useClinicStore((s) => s.getClinic);
  const upcoming = getUpcoming();
  const nextAppt = upcoming[0];
  const nextClinic = nextAppt ? getClinic(nextAppt.clinicId) : undefined;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="medical" size={28} color={Colors.accent} />
          <Text style={styles.appName}>マイ診察券</Text>
        </View>
      </View>
      <Text style={styles.tagline}>あなたの歯科情報をひとつに</Text>

      {/* Next appointment card */}
      {nextAppt && nextClinic ? (
        <TouchableOpacity
          style={styles.nextApptCard}
          onPress={() => router.push('/appointments')}
          activeOpacity={0.9}
        >
          <Text style={styles.nextApptLabel}>次回の予約</Text>
          <View style={styles.nextApptRow}>
            <View>
              <Text style={styles.nextApptDate}>
                {nextAppt.date.slice(5).replace('-', '/')} {nextAppt.time}
              </Text>
              <Text style={styles.nextApptClinic}>{nextClinic.name}</Text>
              <Text style={styles.nextApptType}>{nextAppt.type}</Text>
            </View>
            <View style={styles.nextApptDay}>
              <Text style={styles.nextApptDayNum}>
                {parseInt(nextAppt.date.slice(8))}
              </Text>
              <Text style={styles.nextApptMonth}>
                {parseInt(nextAppt.date.slice(5, 7))}月
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyApptCard}>
          <Ionicons name="calendar-outline" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>予約はまだありません</Text>
        </View>
      )}

      {/* Quick actions */}
      <View style={styles.quickActions}>
        {[
          { icon: 'card' as const, label: '診察券を表示', onPress: () => router.push('/cards') },
          { icon: 'calendar' as const, label: '予約一覧', onPress: () => router.push('/appointments') },
          { icon: 'document-text' as const, label: '診療履歴', onPress: () => router.push('/history') },
          { icon: 'add-circle' as const, label: '医院を追加', onPress: () => router.push('/clinic/add') },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <Ionicons name={action.icon} size={24} color={Colors.accent} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Registered clinics */}
      {clinics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>登録医院</Text>
          {clinics.map((clinic) => (
            <TouchableOpacity
              key={clinic.id}
              style={styles.clinicRow}
              onPress={() => router.push(`/card/${clinic.id}`)}
            >
              <View style={[styles.clinicDot, { backgroundColor: clinic.color }]} />
              <View style={styles.clinicInfo}>
                <Text style={styles.clinicName}>{clinic.name}</Text>
                {clinic.address && (
                  <Text style={styles.clinicAddress}>{clinic.address}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Empty state */}
      {clinics.length === 0 && (
        <TouchableOpacity
          style={styles.emptyState}
          onPress={() => router.push('/clinic/add')}
        >
          <Ionicons name="add-circle-outline" size={48} color={Colors.accent} />
          <Text style={styles.emptyTitle}>医院を登録しましょう</Text>
          <Text style={styles.emptyDesc}>
            通っている歯科医院の診察券を追加して、アプリで管理しましょう
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: -8,
  },

  // Next appointment
  nextApptCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.accent,
  },
  nextApptLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  nextApptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextApptDate: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  nextApptClinic: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  nextApptType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  nextApptDay: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 56,
  },
  nextApptDayNum: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  nextApptMonth: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  emptyApptCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textTertiary,
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  // Clinics section
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clinicDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  clinicAddress: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
