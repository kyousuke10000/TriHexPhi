# Mirror Gate (Public Mirror) v1.0 仕様書

**Version:** 1.0.0  
**Date:** 2025-11-05  
**Status:** Active  
**Owner:** TriHexΦ Operations

---

## 🎯 目的

- **Private Truth** = `origin/main`（今までどおり）
- **Public Mirror** = 「見せて良い部分だけ」自動抽出→公開用リポへ同期
- Web版AIはPublic MirrorのURLだけ読めば最新に追従

---

## 📁 ミラー対象

### Include（公開OK）

- `99_SYSTEM/Proofs/**` - Proofファイル（機密値を含まない運用）
- `00_RYUDO/Council/Records/**` - 評議会記録（本文のみ）
- `70_AI_CHRONICLE/**` - AI年代記（自己史料・叡智アーカイブ）
- `README.md` - プロジェクト概観
- `docs/index.md` - ドキュメント入口

### Exclude（常時ブロック）

- `**/*.env`, `**/.env*`, `**/secrets/**`, `**/keys/**`
- `tools/**`, `app/**`, `specs/**`（※当面公開しない）
- `**/*.(key|pem|p12|sqlite|db|csv)`
- 認証情報/個人情報を含む可能性のある独自パス

---

## ⚙️ 実装

### GitHub Actions Workflow

**`.github/workflows/mirror_gate.yml`**

- **トリガー**: `main`ブランチへのpush、または手動実行
- **Dry-run**: 手動実行時に`dry_run=true`で確認可能
- **Council Gate**: `DEC_*_mirror_*.md`の承認チェック（任意）
- **マスキング**: トークン・鍵らしき文字列を自動マスク
- **Gitleaks**: 機密情報漏洩スキャン（警告のみ）
- **自動push**: 公開リポジトリへ同期

---

## 🔐 セキュリティ設計

### 多層防御

1. **Includeリスト主義**: ホワイトリスト方式で公開対象を明示
2. **マスキング**: トークン形式の文字列を自動マスク
3. **Gitleaks**: 機密情報の漏洩検知
4. **Council Gate**: 公開承認のDECファイルチェック（任意）

### 安全設計のポイント

- **Dry-run必須**: 初回は必ず目視してから本番push
- **生成リポは読み取り専用**: 公開側の変更は上書きされる
- **段階拡張**: 後からInclude/Excludeを調整可能

---

## 📋 事前準備

### 1. 公開用リポジトリ作成

- リポジトリ名: `TriHexPhi-public`（例）
- 可視性: **Public**
- ブランチ: `main`（デフォルト）

### 2. Secrets設定（Private側リポに登録）

- `MIRROR_REPO`: `kyousuke10000/TriHexPhi-public`
- `MIRROR_TOKEN`: Fine-grained PAT（`contents:write`付与）

---

## 🔄 ワークフロー

### 自動実行

`main`ブランチへのpushで自動実行

### 手動実行

1. GitHub Actions > Mirror Gate > Run workflow
2. `dry_run: true`で実行
3. 出力リストを確認
4. 問題なければ`dry_run: false`で本番push

---

## 🔗 参照ルール（Web版AI向け）

### 最新状態の入口

```
https://github.com/kyousuke10000/TriHexPhi-public
```

### ファイル直リンク（例：Proof）

```
https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/99_SYSTEM/Proofs/AIOS_RemoteTruth_2025-11-05.md
```

**以後、「GPTに渡す＝URLを貼るだけ」。アップロード作業は不要。**

---

## 📋 ロールアウト手順

1. ✅ 公開リポ作成 & Secrets設定（`MIRROR_REPO`, `MIRROR_TOKEN`）
2. ✅ Private側に `mirror_gate.yml` を追加 → mainへ
3. ⏳ Actions > Mirror Gate を手動実行（`dry_run=true`）
4. ⏳ 出力リストを確認 → OKなら `dry_run=false` でもう一度
5. ⏳ 公開URLをAIの"記憶入口"として使用開始

---

## 💡 よくある質問

### Q: 機密あるけどProof出したい
**A:** 公開用に"要約版"を出力し、機密はprivateのまま

### Q: もっとパスを出したい
**A:** includeに1行足す。逆に絶対出したくないのはexcludeに足す

### Q: Web版他AIも読める？
**A:** うん、URLが公開なら全員読める（Claude/Gemini/Grok/DeepSeek など）

---

## 🚀 今後の拡張

- 段階的なInclude/Excludeパターンの拡張
- マスキングルールの強化
- 公開前の自動レビュー機能
- 公開履歴の追跡

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-05  
**Status:** ✅ Active
