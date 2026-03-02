import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { ColorPicker } from '../../src/components/ColorPicker';

export default function ClinicAddScreen() {
  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [color, setColor] = useState<string>(Colors.cardColors[0]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const addClinic = useClinicStore((s) => s.addClinic);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('入力エラー', '医院名を入力してください');
      return;
    }
    if (!patientId.trim()) {
      Alert.alert('入力エラー', '患者番号を入力してください');
      return;
    }

    addClinic({
      name: name.trim(),
      patientId: patientId.trim(),
      color,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
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
        <Text style={styles.headerTitle}>医院を追加</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {/* Required fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>必須情報</Text>

          <Text style={styles.label}>医院名</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="例：さくら歯科クリニック"
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
    gap: 24,
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
});
