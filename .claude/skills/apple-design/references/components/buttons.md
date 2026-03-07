# ボタン

## プライマリボタン（CTA）
```css
.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: #ffffff;
  background-color: #0071e3;
  border: none;
  border-radius: 980px; /* 完全丸角 = Apple標準 */
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}
.btn-primary:hover {
  background-color: #0077ed;
}
```

## セカンダリボタン（テキストリンク風）
```css
.btn-secondary {
  display: inline-block;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  color: #0071e3;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: none;
}
.btn-secondary:hover {
  text-decoration: underline;
}
```

## アウトラインボタン
```css
.btn-outline {
  display: inline-block;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  color: #0071e3;
  background: transparent;
  border: 2px solid #0071e3;
  border-radius: 980px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn-outline:hover {
  background: #0071e3;
  color: #ffffff;
}
```

## ルール
- ボタンテキストは簡潔に（2〜5文字）
- 1セクションにCTAは1つまで
- ボタンサイズは最小 `padding: 8px 16px`、最大 `padding: 16px 32px`
- 角丸は `border-radius: 980px`（完全丸角）が基本
