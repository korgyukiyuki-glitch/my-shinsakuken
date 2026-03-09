import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/design';

interface SectionCardProps {
  children: React.ReactNode;
  title?: string;
}

export function SectionCard({ children, title }: SectionCardProps) {
  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.card}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    ...Shadows.md,
  },
});
