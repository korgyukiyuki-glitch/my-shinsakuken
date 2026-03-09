import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/design';

interface InfoNoteProps {
  children: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'info' | 'warning';
}

export function InfoNote({
  children,
  icon = 'information-circle-outline',
  variant = 'info',
}: InfoNoteProps) {
  const isWarning = variant === 'warning';

  return (
    <View style={[styles.container, isWarning && styles.warningContainer]}>
      <Ionicons
        name={icon}
        size={16}
        color={isWarning ? Colors.warning : Colors.textTertiary}
        style={styles.icon}
      />
      <Text style={[styles.text, isWarning && styles.warningText]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.sm,
    padding: 12,
  },
  warningContainer: {
    backgroundColor: '#fef3c7',
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: Colors.textTertiary,
    lineHeight: 18,
  },
  warningText: {
    color: '#92400e',
  },
});
