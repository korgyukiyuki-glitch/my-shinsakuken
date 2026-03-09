import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import * as Notifications from 'expo-notifications';
import { Colors } from '../src/constants/colors';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { AuthGuard } from '../src/components/AuthGuard';
import { configureNotifications } from '../src/utils/notifications';

SystemUI.setBackgroundColorAsync(Colors.background);
configureNotifications();

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

  // 通知タップ時のナビゲーション
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const appointmentId =
          response.notification.request.content.data?.appointmentId;
        if (appointmentId && typeof appointmentId === 'string') {
          router.push(`/appointment/${appointmentId}` as never);
        }
      },
    );
    return () => subscription.remove();
  }, [router]);

  // コールドスタート時の通知タップ処理
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const appointmentId =
          response.notification.request.content.data?.appointmentId;
        if (appointmentId && typeof appointmentId === 'string') {
          setTimeout(
            () => router.push(`/appointment/${appointmentId}` as never),
            500,
          );
        }
      }
    });
  }, []);

  if (!isHydrated) {
    return (
      <View style={splashStyles.container}>
        <StatusBar style="light" />
        <Image
          source={require('../assets/splash-icon.png')}
          style={splashStyles.icon}
          resizeMode="contain"
        />
        <Text style={splashStyles.appName}>おまとめ診察券</Text>
        <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" style={splashStyles.spinner} />
        <Text style={splashStyles.brand}>Medical Craft Laboratory</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>

      <AuthGuard>
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
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="number/[id]"
          options={{ presentation: 'modal' }}
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
          name="medication/add"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="medication/[id]"
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
      </AuthGuard>
    </ErrorBoundary>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  spinner: {
    marginTop: 32,
  },
  brand: {
    position: 'absolute',
    bottom: 60,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.8,
  },
});
