import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function ClinicManageScreen() {
  const clinics = useClinicStore((s) => s.clinics);
  const reorderClinics = useClinicStore((s) => s.reorderClinics);

  const sortedClinics = [...clinics].sort((a, b) => a.order - b.order);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...sortedClinics];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    reorderClinics(newList);
  };

  const moveDown = (index: number) => {
    if (index === sortedClinics.length - 1) return;
    const newList = [...sortedClinics];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    reorderClinics(newList);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          <Text style={styles.backText}>戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>登録医院の管理</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedClinics.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="business-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>登録されている医院はありません</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/clinic/add')}
            >
              <Text style={styles.emptyButtonText}>医院を追加</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.hint}>
              矢印ボタンで表示順を変更できます
            </Text>
            {sortedClinics.map((clinic, index) => (
              <View key={clinic.id} style={styles.clinicRow}>
                {/* Reorder buttons */}
                <View style={styles.reorderButtons}>
                  <TouchableOpacity
                    onPress={() => moveUp(index)}
                    disabled={index === 0}
                    style={styles.arrowButton}
                  >
                    <Ionicons
                      name="chevron-up"
                      size={18}
                      color={index === 0 ? Colors.borderLight : Colors.textTertiary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moveDown(index)}
                    disabled={index === sortedClinics.length - 1}
                    style={styles.arrowButton}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={
                        index === sortedClinics.length - 1
                          ? Colors.borderLight
                          : Colors.textTertiary
                      }
                    />
                  </TouchableOpacity>
                </View>

                {/* Clinic info */}
                <View style={[styles.clinicDot, { backgroundColor: clinic.color }]} />
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>{clinic.name}</Text>
                  <Text style={styles.clinicPatientId}>患者番号: {clinic.patientId}</Text>
                </View>

                {/* Edit button */}
                <TouchableOpacity
                  onPress={() => router.push(`/clinic/${clinic.id}/edit`)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={20} color={Colors.accent} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addRow}
              onPress={() => router.push('/clinic/add')}
            >
              <Ionicons name="add-circle-outline" size={22} color={Colors.accent} />
              <Text style={styles.addRowText}>新しい医院を追加</Text>
            </TouchableOpacity>
          </>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  backText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 10,
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
  hint: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  reorderButtons: {
    gap: 2,
  },
  arrowButton: {
    padding: 2,
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
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  clinicPatientId: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  editButton: {
    padding: 6,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
    marginTop: 4,
  },
  addRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});
