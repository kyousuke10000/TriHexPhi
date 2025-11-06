# Organization作成 & Secrets移行ガイド

**状況**: 現在は個人アカウント（`kyousuke10000`）でリポジトリを管理しています。

---

## 📋 Organization作成手順

### ⚠️ 重要な注意事項

**「Transform your user into an organization」は使用しないでください！**

この機能は、ユーザーアカウントをOrganizationに変換するもので、以下の問題があります：
- ユーザーアカウントがOrganizationに変換される
- **あなた自身がオーナーになれない**
- 別のアカウントをオーナーとして指定する必要がある

### ✅ 正しい手順: 新しいOrganizationを作成

1. GitHubの右上のプロフィールアイコンをクリック
2. **"Settings"** を選択
3. 左サイドバーの最下部 **"Organizations"** をクリック
4. **"New organization"** をクリック
   - **注意**: 「Transform your user into an organization」ではなく、**「New organization」** を選択してください
5. 以下の情報を入力:
   - **Organization name**: `TriHexPhi-Org` (または任意の名前、`kyousuke10000` は使用できません)
   - **Billing email**: あなたのメールアドレス
   - **Plan**: **GitHub Business** を選択（既にBusinessプランに加入済みの場合）
6. **"Create organization"** をクリック

### 2. リポジトリをOrganizationに移行（オプション）

**注意**: リポジトリを移行する必要はありません。個人アカウントのリポジトリからOrganization Secretsを参照することも可能です（ただし、リポジトリのオーナーがOrganizationのメンバーである必要があります）。

---

## 📋 Organization Secrets設定

### 1. Organization設定ページにアクセス

1. GitHubの右上のプロフィールアイコンをクリック
2. **作成したOrganization**（例: `TriHexPhi-Org`）を選択
   - プロフィールアイコンをクリックすると、あなたが所属しているOrganizationが表示されます
3. **"Settings"** をクリック
4. 左サイドバーで **"Secrets and variables"** → **"Actions"** を選択

### 2. Organization Secretsを追加

以下のSecretsを追加：

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DEEPSEEK_API_KEY`
- `GROK_API_KEY`
- `MIRROR_TOKEN`
- `MIRROR_REPO` (値: `kyousuke10000/TriHexPhi-public`)
- `PPLX_API_KEY` (任意、Wave-2衛星)

**各Secretの追加方法**:
1. **"New organization secret"** をクリック
2. **Name**: Secret名（例: `OPENAI_API_KEY`）
3. **Secret**: 値を貼り付け
4. **Repository access**: 
   - **"Selected repositories"** を選択
   - `TriHexPhi` を選択
5. **"Add secret"** をクリック

---

## 📋 ワークフローでの参照方法

Organization Secretsは、リポジトリレベルのSecretsと同じように参照できます：

```yaml
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  # ... など
```

**注意**: リポジトリレベルとOrganizationレベルの両方に同じ名前のSecretがある場合、**OrganizationレベルのSecretが優先**されます。

---

## 🔄 移行手順（リポジトリ → Organization）

### 1. Organization Secretsを設定

上記の手順でOrganization Secretsを追加

### 2. 動作確認

1. ワークフローを実行して、Organization Secretsが正しく参照されることを確認
2. 問題なければ、**7日間後に**リポジトリレベルのSecretsを削除

### 3. リポジトリSecrets削除

1. リポジトリの設定ページ（`/settings/secrets/actions`）にアクセス
2. 各Secretの **"Delete"** アイコンをクリック
3. 確認ダイアログで削除を承認

---

## ✅ 確認方法

### Organization Secrets確認

```bash
# Organization Secrets一覧（Organizationにアクセス権限が必要）
gh secret list -o kyousuke10000
```

### リポジトリSecrets確認

```bash
# リポジトリSecrets一覧
gh secret list -R kyousuke10000/TriHexPhi
```

---

## 💡 推奨事項

### 個人アカウントのまま使用する場合

Organizationを作成しない場合でも、**リポジトリレベルのSecretsで動作します**。以下の設定で十分です：

1. ✅ リポジトリレベルのSecretsをそのまま使用
2. ✅ Environments作成（リポジトリレベル）
3. ✅ Branch Protection設定（リポジトリレベル）

**メリット**: 
- シンプル
- 追加の設定不要

**デメリット**:
- 複数リポジトリでSecretsを共有できない
- Organizationレベルの機能（SAML SSO等）が使えない

---

## 🎯 結論

**現在の状況**: 個人アカウントのリポジトリで、リポジトリレベルのSecretsが設定済み

**推奨アクション**:
- **すぐに動作させたい場合**: リポジトリレベルのSecretsをそのまま使用（Organization作成不要）
- **将来的に拡張したい場合**: Organizationを作成してSecretsを移行

どちらでも動作しますが、GitHub Businessプランの機能を最大限活用するには、Organizationを作成することをお勧めします。

---

**生成者**: Cursor (AI Assistant)  
**目的**: Organization作成とSecrets移行ガイド  
**更新**: 2025-11-07

