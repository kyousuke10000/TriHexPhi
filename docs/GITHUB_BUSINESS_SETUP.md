# GitHub Business 最適化セットアップ

**目的**: GitHub Businessプランの機能を活用して、SeventhSenseとMirror Gateを最適化

---

## 📋 セットアップ手順

### 1. 事前検証（必須）

実行前に、既存設定を確認します：

```bash
npm run check:github-business
```

このコマンドは以下を確認します：
- ✅ Organization Secretsの設定状況
- ✅ Environments（staging/production）の存在
- ✅ Branch Protectionの設定状況
- ✅ ワークフローのEnvironment設定
- ✅ READMEのPublic Mirrorリンク

### 2. GPTに確認（必須）

事前検証結果をGPTに確認してください：

**確認事項の例:**
- 「これらのSecretsは既に別の場所で設定済みですか？」
- 「ブランチ保護を有効にすると、直接pushができなくなります。問題ありませんか？」
- 「これらのワークフローに`environment: production`を追加しますか？」

### 3. セットアップ実行

GPTの承認を得たら、インタラクティブセットアップを実行：

```bash
./scripts/setup-github-business.sh
```

このスクリプトは：
- 各ステップで確認を求めます
- 既存設定を確認してから実行します
- 安全に設定を追加します

---

## 🔧 設定項目

### Organization Secrets

以下のSecretsをOrganizationレベルで設定：

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DEEPSEEK_API_KEY`
- `GROK_API_KEY`
- `PPLX_API_KEY` (Wave-2衛星、任意)
- `MIRROR_TOKEN`
- `MIRROR_REPO`

### Environments

- `staging`: ステージング環境
- `production`: 本番環境（レビュー必須）

### Branch Protection

- `main`ブランチ保護
- 必須レビュー数: 1
- ステータスチェック: strict

### ワークフロー設定

推奨設定（`.github/workflows/_patch_actions_recommendations.txt`参照）:

```yaml
permissions:
  contents: write
  actions: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

environment: production  # Public反映やデプロイ系
```

---

## ⚠️ 注意事項

1. **重複設定の回避**: 既存設定を確認してから実行
2. **GPT確認**: 実行前に必ずGPTに確認
3. **段階的実行**: 一度にすべてを実行せず、段階的に確認しながら実行

---

## 📝 確認フロー

```
指令書受領
    ↓
事前検証実行 (npm run check:github-business)
    ↓
GPTに確認事項を質問
    ↓
GPT承認
    ↓
セットアップ実行 (./scripts/setup-github-business.sh)
    ↓
最終確認
    ↓
完了
```

---

**生成者**: Cursor (AI Assistant)  
**目的**: GitHub Business最適化セットアップの安全な実行  
**更新**: 2025-11-06

