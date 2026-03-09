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
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useHistoryStore } from '../../src/stores/useHistoryStore';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { DateInput } from '../../src/components/DateInput';

export default function HistoryRecordAddScreen() {
  const clinics = useClinicStore((s) => s.clinics);
  const addRecord = useHistoryStore((s) => s.addRecord);

  const [selectedClinicId, setSelectedClinicId] = useState(clinics[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [treatment, setTreatment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (clinics.length === 0) {
      Alert.alert('エラー', '先に医院を登録してください');
      return;
    }
    if (!selectedClinicId) {
      Alert.alert('エラー', '医院を選択してください');
      return;
    }
    if (!date) {
      Alert.alert('エラー', '日付を入力してください');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('エラー', '日付の形式が正しくありません（例：2026-03-01）');
      return;
    }
    if (!treatment.trim()) {
      Alert.alert('エラー', '治療内容を入力してください');
      return;
    }

    addRecord({
      clinicId: selectedClinicId,
      date,
      treatment: treatment.trim(),
      doctor: doctor.trim() || undefined,
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
        <Text style={styles.headerTitle}>診療記録を追加</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {/* Clinic selection */}
        <Text style={styles.label}>医院</Text>
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
        <Text style={styles.label}>診療日</Text>
        <DateInput value={date} onChange={setDate} />

        {/* Treatment */}
        <Text style={styles.label}>治療内容</Text>
        <TextInput
          style={styles.input}
          value={treatment}
          onChangeText={setTreatment}
          placeholder="例：クリーニング、虫歯治療"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Doctor (optional) */}
        <Text style={styles.label}>担当医（任意）</Text>
        <TextInput
          style={styles.input}
          value={doctor}
          onChangeText={setDoctor}
          placeholder="例：田中先生"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Notes (optional) */}
        <Text style={styles.label}>メモ（任意）</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="治療の詳細メモなど"
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={3}
        />

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.noteText}>
            この記録はあなたの個人的な診療メモです。正確な診療内容は医院にお問い合わせください。
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
