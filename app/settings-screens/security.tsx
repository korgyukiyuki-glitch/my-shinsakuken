import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors } from '../../src/constants/colors';
import { useSettingsStore } from '../../src/stores/useSettingsStore';

export default function SecuritySettingsScreen() {
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const setBiometric = useSettingsStore((s) => s.setBiometric);

  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('生体認証');

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsAvailable(compatible && enrolled);

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Touch ID');
      }
    } catch {
      setIsAvailable(false);
    }
  };

  const handleToggleBiometric = async (value: boolean) => {
    if (value) {
      // Verify biometric before enabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '生体認証を有効にしますか？',
        cancelLabel: 'キャンセル',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometric(true);
      } else {
        Alert.alert('認証失敗', '生体認証を有効にするには認証が必要です');
      }
    } else {
      setBiometric(false);
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
        <Text style={styles.headerTitle}>セキュリティ</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>アプリロック</Text>

        <View style={styles.optionsList}>
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Ionicons
                name={biometricType === 'Face ID' ? 'scan-outline' : 'finger-print-outline'}
                size={22}
                color={Colors.accent}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{biometricType}</Text>
              <Text style={styles.optionDescription}>
                {isAvailable
                  ? `${biometricType}でアプリをロックします`
                  : `${biometricType}は利用できません`}
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
              disabled={!isAvailable}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.surface}
            />
          </View>
        </View>

        {!isAvailable && (
          <View style={styles.warning}>
            <Ionicons name="warning-outline" size={16} color={Colors.warning} />
            <Text style={styles.warningText}>
              この端末では生体認証が利用できません。端末の設定で生体認証を設定してからお試しください。
            </Text>
          </View>
        )}

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>現在の状態</Text>
            <View style={[styles.statusBadge, biometricEnabled ? styles.statusActive : styles.statusInactive]}>
              <Text style={[styles.statusBadgeText, biometricEnabled ? styles.statusActiveText : styles.statusInactiveText]}>
                {biometricEnabled ? '有効' : '無効'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons name="shield-checkmark-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.noteText}>
            生体認証を有効にすると、アプリ起動時に認証が必要になります。診察券や予約情報のセキュリティが向上します。
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
  optionsList: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
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
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    flex: 1,
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: '#d1fae5',
  },
  statusInactive: {
    backgroundColor: Colors.borderLight,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusActiveText: {
    color: '#059669',
  },
  statusInactiveText: {
    color: Colors.textTertiary,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 10,
    padding: 12,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textTertiary,
    flex: 1,
    lineHeight: 18,
  },
});
