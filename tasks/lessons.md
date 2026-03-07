# Lessons Learned

## ビルド関連

### ネイティブモジュール追加時は再ビルドが必要
- **状況**: `react-native-document-scanner-plugin` 等のネイティブモジュールを追加した場合
- **ルール**: development-deviceビルドの再ビルドが必須。JSのホットリロードでは反映されない
- **判断基準**:
  - JSコード変更のみ → ホットリロードでOK（再ビルド不要）
  - ネイティブモジュール追加/変更 → 再ビルド必須
- **ユーザーへの説明**: なぜ再ビルドが必要か理由を先に伝えること

### `/usr/bin/env node` はハングする
- **状況**: `npx` や `tsc` がハングする
- **対策**: 明示的なnodeパスを使う: `/Users/izumiryunosuke/.nvm/versions/node/v20.20.0/bin/node`
- **例**: `npx eas build` → `/Users/izumiryunosuke/.nvm/versions/node/v20.20.0/bin/node /Users/izumiryunosuke/.nvm/versions/node/v20.20.0/bin/eas build`

### EAS Build Free tierのキュー待ち
- 時間帯によって待ち時間が大きく変わる（数分〜30分+）
- `eas build:list --json --non-interactive` でキュー位置と推定時間を確認可能

## API関連

### expo-file-system SDK 55 は新API
- `import * as FileSystem from 'expo-file-system'` → `documentDirectory` が存在しない
- **対策**: `import * as FileSystem from 'expo-file-system/legacy'` を使う
- 新API: `Paths.document`, `new File()`, `new Directory()` だがレガシーの方が互換性高い

## OCR関連

### 日本語OCR（ML Kit）は装飾フォントに弱い
- 診察券のデザイン文字は認識できない
- 英語の小さなデザインテキストは読めるが実用性なし
- **結論**: OCR → 写真保存に方針転換済み
- AI Vision API（Claude/GPT-4o）での読み取りは将来のプレミアム機能として検討

## UI/UX

### Claude Codeにスクリーンショットを貼ると固まる
- **対策**: テキストとしてペーストしてもらう

## 収益モデル

### AI読み取り機能のコスト
- AI Vision APIの呼び出しコストは開発者負担になる
- **方針**: 将来の有料プラン or プレミアム機能として位置づけ
- Phase 1では写真保存のみ（コスト0）
