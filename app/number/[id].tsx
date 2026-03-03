import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness';
import { Colors } from '../../src/constants/colors';
import { useClinicStore } from '../../src/stores/useClinicStore';

export default function NumberDisplayScreen() {
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

  return (
    <View style={[styles.container, { backgroundColor: clinic.color }]}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={40} color="rgba(255,255,255,0.9)" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.clinicName}>{clinic.name}</Text>

        <Text style={styles.patientNumber}>{clinic.patientId}</Text>

        <Text style={styles.instruction}>
          受付でこの画面をお見せください
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'white',
    marginBottom: 32,
  },
  patientNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 4,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  instruction: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 32,
  },
});
