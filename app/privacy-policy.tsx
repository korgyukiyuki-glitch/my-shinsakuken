import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          <Text style={styles.backText}>戻る</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>プライバシーポリシー</Text>
        <Text style={styles.date}>最終更新日: 2026年3月3日</Text>

        <Section title="1. はじめに">
          おまとめ診察券（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーは、本アプリにおける情報の取り扱いについて説明します。
        </Section>

        <Section title="2. 収集する情報">
          本アプリは以下の情報をユーザーの端末内にのみ保存します。外部サーバーへの送信は一切行いません。{'\n\n'}
          ・氏名（任意）{'\n'}
          ・医院名・患者番号{'\n'}
          ・予約メモ（日時・内容）{'\n'}
          ・診療履歴メモ（日付・治療内容）
        </Section>

        <Section title="3. データの保存場所">
          すべてのデータはユーザーのスマートフォン端末内にのみ保存されます。クラウドサーバーへのアップロードは行いません。アプリを削除すると、すべてのデータが消去されます。
        </Section>

        <Section title="4. 第三者への提供">
          本アプリは、ユーザーの個人情報を第三者に提供、販売、共有することは一切ありません。
        </Section>

        <Section title="5. プッシュ通知">
          予約リマインダーのためにプッシュ通知を使用します。通知の送信はすべて端末内で処理され、外部サーバーを経由しません。通知はいつでもオフにできます。
        </Section>

        <Section title="6. 生体認証">
          アプリのロック機能として、端末の生体認証（Face ID / Touch ID）を利用できます。生体情報はApple / Googleの仕組みで端末内のみで処理され、本アプリがアクセスすることはありません。
        </Section>

        <Section title="7. 分析・広告">
          本アプリは、ユーザー追跡、行動分析、広告配信を行いません。
        </Section>

        <Section title="8. お問い合わせ">
          本ポリシーに関するご質問は、App Store内のサポートリンクよりお問い合わせください。
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
