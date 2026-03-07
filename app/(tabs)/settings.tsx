import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import Constants from 'expo-constants';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    icon: 'person-outline',
    label: 'プロフィール設定',
    description: '氏名・生年月日・連絡先',
    route: '/settings-screens/profile',
  },
  {
    icon: 'notifications-outline',
    label: '通知設定',
    description: 'リマインダーのタイミング設定',
    route: '/settings-screens/notifications',
  },
  {
    icon: 'shield-outline',
    label: 'セキュリティ',
    description: 'パスコード・生体認証',
    route: '/settings-screens/security',
  },
  {
    icon: 'business-outline',
    label: '登録医院の管理',
    description: '医院の並び替え・編集・削除',
    route: '/clinic/manage',
  },
];

export default function SettingsScreen() {
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => router.push(item.route as Href)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color={Colors.accent} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.privacyLink}
          onPress={() => router.push('/privacy-policy')}
        >
          <Ionicons name="document-text-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.privacyText}>プライバシーポリシー</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Ionicons name="medical" size={20} color={Colors.textTertiary} />
          <Text style={styles.footerAppName}>マイ診察券</Text>
          <Text style={styles.footerVersion}>バージョン {appVersion}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.navy,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 24,
  },
  menuSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerAppName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginTop: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
  },
  privacyText: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
});
