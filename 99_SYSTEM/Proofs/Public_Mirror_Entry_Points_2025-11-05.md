# Public Mirror 固定入口URL（共有用）

**作成日**: 2025-11-05  
**目的**: 新しいチャットでも一発で思い出せる固定入口URL

---

## 📌 固定入口URL（みんなに配る用）

### 入口（Start Here）
```
https://github.com/kyousuke10000/TriHexPhi-public
```

### Proofs 一覧（最新状況の公式履歴）
```
https://github.com/kyousuke10000/TriHexPhi-public/tree/main/99_SYSTEM/Proofs
```

### Council Records（議事録）
```
https://github.com/kyousuke10000/TriHexPhi-public/tree/main/00_RYUDO/Council/Records
```

### Council Decisions（決裁ファイル）
```
https://github.com/kyousuke10000/TriHexPhi-public/tree/main/00_RYUDO/Council/Decisions
```

### 今日の入口（自動更新されるindex.md）
**表示用:**
```
https://github.com/kyousuke10000/TriHexPhi-public/blob/main/index.md
```

**Raw直読み（Web版AI向け）:**
```
https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md
```

---

## 🚀 使い方

### Web版AI（GPT / Claude / Gemini / Grok / DeepSeek）への使い方

1. **入口URLを貼るだけ**:
   - 上記の「入口（Start Here）」URLを貼る
   - または、`index.md`のRaw URLを貼る

2. **毎回のアップロード不要**:
   - 最新の内容が自動で参照される
   - Public Mirrorが自動更新される

### Cursor / ローカル開発での使い方

1. **固定URLをブックマーク**:
   - 上記のURLをブックマークしておく
   - 新しいチャット開始時に貼り付ける

2. **自動生成されるindex.md**:
   - 毎朝00:00 UTC（JST 09:00）に自動更新
   - Mirror Gate実行時にも自動更新

---

## 🔄 自動更新の仕組み

### Mirror Gateワークフロー
- **トリガー**: `main`ブランチへのpush、または手動実行
- **動作**: 
  1. `index.md`を自動生成
  2. Public Mirrorに同期
  3. 最新Proofs Top 10を自動反映

### Daily Index Refreshワークフロー
- **トリガー**: 毎朝00:00 UTC（JST 09:00）
- **動作**: `index.md`を自動更新してPublic Mirrorに反映

---

## 📝 技術的詳細

### index.md生成スクリプト
- **ファイル**: `scripts/generate-public-index.mjs`
- **機能**: 
  - 最新Proofs Top 10を自動取得
  - 固定入口URLを生成
  - Markdown形式で出力

### Mirror Gateワークフロー
- **ファイル**: `.github/workflows/mirror_gate_dispatch.yml`
- **機能**:
  - `index.md`生成を組み込み
  - Public Mirrorへの同期
  - Dry-runモード対応

### Daily Refreshワークフロー
- **ファイル**: `.github/workflows/index_daily_refresh.yml`
- **機能**:
  - 毎朝自動で`index.md`を更新
  - Public Mirrorに反映

---

## ✅ これで今日からの運用

- ✅ 共有は入口URL１本（Start Here）
- ✅ "最新の状況教えて"と言われたら Proofs を見れば一撃
- ✅ Web版AIに相談するときは `index.md`（Raw） を渡すだけ
- ✅ フォルダ散乱の悩みは、Remote Truth（GitHub）× Public Mirror で自然に解消
- ✅ 新しいチャットでも一発で思い出せる

---

**最終更新**: 2025-11-05  
**次回更新**: 自動更新（毎朝）

