import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { CardVisual } from '../../src/components/CardVisual';
import { Department, DEPARTMENT_CONFIG } from '../../src/types';

export default function CardsScreen() {
  const clinics = useClinicStore((s) => s.clinics);

  const grouped = useMemo(() => {
    const groups: Partial<Record<Department, typeof clinics>> = {};
    const sorted = [...clinics].sort((a, b) => a.order - b.order);

    for (const clinic of sorted) {
      const dept = clinic.department ?? 'other';
      if (!groups[dept]) groups[dept] = [];
      groups[dept]!.push(clinic);
    }

    // Sort groups by DEPARTMENT_CONFIG order
    const deptOrder = Object.keys(DEPARTMENT_CONFIG) as Department[];
    return deptOrder
      .filter((dept) => groups[dept] && groups[dept]!.length > 0)
      .map((dept) => ({
        department: dept,
        config: DEPARTMENT_CONFIG[dept],
        clinics: groups[dept]!,
      }));
  }, [clinics]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>マイ診察券</Text>
        <Text style={styles.subtitle}>タップして詳細・QRコードを表示</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {grouped.map(({ department, config, clinics: deptClinics }) => (
          <View key={department} style={styles.group}>
            <View style={styles.groupHeader}>
              <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={18} color={Colors.accent} />
              <Text style={styles.groupTitle}>{config.label}</Text>
              <Text style={styles.groupCount}>{deptClinics.length}</Text>
            </View>
            {deptClinics.map((clinic) => (
              <TouchableOpacity
                key={clinic.id}
                onPress={() => router.push(`/card/${clinic.id}`)}
                activeOpacity={0.9}
              >
                <CardVisual clinic={clinic} compact />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/clinic/add')}
        >
          <Ionicons name="add" size={28} color={Colors.textTertiary} />
          <Text style={styles.addText}>新しい医院の診察券を追加</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.navy,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 20,
  },
  group: {
    gap: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  groupCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  addText: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
});
