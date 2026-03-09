import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness';
import QRCode from 'react-native-qrcode-svg';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { Colors } from '../../src/constants/colors';
import { Radius, Shadows } from '../../src/constants/design';
import { useClinicStore } from '../../src/stores/useClinicStore';

type CodeMode = 'qr' | 'barcode';

export default function QRDisplayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = useClinicStore((s) => s.getClinic(id!));
  const [mode, setMode] = useState<CodeMode>('qr');
  const originalBrightnessRef = useRef<number | null>(null);

  useEffect(() => {
    const setBrightness = async () => {
      try {
        if (Platform.OS !== 'web') {
          originalBrightnessRef.current = await Brightness.getBrightnessAsync();
          await Brightness.setBrightnessAsync(1);
        }
      } catch {}
    };
    setBrightness();

    return () => {
      if (originalBrightnessRef.current !== null) {
        Brightness.setBrightnessAsync(originalBrightnessRef.current).catch(() => {});
      }
    };
  }, []);

  if (!clinic) {
    return (
      <View style={styles.container}>
        <Text>診察券が見つかりません</Text>
      </View>
    );
  }

  const qrData = JSON.stringify({
    type: 'medical_card',
    clinicName: clinic.name,
    patientId: clinic.patientId,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)');
          }
        }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="close-circle" size={40} color={Colors.navy} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.clinicName}>{clinic.name}</Text>

        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'qr' && styles.toggleButtonActive]}
            onPress={() => setMode('qr')}
          >
            <Ionicons
              name="qr-code"
              size={16}
              color={mode === 'qr' ? '#fff' : Colors.textSecondary}
            />
            <Text style={[styles.toggleText, mode === 'qr' && styles.toggleTextActive]}>
              QRコード
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'barcode' && styles.toggleButtonActive]}
            onPress={() => setMode('barcode')}
          >
            <Ionicons
              name="barcode-outline"
              size={16}
              color={mode === 'barcode' ? '#fff' : Colors.textSecondary}
            />
            <Text style={[styles.toggleText, mode === 'barcode' && styles.toggleTextActive]}>
              バーコード
            </Text>
          </TouchableOpacity>
        </View>

        {/* Code display */}
        <View style={styles.codeContainer}>
          {mode === 'qr' ? (
            <QRCode
              value={qrData}
              size={240}
              backgroundColor="white"
              color={Colors.navy}
            />
          ) : (
            <Barcode
              value={clinic.patientId}
              format="CODE128"
              width={2}
              height={100}
              lineColor={Colors.navy}
              background="white"
            />
          )}
        </View>

        <Text style={styles.patientId}>{clinic.patientId}</Text>
        <Text style={styles.instruction}>
          {mode === 'qr'
            ? '受付でこのQRコードをご提示ください'
            : '受付でこのバーコードをご提示ください'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 3,
    marginBottom: 28,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#fff',
  },
  codeContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: Radius.md,
    ...Shadows.md,
    minWidth: 280,
    alignItems: 'center',
  },
  patientId: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 24,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  instruction: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 12,
  },
});
