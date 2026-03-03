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
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../src/constants/colors';
import { useClinicStore } from '../../../src/stores/useClinicStore';
import { ColorPicker } from '../../../src/components/ColorPicker';
import { Department, DEPARTMENT_CONFIG } from '../../../src/types';

const DEPARTMENTS = Object.entries(DEPARTMENT_CONFIG) as [Department, { label: string; icon: string }][];

export default function ClinicEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = useClinicStore((s) => s.getClinic(id));
  const updateClinic = useClinicStore((s) => s.updateClinic);
  const deleteClinic = useClinicStore((s) => s.deleteClinic);

  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [department, setDepartment] = useState<Department>('internal');
  const [color, setColor] = useState<string>(Colors.cardColors[0]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (clinic) {
      setName(clinic.name);
      setPatientId(clinic.patientId);
      setDepartment(clinic.department ?? 'other');
      setColor(clinic.color);
      setAddress(clinic.address ?? '');
      setPhone(clinic.phone ?? '');
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
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      '医院を削除',
      `「${clinic.name}」を削除しますか？関連する予約メモや診療記録は残ります。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            deleteClinic(id);
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
                  name={icon as any}
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
});
