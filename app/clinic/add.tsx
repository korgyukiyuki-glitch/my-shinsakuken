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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MlkitOcr from 'rn-mlkit-ocr';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';
import { ColorPicker } from '../../src/components/ColorPicker';
import { Department, DEPARTMENT_CONFIG } from '../../src/types';
import { parseClinicCardFromOcr } from '../../src/utils/parseClinicCardOcr';

const DEPARTMENTS = Object.entries(DEPARTMENT_CONFIG) as [Department, { label: string; icon: string }][];

export default function ClinicAddScreen() {
  const [name, setName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [department, setDepartment] = useState<Department>('internal');
  const [color, setColor] = useState<string>(Colors.cardColors[0]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [closedDays, setClosedDays] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const addClinic = useClinicStore((s) => s.addClinic);

  const handleScan = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'カメラの許可が必要です',
          '診察券を撮影するにはカメラへのアクセスを許可してください'
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
          '診察券がはっきり写るように、もう一度撮影してみてください'
        );
        setIsScanning(false);
        return;
      }

      const parsed = parseClinicCardFromOcr(rawText);

      if (parsed.clinicName) setName(parsed.clinicName);
      if (parsed.patientId) setPatientId(parsed.patientId);
      if (parsed.phone) setPhone(parsed.phone);
      if (parsed.address) setAddress(parsed.address);
      if (parsed.department) setDepartment(parsed.department);
      if (parsed.businessHours) setBusinessHours(parsed.businessHours);
      if (parsed.closedDays) setClosedDays(parsed.closedDays);

      Alert.alert(
        'スキャン完了',
        '読み取り結果をフォームに反映しました。内容を確認・修正してください。'
      );
    } catch (error) {
      console.error('OCR scan error:', error);
      Alert.alert(
        'スキャンエラー',
        'テキストの読み取りに失敗しました。手入力で登録してください。'
      );
    } finally {
      setIsScanning(false);
    }
  };

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
      department,
      color,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      closedDays: closedDays.trim() || undefined,
      businessHours: businessHours.trim()
        ? {
            mon: { morning: businessHours.trim() },
            tue: { morning: businessHours.trim() },
            wed: { morning: businessHours.trim() },
            thu: { morning: businessHours.trim() },
            fri: { morning: businessHours.trim() },
            sat: { morning: businessHours.trim() },
          }
        : undefined,
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
            {isScanning ? '読み取り中...' : '診察券をスキャン'}
          </Text>
        </TouchableOpacity>

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

          <Text style={styles.label}>診療時間</Text>
          <TextInput
            style={styles.input}
            value={businessHours}
            onChangeText={setBusinessHours}
            placeholder="例：9:00〜12:00 / 14:00〜18:00"
            placeholderTextColor={Colors.textTertiary}
          />

          <Text style={styles.label}>休診日</Text>
          <TextInput
            style={styles.input}
            value={closedDays}
            onChangeText={setClosedDays}
            placeholder="例：木曜・日曜・祝日"
            placeholderTextColor={Colors.textTertiary}
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
