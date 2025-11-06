# Secrets設定チェックリスト

**目的**: Organization "Seventh-Sense-Systems-S3" に設定する必要があるSecretsの一覧

---

## 📋 必須Secrets（6AI + Mirror）

### 1. OPENAI_API_KEY
- **用途**: GPT (OpenAI)
- **必須**: ✅ 必須
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **値の取得**: 既存リポジトリ（`kyousuke10000/TriHexPhi`）からコピー

### 2. GEMINI_API_KEY
- **用途**: Gemini (Google)
- **必須**: ✅ 必須
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **値の取得**: 既存リポジトリ（`kyousuke10000/TriHexPhi`）からコピー

### 3. ANTHROPIC_API_KEY
- **用途**: Claude (Anthropic)
- **必須**: ✅ 必須
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **値の取得**: 既存リポジトリ（`kyousuke10000/TriHexPhi`）からコピー

### 4. DEEPSEEK_API_KEY
- **用途**: DeepSeek
- **必須**: ✅ 必須
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **値の取得**: 既存リポジトリ（`kyousuke10000/TriHexPhi`）からコピー

### 5. GROK_API_KEY
- **用途**: Grok (xAI)
- **必須**: ✅ 必須
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **値の取得**: 既存リポジトリ（`kyousuke10000/TriHexPhi`）からコピー

### 6. MIRROR_TOKEN
- **用途**: Public Mirrorへの同期用GitHub Token
- **必須**: ✅ 必須
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **値の取得**: 既存リポジトリ（`kyousuke10000/TriHexPhi`）からコピー
- **注意**: Fine-grained Personal Access Token（対象repo=TriHexPhi-publicのみ、permissions=Contents: Read/Write）

### 7. MIRROR_REPO
- **用途**: Public Mirrorリポジトリ名
- **必須**: ✅ 必須
- **値**: `Seventh-Sense-Systems-S3/TriHexPhi-public`
- **設定場所**: Organization Settings → Secrets and variables → Actions

---

## 📋 任意Secrets

### 8. PPLX_API_KEY
- **用途**: Perplexity (Wave-2衛星)
- **必須**: ❌ 任意
- **設定場所**: Organization Settings → Secrets and variables → Actions
- **注意**: 設定しない場合、SeventhSenseはCore Six（6AI）のみで動作

### 9. CURSOR_BRIDGE_URL
- **用途**: Cursorアダプター（任意）
- **必須**: ❌ 任意
- **設定場所**: Organization Settings → Secrets and variables → Actions

---

## 🔧 設定手順

### 1. 既存リポジトリから値の確認

```bash
# 既存リポジトリのSecrets一覧
gh secret list -R kyousuke10000/TriHexPhi
```

### 2. Organization Secrets設定

1. GitHub Web UIにアクセス:
   - https://github.com/organizations/Seventh-Sense-Systems-S3/settings/secrets/actions

2. 各Secretを追加:
   - "New organization secret" をクリック
   - Name: Secret名（例: `OPENAI_API_KEY`）
   - Secret: 値を貼り付け
   - Repository access: "Selected repositories" を選択
     - `TriHexPhi` を選択
   - "Add secret" をクリック

3. 設定確認:
   ```bash
   gh secret list -o Seventh-Sense-Systems-S3
   ```

---

## ✅ 設定確認

### Organization Secrets確認

```bash
gh secret list -o Seventh-Sense-Systems-S3
```

### リポジトリSecrets確認

```bash
gh secret list -R Seventh-Sense-Systems-S3/TriHexPhi
```

---

## 📝 注意事項

1. **Secretの値は表示されません**: GitHubでは一度設定したSecretの値は確認できません。間違えて設定した場合は削除して再設定してください。

2. **Repository access**: Organization Secretsは、どのリポジトリで使用するかを指定する必要があります。`TriHexPhi` リポジトリを選択してください。

3. **MIRROR_TOKEN**: Fine-grained Personal Access Tokenを作成する必要があります。
   - 対象リポジトリ: `Seventh-Sense-Systems-S3/TriHexPhi-public`
   - 権限: Contents (Read/Write)

---

**生成者**: Cursor (AI Assistant)  
**目的**: Secrets設定チェックリスト  
**更新**: 2025-11-07

