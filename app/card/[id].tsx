import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { CardVisual } from '../../src/components/CardVisual';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = useClinicStore((s) => s.getClinic(id));

  if (!clinic) {
    return (
      <View style={styles.container}>
        <Text>診察券が見つかりません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          <Text style={styles.backText}>戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/clinic/${id}/edit`)}
        >
          <Ionicons name="create-outline" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card visual */}
        <CardVisual clinic={clinic} />

        {/* QR Code button */}
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push(`/qr/${id}`)}
        >
          <Ionicons name="qr-code" size={22} color={Colors.accent} />
          <Text style={styles.qrButtonText}>受付用QRコードを表示</Text>
        </TouchableOpacity>

        {/* Number display button */}
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => router.push(`/number/${id}`)}
        >
          <Ionicons name="text" size={22} color={Colors.textInverse} />
          <Text style={styles.numberButtonText}>患者番号を大きく表示</Text>
        </TouchableOpacity>

        {/* Clinic info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>医院情報</Text>

          {clinic.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>住所</Text>
                <Text style={styles.infoValue}>{clinic.address}</Text>
              </View>
            </View>
          )}

          {clinic.phone && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${clinic.phone}`)}
            >
              <Ionicons name="call-outline" size={18} color={Colors.textTertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>電話番号</Text>
                <Text style={[styles.infoValue, { color: Colors.accent }]}>
                  {clinic.phone}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
  },
  qrButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
  },
  numberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.navy,
    borderRadius: 14,
    paddingVertical: 14,
  },
  numberButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
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
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});
