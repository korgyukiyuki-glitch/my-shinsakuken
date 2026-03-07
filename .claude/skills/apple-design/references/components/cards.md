# カード

## 基本カード
```css
.card {
  background: #ffffff;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## フィーチャーカード（機能紹介）
```css
.feature-card {
  background: #f5f5f7;
  border-radius: 18px;
  padding: 40px 32px;
  text-align: center;
  border: none; /* 枠線は使わない */
}
.feature-card .icon {
  font-size: 40px;
  margin-bottom: 16px;
}
.feature-card h3 {
  font-size: 21px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
}
.feature-card p {
  font-size: 15px;
  color: #6e6e73;
  line-height: 1.6;
}
```

## カードグリッド
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
```

## ルール
- カードに枠線（border）は使わない。影 or 背景色で区別
- 角丸は `18px`（カード内のサブ要素は `12px`）
- カード内のテキスト量は最小限に（見出し + 1〜2行）
- ホバーエフェクトは translateY のみ。回転や拡大は不可
