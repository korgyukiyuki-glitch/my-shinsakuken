import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useMedicationStore } from '../../src/stores/useMedicationStore';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const medication = useMedicationStore((s) => s.getMedication(id!));
  const deleteMedication = useMedicationStore((s) => s.deleteMedication);
  const getClinic = useClinicStore((s) => s.getClinic);

  if (!medication) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            <Text style={styles.backText}>戻る</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>記録が見つかりません</Text>
        </View>
      </View>
    );
  }

  const clinic = getClinic(medication.clinicId);

  const handleDelete = () => {
    Alert.alert(
      'お薬記録を削除',
      'このお薬記録を削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            deleteMedication(medication.id);
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
        {/* Date header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{medication.date.replace(/-/g, '/')}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>お薬記録</Text>
          </View>
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={18} color={Colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>処方元</Text>
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
            <Ionicons name="medical-outline" size={18} color={Colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>薬品名</Text>
              <Text style={styles.infoValue}>{medication.medicineName}</Text>
            </View>
          </View>

          {medication.dosage && (
            <View style={styles.infoRow}>
              <Ionicons name="flask-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>用量</Text>
                <Text style={styles.infoValue}>{medication.dosage}</Text>
              </View>
            </View>
          )}

          {medication.frequency && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>用法</Text>
                <Text style={styles.infoValue}>{medication.frequency}</Text>
              </View>
            </View>
          )}

          {medication.duration && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>日数</Text>
                <Text style={styles.infoValue}>{medication.duration}</Text>
              </View>
            </View>
          )}

          {medication.prescribedBy && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>処方医</Text>
                <Text style={styles.infoValue}>{medication.prescribedBy}</Text>
              </View>
            </View>
          )}

          {medication.notes && (
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Ionicons name="document-text-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>メモ</Text>
                <Text style={styles.infoValue}>{medication.notes}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Metadata */}
        <Text style={styles.meta}>
          記録日時: {new Date(medication.createdAt).toLocaleDateString('ja-JP')}
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
    alignItems: 'center',
  },
  dateText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
  },
  badge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
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
  meta: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
