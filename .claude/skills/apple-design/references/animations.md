# アニメーション

## 基本方針
- アニメーションは「気づかないくらい自然」が理想
- 装飾目的のアニメーションは不要。意味のあるフィードバックのみ
- 過剰なアニメーションはApple風ではなく「AI生成っぽい」印象を与える

## トランジション
```css
/* 基本のイージング */
--ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);

/* ホバー・インタラクション */
transition: all 0.3s var(--ease-default);

/* 色の変化 */
transition: color 0.3s ease, background-color 0.3s ease;

/* 要素の移動 */
transition: transform 0.4s var(--ease-in-out);
```

## スクロールアニメーション（Fade In Up）
```css
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### JavaScript（Intersection Observer）
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => {
  observer.observe(el);
});
```

## ルール
1. `duration` は `0.2s`〜`0.8s` の範囲内
2. スクロールアニメーションの移動量は `20px`〜`40px`（大きすぎると下品）
3. `ease` or `cubic-bezier` を使用。`linear` は機械的で不可
4. 同時に動くアニメーションは最大3要素まで
5. ローディングスピナーやパルスアニメーションは控えめに
6. `prefers-reduced-motion` に対応すること

### reduced-motion対応
```css
@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```
