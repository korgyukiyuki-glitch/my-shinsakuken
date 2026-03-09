import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/design';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const sizeConfig: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13, iconSize: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15, iconSize: 18 },
  lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16, iconSize: 20 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const s = sizeConfig[size];

  const containerStyle = [
    styles.base,
    { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal },
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ];

  const textColor = variant === 'primary'
    ? Colors.textInverse
    : variant === 'secondary'
    ? Colors.accent
    : variant === 'outline'
    ? Colors.accent
    : Colors.error;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={s.iconSize} color={textColor} />}
          <Text style={[styles.text, { fontSize: s.fontSize, color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: Colors.accentLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  destructive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
});
