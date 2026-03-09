/**
 * Apple Design Tokens — おまとめ診察券
 * 影・角丸・アイコンサイズの統一定義
 */

export const Radius = {
  /** 入力、チップ、小要素 */
  sm: 12,
  /** カード、セクション */
  md: 18,
  /** 大型カード */
  lg: 24,
  /** ピル型ボタン */
  pill: 980,
} as const;

export const Shadows = {
  /** 入力フォーカス、微妙な浮き */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  /** カード、セクション */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  /** モーダル、FAB、強調要素 */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const IconSize = {
  /** インラインの小アイコン */
  sm: 16,
  /** 標準インラインアイコン */
  md: 20,
  /** ヘッダーアクション、ナビゲーション */
  lg: 24,
  /** 空状態、装飾 */
  xl: 48,
} as const;
