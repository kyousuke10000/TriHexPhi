# Secrets設定ガイド

## 📋 必要なSecrets一覧

### ✅ 確認済み
- **GOOGLE_API_KEY** (Gemini) - 設定済み ✅

### ❌ 不足しているSecrets

#### 1. ANTHROPIC_API_KEY (Claude)
- **用途**: Claude API（Claude Code Review、AI Triage）
- **取得方法**: 
  1. https://console.anthropic.com/ にアクセス
  2. アカウント作成/ログイン
  3. API Keys → Create Key
  4. キーをコピー
- **設定場所**: Repository Secrets
- **使用ワークフロー**: 
  - `claude_review.yml`
  - `ai_triage.yml`
  - `tools/ci/ask-claude.mjs`

#### 2. OPENAI_API_KEY (GPT)
- **用途**: OpenAI API（GPT-4、GPT-4o）
- **取得方法**:
  1. https://platform.openai.com/api-keys にアクセス
  2. アカウント作成/ログイン
  3. Create new secret key
  4. キーをコピー（一度しか表示されないので注意）
- **設定場所**: Repository Secrets
- **使用ワークフロー**:
  - `seventhsense.yml`
  - `preflight-check.mjs` (チェック用)

#### 3. MIRROR_REPO
- **用途**: Public Mirrorリポジトリ名
- **値**: `kyousuke10000/TriHexPhi-public` または `Seventh-Sense-Systems-S3/TriHexPhi-public`
- **設定場所**: Repository Secrets
- **使用ワークフロー**:
  - `mirror_gate.yml`
  - `mirror_gate_dispatch.yml`

#### 4. MIRROR_TOKEN
- **用途**: Public Mirrorへの書き込み権限を持つFine-grained Personal Access Token
- **取得方法**:
  1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
  2. Generate new token
  3. 以下の設定:
     - **Name**: `TriHexPhi Mirror Bot`
     - **Expiration**: 適切な期間（90日、1年など）
     - **Repository access**: Selected repositories
     - **Selected repositories**: `TriHexPhi-public` (Public Mirror)
     - **Permissions**:
       - Contents: Read and write
       - Metadata: Read-only
  4. Generate token
  5. トークンをコピー（一度しか表示されないので注意）
- **設定場所**: Repository Secrets
- **使用ワークフロー**:
  - `mirror_gate.yml`
  - `mirror_gate_dispatch.yml`

## 🔧 設定手順

### GitHub UIで設定する方法

1. **Repository Secrets**を開く:
   - リポジトリ → Settings → Secrets and variables → Actions → Repository secrets

2. **New repository secret**をクリック

3. **各Secretを追加**:
   - Name: 上記のSecret名（例: `ANTHROPIC_API_KEY`）
   - Secret: 取得したキー/値
   - Add secret

### GitHub CLIで設定する方法

```bash
# ANTHROPIC_API_KEY
echo "your-anthropic-api-key" | gh secret set ANTHROPIC_API_KEY

# OPENAI_API_KEY
echo "your-openai-api-key" | gh secret set OPENAI_API_KEY

# MIRROR_REPO
echo "kyousuke10000/TriHexPhi-public" | gh secret set MIRROR_REPO

# MIRROR_TOKEN
echo "your-mirror-token" | gh secret set MIRROR_TOKEN
```

## ✅ 確認方法

### GitHub UI
1. Settings → Secrets and variables → Actions → Repository secrets
2. 以下のSecretsが表示されているか確認:
   - ✅ ANTHROPIC_API_KEY
   - ✅ GOOGLE_API_KEY
   - ✅ OPENAI_API_KEY
   - ✅ MIRROR_REPO
   - ✅ MIRROR_TOKEN

### GitHub CLI
```bash
gh secret list
```

### ワークフローで確認
```bash
# preflight-check.mjsを実行
node scripts/preflight-check.mjs
```

## 🚨 エラーの原因

### 1. `❌ Required secrets: OPENAI_API_KEY`
- **原因**: `preflight-check.mjs`が`OPENAI_API_KEY`をチェックしているが、設定されていない
- **解決**: `OPENAI_API_KEY`をRepository Secretsに追加

### 2. `ANTHROPIC_API_KEY missing`
- **原因**: Claude APIを使用するワークフローで`ANTHROPIC_API_KEY`が設定されていない
- **解決**: `ANTHROPIC_API_KEY`をRepository Secretsに追加

### 3. `MIRROR_TOKEN missing` または `MIRROR_REPO missing`
- **原因**: Mirror Gateワークフローで必要なSecretsが設定されていない
- **解決**: `MIRROR_REPO`と`MIRROR_TOKEN`をRepository Secretsに追加

## 📝 注意事項

1. **Secret名の大文字小文字**: GitHub Secretsは大文字小文字を区別します。正確な名前を使用してください。

2. **一度しか表示されない**: 
   - API Keys（OpenAI、Anthropic）
   - Personal Access Tokens（GitHub）
   これらは一度しか表示されないので、必ずコピーして安全な場所に保管してください。

3. **Fine-grained PATの権限**: 
   - `MIRROR_TOKEN`はFine-grained PATを使用し、`TriHexPhi-public`リポジトリへのContents: Read and write権限が必要です。

4. **Organization Secrets vs Repository Secrets**:
   - 現在はRepository Secretsを使用しています
   - Organization Secretsに移行する場合は、ワークフローでの参照方法を変更する必要があります

## 🔗 関連ドキュメント

- `50_CHL/docs/SECRETS_CHECKLIST.md` - Secretsチェックリスト
- `50_CHL/docs/MIRROR_TOKEN_SETUP.md` - MIRROR_TOKEN詳細設定ガイド
- `50_CHL/docs/GITHUB_BUSINESS_MANUAL_SETUP.md` - GitHub Business設定ガイド

---

**最終更新**: 2025-11-07  
**作成者**: Cursor (実装担当)

