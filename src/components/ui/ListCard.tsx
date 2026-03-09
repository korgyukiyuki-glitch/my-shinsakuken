import { TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/design';

interface ListCardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export function ListCard({ children, onPress }: ListCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    ...Shadows.sm,
  },
});
