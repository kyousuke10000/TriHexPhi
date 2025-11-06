# Organization Secrets - Repository Access設定ガイド

**目的**: Organization Secretsの「Repository access」設定について

---

## 📋 選択肢

### 1. All repositories
- **説明**: すべてのリポジトリ（現在・将来含む）で自動的に使用可能
- **メリット**: 
  - 新しいリポジトリを追加する際、追加設定が不要
  - 管理が簡単
- **デメリット**: 
  - 不要なリポジトリにもアクセス可能（セキュリティリスク）
  - 公開リポジトリでも使用可能（Secretsの漏洩リスク）
- **推奨度**: ❌ **非推奨**

### 2. Selected repositories
- **説明**: 指定したリポジトリのみで使用可能
- **メリット**: 
  - 必要最小限のリポジトリのみにアクセス許可（セキュリティが高い）
  - 明示的にリポジトリを管理できる
- **デメリット**: 
  - 新しいリポジトリで使用する際は追加設定が必要
- **推奨度**: ✅ **推奨**

### 3. Private repositories only
- **説明**: プライベートリポジトリのみで自動的に使用可能
- **メリット**: 
  - プライベートリポジトリのみにアクセス許可
  - 公開リポジトリでは使用不可（セキュリティが高い）
- **デメリット**: 
  - 将来的にパブリックリポジトリでも使用する場合は設定変更が必要
- **推奨度**: ⚠️ **条件付き（現時点では問題なし）**

---

## ✅ 推奨設定

### 推奨: Selected repositories

**理由**:
1. **セキュリティ**: 必要最小限のリポジトリのみにアクセス許可
2. **明示的管理**: どのリポジトリで使用しているか明確
3. **将来の拡張性**: 新しいリポジトリで使用する際は明示的に追加

### 選択するリポジトリ

- ✅ **TriHexPhi** (private)
  - SeventhSenseワークフロー
  - Mirror Gateワークフロー
  - PR Reviewワークフロー

### 選択しないリポジトリ

- ❌ **TriHexPhi-public** (public)
  - 公開リポジトリのため、Secretsは使用しない
  - Mirror Gateワークフローは`TriHexPhi`から実行される

- ❌ **7thSense-LP** (private)
  - 現時点ではSecretsを使用しない
  - 将来的に使用する場合は追加設定

- ❌ **SeventhSense-Proofs** (private)
  - 現時点ではSecretsを使用しない
  - 将来的に使用する場合は追加設定

---

## 📝 設定手順

### 1. Organization Secrets設定ページにアクセス

https://github.com/organizations/Seventh-Sense-Systems-S3/settings/secrets/actions

### 2. 各Secretを設定

1. **"New organization secret"** をクリック
2. **Name**: Secret名（例: `OPENAI_API_KEY`）
3. **Secret**: 値を貼り付け
4. **Repository access**: 
   - ✅ **"Selected repositories"** を選択
   - ✅ **"TriHexPhi"** をチェック
5. **"Add secret"** をクリック

### 3. 新しいリポジトリで使用する場合

1. Secretの設定ページにアクセス
2. Secretを選択
3. **"Repository access"** を編集
4. 新しいリポジトリを追加

---

## 🔒 セキュリティ考慮事項

### 公開リポジトリでの使用

- **推奨されません**: 公開リポジトリではSecretsを使用しないことを推奨
- **理由**: ワークフローのログやコードにSecretsが漏洩する可能性
- **対策**: 公開リポジトリは`TriHexPhi-public`のみとし、Secretsは使用しない

### プライベートリポジトリでの使用

- **推奨**: プライベートリポジトリ（`TriHexPhi`）での使用は問題なし
- **理由**: ワークフローのログはプライベートリポジトリのメンバーのみが閲覧可能

---

## 📋 各Secretの設定推奨

| Secret名 | Repository Access | 選択リポジトリ |
|---------|-------------------|---------------|
| OPENAI_API_KEY | Selected repositories | TriHexPhi |
| GEMINI_API_KEY | Selected repositories | TriHexPhi |
| ANTHROPIC_API_KEY | Selected repositories | TriHexPhi |
| DEEPSEEK_API_KEY | Selected repositories | TriHexPhi |
| GROK_API_KEY | Selected repositories | TriHexPhi |
| MIRROR_TOKEN | Selected repositories | TriHexPhi |
| MIRROR_REPO | Selected repositories | TriHexPhi |
| PPLX_API_KEY | Selected repositories | TriHexPhi (任意) |
| CURSOR_BRIDGE_URL | Selected repositories | TriHexPhi (任意) |

---

## 💡 まとめ

**推奨設定**: **"Selected repositories"** で **"TriHexPhi"** のみを選択

**理由**:
- ✅ セキュリティが高い
- ✅ 明示的な管理が可能
- ✅ 将来的に新しいリポジトリで使用する際は追加設定可能

**注意**: 
- 公開リポジトリ（`TriHexPhi-public`）ではSecretsを使用しない
- 新しいリポジトリで使用する場合は、Secretの設定を更新する必要がある

---

**生成者**: Cursor (AI Assistant)  
**目的**: Organization SecretsのRepository Access設定ガイド  
**更新**: 2025-11-07

