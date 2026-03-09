import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'card-outline' as const,
    title: '複数の診察券をひとつに',
    description:
      '通っている医院の診察券をすべてアプリで管理。もうカードを持ち歩く必要はありません。',
  },
  {
    id: '2',
    icon: 'qr-code-outline' as const,
    title: '受付もスムーズに',
    description:
      'QRコードや患者番号を画面に表示して、受付で見せるだけ。どの医院でも使えます。',
  },
  {
    id: '3',
    icon: 'calendar-outline' as const,
    title: '予約もまとめて管理',
    description:
      '次回の予約をメモして、リマインダーでお知らせ。予約を忘れる心配がなくなります。',
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(onboarding)/profile-setup');
    }
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/profile-setup');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>スキップ</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={80} color={Colors.accent} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Page indicator */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Next / Start button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? 'はじめる' : '次へ'}
        </Text>
        <Ionicons
          name={
            currentIndex === slides.length - 1
              ? 'checkmark'
              : 'arrow-forward'
          }
          size={20}
          color={Colors.textInverse}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 24,
  },
  dotInactive: {
    backgroundColor: Colors.border,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 14,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
