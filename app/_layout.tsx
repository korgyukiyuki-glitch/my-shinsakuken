import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { Colors } from '../src/constants/colors';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

SystemUI.setBackgroundColorAsync(Colors.background);

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const isOnboarded = useSettingsStore((s) => s.isOnboarded);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    // Already hydrated (e.g. sync storage)
    if (useSettingsStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!isOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isOnboarded, segments, isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen
          name="card/[id]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="clinic/add"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="qr/[id]"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="number/[id]"
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name="appointment/add"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="history-record/add"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="history-record/[id]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="appointment/[id]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="clinic/[id]/edit"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="clinic/manage"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="settings-screens/profile"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="settings-screens/notifications"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="settings-screens/security"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
