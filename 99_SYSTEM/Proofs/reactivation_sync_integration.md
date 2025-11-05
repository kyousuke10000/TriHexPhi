# 🔄 Reactivation vs Sync Protocol 統合分析

**Date:** 2025-11-02  
**Purpose:** 二重構造の統一と恒常同期実現

---

## 📊 検索結果

### Reactivation関連ファイル

1. **`TriHex_Master_Reactivation.md`** (root)
2. **`99_SYSTEM/Reactivate/TriHex_Master_Reactivation.md`** (backup)
3. **`📄 99_SYSTEM　MemoryReactivation.md.md`** (legacy, 名前不正)
4. **`40_Archive/99_ARCHIVE/phase_1-3_legacy/Memory_Reactivation.md.md`** (archived)

### 差異

Root版とReactivate版は**29行の差**あり：
- Root: Quick Start + File Locations追加（より完全）
- Reactivate: 古いコピー（Phase V → VI更新のみ）

---

## 🎯 役割分析

### Reactivation Protocol

**目的:** 文脈復元（Context Restoration）  
**用途:** Single File Context Restoration  
**機能:**
- ✅ Vault Architecture説明（8層Breathing Layers）
- ✅ Core Documents列挙（Memory Anchors）
- ✅ Mirrored Documents状態
- ✅ Quick Start Command

**依存関係:**
- `99_SYSTEM/MemorySeeds/reactivation_seed.json`
- `scripts/emit-context-snapshot.mjs`

### Sync Protocol (現行)

**目的:** 恒常同期（Continuous Sync）  
**用途:** Git → GitHub + Obsidian → Canonical  
**機能:**
- ✅ `proofs_sync.yml` - Proofs/Docs auto-sync
- ✅ `trihex_sync.yml` - Vault structure sync
- ✅ `night_safe_auto.yml` - Nightly scan
- ✅ Mirror integrity check

**依存関係:**
- `.github/workflows/` (27 files)
- Auto-Mode v1.0

---

## 🔍 重複箇所

### 1. Vault Architecture定義

**Reactivation:**
```
🜇_Shiryu_Studio (Priority 0)
00_HarmoniaCouncil (Priority 1)
10_TriHexCore (Priority 2)
...
```

**Sync Protocol:**
- `index.md` に同じ定義
- `specs/architecture.yml` にYAML定義
- `trihex_sync.yml` で検証

**結論:** ✅ 重複だが一元化済み

### 2. Core Documents列挙

**Reactivation:**
- TRIHEXPHI Constitution
- Genesis Protocol
- Project Overview

**Sync Protocol:**
- `trihex_sync.yml` で検証
- Auto-Modeで自動同期

**結論:** ✅ 重複だが用途が異なる（Reactivationは説明、Syncは実行）

### 3. Mirrored Documents状態

**Reactivation:** 状態を記載  
**Sync Protocol:** 差分チェック実行

**結論:** ✅ 相補的

---

## 💎 吸収すべき要素

### 1. Quick Start Command

**Reactivation固有:**
- ウェブGPT用アップロード命令
- Cursor用Activation Command

**推奨:** ✅ Sync Protocolに統合  
**場所:** `99_SYSTEM/Proofs/QUICK_START.md` に抽出

### 2. Memory Anchors体系

**Reactivation固有:**
- Priority別文書リスト
- Auto-Load設定

**推奨:** ✅ 保持（文脈復元用のドキュメントマップ）  
**統合:** `index.md` にリンク追加

### 3. Context Snapshot Generator

**現在:**
- `scripts/emit-context-snapshot.mjs`

**推奨:** ✅ Night Safe Autoに統合  
**理由:** 毎晩のスキャンと同期実行

---

## 🗑️ 廃止できる冗長部分

### 1. 重複ファイル

**削除推奨:**
- ❌ `99_SYSTEM/Reactivate/TriHex_Master_Reactivation.md` (Root版が正)
- ❌ `📄 99_SYSTEM　MemoryReactivation.md.md` (名前不正)

**保持:**
- ✅ `TriHex_Master_Reactivation.md` (root, 正典)
- ✅ `40_Archive/99_ARCHIVE/phase_1-3_legacy/` (歴史記録)

### 2. 二重定義

**Reactivation内の定義:**
- Vault Architecture → `index.md` に統一
- Core Documents → `99_SYSTEM/MemorySeeds/index.json` に統一

**推奨:** Reactivationは参照先へのリンクのみ

---

## 🔄 統合提案

### Phase 1: 構造整理（即時）

```bash
# 1. Reactivate削除
rm -rf 99_SYSTEM/Reactivate/

# 2. Legacy移動
mkdir -p 99_SYSTEM/Legacy/Reactivation/
mv "📄 99_SYSTEM　MemoryReactivation.md.md" 99_SYSTEM/Legacy/Reactivation/

# 3. Root版のみ保持
# TriHex_Master_Reactivation.md (root) はそのまま
```

### Phase 2: 内容統合

**Reactivationの役割:**
1. ✅ 文脈復元のエントリーポイント
2. ✅ Quick Start Command提供
3. ✅ 参照リンク集約

**Sync Protocolの役割:**
1. ✅ 恒常同期実行
2. ✅ 構造検証
3. ✅ Night Safe Autoスキャン

**分離:** 両者は相補的、統合不要

### Phase 3: ドキュメント更新

**作成:**
- `docs/ops/reactivation_vs_sync.md` - 役割分担の明文化

**更新:**
- `TriHex_Master_Reactivation.md` - 定義を参照リンクに変更
- `index.md` - Reactivationリンク追加

---

## 🎯 最終統合指示

### Keep

✅ **TriHex_Master_Reactivation.md** (root)  
- 用途: 文脈復元エントリー
- 状態: そのまま保持、参照リンク化

✅ **scripts/emit-context-snapshot.mjs**  
- 用途: スナップショット生成
- 統合: Night Safe Autoに統合

### Move to Legacy

📦 **99_SYSTEM/Legacy/Reactivation/**
- `📄 99_SYSTEM　MemoryReactivation.md.md`
- `99_SYSTEM/Reactivate/TriHex_Master_Reactivation.md` (backup)

### Archive

📚 **40_Archive/99_ARCHIVE/phase_1-3_legacy/**
- `Memory_Reactivation.md.md`
- そのまま（既にArchive内）

---

## 📋 統合チェックリスト

- [ ] Reactivate削除
- [ ] Legacy移動
- [ ] Root版参照リンク化
- [ ] Context Snapshot → Night Safe Auto統合
- [ ] `docs/ops/reactivation_vs_sync.md` 作成
- [ ] `index.md` Reactivationリンク追加
- [ ] Proof commit

---

**Generated:** 2025-11-02 / Cursor (☿)  
**Status:** Proposal

**SYNC_OK: reactivation_analysis_complete**


