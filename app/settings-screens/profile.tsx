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
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useProfileStore } from '../../src/stores/useProfileStore';

export default function ProfileEditScreen() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    setName(profile.name);
    setBirthDate(profile.birthDate ?? '');
    setContactPhone(profile.contactPhone ?? '');
  }, [profile]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('入力エラー', '氏名を入力してください');
      return;
    }

    updateProfile({
      name: name.trim(),
      birthDate: birthDate.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
    });

    Alert.alert('保存完了', 'プロフィールを更新しました', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
        <Text style={styles.headerTitle}>プロフィール設定</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {/* Avatar placeholder */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.textTertiary} />
          </View>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本情報</Text>

          <Text style={styles.label}>氏名 *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="例：山田 太郎"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>生年月日（任意）</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="例：1990-05-15"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>電話番号（任意）</Text>
          <TextInput
            style={styles.input}
            value={contactPhone}
            onChangeText={setContactPhone}
            placeholder="例：090-1234-5678"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.note}>
          <Ionicons name="lock-closed-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.noteText}>
            プロフィール情報はお使いの端末内にのみ保存されます。外部に送信されることはありません。
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
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 24,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
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
