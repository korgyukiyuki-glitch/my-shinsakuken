import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { Colors } from '../../../src/constants/colors';
import { useClinicStore } from '../../../src/stores/useClinicStore';
import { useAppointmentStore } from '../../../src/stores/useAppointmentStore';
import { useHistoryStore } from '../../../src/stores/useHistoryStore';
import { useMedicationStore } from '../../../src/stores/useMedicationStore';
import { ColorPicker } from '../../../src/components/ColorPicker';
import { Department, DEPARTMENT_CONFIG } from '../../../src/types';

const DEPARTMENTS = Object.entries(DEPARTMENT_CONFIG) as [Department, { label: string; icon: string }][];

export default function ClinicEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = useClinicStore((s) => s.getClinic(id!));
  const updateClinic = useClinicStore((s) => s.updateClinic);
  const deleteClinic = useClinicStore((s) => s.deleteClinic);
  const deleteAppointmentsByClinic = useAppointmentStore((s) => s.deleteByClinic);
  const deleteHistoryByClinic = useHistoryStore((s) => s.deleteByClinic);
  const deleteMedicationsByClinic = useMedicationStore((s) => s.deleteByClinic);

  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [department, setDepartment] = useState<Department>('internal');
  const [color, setColor] = useState<string>(Colors.cardColors[0]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [closedDays, setClosedDays] = useState('');
  const [cardImageUri, setCardImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (clinic) {
      setName(clinic.name);
      setPatientId(clinic.patientId);
      setDepartment(clinic.department ?? 'other');
      setColor(clinic.color);
      setAddress(clinic.address ?? '');
      setPhone(clinic.phone ?? '');
      setBusinessHours(clinic.businessHours ?? '');
      setClosedDays(clinic.closedDays ?? '');
      setCardImageUri(clinic.cardImageUri ?? null);
    }
  }, [clinic]);

  if (!clinic) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            <Text style={styles.backText}>戻る</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>医院が見つかりません</Text>
        </View>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    try {
      const result = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      if (!result.scannedImages || result.scannedImages.length === 0) return;

      const scannedUri = result.scannedImages[0];

      // 新しい写真をドキュメントディレクトリに保存
      const filename = `clinic_card_${Date.now()}.jpg`;
      const destUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.copyAsync({ from: scannedUri, to: destUri });

      // 古い写真を削除
      if (cardImageUri) {
        try {
          await FileSystem.deleteAsync(cardImageUri, { idempotent: true });
        } catch {
          // 古いファイル削除に失敗しても続行
        }
      }

      setCardImageUri(destUri);
    } catch (error) {
      console.error('Document scan error:', error);
      Alert.alert(
        '撮影エラー',
        '写真の撮影に失敗しました。もう一度お試しください。'
      );
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('入力エラー', '医院名を入力してください');
      return;
    }
    if (!patientId.trim()) {
      Alert.alert('入力エラー', '患者番号を入力してください');
      return;
    }

    updateClinic(id, {
      name: name.trim(),
      patientId: patientId.trim(),
      department,
      color,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      cardImageUri: cardImageUri || undefined,
      closedDays: closedDays.trim() || undefined,
      businessHours: businessHours.trim() || undefined,
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      '医院を削除',
      `「${clinic.name}」を削除しますか？関連する予約メモ・診療記録・お薬記録もすべて削除されます。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteAppointmentsByClinic(id!);
            deleteHistoryByClinic(id!);
            deleteMedicationsByClinic(id!);
            deleteClinic(id!);
            router.dismissAll();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          <Text style={styles.backText}>戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>医院を編集</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {/* Photo capture */}
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
        >
          {cardImageUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image
                source={{ uri: cardImageUri }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
              <View style={styles.photoOverlay}>
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.photoOverlayText}>再撮影</Text>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color={Colors.accent} />
              <Text style={styles.photoButtonText}>診察券を撮影</Text>
              <Text style={styles.photoHint}>影の補正・台形補正を自動で行います</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Required fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>必須情報</Text>

          <Text style={styles.label}>診療科目</Text>
          <View style={styles.departmentGrid}>
            {DEPARTMENTS.map(([key, { label, icon }]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.departmentChip,
                  department === key && styles.departmentChipActive,
                ]}
                onPress={() => setDepartment(key)}
              >
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={department === key ? '#fff' : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.departmentLabel,
                    department === key && styles.departmentLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>医院名</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="例：さくらクリニック"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>患者番号</Text>
          <TextInput
            style={styles.input}
            value={patientId}
            onChangeText={setPatientId}
            placeholder="例：S-20240315"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>カードの色</Text>
          <ColorPicker selected={color} onSelect={setColor} />
        </View>

        {/* Optional fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>任意情報</Text>

          <Text style={styles.label}>住所</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="例：東京都渋谷区神南1-2-3"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>電話番号</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="例：03-1234-5678"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>診療時間</Text>
          <TextInput
            style={styles.input}
            value={businessHours}
            onChangeText={setBusinessHours}
            placeholder="例：9:00〜12:00 / 14:00〜18:00"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>休診日</Text>
          <TextInput
            style={styles.input}
            value={closedDays}
            onChangeText={setClosedDays}
            placeholder="例：木曜・日曜・祝日"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Delete button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteButtonText}>この医院を削除</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
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
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.error,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  departmentChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  departmentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  departmentLabelActive: {
    color: '#fff',
  },
  photoButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
    backgroundColor: Colors.accentLight,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
  photoHint: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  photoPreviewContainer: {
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 180,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
  },
  photoOverlayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});
