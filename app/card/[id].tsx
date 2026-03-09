import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { CardVisual } from '../../src/components/CardVisual';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = useClinicStore((s) => s.getClinic(id!));
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

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

        {/* Card photo */}
        {clinic.cardImageUri && !imageError && (
          <TouchableOpacity
            style={styles.cardPhotoContainer}
            onPress={() => setImageModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: clinic.cardImageUri }}
              style={styles.cardPhoto}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
            <View style={styles.cardPhotoOverlay}>
              <Ionicons name="expand-outline" size={16} color="#fff" />
              <Text style={styles.cardPhotoHint}>タップで拡大</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* QR Code button */}
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push(`/qr/${id}`)}
        >
          <Ionicons name="qr-code" size={22} color={Colors.accent} />
          <Text style={styles.qrButtonText}>受付用コードを表示</Text>
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

      {/* Fullscreen image modal */}
      {clinic.cardImageUri && (
        <Modal
          visible={imageModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Ionicons name="close-circle" size={36} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: clinic.cardImageUri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
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
  cardPhotoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardPhoto: {
    width: '100%',
    height: 200,
  },
  cardPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopLeftRadius: 8,
  },
  cardPhotoHint: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  modalImage: {
    width: SCREEN_WIDTH - 20,
    height: SCREEN_HEIGHT * 0.7,
  },
});
