import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAppointmentStore } from '../../src/stores/useAppointmentStore';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { DateInput } from '../../src/components/DateInput';
import { TimeInput } from '../../src/components/TimeInput';
import type { ReminderType } from '../../src/types';

const reminderOptions: { value: ReminderType; label: string }[] = [
  { value: 'none', label: 'なし' },
  { value: 'day_before', label: '前日' },
  { value: 'morning', label: '当日の朝' },
  { value: 'hour_before', label: '1時間前' },
];

export default function AppointmentAddScreen() {
  const clinics = useClinicStore((s) => s.clinics);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);

  const [selectedClinicId, setSelectedClinicId] = useState(clinics[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');
  const [memo, setMemo] = useState('');
  const [reminder, setReminder] = useState<ReminderType>('morning');

  const handleSave = async () => {
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
      Alert.alert('エラー', '日付の形式が正しくありません（例：2026-04-15）');
      return;
    }
    if (!time) {
      Alert.alert('エラー', '時間を選択してください');
      return;
    }

    await addAppointment({
      clinicId: selectedClinicId,
      date,
      time,
      type: type || '診察',
      memo: memo || undefined,
      reminder,
      source: 'manual',
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>予約メモを追加</Text>
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

        {/* Date & time */}
        <Text style={styles.label}>日付</Text>
        <DateInput value={date} onChange={setDate} />

        <Text style={styles.label}>時間</Text>
        <TimeInput value={time} onChange={setTime} />

        {/* Type */}
        <Text style={styles.label}>内容</Text>
        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder="例：定期検診、クリーニング"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Memo */}
        <Text style={styles.label}>メモ</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={memo}
          onChangeText={setMemo}
          placeholder="メモ（任意）"
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={3}
        />

        {/* Reminder */}
        <Text style={styles.label}>リマインダー</Text>
        <View style={styles.reminderList}>
          {reminderOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.reminderChip,
                reminder === opt.value && styles.reminderChipActive,
              ]}
              onPress={() => setReminder(opt.value)}
            >
              <Text
                style={[
                  styles.reminderText,
                  reminder === opt.value && styles.reminderTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.noteText}>
            この予約メモはあなたの個人的な記録です。医院の予約台帳とは連動しません。
          </Text>
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
  reminderList: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  reminderChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  reminderText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  reminderTextActive: {
    color: 'white',
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
