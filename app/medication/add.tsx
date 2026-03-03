import { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MlkitOcr from 'rn-mlkit-ocr';
import { Colors } from '../../src/constants/colors';
import { useMedicationStore } from '../../src/stores/useMedicationStore';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { parseMedicationFromOcr } from '../../src/utils/parseMedicationOcr';
import { DateInput } from '../../src/components/DateInput';

export default function MedicationAddScreen() {
  const clinics = useClinicStore((s) => s.clinics);
  const addMedication = useMedicationStore((s) => s.addMedication);

  const [selectedClinicId, setSelectedClinicId] = useState(clinics[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'カメラの許可が必要です',
          'お薬シールを撮影するにはカメラへのアクセスを許可してください'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      setIsScanning(true);

      const ocrResult = await MlkitOcr.recognizeText(result.assets[0].uri, 'japanese');
      const rawText = ocrResult.text;

      if (!rawText.trim()) {
        Alert.alert(
          'テキストが検出されませんでした',
          'シールがはっきり写るように、もう一度撮影してみてください'
        );
        setIsScanning(false);
        return;
      }

      const parsed = parseMedicationFromOcr(rawText);

      if (parsed.date) setDate(parsed.date);
      if (parsed.medicineName) setMedicineName(parsed.medicineName);
      if (parsed.dosage) setDosage(parsed.dosage);
      if (parsed.frequency) setFrequency(parsed.frequency);
      if (parsed.duration) setDuration(parsed.duration);
      if (parsed.prescribedBy) setPrescribedBy(parsed.prescribedBy);

      if (parsed.clinicName) {
        const matched = clinics.find(
          (c) => c.name.includes(parsed.clinicName!) || parsed.clinicName!.includes(c.name)
        );
        if (matched) setSelectedClinicId(matched.id);
      }

      Alert.alert(
        'スキャン完了',
        '読み取り結果をフォームに反映しました。内容を確認・修正してください。'
      );
    } catch (error) {
      console.error('OCR scan error:', error);
      Alert.alert(
        'スキャンエラー',
        'テキストの読み取りに失敗しました。手入力で記録してください。'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = () => {
    if (!selectedClinicId) {
      Alert.alert('エラー', '医院を選択してください');
      return;
    }
    if (!date) {
      Alert.alert('エラー', '処方日を入力してください（例：2026-03-01）');
      return;
    }
    if (!medicineName.trim()) {
      Alert.alert('エラー', '薬品名を入力してください');
      return;
    }

    addMedication({
      clinicId: selectedClinicId,
      date,
      medicineName: medicineName.trim(),
      dosage: dosage.trim() || undefined,
      frequency: frequency.trim() || undefined,
      duration: duration.trim() || undefined,
      prescribedBy: prescribedBy.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>お薬を追加</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {/* Scan button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScan}
          disabled={isScanning}
          activeOpacity={0.7}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <Ionicons name="camera-outline" size={20} color={Colors.accent} />
          )}
          <Text style={styles.scanButtonText}>
            {isScanning ? '読み取り中...' : 'お薬シールをスキャン'}
          </Text>
        </TouchableOpacity>

        {/* Clinic selection */}
        <Text style={styles.label}>処方元の医院</Text>
        <View style={styles.clinicList}>
          {clinics.map((clinic) => (
            <TouchableOpacity
              key={clinic.id}
              style={[
                styles.clinicChip,
                selectedClinicId === clinic.id && {
                  backgroundColor: clinic.color,
                  borderColor: clinic.color,
                },
              ]}
              onPress={() => setSelectedClinicId(clinic.id)}
            >
              <Text
                style={[
                  styles.clinicChipText,
                  selectedClinicId === clinic.id && { color: 'white' },
                ]}
              >
                {clinic.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {clinics.length === 0 && (
          <Text style={styles.noClinic}>
            先に医院を登録してください
          </Text>
        )}

        {/* Date */}
        <Text style={styles.label}>処方日</Text>
        <DateInput value={date} onChange={setDate} />

        {/* Medicine name */}
        <Text style={styles.label}>薬品名</Text>
        <TextInput
          style={styles.input}
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="例：ロキソニン錠60mg"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Dosage */}
        <Text style={styles.label}>用量（任意）</Text>
        <TextInput
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
          placeholder="例：1錠"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Frequency */}
        <Text style={styles.label}>用法（任意）</Text>
        <TextInput
          style={styles.input}
          value={frequency}
          onChangeText={setFrequency}
          placeholder="例：1日3回 毎食後"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Duration */}
        <Text style={styles.label}>日数（任意）</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="例：14日分"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Prescribed by */}
        <Text style={styles.label}>処方医（任意）</Text>
        <TextInput
          style={styles.input}
          value={prescribedBy}
          onChangeText={setPrescribedBy}
          placeholder="例：田中先生"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Notes */}
        <Text style={styles.label}>メモ（任意）</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="副作用の注意点、飲み合わせなど"
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={3}
        />

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.noteText}>
            この記録はあなたの個人的なお薬メモです。正確な処方内容は医院・薬局にお問い合わせください。
          </Text>
        </View>
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
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 12,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  scanButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  clinicList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  clinicChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  clinicChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  noClinic: {
    fontSize: 13,
    color: Colors.error,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textTertiary,
    flex: 1,
    lineHeight: 18,
  },
});
