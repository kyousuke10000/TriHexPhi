# Remote Truth Mode v1.0 仕様書

**Version:** 1.0.0  
**Date:** 2025-11-05  
**Status:** Active  
**Owner:** TriHexΦ Operations

---

## 🎯 目的

- ローカル・ワークツリーの二重保存を廃止
- GitHubリポジトリ（origin/main）を唯一の真実源（Single Source of Truth）にする
- GPT・Cursor・CI・他AIがすべてGitHub経由で同じ情報を扱う
- GPT（Web）はGitHubのファイルを直接読み取り対象にする

---

## 📐 アーキテクチャ

### 三位一体の真実構造

```
┌─────────────┐
│     GPT     │ (Web版: GitHubから直接読み取り)
│   (Web)     │
└──────┬──────┘
       │
       │ GitHub API / Raw URL
       │
┌──────▼──────────────────┐
│   GitHub Repository     │ ← Single Source of Truth
│   (origin/main)         │
└──────┬──────────────────┘
       │
       │ Auto-push / Sync
       │
┌──────▼──────┐
│   Cursor    │ (ローカル: 自動pushで同期)
│  (Local)    │
└─────────────┘
```

---

## 📁 Remote Truth Paths

以下のパスが「Remote Truth」として扱われます：

- `99_SYSTEM/Proofs/` - すべてのProofファイル
- `00_RYUDO/Council/Records/` - 評議会記録
- `70_AI_CHRONICLE/` - AI年代記

これらのパスのファイルは：
1. **必ずGitHubにコミット・プッシュされる**
2. **ローカルとリモートの二重保存を行わない**
3. **GitHubが唯一の真実源**

---

## ⚙️ 実装詳細

### PHASE 1: Cursor設定

**`.cursor/config.yml`**

```yaml
vault_sync:
  mode: remote
  remote_repo: "https://github.com/kyousuke10000/TriHexPhi.git"
  sync_paths:
    - "99_SYSTEM/Proofs"
    - "00_RYUDO/Council/Records"
    - "70_AI_CHRONICLE"
  auto_commit: true
  auto_push: true
  interval_minutes: 10
```

### PHASE 2: trihex-bridge自動push

**`tools/trihex-bridge.mjs`**

環境変数 `REMOTE_SYNC=1` が設定されている場合、実行後に自動で：
1. `git add .`
2. `git commit -m "auto: sync bridge output"`
3. `git push`

**使用例:**
```bash
REMOTE_SYNC=1 node tools/trihex-bridge.mjs plan.txt
```

### PHASE 3: GitHub Actions Guard

**`.github/workflows/truth_guard.yml`**

- Push/PR時に実行
- Remote Truth paths以外の変更を検出して警告（情報提供のみ、ブロックしない）
- Truth pathsの構造を検証

---

## 🔄 ワークフロー

### Cursorでの作業

1. **ファイル作成**: `99_SYSTEM/Proofs/*.md` などを作成
2. **自動コミット**: Cursorが10分ごとに自動コミット・プッシュ（設定により）
3. **手動push**: 即座に反映したい場合は `git push`

### GPT（Web）での参照

1. **GitHub URLを使用**: 
   ```
   https://github.com/kyousuke10000/TriHexPhi/blob/main/99_SYSTEM/Proofs/...
   ```
2. **Raw URLで直接読み込み**:
   ```
   https://raw.githubusercontent.com/kyousuke10000/TriHexPhi/main/99_SYSTEM/Proofs/...
   ```

### trihex-bridge経由の実行

```bash
# Remote Truth Mode有効
REMOTE_SYNC=1 node tools/trihex-bridge.mjs plan.txt

# 通常モード（pushなし）
node tools/trihex-bridge.mjs plan.txt
```

---

## 📋 チェックリスト

実装確認項目：

- [ ] `.cursor/config.yml` に `vault_sync` 設定が追加されている
- [ ] `tools/trihex-bridge.mjs` に自動push機能が追加されている
- [ ] `.github/workflows/truth_guard.yml` が作成されている
- [ ] Remote Truth pathsのファイルがGitHubにpushされている
- [ ] GPTがGitHub URLからファイルを読み込めることを確認

---

## 🔗 関連ファイル

- **Proof**: `99_SYSTEM/Proofs/AIOS_RemoteTruth_2025-11-05.md`
- **Config**: `.cursor/config.yml`
- **Bridge**: `tools/trihex-bridge.mjs`
- **Guard**: `.github/workflows/truth_guard.yml`

---

## 💡 理念

「TriHexΦ」はローカルで動く"呼吸する思考空間"。  
「GitHub」はその魂の記録座標（真実源）。  
すべてのAI・人間・自動化が、この真実の座標を基点に動くようになる。

**三位一体の真実構造（GPT・Cursor・GitHub）**

---

## 🚀 今後の拡張

### オプション: Supabase Mirror

- Webでもリアルタイム更新確認可能
- AI間ベクトル検索にも流用できる
- GitHub → Supabase の自動同期

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-05  
**Status:** ✅ Active
