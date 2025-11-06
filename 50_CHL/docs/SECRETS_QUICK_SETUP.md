# Secrets クイック設定ガイド

## 📋 現状確認

✅ **設定済み**: `GOOGLE_API_KEY` (Gemini)  
❌ **不足**: `ANTHROPIC_API_KEY` (Claude), `MIRROR_REPO`, `MIRROR_TOKEN`, `OPENAI_API_KEY` (GPT)

## 🚨 不足しているSecretsと取得方法

### 1. ANTHROPIC_API_KEY (Claude) - 最優先

**用途**: Claude API（コードレビュー、AI Triage）

**取得方法**:
1. https://console.anthropic.com/ にアクセス
2. アカウント作成またはログイン
3. 左メニュー → **API Keys**
4. **Create Key** をクリック
5. Key nameを入力（例: `TriHexPhi CI`）
6. **Create Key** をクリック
7. **表示されたキーをコピー**（⚠️ 一度しか表示されません！）

**設定場所**: GitHub Repository Secrets

---

### 2. OPENAI_API_KEY (GPT)

**用途**: OpenAI API（GPT-4、GPT-4o）- SeventhSenseで使用

**取得方法**:
1. https://platform.openai.com/api-keys にアクセス
2. アカウント作成またはログイン
3. **Create new secret key** をクリック
4. Key nameを入力（例: `TriHexPhi`）
5. **Create secret key** をクリック
6. **表示されたキーをコピー**（⚠️ 一度しか表示されません！）

**設定場所**: GitHub Repository Secrets

---

### 3. MIRROR_REPO

**用途**: Public Mirrorリポジトリ名

**値**: 
- 既存: `kyousuke10000/TriHexPhi-public`
- 新規: `Seventh-Sense-Systems-S3/TriHexPhi-public`（Organization使用時）

**取得方法**: 値の取得は不要。リポジトリ名をそのまま設定。

**設定場所**: GitHub Repository Secrets

---

### 4. MIRROR_TOKEN

**用途**: Public Mirrorへの書き込み権限を持つGitHub Token

**取得方法**:
1. GitHub → 右上のプロフィールアイコン → **Settings**
2. 左メニュー → **Developer settings**
3. **Personal access tokens** → **Fine-grained tokens**
4. **Generate new token** をクリック
5. 以下の設定:
   - **Token name**: `TriHexPhi Mirror Bot`
   - **Expiration**: 適切な期間（90日、1年など）
   - **Repository access**: **Selected repositories**
   - **Selected repositories**: `TriHexPhi-public`（Public Mirrorリポジトリ）を選択
   - **Permissions**:
     - ✅ **Contents**: Read and write
     - ✅ **Metadata**: Read-only
6. **Generate token** をクリック
7. **表示されたトークンをコピー**（⚠️ 一度しか表示されません！）

**設定場所**: GitHub Repository Secrets

---

## 🔧 GitHub Repository Secrets設定手順

### 方法1: GitHub UI（推奨）

1. **リポジトリページに移動**
   - `https://github.com/kyousuke10000/TriHexPhi` または
   - `https://github.com/Seventh-Sense-Systems-S3/TriHexPhi`

2. **Settings を開く**
   - リポジトリの上部タブ → **Settings**

3. **Secrets and variables を開く**
   - 左サイドバー → **Secrets and variables** → **Actions**

4. **New repository secret をクリック**

5. **各Secretを追加**:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Secret**: 取得したキーを貼り付け
   - **Add secret** をクリック

6. **残りのSecretsも同様に追加**:
   - `OPENAI_API_KEY`
   - `MIRROR_REPO` (値: `kyousuke10000/TriHexPhi-public`)
   - `MIRROR_TOKEN`

### 方法2: GitHub CLI

```bash
# リポジトリを指定
REPO="kyousuke10000/TriHexPhi"  # または "Seventh-Sense-Systems-S3/TriHexPhi"

# ANTHROPIC_API_KEY
echo "your-anthropic-api-key" | gh secret set ANTHROPIC_API_KEY -R $REPO

# OPENAI_API_KEY
echo "your-openai-api-key" | gh secret set OPENAI_API_KEY -R $REPO

# MIRROR_REPO
echo "kyousuke10000/TriHexPhi-public" | gh secret set MIRROR_REPO -R $REPO

# MIRROR_TOKEN
echo "your-mirror-token" | gh secret set MIRROR_TOKEN -R $REPO
```

---

## ✅ 確認方法

### GitHub UI
1. Settings → Secrets and variables → Actions → Repository secrets
2. 以下のSecretsが表示されているか確認:
   - ✅ ANTHROPIC_API_KEY
   - ✅ GOOGLE_API_KEY（既に設定済み）
   - ✅ OPENAI_API_KEY
   - ✅ MIRROR_REPO
   - ✅ MIRROR_TOKEN

### ローカルで確認
```bash
# preflight-checkを実行
node scripts/preflight-check.mjs
```

### ワークフローで確認
- `harmonia-ci.yml` の実行ログを確認
- `preflight-check.mjs` のステップでエラーが出ないか確認

---

## 🚨 よくある問題

### 1. "ANTHROPIC_API_KEY missing" エラー

**原因**: 
- Secretが設定されていない
- リポジトリが間違っている（個人リポジトリ vs Organizationリポジトリ）

**解決**:
1. GitHub UIで正しいリポジトリのSecretsを確認
2. Secret名の大文字小文字を確認（`ANTHROPIC_API_KEY`）
3. 設定後、ワークフローを再実行

### 2. "MIRROR_TOKEN missing" エラー

**原因**: 
- Fine-grained PATが作成されていない
- PATの権限が不足（Contents: Read and writeが必要）

**解決**:
1. Fine-grained PATを作成（上記の手順参照）
2. `TriHexPhi-public`リポジトリへのContents: Read and write権限を確認
3. Secretを再設定

### 3. ワークフローは成功だが、ログにエラー

**原因**: 
- `preflight-check.mjs`が警告を出している（Secrets不足）
- frontmatterの警告（これは警告レベルで、ワークフローの成功/失敗には影響しない）

**解決**:
- Secretsを設定すると、`preflight-check.mjs`のエラーが解消されます
- frontmatterの警告は、Markdownファイルのメタデータが不完全ということなので、後で対応可能

---

## 📝 設定後の確認

1. **Secrets確認**: GitHub UIで全てのSecretsが設定されているか確認
2. **ワークフロー実行**: 任意のワークフローを実行して、エラーが出ないか確認
3. **ログ確認**: `preflight-check.mjs`のステップでエラーが出ないか確認

---

**最終更新**: 2025-11-07  
**作成者**: Cursor (実装担当)

