import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Shadows, Radius } from '../../src/constants/design';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useHistoryStore } from '../../src/stores/useHistoryStore';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function HistoryScreen() {
  const records = useHistoryStore((s) => s.records);
  const getClinic = useClinicStore((s) => s.getClinic);

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>診療履歴</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/history-record/add')}
        >
          <Ionicons name="add" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedRecords.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="診療記録がありません"
            actionLabel="記録を追加"
            onAction={() => router.push('/history-record/add')}
          />
        ) : (
          sortedRecords.map((record) => {
            const clinic = getClinic(record.clinicId);
            return (
              <TouchableOpacity
                key={record.id}
                style={styles.recordCard}
                onPress={() => router.push(`/history-record/${record.id}`)}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordDate}>
                      {record.date.replace(/-/g, '/')}
                    </Text>
                    <View style={styles.clinicRow}>
                      <View
                        style={[
                          styles.clinicDot,
                          { backgroundColor: clinic?.color ?? Colors.textTertiary },
                        ]}
                      />
                      <Text style={styles.clinicName}>
                        {clinic?.name ?? '不明な医院'}
                      </Text>
                    </View>
                    <Text style={styles.treatment}>{record.treatment}</Text>
                    {record.doctor && (
                      <Text style={styles.doctor}>
                        <Ionicons name="person-outline" size={11} color={Colors.textTertiary} />{' '}
                        {record.doctor}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Floating add button */}
      {sortedRecords.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/history-record/add')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={Colors.textInverse} />
        </TouchableOpacity>
      )}
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 10,
    paddingBottom: 100,
  },
  recordCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    ...Shadows.sm,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordInfo: {
    flex: 1,
  },
  recordDate: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  clinicDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clinicName: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  treatment: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 6,
  },
  doctor: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});
