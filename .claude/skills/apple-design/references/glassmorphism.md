# グラスモーフィズム（Frosted Glass）

## 基本実装
```css
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
}
```

## ダークモード版
```css
.glass-dark {
  background: rgba(29, 29, 31, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
}
```

## 使い所
- 固定ヘッダー（スクロール時にコンテンツが透ける）
- モーダル / ドロワーの背景
- フローティングカード

## ルール
- `blur` の値は `20px` が基本。大きすぎると重くなる
- 背景に色やグラデーションがある場所で使う（白背景では効果なし）
- 多用しない。1ページに1〜2箇所まで
- `-webkit-backdrop-filter` を必ず併記（Safari対応）
