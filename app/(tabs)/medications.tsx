import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useMedicationStore } from '../../src/stores/useMedicationStore';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function MedicationsScreen() {
  const medications = useMedicationStore((s) => s.medications);
  const getClinic = useClinicStore((s) => s.getClinic);

  const sortedMedications = [...medications].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>お薬手帳</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/medication/add')}
        >
          <Ionicons name="add" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedMedications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="medical-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>お薬の記録はまだありません</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/medication/add')}
            >
              <Text style={styles.emptyButtonText}>お薬を追加</Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedMedications.map((med) => {
            const clinic = getClinic(med.clinicId);
            return (
              <TouchableOpacity
                key={med.id}
                style={[
                  styles.recordCard,
                  { borderLeftColor: clinic?.color ?? Colors.border },
                ]}
                onPress={() => router.push(`/medication/${med.id}`)}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordDate}>
                      {med.date.replace(/-/g, '/')}
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
                    <Text style={styles.medicineName}>{med.medicineName}</Text>
                    {med.dosage && med.frequency && (
                      <Text style={styles.dosageInfo}>
                        {med.dosage} / {med.frequency}
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

      {sortedMedications.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/medication/add')}
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
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  dosageInfo: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
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
