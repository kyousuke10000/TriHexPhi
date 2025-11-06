# 自動実行設定まとめ

**作成日**: 2025-11-07  
**目的**: 外出中にワークフローが自動実行されることを確認

---

## ✅ 完了したこと

1. **Secrets設定**
   - `MIRROR_TOKEN`: ✅ 設定済み
   - `MIRROR_REPO`: ✅ 設定済み（`Seventh-Sense-Systems-S3/TriHexPhi-public`）
   - その他のAPIキー: ✅ 設定済み

2. **コード移行**
   - 既存リポジトリ（`kyousuke10000/TriHexPhi`）から新しいOrganizationリポジトリ（`Seventh-Sense-Systems-S3/TriHexPhi`）にプッシュ完了

3. **初回実行確認**
   - SeventhSenseワークフロー: ✅ 実行成功

---

## 📋 自動実行設定

### 1. SeventhSense (Fusion)
- **ファイル**: `.github/workflows/seventhsense.yml`
- **自動実行**: ✅ 毎日00:00 UTC（日本時間09:00）
- **手動実行**: 任意（workflow_dispatch）
- **実行内容**: SeventhSense AIのProof生成

### 2. PR Ledger (Generate & Publish)
- **ファイル**: `.github/workflows/pr_ledger.yml`
- **自動実行**: ✅ 毎日00:00 UTC（日本時間09:00）
- **手動実行**: 任意（workflow_dispatch）
- **実行内容**: PR Ledger生成とPublic Mirror同期

### 3. Mirror Gate (Public Mirror)
- **ファイル**: `.github/workflows/mirror_gate.yml`
- **自動実行**: ✅ `main`ブランチへのpush時に自動実行
- **手動実行**: 任意（workflow_dispatch）
- **実行内容**: Public Mirrorへの同期

---

## 💡 外出中の確認方法

### 1. GitHub Mobile App
- GitHub Mobile Appで通知を受け取る
- ワークフローの実行結果を確認

### 2. メール通知
- GitHub Settings → Notifications → Actions でメール通知を有効化
- ワークフローの実行結果をメールで受け取る

### 3. 次回帰宅後の確認
```bash
# 実行履歴を確認
gh run list -R Seventh-Sense-Systems-S3/TriHexPhi --limit 10

# 失敗したワークフローのみ確認
gh run list -R Seventh-Sense-Systems-S3/TriHexPhi --status failure --limit 10
```

---

## 🚫 手動実行を避けるための注意事項

### 1. ワークフローの重複実行を防ぐ
- **concurrency**設定が有効になっているか確認
- 同じワークフローが同時に実行されないように設定

### 2. 自動実行のスケジュール確認
- 毎日00:00 UTC（日本時間09:00）に自動実行される
- 手動実行は必要最小限に

### 3. 初回のみ手動実行
- 最初の1回だけ手動実行して動作確認
- 以降は自動実行に任せる

---

## 📝 実行履歴確認URL

**Actions**: https://github.com/Seventh-Sense-Systems-S3/TriHexPhi/actions

---

## ✅ チェックリスト

### 初回セットアップ時
- [x] Secrets設定（MIRROR_TOKEN、MIRROR_REPO含む）
- [x] コードを新しいOrganizationリポジトリにプッシュ
- [x] SeventhSenseワークフロー実行成功
- [ ] Mirror Gate自動実行確認（次回push時）

### 日常運用時
- [ ] 手動実行は必要最小限に
- [ ] 自動実行のスケジュールを確認
- [ ] 実行履歴を定期的に確認

---

**生成者**: Cursor (AI Assistant)  
**目的**: 自動実行設定のまとめ  
**更新**: 2025-11-07

