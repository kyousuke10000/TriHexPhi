# GitHub Business 最適化 手動設定ガイド

**目的**: GitHub Businessプランの機能を活用して、SeventhSenseとMirror Gateを最適化

**注意**: 一部の設定（Environments、Branch Protection）はGitHub Web UIまたは適切なAPI権限が必要です。

---

## 📋 設定項目

### 1. Organization Secrets移行（手動）

**場所**: GitHub Web UI → Settings → Secrets and variables → Actions → Organization secrets

以下のSecretsをOrganizationレベルに設定：

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DEEPSEEK_API_KEY`
- `GROK_API_KEY`
- `MIRROR_TOKEN`
- `MIRROR_REPO` (値: `kyousuke10000/TriHexPhi-public`)
- `PPLX_API_KEY` (任意、Wave-2衛星)

**注意**: リポジトリレベルのSecretsは7日間保持してから削除してください。

---

### 2. Environments作成（手動）

**場所**: GitHub Web UI → Settings → Environments

#### staging環境

1. "New environment" をクリック
2. 環境名: `staging`
3. "Configure environment" をクリック
4. 保護ルールは設定しない（レビュー不要）

#### production環境

1. "New environment" をクリック
2. 環境名: `production`
3. "Configure environment" をクリック
4. **Required reviewers** を有効化:
   - レビュアーを追加: `kyousuke10000` (または管理者)
   - 必須レビュー数: `1`

---

### 3. Branch Protection設定（手動）

**場所**: GitHub Web UI → Settings → Branches → Branch protection rules

1. "Add rule" をクリック
2. Branch name pattern: `main`
3. 以下の設定を有効化:
   - ✅ **Require a pull request before merging**
     - Required number of approvals: `1`
   - ✅ **Require status checks to pass before merging**
     - Require branches to be up to date before merging: ✅
     - Status checks (動的に追加):
       - `Remote Truth Guard`
       - `Claude Review` (オプション)
       - `Gemini Review` (オプション)
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings** (Enforce admins)

---

### 4. ワークフロー環境設定（完了）

✅ **完了済み**: `seventhsense.yml` と `mirror_gate.yml` に以下を追加：

- `environment: production`
- `concurrency` 設定（同名ワークフローの直列化）

---

### 5. README更新（完了）

✅ **完了済み**: Public Mirror固定入口リンクを追加

---

## ✅ 設定確認

### Environments確認

```bash
gh api repos/kyousuke10000/TriHexPhi/environments | jq '.environments[].name'
```

### Branch Protection確認

```bash
gh api repos/kyousuke10000/TriHexPhi/branches/main/protection | jq '.required_pull_request_reviews.required_approving_review_count'
```

### Secrets確認

```bash
gh secret list -o kyousuke10000
```

---

## 📝 次のステップ

1. **Organization Secrets移行**: 手動で設定
2. **Environments作成**: Web UIで設定
3. **Branch Protection設定**: Web UIで設定
4. **動作確認**: Mirror Gateを実行して確認

---

**生成者**: Cursor (AI Assistant)  
**目的**: GitHub Business最適化の手動設定ガイド  
**更新**: 2025-11-07

