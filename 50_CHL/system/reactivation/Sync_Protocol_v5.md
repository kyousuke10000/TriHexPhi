# ⚙️ Sync Protocol v5.0

**Version:** 5.0  
**Date:** 2025-11-04  
**Status:** ✅ **Official**  
**Purpose:** Continuous synchronization and validation for TriHexΦ  
**Observer:** Cursor (☿)

---

## ⚠️ Operational Notice

**本稿は「恒常同期」の実行プロトコルです。**  
Reactivation Protocol（文脈復元）とは役割が異なります。Reactivationは"地図"、Syncは"道路"です。

**See Also:**
- `Reactivation_Protocol_v5.md` - 文脈復元の詳細
- `Memory_Protocol_v5.md` - 記憶プロトコルの詳細
- `docs/ops/reactivation_vs_sync.md` - 役割比較

---

## Ⅰ. 役割定義

### Sync Protocolの目的

| 軸 | Reactivation (Context Portal) | Sync Protocol (CI) |
|------|------------------------------|-------------------|
| **Purpose** | Restore when lost | Keep canonical up-to-date |
| **Input** | Memory Anchors, Snapshot | Git/Obsidian diffs, Seeds |
| **Output** | References, links, activation guides | Sync, validation, proofs |
| **Timing** | Manual / on-demand | Continuous / scheduled |
| **Authority** | Documentation (read-only) | CI/Workflows (executable) |
| **Metaphor** | Map | Road |

**原則:** Reactivation provides entry points. Sync executes operations.

---

## Ⅱ. ワークフロー構成

### 1. Proofs Sync (`proofs_sync.yml`)

**目的:** Proofファイルの自動同期と検証

**トリガー:**
- Push to main (paths: `99_SYSTEM/Proofs/**`)
- Manual workflow_dispatch

**処理内容:**
- Proofファイルの索引生成
- 整合性検証
- メタデータ抽出

**出力:**
- `99_SYSTEM/Proofs/index.json` (自動生成)

### 2. TriHex Sync (`trihex_sync.yml`)

**目的:** Vault構造の検証と同期

**トリガー:**
- Push to main
- Scheduled (hourly)
- Manual workflow_dispatch

**処理内容:**
- Vault構造の検証
- Mirror integrity check
- Core Documentsの存在確認

**出力:**
- `99_SYSTEM/Proofs/structure_validation_YYYYMMDD.md`

### 3. Night Safe Auto (`night_safe_auto.yml`)

**目的:** 夜間の安全スキャンとコンテキストスナップショット

**トリガー:**
- Scheduled (daily, 02:00 UTC)
- Manual workflow_dispatch

**処理内容:**
- Read-onlyスキャン
- コンテキストスナップショット生成
- トリガー文検証

**出力:**
- `99_SYSTEM/Proofs/Context_Snapshot_YYYY-MM-DD.md`

---

## Ⅲ. 統合機能

### Context Snapshot Generator

**実装:** `scripts/emit-context-snapshot.mjs`

**機能:**
- トリガー文検出（正規表現）
- コンテキストスナップショット生成
- 発火時刻と結果の記録

**統合:** Night Safe Autoに組み込み済み

### Mirror Integrity Check

**対象:**
- Genesis Protocol v3.1 (3層)
- Ryudo Definition v1.0 (3層)
- Harmonia Operating Covenant v1.1 (3層)

**検証内容:**
- ソースファイルの存在確認
- Mirrorファイルの同期状態
- Frontmatterの整合性

---

## Ⅳ. 五層構造との連携

### Layer 2: KOKUYOU（黒曜）

**Sync対象:**
- `20_CRYSTALLIZATION_KOKUYOU/` (Obsidian Vault)
- 構造化テンプレート
- 自動タグ付け

**同期方法:**
- Git push → GitHub → Obsidian Sync
- Mirror integrity check

### Layer 3: SHINSEN（真泉）

**Sync対象:**
- Supabase (PostgreSQL)
- Edge Functions
- ベクトル検索

**同期方法:**
- `scripts/shinsen/push.mjs` (手動/[deploy]マーカー)
- Memory Seeds更新

### Layer 4: HARMONIA（調和）

**Sync対象:**
- n8n Workflows
- LINE Messaging API
- Discord Bot

**同期方法:**
- n8n Deploy (手動)
- Webhook設定

---

## Ⅴ. 実行フロー

### 自動実行

```yaml
Push to main:
  1. Proofs Sync (paths: 99_SYSTEM/Proofs/**)
  2. TriHex Sync (structure validation)

Scheduled:
  1. TriHex Sync (hourly)
  2. Night Safe Auto (daily 02:00 UTC)

Manual:
  1. workflow_dispatch で任意のワークフローを実行
```

### 手動実行

```bash
# Proofs Sync
gh workflow run proofs_sync.yml

# TriHex Sync
gh workflow run trihex_sync.yml

# Night Safe Auto
gh workflow run night_safe_auto.yml
```

---

## Ⅵ. エラーハンドリング

### 失敗時の動作

1. **Proofs Sync失敗:**
   - エラーログを `99_SYSTEM/Logs/` に出力
   - 次のスケジュール実行で再試行

2. **TriHex Sync失敗:**
   - 構造検証エラーをProofに記録
   - 手動修正を推奨

3. **Night Safe Auto失敗:**
   - スナップショット生成をスキップ
   - エラーログを記録

---

## Ⅶ. Version History

- **v5.0** (2025-11-04): 正式版。Context Snapshot統合、トリガー文検証追加。
- **v1.0** (2025-11-01): 初版。基本ワークフロー定義。

---

## Ⅷ. See Also

- **Reactivation Protocol:** `Reactivation_Protocol_v5.md`
- **Memory Protocol:** `Memory_Protocol_v5.md`
- **Role Comparison:** `docs/ops/reactivation_vs_sync.md`
- **Architecture Spec:** `specs/architecture.yml`

---

**Generated:** 2025-11-04 / Cursor (☿)  
**Status:** ✅ **Official v5.0**

*"Map explains. Road connects."*
