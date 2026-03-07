import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useProfileStore } from '../../src/stores/useProfileStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const handleRegister = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
    }
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-circle-outline" size={80} color={Colors.accent} />
        </View>

        <Text style={styles.title}>プロフィール設定</Text>
        <Text style={styles.subtitle}>
          お名前を登録しておくと、診察券に表示されます
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>お名前</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="例：田中 太郎"
            placeholderTextColor={Colors.textTertiary}
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>登録する</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>あとで設定する</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  skipButton: {
    alignItems: 'center',
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
