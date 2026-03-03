import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function QRDisplayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = useClinicStore((s) => s.getClinic(id));

  useEffect(() => {
    let originalBrightness: number | null = null;

    const setBrightness = async () => {
      try {
        if (Platform.OS !== 'web') {
          originalBrightness = await Brightness.getBrightnessAsync();
          await Brightness.setBrightnessAsync(1);
        }
      } catch {}
    };
    setBrightness();

    return () => {
      if (originalBrightness !== null) {
        Brightness.setBrightnessAsync(originalBrightness).catch(() => {});
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
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={40} color={Colors.navy} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.clinicName}>{clinic.name}</Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={240}
            backgroundColor="white"
            color={Colors.navy}
          />
        </View>

        <Text style={styles.patientId}>{clinic.patientId}</Text>
        <Text style={styles.instruction}>受付でこのQRコードをご提示ください</Text>
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
    marginBottom: 32,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
