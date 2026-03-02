import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'Hiragino Sans',
  android: 'sans-serif',
  default: 'System',
});

export const Typography = {
  fontFamily,

  // Heading
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
  },

  // Body
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
  },

  // Small
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },

  // Special
  patientNumber: {
    fontSize: 72,
    fontWeight: '800' as const,
    lineHeight: 80,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
} as const;
