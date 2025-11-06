# Organization作成 トラブルシューティング

## ❌ エラー: 「Transform your user into an organization」

### 問題

Organization作成時に「Transform your user into an organization」というページが表示され、エラーが発生する。

### 原因

これは**ユーザーアカウントをOrganizationに変換する機能**であり、以下の問題があります：
- ユーザーアカウントがOrganizationに変換される
- **あなた自身がオーナーになれない**
- 別のアカウントをオーナーとして指定する必要がある

### ✅ 解決方法

**「Transform your user into an organization」は使用しないでください。**

代わりに、**新しいOrganizationを作成**してください：

1. **正しい手順**:
   - GitHubの右上のプロフィールアイコンをクリック
   - **"Settings"** を選択
   - 左サイドバーの最下部 **"Organizations"** をクリック
   - **"New organization"** をクリック
     - ⚠️ 「Transform your user into an organization」ではなく、**「New organization」** を選択

2. **Organization名の選択**:
   - `kyousuke10000` は使用できません（既にユーザーアカウント名として使用中）
   - 別の名前を選択: 例: `TriHexPhi-Org`, `TriHex-Org`, `SeventhSense-Org` など

3. **作成後**:
   - あなたが自動的にOrganizationのオーナーになります
   - リポジトリを移行する必要はありません
   - Organization Secretsを設定できます

---

## ❌ エラー: Organization名が使用できない

### 問題

Organization名として `kyousuke10000` を入力しようとすると、エラーが発生する。

### 原因

`kyousuke10000` は既にユーザーアカウント名として使用されているため、Organization名として使用できません。

### ✅ 解決方法

別の名前を選択してください：
- `TriHexPhi-Org`
- `TriHex-Org`
- `SeventhSense-Org`
- `TriHexPhi-Organization`
- など

---

## ❌ エラー: Organization Secretsが表示されない

### 問題

Organizationの設定ページに「Secrets and variables」セクションが表示されない。

### 原因

- Organizationのオーナー権限がない
- Organizationが正しく作成されていない

### ✅ 解決方法

1. Organizationの設定ページにアクセス
2. 左サイドバーで **"Secrets and variables"** → **"Actions"** を選択
3. 表示されない場合は、Organizationのオーナー権限を確認

---

## 💡 推奨事項

### 個人アカウントのまま使用する場合

Organizationを作成しない場合でも、**リポジトリレベルのSecretsで動作します**。

**メリット**:
- シンプル
- 追加の設定不要
- すぐに動作可能

**必要な作業**:
1. リポジトリレベルのSecretsをそのまま使用
2. Environments作成（リポジトリレベル）
3. Branch Protection設定（リポジトリレベル）

### Organizationを作成する場合

**メリット**:
- 複数リポジトリでSecretsを共有可能
- GitHub Businessの機能を活用
- 将来的な拡張性

**必要な作業**:
1. 新しいOrganizationを作成（「New organization」を使用）
2. OrganizationレベルでSecretsを設定
3. 動作確認後、リポジトリSecretsを削除

---

**生成者**: Cursor (AI Assistant)  
**目的**: Organization作成のトラブルシューティング  
**更新**: 2025-11-07

