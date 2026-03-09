import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Shadows, Radius } from '../../src/constants/design';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useAppointmentStore } from '../../src/stores/useAppointmentStore';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const getUpcoming = useAppointmentStore((s) => s.getUpcoming);
  const getPast = useAppointmentStore((s) => s.getPast);
  const getClinic = useClinicStore((s) => s.getClinic);

  const appointments = tab === 'upcoming' ? getUpcoming() : getPast();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>予約管理</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/appointment/add')}
        >
          <Ionicons name="add" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
          onPress={() => setTab('upcoming')}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>
            今後の予約
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'past' && styles.tabActive]}
          onPress={() => setTab('past')}
        >
          <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>
            過去の予約
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {appointments.length === 0 ? (
          tab === 'upcoming' ? (
            <EmptyState
              icon="calendar-outline"
              title="予約メモがありません"
              actionLabel="予約を追加"
              onAction={() => router.push('/appointment/add')}
            />
          ) : (
            <EmptyState
              icon="time-outline"
              title="過去の予約はありません"
            />
          )
        ) : (
          appointments.map((appt) => {
            const clinic = getClinic(appt.clinicId);
            return (
              <TouchableOpacity
                key={appt.id}
                style={styles.apptCard}
                onPress={() => router.push(`/appointment/${appt.id}`)}
              >
                <View style={styles.apptHeader}>
                  <View>
                    <Text style={styles.apptDate}>
                      {appt.date.slice(5).replace('-', '/')} {appt.time}
                    </Text>
                    <Text style={styles.apptClinic}>
                      {clinic?.name ?? '不明な医院'}
                    </Text>
                    <Text style={styles.apptType}>{appt.type}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab === 'upcoming' ? '予約中' : '完了'}
                    </Text>
                  </View>
                </View>
                {appt.source === 'manual' && (
                  <View style={styles.sourceTag}>
                    <Ionicons name="pencil" size={10} color={Colors.textTertiary} />
                    <Text style={styles.sourceText}>自分のメモ</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
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
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.navy,
  },
  addButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 10,
  },
  apptCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    ...Shadows.sm,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  apptDate: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  apptClinic: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  apptType: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  badge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  sourceText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
});
