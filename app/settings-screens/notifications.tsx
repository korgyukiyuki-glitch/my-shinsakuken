import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Radius, Shadows } from '../../src/constants/design';
import { InfoNote } from '../../src/components/ui/InfoNote';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import type { ReminderType } from '../../src/types';

interface ReminderOption {
  value: ReminderType;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const reminderOptions: ReminderOption[] = [
  {
    value: 'day_before',
    label: '前日通知',
    description: '予約の前日にリマインドします',
    icon: 'calendar-outline',
  },
  {
    value: 'morning',
    label: '当日の朝',
    description: '予約当日の朝8時にリマインドします',
    icon: 'sunny-outline',
  },
  {
    value: 'hour_before',
    label: '1時間前',
    description: '予約の1時間前にリマインドします',
    icon: 'alarm-outline',
  },
];

export default function NotificationSettingsScreen() {
  const defaultReminder = useSettingsStore((s) => s.defaultReminder);
  const setDefaultReminder = useSettingsStore((s) => s.setDefaultReminder);

  const isEnabled = (value: ReminderType) => defaultReminder === value;

  const handleToggle = (value: ReminderType) => {
    if (defaultReminder === value) {
      setDefaultReminder('none');
    } else {
      setDefaultReminder(value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          <Text style={styles.backText}>戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知設定</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>デフォルトのリマインダー</Text>
        <Text style={styles.sectionDescription}>
          新しい予約メモを追加するときに使用されるデフォルトのリマインダー設定です。
        </Text>

        <View style={styles.optionsList}>
          {reminderOptions.map((option, index) => (
            <View
              key={option.value}
              style={[
                styles.optionRow,
                index < reminderOptions.length - 1 && styles.optionRowBorder,
              ]}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={20} color={Colors.accent} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Switch
                value={isEnabled(option.value)}
                onValueChange={() => handleToggle(option.value)}
                trackColor={{ false: Colors.border, true: Colors.accent }}
                thumbColor={Colors.surface}
              />
            </View>
          ))}
        </View>

        <View style={styles.currentSetting}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
          <Text style={styles.currentSettingText}>
            現在の設定:{' '}
            {defaultReminder === 'none'
              ? 'なし'
              : reminderOptions.find((o) => o.value === defaultReminder)?.label ?? defaultReminder}
          </Text>
        </View>

        <InfoNote>
          リマインダーはプッシュ通知で送信されます。端末の設定でアプリの通知が有効になっていることをご確認ください。
        </InfoNote>
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.textTertiary,
    lineHeight: 20,
    marginTop: -8,
  },
  optionsList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  currentSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentSettingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
