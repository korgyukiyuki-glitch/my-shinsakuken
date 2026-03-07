import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface TimeInputProps {
  value: string; // HH:mm
  onChange: (time: string) => void;
  placeholder?: string;
}

function parseToDate(timeStr: string): Date {
  const date = new Date();
  if (timeStr) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      date.setHours(parts[0], parts[1], 0, 0);
    }
  }
  return date;
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function TimeInput({ value, onChange, placeholder = '時間を選択' }: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handlePickerChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(formatTime(selectedDate));
    }
  };

  const handleConfirm = () => {
    if (!value) {
      onChange(formatTime(new Date()));
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(!showPicker)}
        activeOpacity={0.7}
      >
        <Ionicons name="time-outline" size={18} color={Colors.accent} />
        <Text style={[styles.timeText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={showPicker ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Colors.textTertiary}
        />
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={parseToDate(value)}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePickerChange}
            locale="ja-JP"
            minuteInterval={5}
            style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>決定</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  placeholderText: {
    color: Colors.textTertiary,
    fontWeight: '400',
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  iosPicker: {
    height: 180,
  },
  confirmButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.accentLight,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
});
