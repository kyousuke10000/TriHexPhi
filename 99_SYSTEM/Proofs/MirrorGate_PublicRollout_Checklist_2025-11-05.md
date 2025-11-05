# Mirror Gate 公開ロールアウト チェックリスト

**Date:** 2025-11-05  
**Source:** GPT指令書  
**Purpose:** 安全に公開リポジトリを回し始めるための最短チェックリスト

---

## 0) いまの状態

### ✅ 完了済み

- [x] Mirror Gate（workflow/仕様/Proof）→ PR #34 に追加済み
- [x] Remote Truth（GitHub一本化）→ PR #34 で運用固定予定

### ⏳ 確認中

- [ ] PR #34 の Council Gate チェック状態
- [ ] Mirror Gate ワークフローの存在確認

---

## 1) 公開リポを用意（1分）【要：GitHub操作】

### タスク

- [ ] **GitHubで TriHexPhi-public（Public）を作成**
  - Repository名: `TriHexPhi-public`
  - Visibility: **Public**
  - 初期ファイル: README.md のみ（空でも可）

- [ ] **Private 側リポに Secrets を登録**
  - Repository: `kyousuke10000/TriHexPhi` (Private)
  - Settings → Secrets and variables → Actions → New repository secret

  **Secrets 追加:**
  ```
  MIRROR_REPO = kyousuke10000/TriHexPhi-public
  MIRROR_TOKEN = <Fine-grained PAT>
  ```

### Fine-grained PAT の作成手順

1. GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Generate new token
3. **設定:**
   - Token name: `trihex-mirror-gate`
   - Expiration: 90 days（または適宜）
   - Repository access: **Only select repositories**
     - 対象: `kyousuke10000/TriHexPhi-public` **のみ**
   - Permissions:
     - **Contents: Write** （これだけ）
     - 他の権限は付けない（最小権限の原則）

4. Generate token → トークンをコピー → Secrets に登録

---

## 2) PR #34 をマージ（Gate緑→squash）

### 確認ポイント

- [ ] **Checks → Council Gate が緑** になっていること
- [ ] 他のチェックも問題ないこと

### マージ手順

1. PR #34 のページを開く
2. Checks がすべて緑であることを確認
3. "Merge pull request" → **"Squash and merge"** を選択
4. マージ完了後、Actions に **Mirror Gate** ワークフローが並ぶことを確認

---

## 3) 初回は Dry-run で安全確認（30秒）

### 実行手順

1. GitHub Actions → `Mirror Gate (Public Mirror)` を開く
2. "Run workflow" ボタンをクリック
3. **Input:**
   ```
   dry_run: true
   ```
4. "Run workflow" を実行

### 確認ポイント

- [ ] ログの **"Dry-run listing"** セクションを確認
- [ ] 公開候補のファイル一覧に機密が混ざっていないこと

**想定される公開ファイル:**
- `99_SYSTEM/Proofs/**`
- `00_RYUDO/Council/Records/**`
- `70_AI_CHRONICLE/**`
- `README.md`
- `docs/index.md`

**⚠️ 問題があれば:**
- `.github/workflows/mirror_gate.yml` の `include`/`exclude` を修正
- 再度 dry-run を実行して確認

---

## 4) 本番 push（1クリック）

### 実行手順

1. 同じく Actions → Mirror Gate → "Run workflow"
2. **Input:**
   ```
   dry_run: false
   ```
3. "Run workflow" を実行

### 確認

- [ ] `TriHexPhi-public` リポジトリにファイルが反映される
- [ ] 以降、`main` ブランチへの push で自動同期される

---

## 5) Web版AIに“固定で渡す入口”を1つ決める

### 推奨URL

**入口URL（覚えやすい一本）:**
```
https://github.com/kyousuke10000/TriHexPhi-public
```

**実体（例：Proofの固定パス）:**
```
https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/99_SYSTEM/Proofs/AIOS_RemoteTruth_2025-11-05.md
```

### 使い方

- Web版の GPT / Claude / Gemini / Grok / DeepSeek に上記URLを貼るだけ
- アップロードは不要
- 最新の内容が自動で参照される

---

## 6) 安全運用のワンポイント

### Gitleaks

- 現状: **警告運転**（`continue-on-error: true`）
- より厳格にする場合: dry-run は警告、実 push は失敗で止める（`continue-on-error: false` を条件分岐）

### Include主義

- 公開したいパスだけを明示（`include` に追加）
- 増やしたい時は1行ずつ慎重に追加

### Kill Switch（緊急停止）

公開を即止めたい時:

1. **MIRROR_TOKEN を一時無効化** (GitHub Settings → Developer settings)
2. **または Actions を一時 disable** (Actions タブ → 右上の "..." → Disable workflow)

### PAT の範囲

- 公開リポの **"書き込みのみ"** に限定
- `contents:write` だけ（読み取りや admin は不要）
- 対象リポジトリも **`TriHexPhi-public` のみ** に限定

---

## 7) トラブルシューティング（5秒で直す系）

### Mirror Gate が出てこない

- **原因:** PR #34 を `main` にマージしていない
- **対応:** PR #34 をマージ → Actions にワークフローが表示される

### push 成功するのに内容が増えない

- **原因:** `include`/`exclude` と `rsync` のパスが合っていない
- **対応:** `.github/workflows/mirror_gate.yml` の `rsync` コマンドを確認

### 予期せぬファイルが出た

- **原因:** `exclude` が不足
- **対応:**
  1. dry-run で一覧を確認
  2. 不要なファイルを特定
  3. `exclude` に追加
  4. 再実行（dry-run のまま）

### トークン関連エラー

- **原因:** `MIRROR_TOKEN` の権限不足
- **対応:**
  - `TriHexPhi-public: contents:write` になっているか確認
  - PAT が有効期限内か確認
  - リポジトリアクセスが `TriHexPhi-public` のみになっているか確認

---

## 8) これで起きること（インパクト）

### ✅ メリット

- **"毎回アップロード地獄"がゼロに**
- **新チャットでもURLひとつで記憶を継承**
- **叡智AI群（369体想定）全員が同じ最新の地図で動ける**
- **人間/AI/CI が同じ真実座標を共有**（Remote Truth × Public Mirror）

---

## 9) オプション: Index ページ自動生成

### 提案

Public側に「Index（今日の入口）」ページを自動生成して、以下を一覧化:

- 最新のProof 10件
- 直近のCouncil Record 10件

### 実装する場合

- dry-run 付きでサクッと出す
- 小ワークフローとして追加

**実装する？** → 要望があれば対応します

---

## 作業ログ

### 2025-11-05

- [x] チェックリスト作成
- [ ] 公開リポ作成（要：GitHub操作）
- [ ] Secrets 設定（要：GitHub操作）
- [ ] PR #34 マージ確認
- [ ] Dry-run 実行
- [ ] 本番 push

---

**Generated:** 2025-11-05  
**Next:** 公開リポの作成と Secrets 設定から開始

