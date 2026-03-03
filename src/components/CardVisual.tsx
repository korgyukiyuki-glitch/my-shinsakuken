import { View, Text, StyleSheet } from 'react-native';
import type { Clinic } from '../types';
import { DEPARTMENT_CONFIG } from '../types';

interface CardVisualProps {
  clinic: Clinic;
  compact?: boolean;
}

export function CardVisual({ clinic, compact = false }: CardVisualProps) {
  if (compact) {
    return (
      <View style={[styles.compactCard, { backgroundColor: clinic.color }]}>
        <View style={styles.compactHeader}>
          <View>
            <Text style={styles.compactLabel}>{DEPARTMENT_CONFIG[clinic.department ?? 'other'].label}</Text>
            <Text style={styles.compactName}>{clinic.name}</Text>
          </View>
        </View>
        <View style={styles.compactBottom}>
          <View>
            <Text style={styles.compactIdLabel}>患者番号</Text>
            <Text style={styles.compactId}>{clinic.patientId}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: clinic.color }]}>
      <Text style={styles.label}>{DEPARTMENT_CONFIG[clinic.department ?? 'other'].label}</Text>
      <Text style={styles.clinicName}>{clinic.name}</Text>

      <View style={styles.patientIdSection}>
        <Text style={styles.idLabel}>患者番号</Text>
        <Text style={styles.patientId}>{clinic.patientId}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.fieldLabel}>登録日</Text>
          <Text style={styles.fieldValue}>
            {new Date(clinic.createdAt).toLocaleDateString('ja-JP')}
          </Text>
        </View>
        {clinic.phone && (
          <View>
            <Text style={styles.fieldLabel}>電話</Text>
            <Text style={styles.fieldValue}>{clinic.phone}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 24,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
  },
  patientIdSection: {
    marginTop: 24,
  },
  idLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  patientId: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  fieldValue: {
    fontSize: 13,
    color: 'white',
    marginTop: 2,
  },

  // Compact styles
  compactCard: {
    borderRadius: 14,
    padding: 20,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  compactLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  compactName: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    marginTop: 4,
  },
  compactBottom: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  compactIdLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
  },
  compactId: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
});
