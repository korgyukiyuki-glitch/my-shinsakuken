import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
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
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>診療記録はまだありません</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/history-record/add')}
            >
              <Text style={styles.emptyButtonText}>診療記録を追加</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedRecords.map((record) => {
            const clinic = getClinic(record.clinicId);
            return (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.recordCard,
                  { borderLeftColor: clinic?.color ?? Colors.border },
                ]}
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
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  emptyButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  recordCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
