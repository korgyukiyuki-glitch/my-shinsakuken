# ナビゲーション

## ヘッダーナビ
```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## ナビリンク
```css
.nav-link {
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1f;
  text-decoration: none;
  padding: 0 12px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.nav-link:hover {
  opacity: 1;
}
```

## フッター
```css
.footer {
  background: #f5f5f7;
  padding: 40px 20px;
  font-size: 13px;
  color: #6e6e73;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
.footer a {
  color: #424245;
  text-decoration: none;
}
.footer a:hover {
  text-decoration: underline;
}
```

## ルール
- ナビは最大48px高さ（Apple標準）
- ナビ背景はグラスモーフィズム（半透明 + ブラー）
- ナビリンクは控えめなサイズ（14px）
- フッターは薄グレー背景、主張しすぎない
- モバイルではハンバーガーメニュー（シンプルなアイコン）
