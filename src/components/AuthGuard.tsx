import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useSettingsStore } from '../stores/useSettingsStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const setBiometric = useSettingsStore((s) => s.setBiometric);
  const [isLocked, setIsLocked] = useState(biometricEnabled);
  const isAuthenticating = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const authenticate = useCallback(async () => {
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;

    try {
      // ハードウェア・登録チェック — 未対応ならロックアウトしない
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // 生体認証が使えなくなった場合、設定を無効にして解除
        setBiometric(false);
        setIsLocked(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '診察券アプリのロックを解除',
        cancelLabel: 'キャンセル',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLocked(false);
      }
    } catch {
      // エラー時はロック維持（リトライボタンで再試行可能）
    } finally {
      isAuthenticating.current = false;
    }
  }, [setBiometric]);

  // 初回マウント時に認証
  useEffect(() => {
    if (biometricEnabled && isLocked) {
      authenticate();
    }
  }, []);

  // biometricEnabled が変わった時（設定でONにした直後など）
  useEffect(() => {
    if (!biometricEnabled) {
      setIsLocked(false);
    }
  }, [biometricEnabled]);

  // AppState リスナー: バックグラウンド → フォアグラウンドで再ロック
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        biometricEnabled &&
        appStateRef.current === 'background' &&
        nextState === 'active'
      ) {
        setIsLocked(true);
        // 少し遅延させて AppState の安定後に認証プロンプトを出す
        setTimeout(() => authenticate(), 300);
      }
      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, [biometricEnabled, authenticate]);

  if (!biometricEnabled) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isLocked && (
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={56} color={Colors.accent} />
            </View>
            <Text style={styles.appName}>おまとめ診察券</Text>
            <Text style={styles.subtitle}>ロックされています</Text>

            <TouchableOpacity
              style={styles.unlockButton}
              onPress={authenticate}
              activeOpacity={0.8}
            >
              <Ionicons name="lock-open-outline" size={20} color="white" />
              <Text style={styles.unlockButtonText}>ロック解除</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 150, 199, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
