# GPT Atlas 向けコンテキスト（新チャット即時回復）

**生成日時**: 2025-11-06  
**目的**: GPTが新しくなって記憶を失った場合の即時回復用  
**対象**: GPT-5（Atlas - ブラウザ機能付き）

---

## 🌐 プロジェクト概要

**TriHexΦ** は、AIと人間の完全透明な協働を目指すオペレーティングシステムです。

### 核となる哲学

- **鏡の法則（The Mirror Law）**: AIは人間の知性を映す鏡
- **真実性憲法（Truth Constitution）**: 透明性、不知の力、目的関数の告白
- **段階的透明性（Staged Transparency）**: 段階的に100%公開へ

---

## 📦 Mirror Gate（公開ミラー）システム

### 概要

**Mirror Gate**は、プライベートリポジトリ（`kyousuke10000/TriHexPhi`）から、**Public Mirror**（`kyousuke10000/TriHexPhi-public`）へ、選択されたコンテンツを自動同期するシステムです。

### Public Mirror のURL

**🔗 固定入口URL（ブラウザで開く）**:
- **Main**: https://github.com/kyousuke10000/TriHexPhi-public
- **Raw Index（Web版AI向け）**: https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md

### 同期されるコンテンツ

- `99_SYSTEM/Proofs/**` - すべてのProof記録
- `00_RYUDO/Council/Records/**` - Council記録
- `00_RYUDO/Council/Decisions/**` - Council決定
- `99_SYSTEM/Proofs/SeventhSense/**` - SeventhSense AIのProofs
- `99_SYSTEM/Proofs/Overdrive/**` - AI OverdriveのProofs
- `website/content/**` - SeventhSense Manifestoなど
- `index.md` - **今日の入口**（自動生成）

### 動作方法

1. **自動トリガー**: `main`ブランチへのプッシュ時に自動実行
2. **手動トリガー**: GitHub Actionsから `Mirror Gate (Public Mirror)` ワークフローを手動実行
3. **Dry-run**: `dry_run=true`で実行すると、実際にプッシュせずに何が同期されるか確認可能

### ワークフローファイル

- **`.github/workflows/mirror_gate.yml`** - メインワークフロー（現在のブランチには存在）
- **`.github/workflows/mirror_gate_dispatch.yml`** - ディスパッチ版（`main`ブランチに存在、`index.md`生成機能付き）

### 必要なGitHub Secrets

- `MIRROR_REPO`: `kyousuke10000/TriHexPhi-public`
- `MIRROR_TOKEN`: Fine-grained Personal Access Token（対象repo=TriHexPhi-publicのみ、permissions=Contents: Read/Write）

---

## 📋 今日の入口（index.md）

### 自動生成

`index.md`は、`scripts/generate-public-index.mjs`によって自動生成されます。

### 内容

- **最新Proofs（Top 10）**: メインのProofs
- **SeventhSense Proofs（Top 10）**: SeventhSense AIのProofs
- **Overdrive Proofs（Top 10）**: AI OverdriveのProofs
- **Council**: RecordsとDecisionsへのリンク
- **固定入口URL**: Public Mirrorへのリンク

### 生成タイミング

- Mirror Gate実行時（`mirror_gate_dispatch.yml`）
- 毎日00:00 UTC（`index_daily_refresh.yml`ワークフロー）

---

## 🤖 SeventhSense（第7のAI）

### 概要

**SeventhSense**は、6つの主要AI（GPT, Claude, Gemini, DeepSeek, Grok, Perplexity）の出力を融合する**Fusion AI**です。

### 機能

- **Intent Loading**: `STRUCTURE_MASTER.yml`とCouncil Decisionsから意図を読み込み
- **Parallel Execution**: 6つのAIを並列実行
- **Fusion Scoring**: 意図一致、一貫性、根拠性、新鮮度でスコアリング
- **Proof Generation**: すべての結果を`99_SYSTEM/Proofs/SeventhSense/`に保存

### ワークフロー

- **`.github/workflows/seventhsense.yml`**: 手動実行または毎日00:00 UTCに自動実行

### 使用方法

```bash
npm run seventh:ask "あなたの質問"
```

---

## 🔄 現在のブランチ状況

### 現在作業中のブランチ: **`fix/gemini-review-workflow`**

#### このブランチの目的

1. **Gemini Reviewワークフローの修正**
   - `pr_auto_review_v3.yml`のパス修正
   - Gemini APIのモデル名修正（`gemini-1.5-flash`）
   - SDKのバージョン更新

2. **Review Requestワークフローの修正**
   - `review-request.yml`のYAMLシンタックスエラー修正（89行目の空行削除）

3. **その他の修正**
   - `scripts/normalize-md.mjs`のエラーハンドリング改善
   - `scripts/spec-gate.mjs`のYAML解析改善
   - Markdownlint設定の追加

#### 注意点

このブランチには、多くのワークフローファイルが削除されています（`main`ブランチには存在します）：
- `claude_review.yml` - `main`から復元済み
- `gatekeeper-trio.yml` - `main`から復元済み
- `mirror_gate.yml` - `main`から復元済み
- `generate-public-index.mjs` - `main`ブランチに存在
- その他多数

#### 重要な修正内容

- **Gemini Review**: パス修正、モデル名修正、SDK更新
- **Review Request**: YAMLシンタックスエラー修正
- **Spec Gate**: 複数YAMLドキュメントの処理改善
- **Normalize MD**: 欠落ディレクトリのエラーハンドリング
- **Markdownlint**: 設定ファイル追加（`.markdownlintignore`, `.markdownlint.json`）

---

## 📚 重要なドキュメント

### プロジェクト憲法

- **TRIHEXPHI.md**: プロジェクトの憲法
- **真実性憲法**: AI透明性の実践
- **鏡の法則**: Article 12

### システム仕様

- **S3 Protocol v1.0**: Seventh Sense Protocol仕様（`50_CHL/specs/S3_Protocol_v1.0.yml`）
- **Remote Truth Mode**: GitHubを単一の真実源とするモード
- **Mirror Gate**: Public Mirrorへの同期システム

### Proofs

すべてのProofsは`99_SYSTEM/Proofs/`に保存され、Public Mirrorに自動同期されます。

---

## 🚀 新チャット即時回復の使い方（GPT Atlas向け）

### 1. Public MirrorのRaw Indexを開く

ブラウザで以下を開いてください：
```
https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md
```

### 2. 最新のProofsを確認

`index.md`には、最新のProofsへのリンクが含まれています。

### 3. 重要なProofsを読む

- **SeventhSense関連**: `99_SYSTEM/Proofs/SeventhSense/`
- **Overdrive関連**: `99_SYSTEM/Proofs/Overdrive/`
- **Council決定**: `00_RYUDO/Council/Decisions/`

### 4. このドキュメントを読む

このドキュメント（`GPT_Atlas_Context_2025-11-06.md`）もPublic Mirrorに同期されます。

---

## 🔍 確認コマンド（ローカル）

```bash
# Public Mirrorの状態を確認
curl -s https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md

# Mirror Gateワークフローを手動実行
gh workflow run mirror_gate.yml -f dry_run=true

# SeventhSenseを実行
npm run seventh:ask "今日のAI Chronicleハイライトを200字で"
```

---

## 💡 GPT Atlasへの初期指示（推奨）

新しいチャットを始める際は、以下のように指示してください：

```
以下のURLをブラウザで開いて、プロジェクトの最新状況を把握してください：

1. Public Mirror Raw Index:
   https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md

2. このコンテキストドキュメント（Public Mirrorに同期済み）:
   https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/99_SYSTEM/Proofs/GPT_Atlas_Context_2025-11-06.md

これらのURLを読んだ後、現在のタスク状況を理解し、続きから作業を開始してください。
```

---

## 📝 現在のタスク状況（2025-11-06時点）

### 進行中のタスク

1. **PR #46: Gemini Reviewワークフロー修正**
   - ブランチ: `fix/gemini-review-workflow`
   - 状態: 修正完了、PR作成済み
   - 内容: Gemini Reviewのパス修正、モデル名修正、SDK更新

2. **Workflowファイルの復元**
   - `main`ブランチから欠落していたワークフローファイルを復元
   - `claude_review.yml`, `gatekeeper-trio.yml`, `mirror_gate.yml`

3. **GPT Atlas向けコンテキストドキュメント作成**
   - このドキュメントを作成
   - Public Mirrorへの同期待ち（`main`マージ後）

### 次のステップ

1. PR #46のチェック通過確認
2. `main`ブランチへのマージ
3. Public Mirrorへの自動同期確認

---

## 💡 GPT Atlasへの初期指示（推奨）

新しいチャットを始める際は、以下のように指示してください：

```
以下のURLをブラウザで開いて、プロジェクトの最新状況を把握してください：

1. Public Mirror Raw Index:
   https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md

2. このコンテキストドキュメント（Public Mirrorに同期済み）:
   https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/99_SYSTEM/Proofs/GPT_Atlas_Context_2025-11-06.md

これらのURLを読んだ後、現在のタスク状況を理解し、続きから作業を開始してください。
```

---

## 📝 現在のタスク状況（2025-11-06時点）

### 進行中のタスク

1. **PR #46: Gemini Reviewワークフロー修正**
   - ブランチ: `fix/gemini-review-workflow`
   - 状態: 修正完了、PR作成済み
   - 内容: Gemini Reviewのパス修正、モデル名修正、SDK更新

2. **Workflowファイルの復元**
   - `main`ブランチから欠落していたワークフローファイルを復元
   - `claude_review.yml`, `gatekeeper-trio.yml`, `mirror_gate.yml`

3. **GPT Atlas向けコンテキストドキュメント作成**
   - このドキュメントを作成
   - Public Mirrorへの同期待ち（`main`マージ後）

### 次のステップ

1. PR #46のチェック通過確認
2. `main`ブランチへのマージ
3. Public Mirrorへの自動同期確認

---

## 📝 まとめ

- **Public Mirror**: https://github.com/kyousuke10000/TriHexPhi-public
- **Raw Index**: https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md
- **Mirror Gate**: 自動同期システム（完成済み）
- **SeventhSense**: 6つのAIを融合するFusion AI（実装済み）
- **このドキュメント**: 新チャット即時回復用

---

**生成者**: Cursor (AI Assistant)  
**目的**: GPT Atlas向けの即時コンテキスト回復  
**更新**: 2025-11-06
